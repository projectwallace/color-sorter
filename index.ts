import { colordx, extend } from '@colordx/core'
import lab from '@colordx/core/plugins/lab'
import lch from '@colordx/core/plugins/lch'
import hwb from '@colordx/core/plugins/hwb'
import hsv from '@colordx/core/plugins/hsv'
import p3 from '@colordx/core/plugins/p3'
import rec2020 from '@colordx/core/plugins/rec2020'
import a98rgb from '@colordx/core/plugins/a98rgb'
import prophoto from '@colordx/core/plugins/prophoto'
import names from '@colordx/core/plugins/names'

// Register color spaces for parsing and converting.
// Not registered: `color(srgb ...)` / `color(srgb-linear ...)` function
// syntax, which @colordx/core doesn't support yet (colordx.dev roadmap).
extend([lab, lch, hwb, hsv, p3, rec2020, a98rgb, prophoto, names])

export type NormalizedColor = {
	hue: number
	saturation: number
	lightness: number
	alpha: number
}

export type NormalizedColorWithAuthored = NormalizedColor & {
	authored: string
}

function numerify(value: number | null | undefined): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value
	}
	return 0
}

/**
 * Convert a CSS (string) color into a normalized HSL color that can be used for comparison
 * @example convert('red')
 */
export function convert(authored: string): NormalizedColorWithAuthored {
	let color = colordx(authored)

	if (!color.isValid()) {
		return {
			hue: 0,
			saturation: 0,
			lightness: 0,
			alpha: 1,
			authored,
		}
	}

	let hsl = color.toHsl(15)

	return {
		hue: numerify(hsl.h),
		saturation: numerify(hsl.s),
		lightness: numerify(hsl.l),
		alpha: numerify(hsl.alpha),
		authored,
	}
}

const RED = 0
const ORANGE = 1
const BROWN = 2
const YELLOW = 3
const GREEN = 4
const CYAN = 5
const BLUE = 6
const VIOLET = 7
const MAGENTA = 8
const PINK = 9
const GRAY = 10

const COLOR_GROUPS = [
	RED,
	ORANGE,
	BROWN,
	YELLOW,
	GREEN,
	CYAN,
	BLUE,
	VIOLET,
	MAGENTA,
	PINK,
	GRAY,
] as const
type ColorGroup = (typeof COLOR_GROUPS)[number]

export const COLOR_GROUP_NAMES = [
	'red',
	'orange',
	'brown',
	'yellow',
	'green',
	'cyan',
	'blue',
	'violet',
	'magenta',
	'pink',
	'gray',
] as const

export type ColorGroupName = (typeof COLOR_GROUP_NAMES)[number]

/**
 * Get the color's group name, like "red", "green" or "gray"
 *
 * NB: heavily relies on magic numbers. All done by eye so will probably need tweaking from time to time.
 */
function _color_group(color: NormalizedColor): ColorGroup {
	let { hue, saturation, lightness } = color
	if (saturation < 10) {
		return GRAY
	}

	if (hue < 15 || hue >= 345) {
		return RED
	}
	if (hue < 47) {
		if (lightness > 37 && saturation > 0.5) {
			return ORANGE
		}

		if (saturation < 25 && lightness < 15) {
			return GRAY
		}
		return BROWN
	}
	if (hue < 65) {
		if (saturation < 25 && lightness < 15) {
			return GRAY
		}
		if (saturation < 70 && lightness < 80) {
			return BROWN
		}
		if (lightness < 30) {
			return GREEN
		}
		return YELLOW
	}
	if (hue < 164) {
		return GREEN
	}
	if (hue < 194) {
		if (saturation < 20) {
			return GRAY
		}
		return CYAN
	}
	if (hue < 241) {
		if (saturation < 19) {
			return GRAY
		}
		if (saturation > 55 && lightness > 59 && hue > 234) {
			return VIOLET
		}
		return BLUE
	}
	if (hue < 271) {
		return VIOLET
	}
	if (hue < 327) {
		return MAGENTA
	}
	return PINK
}

/**
 * Get the group name of a color
 * @example
 * ```ts
 * const color = convert('rgb(255 0 0)')
 * const group = color_group(color) // => 'red'
 * ```
 */
export function color_group(color: NormalizedColor): ColorGroupName {
	return COLOR_GROUP_NAMES[_color_group(color)]
}

// Allow bigger sub-groups for these colors
const hue_gaps: Partial<Record<ColorGroup, number>> = {
	[BLUE]: 48,
	[GREEN]: 36,
	// Red and gray are sorted by lightness, regardless of hue
	[RED]: 0,
	[GRAY]: 0,
}
const default_hue_gap = 24

const collator = new Intl.Collator('en-US', {
	caseFirst: 'upper',
	sensitivity: 'base',
})

function sort_group_fn(
	a: NormalizedColorWithAuthored,
	b: NormalizedColorWithAuthored,
	group: ColorGroup,
) {
	const hue_gap = hue_gaps[group] ?? default_hue_gap

	// Colors that are very similar in hue get sorted by lightness
	if (Math.abs(a.hue - b.hue) < hue_gap) {
		const diff = b.lightness - a.lightness
		if (diff !== 0) {
			return diff
		}
	} else if (a.lightness !== b.lightness) {
		return b.lightness - a.lightness
	}

	// Sort by transparency, least transparent first
	if (a.alpha !== b.alpha) {
		return b.alpha - a.alpha
	}
	return collator.compare(a.authored, b.authored)
}

/**
 * Compare two colors to determine which one is sorted first.
 */
export function compare(a: NormalizedColorWithAuthored, b: NormalizedColorWithAuthored): number {
	let group_a = _color_group(a)
	let group_b = _color_group(b)

	if (group_a === group_b) {
		return sort_group_fn(a, b, group_a)
	}

	return group_a - group_b
}

/**
 * Function that sorts colors
 * @example ['red', 'yellow'].sort(sort_fn)
 */
export function sort_fn(a: string, b: string): number {
	let color_a = convert(a)
	let color_b = convert(b)

	return compare(color_a, color_b)
}
