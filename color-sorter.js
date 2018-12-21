const tinycolor = require('tinycolor2')

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

const sortFn = (a, b) => {
	const aa = convert(a)
	const bb = convert(b)

	// Move fully transparent colors to the back and
	// sort by A-Z if both colors are fully transparent
	if (aa.alpha === 0 || bb.alpha === 0) {
		if (aa.alpha === bb.alpha) {
			return aa.authored.toLowerCase().localeCompare(bb.authored.toLowerCase())
		}

		return bb.alpha - aa.alpha
	}

	// Move grey-ish values to the back
	if (
		(aa.saturation === 0 || bb.saturation === 0) &&
		aa.saturation !== bb.saturation
	) {
		return bb.saturation - aa.saturation
	}

	// Sort by hue (lowest first)
	if (aa.hue !== bb.hue) {
		return aa.hue - bb.hue
	}

	// Sort by saturation (highest first)
	if (aa.saturation !== bb.saturation) {
		return aa.saturation - bb.saturation
	}

	// Comparing grey values, light before dark
	if (aa.saturation === 0 && bb.saturation === 0) {
		if (aa.lightness !== bb.lightness) {
			return bb.lightness - aa.lightness
		}
	}

	// Sort by transparency, least transparent first
	if (aa.alpha !== bb.alpha) {
		return bb.alpha - aa.alpha
	}
}

module.exports = colors => colors.sort(sortFn)
module.exports.convert = convert
module.exports.sortFn = sortFn
