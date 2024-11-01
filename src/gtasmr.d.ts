declare type vec4 = [number, number, number, number];
declare type vec3 = [number, number, number];
declare type vec2 = [number, number];

declare var THREE: any

// use the type dud or direct for direct instantiations
// the type system will known what to do

type typez = 'direct' | 'dud' | 'floor' | 'block' | 'ped' | 'ply'

interface objprops {
	type: typez
	_wpos: vec3,
	name?: string,
	r?: number
}

declare class baseobj {constructor(objprops)}

type bobj = baseobj
type propz = objprops