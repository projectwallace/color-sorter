const test = require('ava')
const colorSorter = require('./color-sorter.js')

test('it exposes a basic colorSort function', t => {
	t.is(typeof colorSorter, 'function')
})

test('it exposes a convert function', t => {
	t.is(typeof colorSorter.convert, 'function')
})

test('it exposes a sortFn', t => {
	t.is(typeof colorSorter.sortFn, 'function')
})

test('the convert fn converts colors to an HSLA object', t => {
	const colors = [
		'red',
		'hsla(0, 100%, 50%, 1)',
		'hsl(0, 100%, 50%)',
		'rgb(255, 0, 0)',
		'rgba(255, 0, 0, 1)'
	].map(color => colorSorter.convert(color))

	colors.forEach(color => {
		t.deepEqual(color, {
			hue: 0,
			saturation: 100,
			lightness: 50,
			alpha: 1,
			authored: color.authored
		})
	})
})

test('Colors are sorted by Hue', t => {
	const colors = [
		'hsl(0, 100%, 50%)',
		'hsl(200, 100%, 50%)',
		'hsl(50, 100%, 50%)',
		'hsl(10, 100%, 50%)',
		'hsl(100, 100%, 50%)'
	]
	const expected = [
		'hsl(0, 100%, 50%)',
		'hsl(10, 100%, 50%)',
		'hsl(50, 100%, 50%)',
		'hsl(100, 100%, 50%)',
		'hsl(200, 100%, 50%)'
	]
	const actual = colorSorter(colors)

	t.deepEqual(actual, expected)
})

test.skip('Colors are sorted by Hue, then by saturation', t => {
	const colors = [
		'hsl(0, 100%, 50%)',
		'hsl(0, 50%, 50%)',
		'hsl(50, 20%, 50%)',
		'hsl(50, 100%, 50%)'
	]
	const expected = [
		'hsl(0, 50%, 50%)',
		'hsl(0, 100%, 50%)',
		'hsl(50, 100%, 50%)',
		'hsl(50, 20%, 50%)'
	]
	const actual = colorSorter(colors)

	t.deepEqual(actual, expected)
})

test('Grey-ish values are shifted to the end (lightest first)', t => {
	const colors = [
		'hsl(0, 0, 0)', // Black
		'hsl(0, 100%, 50%)', // Red,
		'hsl(0, 0, 100%)', // White
		'hsl(240, 100%, 50%)' // Blue
	]
	const expected = [
		'hsl(0, 100%, 50%)', // Red
		'hsl(240, 100%, 50%)', // Blue
		'hsl(0, 0, 100%)', // White
		'hsl(0, 0, 0)' // Black
	]
	const actual = colorSorter(colors)

	t.deepEqual(actual, expected)
})

test('Grey-ish colors are sorted by Lightness', t => {
	// The key here is that saturation (the middle value in HSL)
	// equals 0
	const colors = [
		'hsl(0, 0, 40%)',
		'hsl(10, 0, 50%)',
		'hsl(20, 0, 30%)',
		'hsl(30, 0, 20%)',
		'hsl(40, 0, 60%)'
	]
	const expected = [
		'hsl(40, 0, 60%)',
		'hsl(10, 0, 50%)',
		'hsl(0, 0, 40%)',
		'hsl(20, 0, 30%)',
		'hsl(30, 0, 20%)'
	]
	const actual = colorSorter(colors)

	t.deepEqual(actual, expected)
})

test('Grey-ish colors are sorted by Lightness, then by Alpha', t => {
	const colors = [
		'hsla(0, 0, 20%, 1)',
		'hsla(0, 0, 10%, 1)',
		'hsla(0, 0, 10%, 0)',
		'hsla(0, 0, 0, 0)'
	]
	const expected = [
		'hsla(0, 0, 20%, 1)',
		'hsla(0, 0, 10%, 1)',
		'hsla(0, 0, 0, 0)',
		'hsla(0, 0, 10%, 0)'
	]
	const actual = colorSorter(colors)

	t.deepEqual(actual, expected)
})

