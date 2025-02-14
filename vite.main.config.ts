import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
	build: {
		rollupOptions: {
			external: ["get-windows"],
		},
		commonjsOptions: {
			include: [/node_modules/],
			transformMixedEsModules: true,
		},
	},
});
