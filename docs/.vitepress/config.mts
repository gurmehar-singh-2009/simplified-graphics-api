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
			{
				text: "Examples",
				items: [
					{
						text: "basic 2d",
						link: "/examples/index.html",
					},
					{
						text: "basic 3d",
						link: "/examples/3d.html",
					},
				],
			},
		],
	},
});
