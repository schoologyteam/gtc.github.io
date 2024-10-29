import lod from "./lod.js";
import pts from "./dep/pts.js";
import renderer from "./renderer.js";
;
;
export class sprite {
    constructor(sprops) {
        this.sprops = sprops;
        this.rposoffset = [0, 0];
        this.sprops.bind.sprite = this;
        this.sprops.offset = this.sprops.offset || [0, 0];
        this.sprops.repeat = this.sprops.repeat || [1, 1];
        this.sprops.center = this.sprops.center || [0, 1];
        this.sprops.z = this.sprops.z || 0;
        this.rotation = 0;
        this.matrix = new THREE.Matrix3;
    }
    douv() {
        // todo
        this.matrix.setUvTransform(this.sprops.offset[0], this.sprops.offset[1], this.sprops.repeat[0], this.sprops.repeat[1], this.rotation, this.sprops.center[0], this.sprops.center[1]);
        // this is built-in
        // this.material.map.matrix.copy(this.matrix);
        // this.material.map.matrixAutoUpdate = false;
    }
    step() {
        if (!this.mesh)
            return;
        this.douv();
        let pos = pts.add(this.sprops.bind.rpos, this.rposoffset);
        this.mesh.rotation.z = this.sprops.bind.rz;
        this.mesh.position.fromArray([...pos, this.sprops.z]);
        this.mesh.updateMatrix();
    }
    dispose() {
        var _a, _b, _c;
        (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this.material) === null || _b === void 0 ? void 0 : _b.dispose();
        (_c = this.mesh.parent) === null || _c === void 0 ? void 0 : _c.remove(this.mesh);
    }
    create() {
        let pt = pts.clone(this.sprops.bind.size);
        pts.mult(pt, lod.size);
        this.geometry = new THREE.PlaneGeometry(pt[0], pt[1]);
        this.material = MySpriteMaterial({
            map: renderer.load_texture(this.sprops.sty),
            color: this.sprops.color || 'white',
            transparent: true,
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
    }
}
;
function MySpriteMaterial(parameters, uniforms) {
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
    };
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
        shader.vertexShader = shader.vertexShader.replace(`#define PHONG`, `#define PHONG
			varying vec2 fUv;
			uniform mat3 spriteMatrix;
		`);
        shader.vertexShader = shader.vertexShader.replace(`#include <uv_vertex>`, `#include <uv_vertex>
			#ifdef USE_MAP
				fUv = ( spriteMatrix * vec3( MAP_UV, 1 ) ).xy;
			#endif
		`);
        shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `#define PHONG
			varying vec2 fUv;
			uniform sampler2D blurMap;
			uniform sampler2D maskMap;
		`);
        shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
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
		`);
    };
    return material;
}
export default sprite;
