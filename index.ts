import { parse, to as convertColor, ColorSpace, sRGB, P3, LCH, HSL, OKLCH } from 'colorjs.io/fn'

// Register color spaces for parsing and converting
ColorSpace.register(sRGB) // Parses keywords and hex colors
ColorSpace.register(P3)
ColorSpace.register(HSL)
ColorSpace.register(LCH)
ColorSpace.register(OKLCH)

export type NormalizedColor = {
	hue: number
	saturation: number
	lightness: number
	alpha: number
}

export type NormalizedColorWithAuthored = NormalizedColor & {
	authored: string
}

function numerify(value: unknown): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value
	}
	return 0
}

/**
 * Convert a CSS (string) color into a normalized object that can be used for comparison
 * @example convert('red')
 */
export function convert(authored: string): NormalizedColorWithAuthored {
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
			authored,
		}
	} catch {
		return {
			hue: 0,
			saturation: 0,
			lightness: 0,
			alpha: 0,
			authored,
		}
	}
}

export function compare(a: NormalizedColorWithAuthored, b: NormalizedColorWithAuthored): number {
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
 * @example ['red', 'yellow'].sort(sortFn)
 */
export function sortFn(a: string, b: string): number {
	let colorA = convert(a)
	let colorB = convert(b)

	return compare(colorA, colorB)
}

/**
 * Sort the `colors` array using `Array.sort()`, so beware that it changes the source input
 * @example sort(['red', 'yellow'])
 */
export function sort(colors: string[]): string[] {
	return colors.sort(sortFn)
}
