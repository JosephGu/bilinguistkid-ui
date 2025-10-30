import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

// 微信用户信息接口
export interface WechatProfile {
  openid: string;
  unionid?: string;
  nickname: string;
  headimgurl?: string;
  language?: string;
  scope?: string;
}

// 辅助函数：构建查询字符串
function buildQueryString(params: Record<string, string | undefined>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
    )
    .join("&");
}

// 微信Provider配置
export function WechatProvider<P extends WechatProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "wechat",
    name: "WeChat",
    type: "oauth",
    wellKnown: undefined,
    authorization: {
      url: "https://open.weixin.qq.com/connect/qrconnect",
      params: {
        appid: options.clientId,
        redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/wechat",
        response_type: "code",
        scope: "snsapi_login",
        state: "STATE",
      },
    },
    token: {
      async request(context) {
        const { code } = context.params;

        // 构建URL查询参数
        const queryParams = buildQueryString({
          appid: options.clientId,
          secret: options.clientSecret,
          code: code as string,
          grant_type: "authorization_code",
        });

        const response = await fetch(
          `https://api.weixin.qq.com/sns/oauth2/access_token?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch access token: ${response.status}`);
        }

        const data = await response.json();
        const { access_token, refresh_token, openid, unionid, expires_in } =
          data;

        return {
          tokens: {
            access_token,
            refresh_token,
            openid,
            unionid,
            expires_at: Math.floor(Date.now() / 1000) + expires_in,
          },
        };
      },
    },
    userinfo: {
      async request(context) {
        const { access_token, openid } = context.tokens;

        // 构建URL查询参数
        const queryParams = buildQueryString({
          access_token: access_token as string,
          openid: openid as string,
          lang: "zh_CN",
        });

        const response = await fetch(
          `https://api.weixin.qq.com/sns/userinfo?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch user info: ${response.status}`);
        }

        return response.json();
      },
    },
    profile(profile) {
      return {
        id: profile.unionid || profile.openid,
        name: profile.nickname,
        email: undefined, // 微信不直接提供邮箱
        image: profile.headimgurl,
        ...profile,
      };
    },
    ...options,
  };
}

// 刷新微信access_token
export async function refreshWechatAccessToken(
  appId: string,
  refreshToken: string
) {
  try {
    // 构建URL查询参数
    const queryParams = buildQueryString({
      appid: appId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    const response = await fetch(
      `https://api.weixin.qq.com/sns/oauth2/refresh_token?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to refresh access token: ${response.status}`);
    }

    const data = await response.json();
    const { access_token, expires_in } = data;

    return {
      accessToken: access_token,
      expiresAt: Math.floor(Date.now() / 1000) + expires_in,
    };
  } catch (error) {
    console.error("Failed to refresh WeChat access token:", error);
    throw error;
  }
}

// 验证微信access_token是否有效
export async function validateWechatAccessToken(
  accessToken: string,
  openid: string
) {
  try {
    // 构建URL查询参数
    const queryParams = buildQueryString({
      access_token: accessToken,
      openid,
    });

    const response = await fetch(
      `https://api.weixin.qq.com/sns/auth?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to validate access token: ${response.status}`);
    }

    const data = await response.json();
    return data.errcode === 0;
  } catch (error) {
    console.error("Failed to validate WeChat access token:", error);
    return false;
  }
}

// 获取微信用户信息的封装函数（用于route.ts中的signIn回调）
export async function fetchWechatUserInfo(profile: WechatProfile) {
  try {
    // 这里可以添加更多的用户信息处理逻辑
    // 例如将用户信息保存到数据库等

    return {
      id: profile.unionid || profile.openid,
      name: profile.nickname,
      email: undefined, // 微信不直接提供邮箱
      image: profile.headimgurl,
      wechatId: profile.openid,
      unionId: profile.unionid,
      ...profile,
    };
  } catch (error) {
    console.error("Failed to fetch WeChat user info:", error);
    return null;
  }
}
