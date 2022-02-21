import Core from "./core";
// high level game happenings
var Hooks;
(function (Hooks) {
    function start() {
        console.log(' hooks start ');
        Core.Sector.hooks = {
            onCreate: SectorOnCreate,
            onTick: SectorOnTick
        };
    }
    Hooks.start = start;
    function SectorOnCreate(sector) {
    }
    Hooks.SectorOnCreate = SectorOnCreate;
    function SectorOnTick(sector) {
    }
    Hooks.SectorOnTick = SectorOnTick;
})(Hooks || (Hooks = {}));
export default Hooks;
