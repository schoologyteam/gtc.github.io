// why would we need to use the gta 24 style factory?

import objects from "./misc";

// reason number one, objects come in as data from the network
// reason number two, it is friendlier to use type names than import a large number of class files

// another thing to watch out for is that
// bobj construction parameters or propz are for initialization
// things like the wpos and rpos are part of lod.obj, not of baseobj or bobj 

export function bobjfactory(type: string, props: propz) {
    let obj;
    switch(type) {
        case 'floor':
            obj = new objects.floor(props);
    }
}