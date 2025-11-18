import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const store = await cookies();
  const headerStore = await headers();


  const acceptLanguage = headerStore.get("Accept-Language")?.includes("zh") ? "zh" : "en";

  console.log(acceptLanguage);

  const locale = store.get("locale")?.value || acceptLanguage;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
