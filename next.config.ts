import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   async rewrites() {
    return [
      {
        source: '/api/:path*', // 前端请求的路径（如 /api/user → 代理到后端）
        destination: 'http://localhost:8080/api/:path*', // 后端 API 地址
      },
      // 可以配置多个代理规则
     
    ];
  },
};

export default nextConfig;
