import { defineConfig } from "tsdown"
import { codecovRollupPlugin } from "@codecov/rollup-plugin"

export default defineConfig({
	entry: ["index.js"],
	format: "esm",
	deps: { neverBundle: ["colorjs.io/fn"] },
	dts: true,
	plugins: [
		codecovRollupPlugin({
			enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
			bundleName: "formatCss",
			uploadToken: process.env.CODECOV_TOKEN,
		}),
	],
})
