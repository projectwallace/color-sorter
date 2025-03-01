import {
	parse,
	to as convertColor,
	ColorSpace,
	sRGB,
	P3,
	LCH,
	HSL,
	OKLCH,
} from "colorjs.io/fn"

// Register color spaces for parsing and converting
ColorSpace.register(sRGB) // Parses keywords and hex colors
ColorSpace.register(P3)
ColorSpace.register(HSL)
ColorSpace.register(LCH)
ColorSpace.register(OKLCH)

/**
 * @typedef NormalizedColor
 * @property {number} hue
 * @property {number} saturation
 * @property {number} lightness
 * @property {number} alpha
 */

/**
 * @typedef {NormalizedColor & { authored: string }} NormalizedColorWithAuthored
 */

/**
 * @param {string | number | {raw: string} | undefined | null} value
 * @returns {number}
 * @todo Make this faster based on usage heuristics
 */
function numerify(value) {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value
	}
	return 0
}

/**
 * Convert a CSS (string) color into a normalized object that can be used for comparison
 * @param {string} authored
 * @returns {NormalizedColorWithAuthored}
 * @example convert('red')
 */
export function convert(authored) {
	try {
		let parsed = parse(authored)
		let converted = parsed.spaceId === 'hsl' ? parsed : convertColor(parsed, HSL)
		let hsl = converted.coords
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
}

/**
 * @param {NormalizedColorWithAuthored} a
 * @param {NormalizedColorWithAuthored} b
 * @returns {number}
 */
export function compare(a, b) {
	// Move grey-ish values to the back
	if (
		(a.saturation === 0 || b.saturation === 0) &&
		a.saturation !== b.saturation
	) {
		return b.saturation - a.saturation
	}

	// Sort by hue (lowest first)
	if (a.hue !== b.hue) {
		return a.hue - b.hue
	}

	// Sort by saturation (highest first)
	if (a.saturation !== b.saturation) {
		return a.saturation - b.saturation
	}

	// Comparing gray values, light before dark
	if (a.saturation === 0 && b.saturation === 0) {
		if (a.lightness !== b.lightness) {
			return b.lightness - a.lightness
		}
	}

	// Sort by transparency, least transparent first
	if (a.alpha === b.alpha) {
		return a.authored.toLowerCase().localeCompare(b.authored.toLowerCase())
	}

	return b.alpha - a.alpha
}

/**
 * Function that sorts colors
 * @param {string} a
 * @param {string} b
 * @returns {number}
 * @example ['red', 'yellow'].sort(sortFn)
 */
export function sortFn(a, b) {
	let colorA = convert(a)
	let colorB = convert(b)

	return compare(colorA, colorB)
}

/**
 * Sort the `colors` array using `Array.sort()`, so beware that it changes the source input
 * @param {string[]} colors
 * @returns {string[]} sorted
 * @example sort(['red', 'yellow'])
 */
export function sort(colors) {
	return colors.sort(sortFn)
}