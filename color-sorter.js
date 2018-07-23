const tinycolor = require('tinycolor2')

/**
 * Sort by saturation, high to low (ASC, 100%  - 0%)
 * @param {*} colorA An {hsl: {}}-like object
 * @param {*} colorB An {hsl: {}}-like object
 */
function sortBySaturation(colorA, colorB) {
	return colorA.saturation - colorB.saturation
}

/**
 * Sort by hue, red-yellow-green-blue-purple (0-360)
 * @param {*} colorA An {hsl: {}}-like object
 * @param {*} colorB An {hsl: {}}-like object
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

/**
 * Sort by alpha channel, transparent to opaque
 * @param {*} colorA An {hsl: {}}-like object
 * @param {*} colorB An {hsl: {}}-like object
 */
function sortByAlpha({hsl: colorA}, {hsl: colorB}) {
	if (colorA.alpha === colorB.alpha) {
		return sortByLightness(colorA, colorB)
	}

	return colorB.alpha - colorA.alpha
}

/**
 * Sort by lightness, light to dark
 * @param {*} colorA An {hsl: {}}-like object
 * @param {*} colorB {hsl: {}}-like object
 */
function sortByLightness(colorA, colorB) {
	const {lightness: lightnessA} = colorA
	const {lightness: lightnessB} = colorB

	return lightnessB - lightnessA
}

/**
 * Determines if a given color is a pure grey
 * @param {*} color An {hsl: {}}-like object
 */
function isGrey(color) {
	return color.hsl.saturation === 0
}

/**
 * Sort an array of color objects
 *
 * @param colors An array of {value: #f00;}-like objects
 * @returns array A new sorted array
 */
module.exports = colors => {
	// add an `hsl` prop to our array to use for sorting
	const mapped = colors.map(color => {
		const {h: hue, s: saturation, l: lightness, a: alpha} = tinycolor(
			color.value
		).toHsl()

		return {
			...color,
			hsl: {hue, saturation, lightness, alpha}
		}
	})

	return (
		mapped
			// sort by hue
			.sort(sortByHue)
			// remove the grey colors
			.filter(color => !isGrey(color))
			// and append the grey colors to the back
			// and sort the greys by lightness
			.concat(mapped.filter(color => isGrey(color)).sort(sortByAlpha))
			// and finally strip the `hsl` prop from our output array
			.map(color => {
				const {hsl, ...originalColor} = color
				return originalColor
			})
	)
}
