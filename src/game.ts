import Core, { Counts } from "./core.js";
import pts from "./pts.js";
import Renderer from "./renderer.js";

export namespace Game {

	export namespace Sprite {
		export type Parameters = Sprite['properties'];
	};
	interface SpriteParameters {
		bind: Core.Obj,
		sty: string,
		mask?: string,
		blur?: string,
		offset?: vec2,
		repeat?: vec2,
		z?: number
	};

	export class Sprite extends Core.Shape {
		mesh
		material
		geometry
		offset
		repeat
		center
		rotation
		spriteMatrix
		constructor(
			public readonly properties: SpriteParameters
		) {
			super(properties, Counts.Sprites);
			this.offset = new THREE.Vector2(0, 0);
			this.repeat = new THREE.Vector2(1, 1);
			this.center = new THREE.Vector2(0, 1);
			this.rotation = 0;
			this.spriteMatrix = new THREE.Matrix3;
		}
		update() {
			if (!this.mesh)
				return;
			this.offset.fromArray(this.properties.offset || [0, 0]);
			this.repeat.fromArray(this.properties.repeat || [1, 1]);
			this.spriteMatrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
			this.mesh.rotation.z = this.properties.bind.rz;
			this.mesh?.position.fromArray([...this.properties.bind.rpos, this.properties.z || 0]);
			this.mesh?.updateMatrix();
		}
		dispose() {
			if (!this.mesh)
				return;
			this.geometry?.dispose();
			this.material?.dispose();
			this.mesh.parent?.remove(this.mesh);
		}
		create() {
			let w = this.properties.bind.size[0];
			let h = this.properties.bind.size[1];
			this.geometry = new THREE.PlaneGeometry(w, h);
			this.material = MySpriteMaterial({
				map: Renderer.load_texture(`sty/${this.properties.sty}`),
				transparent: true,
				shininess: 0
			}, {
				spriteMatrix: this.spriteMatrix,
				blurMap: (this.properties.blur ? Renderer.load_texture(`sty/${this.properties.blur}`) : null),
				maskMap: (this.properties.mask ? Renderer.load_texture(`sty/${this.properties.mask}`) : null)
			});
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.mesh.frustumCulled = false;
			this.mesh.matrixAutoUpdate = false;
			this.update();
			//if (this.y.drawable.x.obj.sector)
			//	this.y.drawable.x.obj.sector.group.add(this.mesh);
			//else
			Renderer.scene.add(this.mesh);
		}
	};

	export function MySpriteMaterial(parameters, uniforms: any) {
		let material = new THREE.MeshPhongMaterial(parameters);
		material.name = "MeshPhongSpriteMat";
		material.customProgramCacheKey = function() {
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
			shader.uniforms.spriteMatrix = { value: uniforms.spriteMatrix };

			shader.vertexShader = shader.vertexShader.replace(
				`#define PHONG`,
				`#define PHONG
				uniform mat3 spriteMatrix;
			`
			);
			shader.vertexShader = shader.vertexShader.replace(
				`#include <uv_vertex>`,
				`#include <uv_vertex>
				#ifdef USE_UV
				vUv = ( spriteMatrix * vec3( uv, 1 ) ).xy;
				#endif
			`
			);			
			shader.fragmentShader = shader.fragmentShader.replace(
				`#define PHONG`,
				`#define PHONG
				uniform sampler2D blurMap;
				uniform sampler2D maskMap;
			`
			);
			shader.fragmentShader = shader.fragmentShader.replace(
				`#include <map_fragment>`,
				`
				#ifdef USE_MAP
				vec4 texelColor = vec4(0);
				vec4 mapColor = texture2D( map, vUv );
				#ifdef HAS_BLUR
				vec4 blurColor = texture2D( blurMap, vUv );
				blurColor.rgb *= 0.0;
				blurColor.a /= 4.0;
				texelColor = blurColor;
				#endif
				texelColor += mapColor;
				#ifdef HAS_MASK
				vec4 maskColor = texture2D( maskMap, vUv );
				texelColor.rgb *= maskColor.r;
				#endif
				texelColor = mapTexelToLinear( texelColor );
				diffuseColor *= texelColor;
				#endif
			`
			);
		}
		return material;
	}
}

export default Game;