test('Fully transparent colors are shifted to the end', t => {
	const colors = ['hsla(0, 0, 0, 0)', 'hsla(0, 0, 0, .5)', 'hsla(0, 0, 0, 1)']
	const actual = colorSorter(colors)
	const expected = ['hsla(0, 0, 0, 1)', 'hsla(0, 0, 0, .5)', 'hsla(0, 0, 0, 0)']

	t.deepEqual(actual, expected)
})

test.only('smoke test', t => {
	const colors = [
		'#4b4747',
		'#f00',
		'rgb(255, 0, 0)',
		'#d70c0b',
		'rgb(215, 12, 11)',
		'#f22b24',
		'rgb(242, 43, 36)',
		'#ff6930',
		'rgb(255, 105, 48)',
		'#eb6c1e',
		'rgb(235, 108, 30)',
		'#eb6d1e',
		'rgb(235, 109, 30)',
		'#f57917',
		'rgb(245, 121, 23)',
		'#ff8a0a',
		'rgb(255, 138, 10)',
		'#f7a336',
		'rgb(247, 163, 54)',
		'#feb95a',
		'rgb(254, 185, 90)',
		'#eca920',
		'rgb(236, 169, 32)',
		'#f1c15d',
		'rgb(241, 193, 93)',
		'#f1c260',
		'rgb(241, 194, 96)',
		'#ff0',
		'rgb(255, 255, 0)',
		'#c8d05b',
		'rgb(200, 208, 91)',
		'#ccd557',
		'rgb(204, 213, 87)',
		'#d2ff52',
		'rgb(210, 255, 82)',
		'#10ac47',
		'rgb(16, 172, 71)',
		'#04a03b',
		'rgb(4, 160, 59)',
		'#03fff3',
		'rgb(3, 255, 243)',
		'#38d7df',
		'rgb(56, 215, 223)',
		'#25bbc3',
		'rgb(37, 187, 195)',
		'#15b8ec',
		'rgb(21, 184, 236)',
		'#00adea',
		'rgb(0, 173, 234)',
		'#8e34c9',
		'rgb(142, 52, 201)',
		'#9a3dd1',
		'rgb(154, 61, 209)',
		'#cd66f6',
		'rgb(205, 102, 246)',
		'#fff',
		'rgb(255, 255, 255)',
		'rgba(255,255,255,0.2)',
		'rgba(255, 255, 255, 0.2)',
		'rgba(255,255,255,0.07)',
		'rgba(255, 255, 255, 0.07)',
		'#f9f9f9',
		'rgb(249, 249, 249)',
		'#f4f4f4',
		'rgb(244, 244, 244)',
		'#f2f2f2',
		'rgb(242, 242, 242)',
		'#e4e4e4',
		'rgb(228, 228, 228)',
		'#ddd',
		'rgb(221, 221, 221)',
		'#c0c0c0',
		'rgb(192, 192, 192)',
		'#666',
		'rgb(102, 102, 102)',
		'#4a4a4a',
		'rgb(74, 74, 74)',
		'#1d1d1d',
		'rgb(29, 29, 29)',
		'#0d0d0d',
		'rgb(13, 13, 13)',
		'#000',
		'rgb(0, 0, 0)',
		'rgba(0,0,0,0.8)',
		'rgba(0, 0, 0, 0.8)',
		'rgba(0,0,0,0.6)',
		'rgba(0, 0, 0, 0.6)',
		'rgba(0,0,0,0.4)',
		'rgba(0, 0, 0, 0.4)',
		'rgba(0,0,0,0.1)',
		'rgba(0, 0, 0, 0.1)',
		'rgba(0,0,0,0.05)',
		'rgba(0, 0, 0, 0.05)'
	]
	const expected = [...colors]
	const actual = colorSorter(colors)

	t.deepEqual(actual, expected)
})
