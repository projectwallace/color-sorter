const tinycolor = require('tinycolor2')

/*
 * Sort by saturation, high to low (ASC, 100%  - 0%)
 */
function sortBySaturation(colorA, colorB) {
	return colorA.saturation - colorB.saturation
}

/*
 * Sort by hue, red-yellow-green-blue-purple (0-360)
 */
function sortByHue({hsl: colorA}, {hsl: colorB}) {
	const {hue: hueA} = colorA
	const {hue: hueB} = colorB

	// If the hues are the same, sort by saturation
	if (hueA === hueB) {
		return sortBySaturation(colorA, colorB)
	}

	return hueA - hueB
}

/*
 * Sort by alpha channel, transparent to opaque
 */
function sortByAlpha({hsl: colorA}, {hsl: colorB}) {
	if (colorA.alpha === colorB.alpha) {
		return sortByLightness(colorA, colorB)
	}

	return colorB.alpha - colorA.alpha
}

/*
 * Sort by lightness, light to dark
 */
function sortByLightness(colorA, colorB) {
	const {lightness: lightnessA} = colorA
	const {lightness: lightnessB} = colorB

	return lightnessB - lightnessA
}

/*
 * Determines if a given color is a pure grey
 */
function isGrey(color) {
	return color.hsl.saturation === 0
}

/*
 * Sort an array of CSS colors
 *
 * @param colors An array of CSS colors
 * @returns array A new sorted array
 */
module.exports = colors => {
	// Add an `hsl` prop to our array to use for sorting
	const mapped = colors.map(color => {
		const {h: hue, s: saturation, l: lightness, a: alpha} = tinycolor(
			color
		).toHsl()

		return {
			authored: color,
			hsl: {hue, saturation, lightness, alpha}
		}
	})

	return (
		mapped
			// Sort by hue
			.sort(sortByHue)
			// Remove the grey colors
			.filter(color => !isGrey(color))
			.concat(
				// Shift the grey colors to the back
				mapped
					.filter(color => isGrey(color))
					// And sort the greys by lightness
					.sort(sortByAlpha)
			)
			// Finally, return the array in the form it was given to us
			.map(color => color.authored)
	)
}
