import lod, { numbers } from "./lod.js";
import pts from "./dep/pts.js";
import renderer from "./renderer.js";
import baseobj from "./objs/baseobj.js";

export namespace sprite {
	export type parameters = sprite['sprops'];
};

interface local_rules {
	bind: baseobj,
	z?: number
	sty: string,
	color?: string,
	transparent?: boolean,
	offset?: vec2,
	repeat?: vec2,
	center?: vec2,
	flip?: boolean,
	make_shadow_sprite?: boolean,
	shadow_opacity?: number,
	shadow_length?: vec2,
	mask?: string,
	blur?: string,
};

const default_shadow_opacity = 0.7;
const default_shadow_length = [4, -4] as vec2;

export class sprite {
	bind: baseobj
	rposoffset = [0, 0] as vec2
	mesh
	material
	geometry
	rotation
	matrix
	shadow?: shadow
	constructor(
		public readonly sprops: local_rules
	) {
		(this.sprops.bind as any).sprite = this;
		this.bind = this.sprops.bind;
		this.sprops = {
			offset: [0, 0],
			repeat: [1, 1],
			center: [0, 1],
			shadow_opacity: default_shadow_opacity,
			shadow_length: default_shadow_length,
			z: 0,
			...sprops,
		} as local_rules;
		this.rotation = 0;
		this.matrix = new THREE.Matrix3;
	}
	douv() {
		// todo
		this.matrix.setUvTransform(
			this.sprops.offset![0],
			this.sprops.offset![1],
			this.sprops.repeat![0],
			this.sprops.repeat![1],
			this.rotation,
			this.sprops.center![0],
			this.sprops.center![1]);
		// this is built-in
		// this.material.map.matrix.copy(this.matrix);
		// this.material.map.matrixAutoUpdate = false;
	}
	step() {
		if (!this.mesh)
			return;
		this.douv();
		let pos = pts.add(this.bind.rpos, this.rposoffset);
		this.mesh.rotation.z = this.bind.r;
		this.mesh.scale.x = this.sprops.flip ? -1 : 1;
		this.mesh.position.fromArray([...pos, this.bind.z + this.sprops.z!]);
		this.mesh.updateMatrix();
		this.shadow?.step();
	}
	dispose() {
		this.geometry?.dispose();
		this.material?.dispose();
		this.mesh.parent?.remove(this.mesh);
		this.shadow?.end();
	}
	create() {
		let pt = pts.copy(this.bind.size);
		pts.mult(pt, lod.size);
		this.geometry = new THREE.PlaneGeometry(pt[0], pt[1]);
		this.material = MySpriteMaterial({
			map: renderer.load_texture(this.sprops.sty),
			color: this.sprops.color || 'white',
			transparent: !! this.sprops.transparent,
			shininess: 0
		}, {
			matrix: this.matrix,
			blurMap: (this.sprops.blur ? renderer.load_texture(this.sprops.blur) : null),
			maskMap: (this.sprops.mask ? renderer.load_texture(this.sprops.mask) : null)
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = false;
		this.mesh.matrixAutoUpdate = false;
		this.step();
		renderer.scene.add(this.mesh);
		if (this.sprops.make_shadow_sprite)
			this.shadow = new shadow(this);
	}
};

export class shadow {
	mesh
	material
	readonly sprops: local_rules
	constructor(
		public readonly sprite: sprite
	) {
		const { sprops } = sprite;
		this.sprops = sprops;
		this.material = MySpriteMaterial({
			map: renderer.load_texture(this.sprops.sty),
			color: 'black',
			transparent: true,
			opacity: sprops.shadow_opacity,
		}, {
			matrix: this.sprite.matrix,
			// blurMap: (this.sprops.blur ? renderer.load_texture(this.sprops.blur) : null),
		});
		this.mesh = new THREE.Mesh(this.sprite.geometry, this.material);
		this.mesh.frustumCulled = false;
		this.mesh.matrixAutoUpdate = false;
		this.step();
		renderer.scene.add(this.mesh);
	}
	end() {
		this.material?.dispose();
		this.mesh.parent?.remove(this.mesh);
	}
	step() {
		let pos = pts.add(this.sprops.bind.rpos, this.sprite.rposoffset);
		pos = pts.add(pos, this.sprops.shadow_length!);
		this.mesh.rotation.z = this.sprops.bind.r;
		this.mesh?.position.fromArray([...pos, this.sprops.z! - 0.5]);
		this.mesh.updateMatrix();
	}
};

function MySpriteMaterial(parameters, uniforms: any) {
	let material = new THREE.MeshPhongMaterial(parameters);
	material.name = "MeshPhongSpriteMaterial";
	material.customProgramCacheKey = function () {
		let str = '';
		if (uniforms.blurMap)
			str += 'blurMap';
		if (uniforms.maskMap)
			str += 'maskMap';
		// console.log('cache key', str);
		return str;
	}
	material.onBeforeCompile = function (shader) {
		shader.defines = {};
		if (uniforms.blurMap) {
			shader.uniforms.blurMap = { value: uniforms.blurMap };
			shader.defines.HAS_BLUR = 1;
		}
		if (uniforms.maskMap) {
			shader.uniforms.maskMap = { value: uniforms.maskMap };
			shader.defines.HAS_MASK = 1;
		}
		shader.uniforms.spriteMatrix = { value: uniforms.matrix };

		shader.vertexShader = shader.vertexShader.replace(
			`#define PHONG`,
			`#define PHONG
			varying vec2 fUv;
			uniform mat3 spriteMatrix;
		`
		);
		shader.vertexShader = shader.vertexShader.replace(
			`#include <uv_vertex>`,
			`#include <uv_vertex>
			#ifdef USE_MAP
				fUv = ( spriteMatrix * vec3( MAP_UV, 1 ) ).xy;
			#endif
		`
		);
		shader.fragmentShader = shader.fragmentShader.replace(
			`#define PHONG`,
			`#define PHONG
			varying vec2 fUv;
			uniform sampler2D blurMap;
			uniform sampler2D maskMap;
		`
		);
		shader.fragmentShader = shader.fragmentShader.replace(
			`#include <map_fragment>`,
			`
			#ifdef USE_MAP
				vec4 texelColor = vec4(0);
				vec4 mapColor = texture2D( map, fUv );
				
				#ifdef HAS_BLUR
					vec4 blurColor = texture2D( blurMap, fUv );
					blurColor.rgb *= 0.0;
					blurColor.a /= 4.0;
					texelColor = blurColor;
				#endif

				texelColor += mapColor;

				#ifdef HAS_MASK
					vec4 maskColor = texture2D( maskMap, fUv );
					texelColor.rgb *= maskColor.r;
				#endif

				//texelColor = mapTexelToLinear( texelColor );
				
				diffuseColor *= texelColor;
				
			#endif
		`
		);
	}
	return material;
}

export default sprite;