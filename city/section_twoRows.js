import * as THREE from 'three';


import * as TILES from './tiles.js';
import * as TILES_DOUBLE from './tiles_double.js';
import { InstaMesh  } from './grid.js';

import * as ONE from './section_one.js';
import { getRandomColor} from "./index.js";

class WallWithTwoRows{
	constructor(tilesX,tilesY , tileGeometry_00 , tileGeometry_01 , offset ){
		this.tilesX = tilesX;
		this.tilesY = tilesY;

		this.addPattern(tileGeometry_00, 0 , tileGeometry_01.height , tilesX , offset.matrix);
		this.addPattern(tileGeometry_01, 1 , tileGeometry_00.height , tilesX , offset.matrix);
		
	}

	addPattern( instanced , yStepOffset, otherHeight , xLoopLength , m ) {
		let dummy =  new THREE.Object3D();
	

		for(let ix = 0 ; ix < xLoopLength ; ix++){
			for(let iy = 0 ; iy < this.tilesY/2  ; iy++){
				dummy.position.x = ix * instanced.width;
				dummy.position.y = iy * (instanced.height + otherHeight) + yStepOffset * otherHeight ;
				dummy.position.z = 0 ;


				dummy.updateMatrix();
				instanced.addInstance(dummy.matrix.premultiply(m));
				
			}
		}
	}
}



class Section extends ONE.Section{
	calculateHeight(){
		return (this.tilesY/2) * ( this.tileMesh.height +  this.tileMesh_01.height);	
	}

	createWalls(bevelSize ){
		super.createWalls(bevelSize);

		this.tileMesh_01.create()
		this.group.add( this.tileMesh_01.mesh );
	}

	createGeoms(rectWidth , rectHeight , rectHeight_01){
		const extrudeSettings = { depth: this.extrudeDepth, bevelEnabled: true, bevelSegments: 5, steps: 5, bevelSize: this.bevelSize, bevelThickness: this.bevelSize };


		let tileGeometry_00 	= new THREE.ExtrudeGeometry( this.getShape(rectWidth,rectHeight), extrudeSettings );
		extrudeSettings.depth *= Math.random() * 1.5 + 0.5;		
		const tileGeometry_01 = new THREE.ExtrudeGeometry( this.getShape_01(rectWidth,rectHeight_01), extrudeSettings );
		
		rectWidth+=(this.bevelSize*2);
		rectHeight+=(this.bevelSize*2);
		rectHeight_01+=(this.bevelSize*2);

		let tile_00_Material = new THREE.MeshStandardMaterial( { color: getRandomColor() , roughness:1 , metalness:0 } );
		let tileMesh_00 = new InstaMesh(rectWidth,rectHeight,this.extrudeDepth,tileGeometry_00,tile_00_Material);


		let tile_01_Material = new THREE.MeshStandardMaterial( { color: getRandomColor() , roughness:1 , metalness:0 } );
		let tileMesh_01 = new InstaMesh(rectWidth,rectHeight_01 ,this.extrudeDepth,tileGeometry_01,tile_01_Material);


		//public
		this.tileMesh = tileMesh_00;
		this.tileMesh_01 = tileMesh_01;
	//	this.rectWidth = rectWidth;
	

	}

	getFrontWall(tilesX, tilesY , dummy){
		return new WallWithTwoRows(tilesX, tilesY , this.tileMesh , this.tileMesh_01  , dummy );
	}

	getLeftWall(tilesX, tilesY , dummy){
		return new WallWithTwoRows(tilesX, tilesY , this.tileMesh , this.tileMesh_01  , dummy );
	}

	getRightWall(tilesX, tilesY , dummy){
		return new WallWithTwoRows(tilesX, tilesY , this.tileMesh , this.tileMesh_01  , dummy );
	}

	getBackWall(tilesX, tilesY , dummy){
		return new WallWithTwoRows(tilesX, tilesY , this.tileMesh , this.tileMesh_01  , dummy );
	}



	getShape_01(rectWidth,rectHeight){
		return TILES.getRectShape(rectWidth,rectHeight)
	}


}

export class MidSection_DoubleTile extends Section{
	constructor( tilesX , tilesY , tilesZ )
	{
		super( tilesX , tilesY * 2, tilesZ );
	}

	createGeoms(){
		let rectWidth   = 165;
		let rectHeight  = 100;

		super.createGeoms(rectWidth,rectHeight, Math.random()*rectHeight/3 + 10);
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

		super.createGeoms(rectWidth,rectHeight, Math.random()*rectHeight/3 + 10);
	}

	getShape(rectWidth,rectHeight){
		return TILES.getOneThinWindow(rectWidth,rectHeight)
	}
}

