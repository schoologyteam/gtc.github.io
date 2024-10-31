declare type vec4 = [number, number, number, number];
declare type vec3 = [number, number, number];
declare type vec2 = [number, number];

declare var THREE: any

interface objprops {
	fakewpos: vec3,
	name: string
	r?: number
}

declare class baseobj {constructor(objprops)}

type bobj = baseobj
type propz = objprops