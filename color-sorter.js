import { colord, extend } from 'colord'
import namesPlugin from 'colord/plugins/names'

extend([namesPlugin])

/**
 * @typedef NormalizedColor
 * @property {number} hue
 * @property {number} saturation
 * @property {number} lightness
 * @property {number} alpha
 */

/**
 * Convert a CSS (string) color into a normalized object that can be used for comparison
 * @param {string} color
 * @returns {NormalizedColor & { authored: string }}
 */
export function convert(color) {
	let result = colord(color).toHsl()

	return {
		hue: result.h,
		saturation: result.s,
		lightness: result.l,
		alpha: result.a,
		authored: color
	}
}

/**
 * Function that sorts colors
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function sortFn(a, b) {
	let colorA = convert(a)
	let colorB = convert(b)

	// Move grey-ish values to the back
	if (
		(colorA.saturation === 0 || colorB.saturation === 0) &&
		colorA.saturation !== colorB.saturation
	) {
		return colorB.saturation - colorA.saturation
	}

	// Sort by hue (lowest first)
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
		return colorA.authored.toLowerCase().localeCompare(colorB.authored.toLowerCase())
	}

	return colorB.alpha - colorA.alpha
}

/**
 * Sort the `colors` array using `Array.sort()`, so beware that it changes the source input
 * @param {string[]} colors
 * @returns {string[]} sorted
 */
export function sort(colors) {
	return colors.sort(sortFn)
}