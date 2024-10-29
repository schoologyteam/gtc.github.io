import lod from "./lod.js";
import view from "./view.js";
import objects from "./objs/misc.js";

// high level game happenings

namespace ghooks {
	export function start() {
		console.log(' ghooks start ');
		
	}
	export function SectorOnCreate(sector: lod.chunk) {
		
	}
	export function SectorOnTick(sector: lod.chunk) {
		
	}
}

export default ghooks;