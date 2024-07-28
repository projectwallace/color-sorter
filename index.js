import Color from 'colorjs.io'

/**
 * @typedef NormalizedColor
 * @property {number} hue
 * @property {number} saturation
 * @property {number} lightness
 * @property {number} alpha
 */


/**
 * @param {string | number | {raw: string} | undefined} value
 * @returns {number}
 * @todo Make this faster based on usage heuristics
 */
function numerify(value) {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value
	}
	if (Number.isNaN(value)) {
		return 0
	}
	if (typeof value === 'object' && 'raw' in value) {
		return parseFloat(value.raw)
	}
	return 0
}

/**
 * Convert a CSS (string) color into a normalized object that can be used for comparison
 * @param {string} authored
 * @returns {NormalizedColor & { authored: string }}
 */
export function convert(authored) {
	// TODO: get rid of try/catch
	try {
		let converted = new Color(authored)
		let hsl = converted.hsl
		let hue = numerify(hsl[0])
		let saturation = numerify(hsl[1])
		let lightness = numerify(hsl[2])
		let alpha = numerify(converted.alpha)

		return {
			hue,
			saturation,
			lightness,
			alpha,
			authored
		}
	} catch (error) {
		return {
			hue: 0,
			saturation: 0,
			lightness: 0,
			alpha: 0,
			authored
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