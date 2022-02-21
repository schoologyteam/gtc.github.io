import { Mesh, PlaneBufferGeometry, MeshPhongMaterial, Matrix3, Vector2 } from "three";
import Core, { Counts } from "./core";
import Renderer from "./renderer";
export var Game;
(function (Game) {
    ;
    ;
    class Sprite extends Core.Shape {
        constructor(properties) {
            super(properties, Counts.Sprites);
            this.properties = properties;
            this.offset = new Vector2(0, 0);
            this.repeat = new Vector2(1, 1);
            this.center = new Vector2(0, 1);
            this.rotation = 0;
            this.spriteMatrix = new Matrix3;
        }
        update() {
            var _a, _b;
            if (!this.mesh)
                return;
            this.offset.fromArray(this.properties.offset || [0, 0]);
            this.repeat.fromArray(this.properties.repeat || [1, 1]);
            this.spriteMatrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
            this.mesh.rotation.z = this.properties.bind.rz;
            (_a = this.mesh) === null || _a === void 0 ? void 0 : _a.position.fromArray([...this.properties.bind.rpos, this.properties.z || 0]);
            (_b = this.mesh) === null || _b === void 0 ? void 0 : _b.updateMatrix();
        }
        dispose() {
            var _a, _b, _c;
            if (!this.mesh)
                return;
            (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this.material) === null || _b === void 0 ? void 0 : _b.dispose();
            (_c = this.mesh.parent) === null || _c === void 0 ? void 0 : _c.remove(this.mesh);
        }
        create() {
            let w = this.properties.bind.size[0];
            let h = this.properties.bind.size[1];
            this.geometry = new PlaneBufferGeometry(w, h);
            this.material = MySpriteMaterial({
                map: Renderer.load_texture(`sty/${this.properties.sty}`),
                transparent: true,
                shininess: 0
            }, {
                spriteMatrix: this.spriteMatrix,
                blurMap: (this.properties.blur ? Renderer.load_texture(`sty/${this.properties.blur}`) : null),
                maskMap: (this.properties.mask ? Renderer.load_texture(`sty/${this.properties.mask}`) : null)
            });
            this.mesh = new Mesh(this.geometry, this.material);
            this.mesh.frustumCulled = false;
            this.mesh.matrixAutoUpdate = false;
            this.update();
            //if (this.y.drawable.x.obj.sector)
            //	this.y.drawable.x.obj.sector.group.add(this.mesh);
            //else
            Renderer.scene.add(this.mesh);
        }
    }
    Game.Sprite = Sprite;
    ;
    function MySpriteMaterial(parameters, uniforms) {
        let material = new MeshPhongMaterial(parameters);
        material.name = "MeshPhongSpriteMat";
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
            shader.uniforms.spriteMatrix = { value: uniforms.spriteMatrix };
            shader.vertexShader = shader.vertexShader.replace(`#define PHONG`, `#define PHONG
				uniform mat3 spriteMatrix;
			`);
            shader.vertexShader = shader.vertexShader.replace(`#include <uv_vertex>`, `#include <uv_vertex>
				#ifdef USE_UV
				vUv = ( spriteMatrix * vec3( uv, 1 ) ).xy;
				#endif
			`);
            shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `#define PHONG
				uniform sampler2D blurMap;
				uniform sampler2D maskMap;
			`);
            shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
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
			`);
        };
        return material;
    }
    Game.MySpriteMaterial = MySpriteMaterial;
})(Game || (Game = {}));
export default Game;
