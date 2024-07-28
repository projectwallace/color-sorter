import { Bench } from "tinybench"
import { withCodSpeed } from "@codspeed/tinybench-plugin"
import { convert, sort } from './index.js'

let bench = withCodSpeed(new Bench())

bench.add('real world sort example #1', () => {
	sort([
		'#4b4747',
		'#d70c0b',
		'#f00',
		'#f22b24',
		'#ff6930',
		'#eb6c1e',
		'#eb6d1e',
		'#f57917',
		'#ff8a0a',
		'#f7a336',
		'#feb95a',
		'#eca920',
		'#f1c15d',
		'#f1c260',
		'#ff0',
		'#c8d05b',
		'#ccd557',
		'#d2ff52',
		'#10ac47',
		'#04a03b',
		'#03fff3',
		'#25bbc3',
		'#38d7df',
		'#15b8ec',
		'#00adea',
		'#8e34c9',
		'#9a3dd1',
		'#cd66f6',
		'#fff',
		'rgba(255,255,255,0.2)',
		'rgba(255,255,255,0.07)',
		'#f9f9f9',
		'#f4f4f4',
		'#f2f2f2',
		'#e4e4e4',
		'#ddd',
		'#c0c0c0',
		'#666',
		'#4a4a4a',
		'#1d1d1d',
		'#0d0d0d',
		'#000',
		'rgba(0,0,0,0.8)',
		'rgba(0,0,0,0.6)',
		'rgba(0,0,0,0.4)',
		'rgba(0,0,0,0.1)',
		'rgba(0,0,0,0.05)'
	])
})

bench.add('real world sort example #2 (nerdy.dev)', () => {
	sort([
		"rgb(66, 99, 235)",
		"rgb(174, 62, 201)",
		"rgb(3, 5, 7)",
		"rgb(73, 80, 87)",
		"rgb(248, 249, 250)",
		"rgb(233, 236, 239)",
		"rgb(222, 226, 230)",
		"rgb(206, 212, 218)",
		"rgb(250, 82, 82)",
		"rgb(255, 168, 168)",
		"rgb(134, 142, 150)",
		"rgb(145, 167, 255)",
		"rgb(229, 153, 247)",
		"rgb(241, 243, 245)",
		"rgb(33, 37, 41)",
		"rgb(52, 58, 64)",
		"rgb(186, 200, 255)",
		"rgb(238, 190, 250)",
		"rgb(201, 42, 42)",
		"rgb(255, 201, 201)",
		"rgb(43, 138, 62)",
		"rgb(211, 249, 216)",
		"rgb(51, 154, 240)",
		"rgb(22, 25, 29)",
		"rgb(173, 181, 189)",
		"rgb(13, 15, 18)",
		"rgb(190, 75, 219)",
		"rgb(130, 201, 30)",
		"rgb(253, 126, 20)",
		"rgb(255, 224, 102)",
		"rgb(102, 217, 232)",
		"rgb(237, 242, 255)",
		"rgb(59, 91, 219)",
		"rgb(219, 228, 255)",
		"transparent",
		"color(display-p3 0.1 0.4 1)",
		"color(display-p3 0.6 0.2 1)",
		"rgb(255, 255, 255)",
		"rgb(23, 26, 28)",
		"rgba(0, 0, 0, 0.067)",
		"rgba(255, 255, 255, 0.067)",
		"rgba(0, 0, 0, 0.467)",
		"currentcolor",
		"rgb(102, 51, 153)",
		"cyan",
		"rgb(255, 20, 147)",
		"rgb(148, 97, 253)",
		"rgb(45, 217, 254)",
		"color(display-p3 1 0 0)",
		"color(display-p3 0 0.75 1)",
		"color(display-p3 1 0 1)",
		"color(display-p3 0.5 0 1)",
		"color(display-p3 0.5 0.35 1)",
		"color(display-p3 0 0 1)",
		"color(display-p3 0 1 0)",
		"color(display-p3 1 0.5 0)",
		"color(display-p3 1 1 0)",
		"rgba(0, 0, 0, 0)",
		"rgb(137, 41, 255)",
		"rgb(230, 98, 230)",
		"color(display-p3 0.001 0.015 0.03)"
	])
})

bench.add('convert hex', () => convert('#f00'))
bench.add('convert rgba()', () => convert('rgba(255,0,0,0.5)'))
bench.add('convert rgba() (modern syntax)', () => convert('rgba(255 0 0 / 0.5)'))
bench.add('convert rgb()', () => convert('rgb(255,0,0)'))
bench.add('convert rgb() (modern syntax)', () => convert('rgb(255 0 0)'))
bench.add('convert hsl()', () => convert('hsl(0,100%,50%)'))
bench.add('convert hsl() (modern syntax)', () => convert('hsl(0 100% 50%)'))
bench.add('convert hsla()', () => convert('hsla(0,100%,50%,0.5)'))
bench.add('convert hsla() (modern syntax)', () => convert('hsla(0 100% 50% / 0.5)'))
bench.add('convert named color', () => convert('red'))
bench.add('convert transparent', () => convert('transparent'))
bench.add('convert invalid color', () => convert('invalid'))
bench.add('convert oklch()', () => convert('oklch(25% .148 81.72)'))
bench.add('convert system color', () => convert('Highlight'))

await bench.warmup()
await bench.run()

console.table(bench.table())
