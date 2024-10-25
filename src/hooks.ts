import Core from "./core.js";
import View from "./view.js";
import Objects from "./objects.js";

// high level game happenings

namespace Hooks {
	export function start() {
		console.log(' hooks start ');
		
		Core.Sector.hooks = {
			onCreate: SectorOnCreate,
			onTick: SectorOnTick
		};
		
	}
	export function SectorOnCreate(sector: Core.Sector) {
		
	}
	export function SectorOnTick(sector: Core.Sector) {
		
	}
}

export default Hooks;