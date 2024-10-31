// For making vertical ~> horizontal

/*
class staging_area {

	min: [number, number, number]
	max: [number, number, number]

	datas: oprops[] = []

	constructor() {

	}

	addData(data: oprops) {
		this.datas.push(data);
	}

	addDatas(datas: oprops[]) {
		this.datas = this.datas.concat(datas);
	}

	deliverReplace() {
		//for (let data of this.datas)
		//	Datas.replaceDeliver(data);
	}

	deliverKeep() {
		//for (let data of this.datas)
		//	Datas.deliver(data);
	}

	private findExtents() {
		let set = false;

		for (let data of this.datas) {

			// aabb
			if (!set) {
				this.min = [data.x, data.y, data.z];
				this.max = [data.x, data.y, data.z];
				set = true;
			}

			this.min[0] = Math.min(data.x, this.min[0]);
			this.min[1] = Math.min(data.y, this.min[1]);
			this.min[2] = Math.min(data.z, this.min[2]);
			this.max[0] = Math.max(data.x, this.max[0]);
			this.max[1] = Math.max(data.y, this.max[1]);
			this.max[2] = Math.max(data.z, this.max[2]);
		}
	}

	ccw(n: 1 | 2 | 3 = 1) {
		
		this.findExtents();
		
		for (let data of this.datas) {
			let p = rotate(
				this.min[0], 
				this.min[1],
				data.x,
				data.y,
				n * 90);

			//console.log('rotate is', p[0], p[1]);
			
			data.r! += n;
			data.x = p[0];
			data.y = p[1] + (this.max[0] - this.min[0]);
		}
	}
}

function rotate(cx, cy, x, y, angle) {
	var radians = (Math.PI / 180) * angle,
		cos = Math.cos(radians),
		sin = Math.sin(radians),
		nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
		ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
	return [Math.round(nx), Math.round(ny)];
}
*/

//export default staging_area;