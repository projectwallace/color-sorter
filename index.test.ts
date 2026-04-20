import { test, expect, describe } from 'vitest'
import { convert, sort_fn, compare, color_group } from './index.ts'

describe('public API', () => {
	test('it exposes a convert function', () => {
		expect(typeof convert).toBe('function')
	})

	test('it exposes a sort_fn', () => {
		expect(typeof sort_fn).toBe('function')
	})

	test('it exposes a compare function', () => {
		expect(typeof compare).toBe('function')
	})

	test('it exposes a color_group function', () => {
		expect(typeof color_group).toBe('function')
	})
})

describe('convert', () => {
	test('the convert fn converts colors to an HSLA object', () => {
		const colors = [
			'red',
			'#f00',
			'hsla(0, 100%, 50%, 1)',
			'hsl(0, 100%, 50%)',
			'rgb(255, 0, 0)',
			'rgba(255, 0, 0, 1)',
			'oklch(62.8% 0.25768330773615683 29.2338851923426)',
		]

		for (let color of colors) {
			let converted = convert(color)
			// Making sure most colors are mostly within the range
			expect(
				converted.hue >= 0 && converted.hue <= 0.01,
				`Failed hue for '${color}', got ${converted.hue}`,
			).toBe(true)
			expect(
				converted.saturation >= 99.9 && converted.saturation <= 100.02,
				`Failed saturation for '${color}', got ${converted.saturation}`,
			).toBe(true)
			expect(
				converted.lightness >= 49.9 && converted.lightness <= 50.02,
				`Failed lightness for '${color}', got ${converted.lightness}`,
			).toBe(true)
			expect(converted.alpha).toBe(1)
			expect(converted.authored).toBe(color)
		}
	})

	const invalid_colors = ['hsl(0, 0, 0)', 'rgb(0 0 0 1)', 'rgb(a, b, c, 1)']
	test.each(invalid_colors)(`invalid colors return a default object: %s`, (color) => {
		expect(convert(color)).toEqual({
			hue: 0,
			saturation: 0,
			lightness: 0,
			alpha: 1,
			authored: color,
		})
	})

	test('NaN', () => {
		expect(convert('rgb(NaN NaN NaN / 1)')).toEqual({
			hue: 0,
			saturation: 0,
			lightness: 0,
			alpha: 1,
			authored: 'rgb(NaN NaN NaN / 1)',
		})
	})

	test('converts `transparent` to 0% opacity black', () => {
		const transparent = convert('transparent')
		expect(transparent).toEqual({
			hue: 0,
			saturation: 0,
			lightness: 0,
			alpha: 0,
			authored: 'transparent',
		})
	})

	test('converts `inherit` to black', () => {
		expect(convert('inherit')).toEqual({
			hue: 0,
			saturation: 0,
			lightness: 0,
			alpha: 1,
			authored: 'inherit',
		})
	})

	test('converts `currrentcolor` to black', () => {
		expect(convert('currentcolor')).toEqual({
			hue: 0,
			saturation: 0,
			lightness: 0,
			alpha: 1,
			authored: 'currentcolor',
		})
	})
})

describe('compare', () => {
	test('comparing two colors', () => {
		const a = convert('red')
		const b = convert('blue')
		const actual = compare(a, b)
		expect(actual).toBeLessThan(0)
	})

	test('comparing identical colors', () => {
		const a = convert('red')
		const b = convert('red')
		const actual = compare(a, b)
		expect(actual).toBe(0)
	})
})

