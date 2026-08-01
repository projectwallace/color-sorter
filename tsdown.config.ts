import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['index.ts'],
	format: 'esm',
	platform: 'neutral',
	dts: true,
	publint: true,
})
