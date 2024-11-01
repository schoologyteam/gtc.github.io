import objects from "./misc.js";
// why the gta kill style factory:
// reason number one, objects come in as data from the network
// reason number two, it is friendlier to use type names than import a large number of class files
export function objfactory(props) {
    let obj;
    switch (props._type) {
        case 'dud':
        case 'direct':
            console.warn(' unset type passed to factory ');
            break;
        case 'floor':
            obj = new objects.floor(props);
            break;
        case 'block':
            obj = new objects.floor(props);
            break;
    }
    return obj;
}
export default objfactory;
