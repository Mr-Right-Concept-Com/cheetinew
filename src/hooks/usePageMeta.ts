import { useEffect } from "react";

export const usePageMeta = (title: string, description?: string) => {
  useEffect(() => {
    document.title = `${title} | CheetiHost`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) {
      meta.setAttribute("content", description);
    } else if (description) {
      const tag = document.createElement("meta");
      tag.name = "description";
      tag.content = description;
      document.head.appendChild(tag);
    }
    return () => {
      document.title = "CheetiHost — Lightning-Fast Web Hosting";
    };
  }, [title, description]);
};
