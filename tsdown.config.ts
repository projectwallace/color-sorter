import { defineConfig } from 'tsdown'
import { codecovRollupPlugin } from '@codecov/rollup-plugin'

export default defineConfig({
	entry: ['index.ts'],
	format: 'esm',
	platform: 'neutral',
	dts: true,
	publint: true,
	plugins: [
		codecovRollupPlugin({
			enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
			bundleName: 'colorSorter',
			uploadToken: process.env.CODECOV_TOKEN,
		}),
	],
})
