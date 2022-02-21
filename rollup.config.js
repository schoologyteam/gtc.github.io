const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'js/gta.js',
	output: {
		name: 'GTASMR',
		file: 'gtasmr.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: false,
		globals: { THREE: 'THREE' }
	}
};