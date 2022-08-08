import Color from 'colorjs.io'

const convert = color => {
	const {coords, alpha} = new Color(color).to('oklch')

	return {
		// Specifies the perceived lightness, and is a <percentage> between 0% representing
		// black and 100% representing white
		lightness: coords[0],
		// Chroma (roughly representing the "amount of color"). Its minimum useful value is 0,
		// while its maximum is theoretically unbounded (but in practice does not exceed 0.4).
		chroma: coords[1],
		// Hue angle. 0deg points along the positive "a" axis (toward purplish red), 90deg
		// points along the positive "b" axis (toward mustard yellow), 180deg points along
		// the negative "a" axis (toward greenish cyan), and 270deg points along the
		// negative "b" axis (toward sky blue).
		hue: coords[2],
		alpha: alpha
	}
}

export const sortFn = (a, b) => {
	const colorA = convert(a)
	const colorB = convert(b)

	// Move grey-ish values to the back
	if (
		(colorA.chroma === 0 || colorB.chroma === 0) &&
		colorA.chroma !== colorB.chroma
	) {
		return colorB.chroma - colorA.chroma
	}

	// Sort by hue (lowest first)
	if (colorA.hue !== colorB.hue) {
		return colorA.hue - colorB.hue
	}

	// Sort by chroma (highest first)
	if (colorA.chroma !== colorB.chroma) {
		return colorA.chroma - colorB.chroma
	}

	// Comparing gray values, light before dark
	if (colorA.chroma === 0 && colorB.chroma === 0) {
		if (colorA.lightness !== colorB.lightness) {
			return colorB.lightness - colorA.lightness
		}
	}

	// Sort by transparency, least transparent first
	if (colorA.alpha === colorB.alpha) {
		return a.toLowerCase().localeCompare(b.toLowerCase())
	}

	return colorB.alpha - colorA.alpha
}

export const colorSorter = colors => colors.sort(sortFn)
