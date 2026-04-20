# color-sorter

Sort CSS colors by hue, then by saturation. Black-grey-white colors (colors with
0% saturation) are shifted to the end. Fully transparent colors are placed at
the _very_ end.

This sorting algorithm is very opinionated and might not fit _your_ needs!

## Usage

```js
import { sort_fn, sort } from 'color-sorter'
var colors = ['#000', 'red', 'hsl(0, 10%, 60%)']
var sorted = colors.sort(sort_fn)
// Or:
// sorted = sort(colors)

// => sorted:
// [
//  'red',
//  'hsl(0, 10%, 60%)',
//  '#000'
// ]
```

[Example usage on Stackblitz](https://stackblitz.com/edit/color-sorter-example-esm?file=index.js&view=editor)

## API

### `convert`

Convert any CSS color to a color that we can use for comparison. Returns black in case parsing fails.

```ts
import { convert } from 'color-sorter'
const color = convert('#f00')
// => { hue: 0, saturation: 100, lightness: 50, alpha: 1, authored: '#f00' }
```

### `compare`

Compare two converted colors to know where they must go while sorting.

```ts
import { convert, compare } from 'color-sorter'
const red = convert('rgb(255 0 0)')
const green = convert('#0f0')
const result = compare(red, green)
// => result < 0, making sure red ends up before green
```

### `color_group`

Get the named group of a given color. Useful for making groups of colors.

```ts
import { color_group, convert } from 'color-sorter'
const color = convert('rgb(255 0 0)')
const group = color_group(color) // => 'red'
```

### `sort_fn`

Callback sorting function that can be passed to a `.sort()` or `toSorted()`. Uses `compare` internally.

```ts
import { sort_fn } from 'color-sorter'
const sorted = ['rebeccapurple', '#f00'].toSorted(sort_fn)
//=> ['#f00', 'rebeccapurple']
```

## Related projects

- [CSS Analyzer](https://github.com/projectwallace/css-analyzer) - Generate
  analysis for a string of CSS
- [Wallace CLI](https://github.com/projectwallace/wallace-cli) - CLI tool for
  @projectwallace/css-analyzer
- [CSS Design Tokens](https://github.com/projectwallace/css-design-tokens) - Create Design Tokens by going through CSS to find colors, font-sizes, gradients etcetera and turn them into a Design Tokens spec-compliant token format.

## License

MIT © Bart Veneman
