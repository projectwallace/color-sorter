# color-sorter [![Build Status](https://travis-ci.org/bartveneman/color-sorter.svg?branch=master)](https://travis-ci.org/bartveneman/color-sorter) [![Known Vulnerabilities](https://snyk.io/test/github/bartveneman/color-sorter/badge.svg)](https://snyk.io/test/github/bartveneman/color-sorter) ![Dependencies Status](https://img.shields.io/david/bartveneman/color-sorter.svg) ![Dependencies Status](https://img.shields.io/david/dev/bartveneman/color-sorter.svg) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Sort CSS colors by hue, then by saturation. Black-grey-white colors (colors with
0% saturation) are shifted to the end. Fully transparent colors are placed at
the _very_ end.

This sorting algorithm is very opinionated and might not fit _your_ needs!

## Usage

```js
var colorSort = require('color-sorter')
var colors = ['#000', 'red', 'hsl(0, 10%, 60%)']
var sorted = colors.sort(colorSort)

// => sorted:
// [
//  'red',
//  'hsl(0, 10%, 60%)',
//  '#000'
// ]
```

## Examples

These examples can be seen on [Project Wallace](https://projectwallace.com)
where this package is used for sorting the colors.

### CSS-Tricks

![CSS Tricks color sort example](/examples/css-tricks.png)

### Smashing Magazine

![Smashing Magazine color sort example](/examples/smashing-magazine.png)

### Bootstrap

![Bootstrap color sort example](/examples/bootstrap.png)

### Zurb Foundation

![Zurb Foundation color sort example](/examples/foundation.png)

### Project Wallace

![Project Wallace color sort example](/examples/project-wallace.png)

## Related projects

- [CSS Analyzer](https://github.com/projectwallace/css-analyzer) - Generate
  analysis for a string of CSS
- [Wallace](https://github.com/bartveneman/wallace-cli) - CLI tool for
  @projectwallace/css-analyzer
- [Gromit](https://github.com/bartveneman/gromit-cli) - A test framework to
  assert that CSS doesn't exceeds certain thresholds

## License

MIT © Bart Veneman
