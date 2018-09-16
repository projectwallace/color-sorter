const test = require('ava')
const colorSort = require('./color-sorter.js')

test('It exposes an composition api', t => {
	t.is(typeof colorSort, 'function')
})

test('It exposes a sortFn', t => {
	t.is(typeof colorSort.sortFn, 'function')
})

test('It exposes a normalizeColor method', t => {
	t.is(typeof colorSort.normalizeColor, 'function')
})

test('sortFn takes two parameters and sorts using Array.sort()', t => {
	const colors = [
		'red',
		'blue',
		'yellow',
		'purple',
		'green'
	]
	const expected = [
		'red',
		'yellow',
		'green',
		'blue',
		'purple'
	]
	const actual = colors.sort(colorSort.sortFn)

	t.deepEqual(actual, expected)
})

test('Colors are sorted by Hue', t => {
	const colors = [
		'red',
		'blue',
		'yellow',
		'purple',
		'green'
	]
	const expected = [
		'red',
		'yellow',
		'green',
		'blue',
		'purple'
	]
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})

test('Colors are sorted by Hue, then by saturation', t => {
	const colors = [
		'hsl(60, 50%, 50%)',
		'hsl(60, 100%, 50%)',
		'hsl(0, 100%, 50%)'
	]
	const expected = [
		'hsl(0, 100%, 50%)',
		'hsl(60, 100%, 50%)',
		'hsl(60, 50%, 50%)'
	]
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})

test('Grey-ish values are shifted to the end', t => {
	const colors = [
		'white',
		'yellow',
		'black',
		'red',
		'whitesmoke'
	]
	const expected = [
		'red',
		'yellow',
		'white',
		'whitesmoke',
		'black'
	]
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})

test('Grey-ish colors are sorted by Lightness', t => {
	const colors = [
		'hsl(0, 0%, 100%)',
		'hsl(0, 0%, 0%)',
		'hsl(0, 0%, 25%)',
		'hsl(0, 0%, 50%)'
	]
	const expected = [
		'hsl(0, 0%, 100%)',
		'hsl(0, 0%, 50%)',
		'hsl(0, 0%, 25%)',
		'hsl(0, 0%, 0%)'
	]
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})

test('Grey-ish colors with matching lightness are sorted by alpha', t => {
	const colors = [
		'hsla(0, 0%, 0%, 0.3)',
		'hsla(0, 0%, 0%, 0.5)',
		'hsla(0, 0%, 0%, 1.0)',
		'hsla(0, 0%, 0%, 0.1)',
		'hsla(0, 0%, 0%, 0.2)'
	]
	const expected = [
		'hsla(0, 0%, 0%, 1.0)',
		'hsla(0, 0%, 0%, 0.5)',
		'hsla(0, 0%, 0%, 0.3)',
		'hsla(0, 0%, 0%, 0.2)',
		'hsla(0, 0%, 0%, 0.1)'
	]
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})

test('Grey-ish colors with matching lightness and alpha are sorted by string length and alphabet', t => {
	const colors = [
		'hsl(0,0%,0%)',
		'rgb(0, 0, 0)',
		'black',
		'#000',
		'#000000'
	]
	const expected = [
		'#000',
		'black',
		'#000000',
		'hsl(0,0%,0%)',
		'rgb(0, 0, 0)'
	]
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})
