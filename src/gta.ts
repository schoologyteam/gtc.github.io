import City from "./city";
import Core from "./core";
import Hooks from "./hooks";
import Objects from "./objects";
import View from "./view";


export namespace GTA {

	export var view: View;
	export var ply: Objects.Ply;

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
			start();
	}
	export function reasonable_waiter() {
		if (time + MAX_WAIT < new Date().getTime()) {
			console.warn(`passed reasonable wait time for resources`);
			start();
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
		window['GTA'] = GTA;
	}
	function start() {
		if (started)
			return;
		console.log(' gtasmr starting ');
		view = View.make();
		ply = Objects.Ply.instance();
		view.add(ply);
		City.load_sounds();
		City.creation();
		Hooks.start();
		if (window.location.href.indexOf("#novar") != -1)
			NO_VAR = false;
		started = true;
	}

	export function tick() {
		if (!started) {
			reasonable_waiter();
			return;
		}
		view.tick();
		//Board.update();
		//Ploppables.update();
	}

}

export default GTA;