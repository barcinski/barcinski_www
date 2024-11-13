import * as THREE from 'three';


import * as TILES from './tiles.js';
import * as TILES_DOUBLE from './tiles_double.js';
import { InstaMesh  } from './grid.js';

import * as ONE from './section_one.js';
import { getRandomColor} from "./index.js";

class WallWithTwoCols{
	constructor(tilesX,tilesY , tileGeometry_00 , tileGeometry_01 , offset ){
		this.tilesX = tilesX;
		this.tilesY = tilesY;

		this.addPattern(tileGeometry_00, 0 , tileGeometry_01.width , tilesX , offset.matrix);
		this.addPattern(tileGeometry_01, 1 , tileGeometry_00.width , tilesX-1 , offset.matrix);
		
	}

	addPattern( instanced , yStepOffset, otherHeight , xLoopLength , m ) {
		let dummy =  new THREE.Object3D();
	

		for(let ix = 0 ; ix < xLoopLength ; ix++){
			for(let iy = 0 ; iy < this.tilesY  ; iy++){
				dummy.position.x = ix * (instanced.width + otherHeight) + yStepOffset * otherHeight ;
				dummy.position.y = iy * instanced.height;
				dummy.position.z = 0 ;


				dummy.updateMatrix();
				instanced.addInstance(dummy.matrix.premultiply(m));
				
			}
		}
	}
}



class Section extends ONE.Section{
	calculateWidth(){
		return this.tilesX * (this.tileMesh.width+this.tileMesh_01.width) - this.tileMesh_01.width;
	}

	calculateDepth(){
		return this.tilesZ * (this.tileMesh.width+this.tileMesh_01.width) - this.tileMesh_01.width;
	}

	

	createGeoms(rectWidth , rectHeight , rectWidth_01){
		const extrudeSettings = { depth: this.extrudeDepth, bevelEnabled: true, bevelSegments: 5, steps: 5, bevelSize: this.bevelSize, bevelThickness: this.bevelSize };


		let tileGeometry_00 	= new THREE.ExtrudeGeometry( this.getShape(rectWidth,rectHeight), extrudeSettings );
		extrudeSettings.depth *= Math.random() * 1.5 + 0.5;		
		const tileGeometry_01 = new THREE.ExtrudeGeometry( this.getShape_01(rectWidth_01,rectHeight), extrudeSettings );
		
		rectWidth+=(this.bevelSize*2);
		rectHeight+=(this.bevelSize*2);
		rectWidth_01+=(this.bevelSize*2);

		let tile_00_Material = new THREE.MeshStandardMaterial( { color: getRandomColor() , roughness:1 , metalness:0 } );
		let tileMesh_00 = new InstaMesh(rectWidth,rectHeight,this.extrudeDepth,tileGeometry_00,tile_00_Material);


		let tile_01_Material = new THREE.MeshStandardMaterial( { color: getRandomColor() , roughness:1 , metalness:0 } );
		let tileMesh_01 = new InstaMesh(rectWidth_01,rectHeight ,this.extrudeDepth,tileGeometry_01,tile_01_Material);


		//public
		this.tileMesh = tileMesh_00;
		this.tileMesh_01 = tileMesh_01;
	//	this.rectWidth = rectWidth;
	

	}

	createWalls(){
		let dummy =  new THREE.Object3D();

		let bevelSize = this.bevelSize;
		const rectWidth = this.tileMesh.width + this.tileMesh_01.width;
		const rectHeight = this.tileMesh.height;
		const rectWidth_01 = this.tileMesh_01.width;
		const tilesX = this.tilesX;
		const tilesZ = this.tilesZ;
		const tilesY = this.tilesY;
		

		///////////////////////////////////////////////////////////////////
		//front wall
		let frontWall = this.getFrontWall( tilesX , tilesY , dummy );


		///////////////////////////////////////////////////////////////////
		//left wall
		dummy.position.x =  - bevelSize;
		dummy.position.z = - ((tilesZ * rectWidth)- rectWidth_01) + bevelSize ;//- bevelSize;
		dummy.rotation.y = -Math.PI/2;
		dummy.updateMatrix();

		let leftWall = this.getLeftWall(tilesZ, tilesY  , dummy);


		///////////////////////////////////////////////////////////////////
		//back wall
		dummy.position.x = tilesX * rectWidth - rectWidth_01 - bevelSize - bevelSize;
		dummy.position.z = - (tilesZ * rectWidth - rectWidth_01) ;
		dummy.rotation.y = Math.PI;
		dummy.updateMatrix();

		let  backWall = this.getBackWall( tilesX , tilesY  , dummy);


		///////////////////////////////////////////////////////////////////
		//right wall
		dummy.position.x = tilesX * rectWidth - rectWidth_01 - bevelSize;
		dummy.position.z = -bevelSize;
		dummy.rotation.y = Math.PI/2;
		dummy.updateMatrix();

		let rightWall = this.getRightWall( tilesZ, tilesY , dummy );


		this.tileMesh.create();
		this.group = this.tileMesh.mesh;

		this.tileMesh_01.create()
		this.group.add( this.tileMesh_01.mesh );
		
	}

	getFrontWall(tilesX, tilesY , dummy){
		return new WallWithTwoCols(tilesX, tilesY , this.tileMesh , this.tileMesh_01  , dummy );
	}

	getLeftWall(tilesX, tilesY , dummy){
		return new WallWithTwoCols(tilesX, tilesY , this.tileMesh , this.tileMesh_01  , dummy );
	}

	getRightWall(tilesX, tilesY , dummy){
		return new WallWithTwoCols(tilesX, tilesY , this.tileMesh , this.tileMesh_01  , dummy );
	}

	getBackWall(tilesX, tilesY , dummy){
		return new WallWithTwoCols(tilesX, tilesY , this.tileMesh , this.tileMesh_01  , dummy );
	}



	getShape_01(rectWidth,rectHeight){
		return TILES.getRectShape(rectWidth,rectHeight)
	}


}

export class MidSection_DoubleTile extends Section{
	constructor( tilesX , tilesY , tilesZ )
	{
		super( tilesX , tilesY , tilesZ );
	}

	createGeoms(){
		let rectWidth   = 165;
		let rectHeight  = 100;

		let rnd = Math.random()*20 + 10;

		super.createGeoms(rectWidth-rnd,rectHeight, rnd);
	}
}

export class MidSection_DoubleTile_TwoWindows extends Section{
	constructor( tilesX , tilesY , tilesZ )
	{
		super( tilesX , tilesY * 2, tilesZ );
	}

	createGeoms(){
		let rectWidth   = 165;
		let rectHeight  = 100;

		super.createGeoms(rectWidth-40,rectHeight, 40);
	}

	getShape(rectWidth,rectHeight){
		return TILES_DOUBLE.getTwoRectWindows(rectWidth,rectHeight)
	}
}

