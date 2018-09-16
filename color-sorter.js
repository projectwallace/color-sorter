const tinycolor = require('tinycolor2')

function normalizeColor(color) {
	const {h: hue, s: saturation, l: lightness, a: alpha} = tinycolor(
		color
	).toHsl()

	return {hue, saturation, lightness, alpha}
}

const sortFn = (a, b) => {
	const colorA = normalizeColor(a)
	const colorB = normalizeColor(b)

	// Move grey-ish colors to the back of the list
	if (
		(colorA.saturation === 0 || colorB.saturation === 0) &&
		colorA.saturation !== colorB.saturation
	) {
		return 1
	}

	if (colorA.saturation !== colorB.saturation) {
		return colorA.saturation - colorB.saturation
	}

	if (colorA.hue !== colorB.hue) {
		return colorA.hue - colorB.hue
	}

	if (colorA.lightness !== colorB.lightness) {
		return colorB.lightness - colorA.lightness
	}

	if (colorA.alpha !== colorB.alpha) {
		return colorB.alpha - colorA.alpha
	}

	if (a.length !== b.length) {
		return a.length - b.length
	}

	return a.localeCompare(b)
}

module.exports = colors => colors.sort(sortFn)
module.exports.sortFn = sortFn
module.exports.normalizeColor = normalizeColor
