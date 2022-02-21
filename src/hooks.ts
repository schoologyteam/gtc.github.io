import Core from "./core";
import View from "./view";
import Objects from "./objects";

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