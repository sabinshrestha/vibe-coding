import { defineConfig } from "vitepress";

export default defineConfig({
  title: "DeepWiki",
  description: "vibe-coding project wiki",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Architecture", link: "/architecture" },
      { text: "Decisions", link: "/decisions/README" }
    ]
  }
});