describe('sort_fn', () => {
	test('Colors are sorted by Hue', () => {
		const colors = [
			'hsl(0, 100%, 50%)',
			'hsl(200, 100%, 50%)',
			'hsl(50, 100%, 50%)',
			'hsl(10, 100%, 50%)',
			'hsl(100, 100%, 50%)',
		]
		const expected = [
			'hsl(0, 100%, 50%)',
			'hsl(10, 100%, 50%)',
			'hsl(50, 100%, 50%)',
			'hsl(100, 100%, 50%)',
			'hsl(200, 100%, 50%)',
		]
		const actual = colors.toSorted(sort_fn)

		expect(actual).toEqual(expected)
	})

	test('Colors are sorted by Hue, then by lightness', () => {
		const colors = [
			'hsl(50, 20%, 50%)',
			'hsl(0, 100%, 50%)',
			'hsl(0, 50%, 50%)',
			'hsl(50, 100%, 50%)',
		]
		const expected = [
			'hsl(0, 100%, 50%)',
			'hsl(0, 50%, 50%)',
			'hsl(50, 20%, 50%)',
			'hsl(50, 100%, 50%)',
		]
		const actual = colors.toSorted(sort_fn)

		expect(actual).toEqual(expected)
	})

	test('Grey-ish values are shifted to the end (lightest first)', () => {
		const colors = [
			'hsl(0, 0%, 0%)', // Black
			'hsl(0, 100%, 50%)', // Red,
			'hsl(0, 0%, 100%)', // White
			'hsl(240, 100%, 50%)', // Blue
		]
		const expected = [
			'hsl(0, 100%, 50%)', // Red
			'hsl(240, 100%, 50%)', // Blue
			'hsl(0, 0%, 100%)', // White
			'hsl(0, 0%, 0%)', // Black
		]
		const actual = colors.toSorted(sort_fn)

		expect(actual).toEqual(expected)
	})

	test('Grey-ish colors are sorted by Lightness', () => {
		// The key here is that saturation (the middle value in HSL)
		// equals 0
		const colors = ['#000', '#fff', '#eee', '#555', '#222']
		const expected = ['#fff', '#eee', '#555', '#222', '#000']
		const actual = colors.toSorted(sort_fn)

		expect(actual).toEqual(expected)
	})

	test('Grey-ish colors are sorted by Lightness, then by Alpha', () => {
		const colors = [
			'hsla(0, 0%, 20%, 1)',
			'hsla(0, 0%, 10%, 1)',
			'hsla(0, 0%, 10%, 0)',
			'hsla(0, 0%, 0%, 0)',
		]
		const expected = [
			'hsla(0, 0%, 20%, 1)',
			'hsla(0, 0%, 10%, 1)',
			'hsla(0, 0%, 10%, 0)',
			'hsla(0, 0%, 0%, 0)',
		]
		const actual = colors.toSorted(sort_fn)

		expect(actual).toEqual(expected)
	})

	test('colors with identical transparency are sorted alphabetically', () => {
		const colors = ['RGBA(255, 0, 0, 0.5)', 'rgba(255, 0, 0, 0.5)']
		const actual = colors.toSorted(sort_fn)
		const expected = ['RGBA(255, 0, 0, 0.5)', 'rgba(255, 0, 0, 0.5)']
		expect(actual).toEqual(expected)
	})

	test('Fully transparent colors are sorted along their opaque companions', () => {
		const colors = ['rgba(255, 0, 0, 0)', 'hsla(0, 100%, 50%, 0.1)', 'red']
		const actual = colors.toSorted(sort_fn)
		const expected = ['red', 'hsla(0, 100%, 50%, 0.1)', 'rgba(255, 0, 0, 0)']

		expect(actual).toEqual(expected)
	})

	test('smoke test', () => {
		const colors = [
			'#f22b24',
			'#f00',
			'#d70c0b',
			'#feb95a',
			'#f1c260',
			'#f1c15d',
			'#ff6930',
			'#f7a336',
			'#eca920',
			'#f57917',
			'#ff8a0a',
			'#eb6c1e',
			'#eb6d1e',
			'#ccd557',
			'#c8d05b',
			'#ff0',
			'#d2ff52',
			'#10ac47',
			'#04a03b',
			'#38d7df',
			'#03fff3',
			'#25bbc3',
			'#15b8ec',
			'#00adea',
			'#cd66f6',
			'#9a3dd1',
			'#8e34c9',
			'#fff',
			'rgba(255,255,255,0.2)',
			'rgba(255,255,255,0.07)',
			'#f9f9f9',
			'#f4f4f4',
			'#f2f2f2',
			'#e4e4e4',
			'#ddd',
			'#c0c0c0',
			'#666',
			'#4a4a4a',
			'#4b4747',
			'#1d1d1d',
			'#0d0d0d',
			'#000',
			'rgba(0,0,0,0.8)',
			'rgba(0,0,0,0.6)',
			'rgba(0,0,0,0.4)',
			'rgba(0,0,0,0.1)',
			'rgba(0,0,0,0.05)',
		]
		const expected = [...colors]
		const actual = colors.toSorted(sort_fn)

		expect(actual).toEqual(expected)
	})
})

