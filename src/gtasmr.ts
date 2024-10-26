import city from "./city.js";
import lod from "./lod.js";
import ghooks from "./ghooks.js";
import objects from "./objects.js";
import renderer from "./renderer.js";
import view from "./view.js";
import player from "./objs/player.js";

export namespace gtasmr {

	export var gview: view;
	export var ply: player;

	export var NO_VAR = false;
	export var SOME_OTHER_SETTING = false;

	const MAX_WAIT = 1500;

	var started = false;

	export function sample(a) {
		return a[Math.floor(Math.random() * a.length)];
	}
	export function clamp(val, min, max) {
		return val > max ? max : val < min ? min : val;
	}
	export enum RESOURCES {
		RC_UNDEFINED = 0,
		POPULAR_ASSETS,
		CANT_FIND,
		READY,
		COUNT
	};
	let time;
	let resources_loaded = 0b0;
	export function resourced(word: string) {
		resources_loaded |= 0b1 << RESOURCES[word];
		try_start();
	}
	function try_start() {
		let count = 0;
		let i = 0;
		for (; i < RESOURCES.COUNT; i++)
			if (resources_loaded & 0b1 << i) count++;
		if (count == RESOURCES.COUNT)
			init();
	}
	export function reasonable_waiter() {
		if (time + MAX_WAIT < new Date().getTime()) {
			console.warn(`passed reasonable wait time for resources`);
			init();
		}
	}
	export function critical(mask: string) {
		// Couldn't load
		console.error('resource', mask);
	}
	export function init() {
		console.log(' gta init ');
		time = new Date().getTime();
		resourced('RC_UNDEFINED');
		resourced('POPULAR_ASSETS');
		resourced('READY');
		window['GTA'] = gtasmr;
	}
	export async function start() {
		if (started)
			return;
		console.log(' gtasmr start ');
		gview = view.make();
		ply = player.instance();
		gview.add(ply);
		city.load_sounds();
		city.creation();
		ghooks.start();
		if (window.location.href.indexOf("#novar") != -1)
			NO_VAR = false;
		started = true;
	}

	export function step(delta) {
		if (!started) {
			reasonable_waiter();
			return;
		}
		gview.tick();
		renderer.update();
		renderer.render();
	}

}

export default gtasmr;