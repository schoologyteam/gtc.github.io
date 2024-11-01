declare type vec4 = [number, number, number, number];
declare type vec3 = [number, number, number];
declare type vec2 = [number, number];

declare var THREE: any

// use type direct for direct instantiations
// the type system will known what to do

type typez = 'direct' | 'dud' | 'floor' | 'block' | 'ped' | 'ply'

interface objprops {
	_type: typez
	_wpos: vec3,
	_r?: number,
	name?: string,
	extra?: any
}

declare class baseobj {z; constructor(objprops)}

type bobj = baseobj
type propz = objprops