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
	;[
		'red',
		'hsla(0, 100%, 50%, 1)',
		'hsl(0, 100%, 50%)',
		'rgb(255, 0, 0)',
		'rgba(255, 0, 0, 1)'
	]
		.map(color => colorSorter.convert(color))
		.forEach(color => {
			t.deepEqual(color, {
				hue: 0,
				saturation: 1,
				lightness: 0.5,
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

test('Colors are sorted by Hue, then by saturation', t => {
	const colors = [
		'hsl(0, 100%, 50%)',
		'hsl(0, 50%, 50%)',
		'hsl(50, 50%, 50%)',
		'hsl(50, 100%, 50%)'
	]
	const expected = [
		'hsl(0, 50%, 50%)',
		'hsl(0, 100%, 50%)',
		'hsl(50, 100%, 50%)',
		'hsl(50, 50%, 50%)'
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
