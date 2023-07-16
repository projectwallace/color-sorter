# color-sorter

![Color sorter](https://repository-images.githubusercontent.com/142018423/f0333800-be49-11ea-8033-0e3df5daf1ab)

Sort CSS colors by hue, then by saturation. Black-grey-white colors (colors with
0% saturation) are shifted to the end. Fully transparent colors are placed at
the _very_ end.

This sorting algorithm is very opinionated and might not fit _your_ needs!

## Usage

```js
import { sortFn, sort } from "color-sorter";
var colors = ["#000", "red", "hsl(0, 10%, 60%)"];
var sorted = colors.sort(sortFn);
// Or:
// sorted = sort(colors)

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
- [Wallace](https://github.com/projectwallace/wallace-cli) - CLI tool for
  @projectwallace/css-analyzer
- [Constyble](https://github.com/projectwallace/constyble) - A CSS complexity linter, based on css-analyzer. Don't let your CSS grow beyond the thresholds that you provide.

## License

MIT © Bart Veneman
