const test = require('ava')
const colorSort = require('./color-sorter.js')

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
		'hsl(60, 100%, 50%)',
		'hsl(60, 50%, 50%)',
		'red'
	]
	const expected = [
		'red',
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
		'red'
	]
	const expected = [
		'red',
		'yellow',
		'white',
		'black'
	]
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})

test('Grey-ish colors are sorted by Lightness', t => {
	const colors = [
		'white',
		'red',
		'black',
		'grey',
		'whitesmoke'
	]
	const expected = [
		'red',
		'white',
		'whitesmoke',
		'grey',
		'black'
	]
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})

test('Grey-ish colors are sorted by Lightness, then by Alpha', t => {
	const colors = [
		'rgb(160, 160, 160)',
		'rgba(0, 0, 0, 0.33)',
		'rgb(0, 0, 0)',
		'rgba(0, 0, 0, 0.5)',
		'rgba(160, 160, 160, 0.5)'
	]
	const expected = [
		'rgb(160, 160, 160)',
		'rgb(0, 0, 0)',
		'rgba(160, 160, 160, 0.5)',
		'rgba(0, 0, 0, 0.5)',
		'rgba(0, 0, 0, 0.33)'
	]
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})

test('Fully transparent colors are shifted to the end', t => {
	const colors = [
		'rgba(1, 1, 1, 0)',
		'red',
		'hsla(100, 100%, 50%, 1)',
		'hsla(100, 100%, 50%, 0)',
		'grey'
	]
	const actual = colorSort(colors)
	const expected = [
		'red',
		'hsla(100, 100%, 50%, 1)',
		'grey',
		'rgba(1, 1, 1, 0)',
		'hsla(100, 100%, 50%, 0)'
	]

	t.deepEqual(actual, expected)
})
