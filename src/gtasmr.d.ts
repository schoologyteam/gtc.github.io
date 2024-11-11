declare type vec4 = [number, number, number, number];
declare type vec3 = [number, number, number];
declare type vec2 = [number, number];

declare var THREE: any

// Use type direct for direct instantiations
// The type system will known what to do

type typez = 'direct' | 'dud' | 'floor' | 'block' | 'ped' | 'ply'

interface objprops {
	_type: typez
	_wpos: vec3,
	_r?: number,
	name?: string,
	extra?: any
}

declare class baseobj {z; constructor(props: propz)}

type propz = objprops
type propzs = objprops[]

declare class staging_area {}

type staging = staging_area