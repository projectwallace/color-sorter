const tinycolor = require('tinycolor2')

// /*
//  * Sort by saturation, high to low (ASC, 100%  - 0%)
//  */
// function sortBySaturation(colorA, colorB) {
// 	return colorA.saturation - colorB.saturation
// }

// /*
//  * Sort by hue, red-yellow-green-blue-purple (0-360)
//  */
// function sortByHue({hsl: colorA}, {hsl: colorB}) {
// 	const {hue: hueA} = colorA
// 	const {hue: hueB} = colorB

// 	// If the hues are the same, sort by saturation
// 	if (hueA === hueB) {
// 		return sortBySaturation(colorA, colorB)
// 	}

// 	return hueA - hueB
// }

// /*
//  * Sort by alpha channel, transparent to opaque
//  */
// function sortByAlpha({hsl: colorA}, {hsl: colorB}) {
// 	if (colorA.alpha === colorB.alpha) {
// 		return sortByLightness(colorA, colorB)
// 	}

// 	return colorB.alpha - colorA.alpha
// }

// /*
//  * Sort by lightness, light to dark
//  */
// function sortByLightness(colorA, colorB) {
// 	const {lightness: lightnessA} = colorA
// 	const {lightness: lightnessB} = colorB

// 	return lightnessB - lightnessA
// }

// /*
//  * Determines if a given color is a pure grey
//  */
// function isGrey(color) {
// 	return color.hsl.saturation === 0
// }

// /*
//  * Determines if a color is fully transparent
//  */
// function isTransparent(color) {
// 	return color.hsl.alpha === 0
// }

// /*
//  * Sort an array of CSS colors
//  *
//  * @param colors An array of CSS colors
//  * @returns array A new sorted array
//  */
// module.exports = colors => {
// 	// Add an `hsl` prop to our array to use for sorting
// 	const mapped = colors.map(color => {
// 		const {h: hue, s: saturation, l: lightness, a: alpha} = tinycolor(
// 			color
// 		).toHsl()

// 		return {
// 			authored: color,
// 			hsl: {hue, saturation, lightness, alpha}
// 		}
// 	})

// 	return (
// 		mapped
// 			// Sort by hue
// 			.sort(sortByHue)
// 			// Remove the grey colors
// 			.filter(color => !isGrey(color))
// 			.filter(color => !isTransparent(color))
// 			.concat(
// 				// Shift the grey colors to the back
// 				mapped
// 					.filter(color => isGrey(color) && !isTransparent(color))
// 					// And sort the greys by lightness
// 					.sort(sortByAlpha)
// 			)
// 			.concat(
// 				// Shift fully transparent colors after the greys
// 				mapped
// 					.filter(color => isTransparent(color))
// 					.sort(sortByHue)
// 			)
// 			// Finally, return the array in the form it was given to us
// 			.map(color => color.authored)
// 	)
// }

const convert = color => {
	const {h: hue, s: saturation, l: lightness, a: alpha} = tinycolor(
		color
	).toHsl()

	return {
		hue,
		saturation,
		lightness,
		alpha,
		authored: color
	}
}

// should return -1, 0 or 1
const sortFn = (a, b) => {
	// Move fully transparent colors to the back and
	// sort by A-Z if both colors are fully transparent
	if (a.alpha === 0 || b.alpha === 0) {
		if (a.alpha === b.alpha) {
			return a.authored.toLowerCase().localeCompare(b.authored.toLowerCase())
		}

		return b.alpha - a.alpha
	}

	// Move grey-ish values to the back
	if ((a.saturation === 0 || b.saturation === 0) && a.saturation !== b.saturation) {
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

	// comparing grey values, light before dark
	if (a.saturation === 0 && b.saturation === 0) {
		if (a.lightness !== b.lightness) {
			return b.lightness - a.lightness
		}
	}

	// Sort by transparency, least transparent first
	if (a.alpha !== b.alpha) {
		return b.alpha - a.alpha
	}
}

module.exports = colors => colors.map(convert).sort(sortFn).map(color => color.authored)
module.exports.convert = convert
module.exports.sortFn = sortFn