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

	if (colorA.saturation === 0 && colorB.saturation !== 0) {
		return 1
	}

	if (colorA.saturation === 0) {
		if (colorA.alpha === colorB.alpha) {
			if (colorA.lightness === colorB.lightness) {
				if (a.length === b.length) {
					return a.localeCompare(b)
				}

				return a.length - b.length
			}

			return colorB.lightness - colorA.lightness
		}

		return colorB.alpha - colorA.alpha
	}

	return colorA.hue - colorB.hue
}

module.exports = colors => colors.sort(sortFn)
module.exports.sortFn = sortFn
module.exports.normalizeColor = normalizeColor
