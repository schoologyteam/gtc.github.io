import glob from "./dep/glob.js";
import hooks from "./dep/hooks.js";
import points from "./dep/pts.js";
import gtasmr from "./gtasmr.js";
import renderer from "./renderer.js";

namespace app {

	export enum KEY {
		UNPRESSED, PRESSED, REPEAT_DELAY, REPEAT, RELEASED
	}

	export enum BUTTON {
		UP = - 1, OFF, DOWN, STILL
	}

	const keys: { [key: string]: number } = {}
	const buttons = {}

	var pos: vec2 = [0, 0]

	export var salt = 'x'
	export var wheel = 0

	export function onkeys(event) {
		const key = event.key.toLowerCase();
		if ('keydown' == event.type)
			keys[key] = keys[key]
				? KEY.REPEAT : KEY.PRESSED;
		else if ('keyup' == event.type)
			keys[key] = KEY.RELEASED;
		if (event.keyCode == 114)
			event.preventDefault();
	}

	export function mpos(): vec2 {
		return [...pos];
	}

	export function button(b: number) {
		return buttons[b] || BUTTON.OFF;
	}

	export function key(k: string) {
		return keys[k] || KEY.UNPRESSED;
	}

	export async function boot(version: string) {
		console.log(' app boot ');
		hooks.call('appBoot', null);
		glob.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		function onmousemove(e) {
			pos[0] = e.clientX;
			pos[1] = e.clientY;
		}
		function onmousedown(e) {
			buttons[e.button] = BUTTON.DOWN;
			if (e.button == 1)
				return false;
		}
		function onmouseup(e) {
			buttons[e.button] = BUTTON.UP;
		}
		function onwheel(e) {
			wheel = e.deltaY < 0 ? 1 : -1;
		}
		let touchStart: vec2 = [0, 0];
		function ontouchstart(e) {
			//message("ontouchstart");
			touchStart = [e.pageX, e.pageY];
			pos[0] = e.pageX;
			pos[1] = e.pageY;
			buttons[2] = BUTTON.UP;
		}
		function ontouchmove(e) {
			pos[0] = e.pageX;
			pos[1] = e.pageY;
			if (!buttons[0])
				buttons[0] = BUTTON.DOWN;
			e.preventDefault();
			return false;
		}
		function ontouchend(e) {
			const touchEnd: vec2 = [e.pageX, e.pageY];
			buttons[0] = BUTTON.UP;
			buttons[2] = BUTTON.UP;

			if (points.equals(touchEnd, touchStart) /*&& buttons[2] != MOUSE.STILL*/) {
				buttons[2] = BUTTON.DOWN;
			}/*
			else if (!pts.equals(touchEnd, touchStart)) {
				buttons[2] = MOUSE.UP;
			}
			//message("ontouchend");*/
			//return false;
		}
		function onerror(message) {
			document.querySelectorAll('salvage-stats')[0].innerHTML = message;
		}
		if (glob.mobile) {
			document.ontouchstart = ontouchstart;
			document.ontouchmove = ontouchmove;
			document.ontouchend = ontouchend;
		}
		else {
			document.onkeydown = document.onkeyup = onkeys;
			document.onmousemove = onmousemove;
			document.onmousedown = onmousedown;
			document.onmouseup = onmouseup;
			document.onwheel = onwheel;
		}
		window.onerror = onerror;
		renderer.init();
		gtasmr.init();
		await gtasmr.start();
		blockable = trick_animation_frame(base_loop);
	}

	function post_keys() {
		for (let i in keys) {
			if (keys[i] == KEY.PRESSED)
				keys[i] = KEY.REPEAT_DELAY;
			else if (keys[i] == KEY.RELEASED)
				keys[i] = KEY.UNPRESSED;
		}
	}

	function post_mouse_buttons() {
		for (let b of [0, 1, 2])
			if (buttons[b] == BUTTON.DOWN)
				buttons[b] = BUTTON.STILL;
			else if (buttons[b] == BUTTON.UP)
				buttons[b] = BUTTON.OFF;
	}

	export var delta = 0
	export var last = 0

	export async function base_loop() {
		//await new Promise(resolve => setTimeout(resolve, 16.6)); // 60 fps mode
		const now = (performance || Date).now();
		delta = (now - last) / 1000;
		last = now;
		await gtasmr.step(delta);
		wheel = 0;
		post_keys();
		post_mouse_buttons();
	}

	async function sleep() {
		return new Promise(requestAnimationFrame);
	}

	export var blockable

	export async function trick_animation_frame(callback) {
		console.log(' trick animation frame ');
		do {
			await sleep();
			await callback();
		} while (1);
	}

	export function set_html(selector, html) {
		let element = document.querySelectorAll(selector)[0];
		element.innerHTML = html;
	}

	export function set_style(selector, style, property) {
		let element = document.querySelectorAll(selector)[0];
		element.style[style] = property;
	}
}

window['app'] = app;

export default app;