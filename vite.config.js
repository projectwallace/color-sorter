import { resolve } from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import { codecovVitePlugin } from "@codecov/vite-plugin"

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "index.js"),
			formats: ['es']
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: [
				'colorjs.io/fn'
			],
		},
	},
	plugins: [
		dts(),
		codecovVitePlugin({
			enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
			bundleName: "formatCss",
			uploadToken: process.env.CODECOV_TOKEN,
		}),
	],
})
