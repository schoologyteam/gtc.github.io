// high level game happenings
var ghooks;
(function (ghooks) {
    function start() {
        console.log(' ghooks start ');
    }
    ghooks.start = start;
    function SectorOnCreate(sector) {
    }
    ghooks.SectorOnCreate = SectorOnCreate;
    function SectorOnTick(sector) {
    }
    ghooks.SectorOnTick = SectorOnTick;
})(ghooks || (ghooks = {}));
export default ghooks;
