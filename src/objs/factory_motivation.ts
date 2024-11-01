
import objects from "./misc";

// why the gta kill style factory:

// reason number one, objects come in as data from the network
// reason number two, it is friendlier to use type names than import a large number of class files

export function objfactory(type: typez, props: propz) {
    let obj;
    switch (type) {
        case 'dud':
        case 'direct':
            console.warn(' dud or direct construction information passed to factory ');
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