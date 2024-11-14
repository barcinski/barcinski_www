import * as THREE from 'three';



class InstaMesh{
	constructor(width, height, depth, geometry , material){
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.geometry = geometry;
		this.material = material;
		this.matrixes = [];
		this.mesh = {};
	}

	addInstance(matrix){
		this.matrixes.push(matrix.clone());
	}

	create(){
		this.mesh = new THREE.InstancedMesh( this.geometry, this.material, this.matrixes.length );
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		
		for(var i = 0 ; i < this.matrixes.length ; i++){
			this.mesh.setMatrixAt( i, this.matrixes[i] );
		}
	}

}


function int(f){
	return Math.floor(f)
}

function random(min,max){
	return Math.random()*(max - min)+min;
}

function min(a,b){
	if(a <= b)return a;
	else return b;
}


class Grid {
  constructor(w, h) {
    this.rows = [];
    this.h = h;
    this.w = w;
    this.blocks = [];
    this.blockIndex = -1;//private

    this.populate();
    this.randomize();
  }

  populate() {
    for (let iy = 0; iy < this.h; iy++) {
      this.rows[iy] = [];

      for (let ix = 0; ix < this.w; ix++) {
        this.rows[iy][ix]  = -1;
      }
    }
  }
  
  findEmptyRect(startX,startY){  
    this.blockIndex ++;
    
    let maxW = int(random(5,20))
    let maxH = int(random(5,20))
    
    let endW = min(startX + maxW, this.w)
    let endH = min(startY + maxH , this.h)
    
    for (let iy = startY; iy < endH; iy++) {
      endW = this.findEmptyInRow(this.rows[iy], startX, endW)
      if(endW - startX < 3)endH = min(startY + endW - startX,this.h)
    }

  this.blocks.push(new Block(startX,startY,endW-startX,endH-startY))
  
}

findEmptyInRow(row , startX, endW){
  for (let ix = startX; ix < endW; ix++) {
    if(row[ix]  != -1){
     return ix;   
   }else{
    row[ix] = this.blockIndex
  }
}
return endW
}

randomize() {
  for (let iy = 0; iy < this.h; iy++) {
    for (let ix = 0; ix < this.w; ix++) {
      if(this.rows[iy][ix]  == -1){
          //we have an empty one
          this.findEmptyRect(ix,iy)
        }
      }
    }
  }
}

class Block{
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.height = random(1, random(1,random(1,50)))
    
    //let numColors = palette.colors.length;
    //this.color = color (palette.colors[ floor(random(numColors))])
  }
}



export {  InstaMesh  , Grid  };