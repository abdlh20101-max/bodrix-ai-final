import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

export function DynamicStyles() {
  const { data: configs } = trpc.siteConfig.getAll.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (!configs) return;

    const root = document.documentElement;
    
    // Apply primary color
    const primaryColorConfig = configs.find(c => c.key === "primary_color");
    if (primaryColorConfig && primaryColorConfig.value) {
      root.style.setProperty("--primary", primaryColorConfig.value);
      root.style.setProperty("--ring", primaryColorConfig.value);
    }

    // Apply site name to document title
    const siteNameConfig = configs.find(c => c.key === "site_name");
    if (siteNameConfig && siteNameConfig.value) {
      document.title = siteNameConfig.value;
    }

    // Apply Custom CSS
    const customCss = configs.find(c => c.key === "custom_css")?.value;
    if (customCss) {
      const styleId = "dynamic-custom-css";
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = customCss;
    }

  }, [configs]);

  return null;
}
