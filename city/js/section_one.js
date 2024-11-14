import * as THREE from 'three';

import * as TILES from './tiles.js';
import * as TILES_DOUBLE from './tiles_double.js';
import { InstaMesh  } from './grid.js';
//import { RoundedBoxGeometry } from './lib/RoundedBoxGeometry.js';

import { getRandomColor  } from './color.js';


class Wall{
	constructor(tilesX,tilesY , tileGeometry  , offset , hole = -111 ){
		this.tilesX = tilesX;
		this.tilesY = tilesY;

		this.addPattern(tileGeometry , offset.matrix , 0 , hole);
	}

	addPattern( instanced , m , delay , hole) {
		let dummy =  new THREE.Object3D();
		

		for(let ix = 0 ; ix < this.tilesX ; ix++){
			for(let iy = 0 ; iy < this.tilesY ; iy++){
				dummy.position.x = ix * instanced.width 
				dummy.position.y = iy * instanced.height  
				dummy.position.z = 0


				if(iy == 0 && this.tilesX > 1){
					if(ix == Math.ceil(hole) || (ix == hole+1 && this.tilesX > 2)){
						continue;
					}
				}

				dummy.updateMatrix();
				instanced.addInstance(dummy.matrix.premultiply(m), delay + iy*50 + ix*4);
				
			}
		}
	}
}



export class Section{
	constructor( tilesX , tilesY , tilesZ ){
		this.extrudeDepth = Math.random()* 20 + 10;
		this.bevelSize = 2.5;
		
		//////////////
		//Properties//
		//////////////
		this.tilesX = tilesX;
		this.tilesZ = tilesZ;
		this.tilesY = tilesY;


		this.createGeoms();
		this.createWalls();
	}

	calculateHeight(){
		return this.tilesY * this.tileMesh.height ;
	};

	calculateWidth(){
		return this.tilesX * this.tileMesh.width;
	}

	calculateDepth(){
		return this.tilesZ * this.tileMesh.width;
	}

	

	createGeoms(rectWidth , rectHeight){

		const extrudeSettings = { depth: this.extrudeDepth, bevelEnabled: true, bevelSegments: 5, steps: 5, bevelSize: this.bevelSize, bevelThickness: this.bevelSize };


		let tileGeometry 	= new THREE.ExtrudeGeometry( this.getShape(rectWidth,rectHeight), extrudeSettings );
		rectWidth+=(this.bevelSize*2);
		rectHeight+=(this.bevelSize*2);

		let material 	= new THREE.MeshStandardMaterial( { color: getRandomColor() , roughness:1 , metalness:0 } );
		let tileMesh = new InstaMesh(rectWidth,rectHeight,this.extrudeDepth,tileGeometry,material);


		//////////////
		//Properties//
		//////////////
		this.tileMesh = tileMesh;
		//this.rectWidth = rectWidth;
		
	}

	createWalls(){
		let dummy =  new THREE.Object3D();

		let bevelSize = this.bevelSize;
		const rectWidth = this.tileMesh.width;
		const rectHeight = this.tileMesh.height;
		const tilesX = this.tilesX;
		const tilesZ = this.tilesZ;
		const tilesY = this.tilesY;
		

		///////////////////////////////////////////////////////////////////
		//front wall
		let frontWall = this.getFrontWall( tilesX , tilesY , dummy );


		///////////////////////////////////////////////////////////////////
		//left wall
		dummy.position.x =  - bevelSize;
		dummy.position.z = - (tilesZ * rectWidth) + bevelSize ;//- bevelSize;
		dummy.rotation.y = -Math.PI/2;
		dummy.updateMatrix();

		let leftWall = this.getLeftWall(tilesZ, tilesY  , dummy);


		///////////////////////////////////////////////////////////////////
		//back wall
		dummy.position.x = tilesX * rectWidth - bevelSize - bevelSize;
		dummy.position.z = - (tilesZ * rectWidth) ;
		dummy.rotation.y = Math.PI;
		dummy.updateMatrix();

		let  backWall = this.getBackWall( tilesX , tilesY  , dummy);


		///////////////////////////////////////////////////////////////////
		//right wall
		dummy.position.x = tilesX * rectWidth - bevelSize;
		dummy.position.z = -bevelSize;//- (tilesZ * rectWidth) + bevelSize ;
		dummy.rotation.y = Math.PI/2;
		dummy.updateMatrix();

		let rightWall = this.getRightWall( tilesZ, tilesY , dummy );


		this.tileMesh.create();
		this.group = this.tileMesh.mesh;
		
	}

	getFrontWall( tilesX , tilesY , dummy ){
		return new Wall(tilesX, tilesY , this.tileMesh  , dummy);
	}
	
	getLeftWall( tilesZ , tilesY , dummy ){
		return new Wall(tilesZ, tilesY , this.tileMesh  , dummy);
	}

	getBackWall( tilesX , tilesY , dummy ){
		return new Wall(tilesX, tilesY , this.tileMesh  , dummy);
	}
	
	getRightWall( tilesZ , tilesY , dummy ){
		return new Wall(tilesZ, tilesY , this.tileMesh  , dummy);
	}


	getShape(rectWidth,rectHeight){
			return TILES.getOneTileWindow(rectWidth,rectHeight)
	}

}


export class MidSection extends Section{
	createGeoms(){
		super.createGeoms(80,120);
	}
}

export class MidSection_ThinWindow extends Section{
	createGeoms(){
		super.createGeoms(80,120);
	}

	getShape(w,h){
		return TILES.getOneThinWindow(w,h)
	}
}

export class MidSection_TwoWindows extends Section{
	createGeoms(){
		super.createGeoms(80,120);
	}


	getShape(w,h){
		return TILES.getDoubleWindow(w,h)
	}

}

export class MidSection_DoubleTile_OneWindow extends Section{
	createGeoms(){
		super.createGeoms(165,100);
	}
	

	getShape(rectWidth,rectHeight){
		return TILES.getOneThinWindow(rectWidth,rectHeight)
	}

}

export class MidSection_DoubleTile_TwoWindows extends Section{
	createGeoms(){
		let rectWidth   = 165;
		let rectHeight  = 100;

		super.createGeoms(rectWidth,rectHeight);
	}
	

	getShape(rectWidth,rectHeight){
		return TILES_DOUBLE.getTwoRectWindows(rectWidth,rectHeight)
	}

}


export class TopSection extends Section{
	createGeoms(){
		let rectWidth   = 80
		let rectHeight  = 160

		super.createGeoms(rectWidth,rectHeight);
	}
	

	getShape(rectWidth,rectHeight){
		return TILES.getOneTileDoor(rectWidth,rectHeight);
	}

}




export class TopSection_DoubleTile extends Section{
	createGeoms(){
		super.createGeoms(165,240);
	}

	
	getShape(w,h){
		return TILES_DOUBLE.getTopSection(w,h)
	}

}


export class BaseSection extends TopSection{
	getFrontWall(tilesX, tilesY  , dummy){
		return new Wall(tilesX, tilesY , this.tileMesh  , dummy , this.tilesX/2-1);
	}

	getBackWall(tilesX, tilesY  , dummy){
		return new Wall(tilesX, tilesY , this.tileMesh  , dummy , this.tilesX/2-1);
	}

	getLeftWall( tilesZ , tilesY , dummy ){
		return new Wall(tilesZ, tilesY , this.tileMesh  , dummy , this.tilesZ/2-1);
	}

	getRightWall( tilesZ , tilesY , dummy ){
		return new Wall(tilesZ, tilesY , this.tileMesh  , dummy , this.tilesZ/2-1);
	}

	

}
