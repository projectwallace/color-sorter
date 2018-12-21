const test = require('ava')
const colorSort = require('./color-sorter.js')
const {convert} = require('./color-sorter.js')

test('it exposes a convert function', t => {
	t.is(typeof convert, 'function')
})

test('the convert fn converts colors to an HSLA object', t => {
	[
		'red',
		'hsla(0, 100%, 50%, 1)',
		'hsl(0, 100%, 50%)',
		'rgb(255, 0, 0)',
		'rgba(255, 0, 0, 1)'
	].map(color => convert(color)).forEach(hsla => {
		t.deepEqual(hsla, {
			hue: 0,
			saturation: 1,
			lightness: .5,
			alpha: 1,
			authored: hsla.authored
		})
	})
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

test('V2. Colors are sorted by Hue', t => {
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
		'hsl(200, 100%, 50%)',
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

test('V2. Colors are sorted by Hue, then by saturation', t => {
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
		'hsl(50, 50%, 50%)',
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

test('V2. Grey-ish values are shifted to the end (lightest first)', t => {
	const colors = [
		'hsl(0, 0, 0)', // black
		'hsl(0, 100%, 50%)', // red,
		'hsl(0, 0, 100%)', // white
		'hsl(240, 100%, 50%)' // blue
	]
	const expected = [
		'hsl(0, 100%, 50%)', // red
		'hsl(240, 100%, 50%)', // blue
		'hsl(0, 0, 100%)', // white
		'hsl(0, 0, 0)', // black
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
		'rgba(160, 160, 160, 0.5)',
		'rgb(0, 0, 0)',
		'rgba(0, 0, 0, 0.5)',
		'rgba(0, 0, 0, 0.33)'
	]
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})

test('V2. Grey-ish colors are sorted by Lightness, then by Alpha', t => {
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
	const actual = colorSort(colors)

	t.deepEqual(actual, expected)
})

test('Fully transparent colors are shifted to the end', t => {
	const colors = [
		'rgba(1, 1, 1, 0)',
		'red',
		'rgba(0, 0, 0, 0)',
		'hsla(100, 100%, 50%, 1)',
		'hsla(100, 100%, 50%, 0)',
		'grey'
	]
	const actual = colorSort(colors)
	const expected = [
		'red',
		'hsla(100, 100%, 50%, 1)',
		'grey',
		'hsla(100, 100%, 50%, 0)',
		'rgba(0, 0, 0, 0)',
		'rgba(1, 1, 1, 0)'
	]

	t.deepEqual(actual, expected)
})

test('V2. Fully transparent colors are shifted to the end', t => {
	const colors = [
		'hsla(0, 0, 0, 0)',
		'hsla(0, 0, 0, .5)',
		'hsla(0, 0, 0, 1)'
	]
	const actual = colorSort(colors)
	const expected = [
		'hsla(0, 0, 0, 1)',
		'hsla(0, 0, 0, .5)',
		'hsla(0, 0, 0, 0)'
	]

	t.deepEqual(actual, expected)
})
