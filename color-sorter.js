const {colord, extend} = require('colord')
const namesPlugin = require('colord/plugins/names')

extend([namesPlugin])

const convert = color => {
	const {h: hue, s: saturation, l: lightness, a: alpha} = colord(
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

const sortFn = (a, b) => {
	const colorA = convert(a)
	const colorB = convert(b)

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

module.exports = colors => colors.sort(sortFn)
module.exports.convert = convert
module.exports.sortFn = sortFn
