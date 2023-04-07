import { ColorNotation, color, colorDataTo } from '@csstools/css-color-parser'
import { tokenize } from '@csstools/css-tokenizer'
import { parseComponentValue } from '@csstools/css-parser-algorithms'

/** @param {string} css */
function parse(css) {
	let tokens = tokenize({ css: css })
	let value = parseComponentValue(tokens, {})
	return colorDataTo(color(value), ColorNotation.HSL)
}

/**
 * Convert a CSS Color to an object that can be used for comparing colors
 * @param {string} color
 */
export function convert(color) {
	let hsl = parse(color)
	// Even out-of-sRGB-space colors are converted to HSL,
	// where Saturation might be more than 100
	let { channels, alpha } = hsl

	return {
		hue: channels[0],
		saturation: channels[1],
		lightness: channels[2],
		alpha,
		authored: color
	}
}

/**
 * @param {string} a CSS Color A
 * @param {string} b CSS Color B
 */
export function sortFn(a, b) {
	const colorA = convert(a)
	const colorB = convert(b)

	// Move grey-ish values to the back
	if (isNaN(colorA.saturation) && !isNaN(colorB.saturation)) {
		return 1
	}

	if (!isNaN(colorA.saturation) && isNaN(colorB.saturation)) {
		return -1
	}

	// Both colors have a saturation, but it could be 0 (white/gray)
	if (
		(colorA.saturation === 0 || colorB.saturation === 0) &&
		colorA.saturation !== colorB.saturation
	) {
		return colorB.saturation - colorA.saturation
	}

	// Sort by hue (lowest hue value first)
	if (colorA.hue !== colorB.hue) {
		return colorA.hue - colorB.hue
	}

	// Sort by saturation (highest first)
	if (colorA.saturation !== colorB.saturation) {
		return colorA.saturation - colorB.saturation
	}

	// Comparing gray values, light before dark
	if (colorA.saturation === 0 && colorB.saturation === 0) {
		if (colorA.lightness !== colorB.lightness) {
			return colorB.lightness - colorA.lightness
		}
	}

	// Sort by transparency, least transparent first
	if (colorA.alpha === colorB.alpha) {
		// Explicit sort by name in case we have RGB(0, 0, 0, 0) vs. rgb(0, 0, 0, 0)
		// -> We want the sorting to be consistent
		return colorA.authored.toLowerCase().localeCompare(colorB.authored.toLowerCase())
	}

	return colorB.alpha - colorA.alpha
}

/** @param {string[]} colors */
export function colorSorter(colors) {
	return colors.sort(sortFn)
}