describe('color group', () => {
	test('gets a single color group', () => {
		const colors = [
			['hsl(0, 100%, 50%)', 'red'],
			['hsl(200, 100%, 50%)', 'blue'],
			['hsl(50, 100%, 50%)', 'yellow'],
			['hsl(10, 100%, 50%)', 'red'],
			['hsl(100, 100%, 50%)', 'green'],
			['hsl(270 52% 45%)', 'violet'],
		]
		for (let [color, group] of colors) {
			expect(color_group(convert(color!))).toBe(group)
		}
	})

	test('allows grouping of colors', () => {
		const colors = [
			'#f22b24',
			'#f00',
			'#d70c0b',
			'#feb95a',
			'#f1c260',
			'#f1c15d',
			'#ff6930',
			'#f7a336',
			'#f57917',
			'#eca920',
			'#ff8a0a',
			'#eb6c1e',
			'#eb6d1e',
			'#ccd557',
			'#c8d05b',
			'#ff0',
			'#d2ff52',
			'#10ac47',
			'#04a03b',
			'#38d7df',
			'#03fff3',
			'#25bbc3',
			'#15b8ec',
			'#00adea',
			'#cd66f6',
			'#9a3dd1',
			'#8e34c9',
			'#fff',
			'rgba(255,255,255,0.2)',
			'rgba(255,255,255,0.07)',
			'#f9f9f9',
			'#f4f4f4',
			'#f2f2f2',
			'#e4e4e4',
			'#ddd',
			'#c0c0c0',
			'#666',
			'#4a4a4a',
			'#4b4747',
			'#1d1d1d',
			'#0d0d0d',
			'#000',
			'rgba(0,0,0,0.8)',
		]
		let authored = Object.entries(
			colors.reduce(
				(acc, color) => {
					let converted = convert(color)
					let group = color_group(converted)
					if (!acc[group]) {
						acc[group] = []
					}
					acc[group].push(converted.authored)
					return acc
				},
				{} as Record<string, string[]>,
			),
		)
		expect(authored).toEqual([
			['red', ['#f22b24', '#f00', '#d70c0b']],
			[
				'orange',
				[
					'#feb95a',
					'#f1c260',
					'#f1c15d',
					'#ff6930',
					'#f7a336',
					'#f57917',
					'#eca920',
					'#ff8a0a',
					'#eb6c1e',
					'#eb6d1e',
				],
			],
			['brown', ['#ccd557', '#c8d05b']],
			['yellow', ['#ff0']],
			['green', ['#d2ff52', '#10ac47', '#04a03b']],
			['cyan', ['#38d7df', '#03fff3', '#25bbc3']],
			['blue', ['#15b8ec', '#00adea']],
			['magenta', ['#cd66f6', '#9a3dd1', '#8e34c9']],
			[
				'gray',
				[
					'#fff',
					'rgba(255,255,255,0.2)',
					'rgba(255,255,255,0.07)',
					'#f9f9f9',
					'#f4f4f4',
					'#f2f2f2',
					'#e4e4e4',
					'#ddd',
					'#c0c0c0',
					'#666',
					'#4a4a4a',
					'#4b4747',
					'#1d1d1d',
					'#0d0d0d',
					'#000',
					'rgba(0,0,0,0.8)',
				],
			],
		])
	})
})
