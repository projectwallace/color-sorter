import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { convert, sort, sortFn } from './index.js'

test('it exposes a basic sort function', () => {
	assert.is(typeof sort, 'function')
})

test('it exposes a convert function', () => {
	assert.is(typeof convert, 'function')
})

test('it exposes a sortFn', () => {
	assert.is(typeof sortFn, 'function')
})

test('the convert fn converts colors to an oklch object', () => {
	const colors = [
		'red',
		'hsla(0, 100%, 50%, 1)',
		'hsl(0, 100%, 50%)',
		'rgb(255, 0, 0)',
		'rgba(255, 0, 0, 1)'
	]

	for (let color of colors) {
		assert.equal(convert(color), {
			hue: 0,
			saturation: 100,
			lightness: 50,
			alpha: 1,
			authored: color
		}, `Failed convert for '${color}'`)
	}
})

test('Colors are sorted by Hue', () => {
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
	const actual = sort(colors)

	assert.equal(actual, expected)
})

test('Colors are sorted by Hue, then by saturation', () => {
	const colors = [
		'hsl(0, 100%, 50%)',
		'hsl(0, 50%, 50%)',
		'hsl(50, 20%, 50%)',
		'hsl(50, 100%, 50%)'
	]
	const expected = [
		'hsl(0, 50%, 50%)',
		'hsl(0, 100%, 50%)',
		'hsl(50, 20%, 50%)',
		'hsl(50, 100%, 50%)'
	]
	const actual = sort(colors)

	assert.equal(actual, expected)
})

test('Grey-ish values are shifted to the end (lightest first)', () => {
	const colors = [
		'hsl(0, 0%, 0%)', // Black
		'hsl(0, 100%, 50%)', // Red,
		'hsl(0, 0%, 100%)', // White
		'hsl(240, 100%, 50%)' // Blue
	]
	const expected = [
		'hsl(0, 100%, 50%)', // Red
		'hsl(240, 100%, 50%)', // Blue
		'hsl(0, 0%, 100%)', // White
		'hsl(0, 0%, 0%)', // Black
	]
	const actual = sort(colors)

	assert.equal(actual, expected)
})

test('Grey-ish colors are sorted by Lightness', () => {
	// The key here is that saturation (the middle value in HSL)
	// equals 0
	const colors = [
		'#000',
		'#fff',
		'#eee',
		'#555',
		'#222'
	]
	const expected = [
		'#fff',
		'#eee',
		'#555',
		'#222',
		'#000'
	]
	const actual = sort(colors)

	assert.equal(actual, expected)
})

test('Grey-ish colors are sorted by Lightness, then by Alpha', () => {
	const colors = [
		'hsla(0, 0%, 20%, 1)',
		'hsla(0, 0%, 10%, 1)',
		'hsla(0, 0%, 10%, 0)',
		'hsla(0, 0%, 0%, 0)'
	]
	const expected = [
		'hsla(0, 0%, 20%, 1)',
		'hsla(0, 0%, 10%, 1)',
		'hsla(0, 0%, 10%, 0)',
		'hsla(0, 0%, 0%, 0)',
	]
	const actual = sort(colors)

	assert.equal(actual, expected)
})

test('Fully transparent colors are sorted along their opaque companions', () => {
	const colors = ['rgba(255, 0, 0, 0)', 'hsla(0, 100%, 50%, 0.1)', 'red']
	const actual = sort(colors)
	const expected = ['red', 'hsla(0, 100%, 50%, 0.1)', 'rgba(255, 0, 0, 0)']

	assert.equal(actual, expected)
})

test('smoke test', () => {
	const colors = [
		'#4b4747',
		'#f00',
		'#d70c0b',
		'#f22b24',
		'#ff6930',
		'#eb6c1e',
		'#eb6d1e',
		'#f57917',
		'#ff8a0a',
		'#f7a336',
		'#feb95a',
		'#eca920',
		'#f1c15d',
		'#f1c260',
		'#ff0',
		'#c8d05b',
		'#ccd557',
		'#d2ff52',
		'#10ac47',
		'#04a03b',
		'#03fff3',
		'#38d7df',
		'#25bbc3',
		'#15b8ec',
		'#00adea',
		'#8e34c9',
		'#9a3dd1',
		'#cd66f6',
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
		'#1d1d1d',
		'#0d0d0d',
		'#000',
		'rgba(0,0,0,0.8)',
		'rgba(0,0,0,0.6)',
		'rgba(0,0,0,0.4)',
		'rgba(0,0,0,0.1)',
		'rgba(0,0,0,0.05)'
	]
	const expected = [...colors]
	const actual = sort(colors)

	assert.equal(actual, expected)
})

test.run()
