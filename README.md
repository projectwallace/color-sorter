# color-sorter

Sort CSS colors by hue, then by saturation. Black-grey-white colors (colors with 0% saturation) are shifted to the end.

This sorting algorithm is very opinionated and might not fit *your* needs!

## Usage

```js
const sortColors = require('color-sorter');

const colors = [
  '#000',
  'red',
  'hsl(0, 10%, 60%)'
];

const sorted = sortColors(colors);

// => sorted:
// [
//  'red',
//  'hsl(0, 10%, 60%)',
//  '#000'
// ]
```

## Examples

These examples can be seen on [Project Wallace](https://projectwallace.com) where this package is used for sorting the colors.

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