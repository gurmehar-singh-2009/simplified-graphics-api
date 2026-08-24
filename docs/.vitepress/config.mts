import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";

export default defineConfig({
	base: "/simplified-graphics-api/",
	title: "simplified-graphics-api",
	description: "Documentation for simplified-graphics-api",
	ignoreDeadLinks: true,
	themeConfig: {
		nav: [
			{ text: "Home", link: "/" },
			{ text: "API Reference", link: "/api/" },
		],
		sidebar: [
			{
				text: "Overview",
				items: [{ text: "Getting Started", link: "/" }],
			},
			{
				text: "API Reference",
				items: typedocSidebar,
			},
		],
	},
});
