import * as THREE from 'three';

import * as ONE from './section_one.js';
import * as TWO_ROWS from './section_twoRows.js';
import * as TWO_COLS from './section_twoCols.js';
import { RoundedBoxGeometry } from './lib/RoundedBoxGeometry.js';
import { InstaMesh  } from './grid.js';

import { getRandomColor  } from './color.js';


function random(min = -1,max = 1){
	return Math.random()*(max - min)+min;
}


function rnd(max = 1){
	return Math.random() * max;
}

function max(a,b){
	if(a >=	 b)return a;
	else return b;
}

function min(a,b){
	if(a <= b)return a;	
	else return b;
}


class Composed_Building{	
	constructor( tilesX = 26,tilesZ = 26,tilesY = 50 ){
		this.group = new THREE.Group();

		//const light = new THREE.PointLight( 0xffffff, 1, 500 );
		//this.group.add( light );

		let baseTilesY = random(1,3)
		let tilesYLeft = tilesY - baseTilesY
		let shrinkBase = 1;
		if(rnd()>0.5)shrinkBase = 0
		let building_base = new BaseSection_Building( min(max(tilesX-shrinkBase,2), tilesX) ,  min(max(tilesZ-shrinkBase,2), tilesZ) ,baseTilesY,true,false);
		this.group.add(building_base.group)
		
		
			let midHeight = random(2,6)
			tilesYLeft -= midHeight

			let building_mid;
			if(rnd()>.5)
				building_mid = new MidSection_Building(tilesX,tilesZ, midHeight  ,true);
			else 
				building_mid = new MidSection_DoubleTile_Building(tilesX/2,tilesZ/2, midHeight  ,true);
			building_mid.group.position.y += building_base.roofPos
			this.group.add(building_mid.group);
		

		let buildingWidth = building_mid.getWidth();
		let buildingDepth = building_mid.getDepth();
		building_base.group.position.x = (buildingWidth - building_base.getWidth())/2;
		building_base.group.position.z = - (buildingDepth - building_base.getDepth())/2;

		//light.position.set( buildingWidth/2, building_base.calculateRoofPos()/2, -buildingDepth/2 );


		let building_mid2
		let shrinkMid2 = random(0, 3)
		let shrinkTop = random( shrinkMid2,3)

		let mid2_ceiling = true;
		let top_floor = false;
		let hasTopFloor = false;
		if(rnd()>0.5)hasTopFloor = true;


		if(shrinkTop < shrinkMid2 && hasTopFloor){
			mid2_ceiling = false;
			top_floor = true;
		}
		if(tilesYLeft > 1){
			if(rnd()>.5)
				building_mid2 = new MidSection_DoubleTile_Building( min(max(tilesX/2-shrinkMid2/2,1),tilesX) , min(max(tilesZ/2-shrinkMid2/2,1),tilesZ) , tilesYLeft , false , mid2_ceiling);
			else
				building_mid2 = new MidSection_Building( min(max(tilesX-shrinkMid2,1),tilesX) , min(max(tilesZ-shrinkMid2,1),tilesZ) , tilesYLeft , false , mid2_ceiling);

			building_mid2.group.position.y += building_base.roofPos + building_mid.roofPos;
			building_mid2.group.position.x = (buildingWidth - building_mid2.getWidth())/2;
			building_mid2.group.position.z = -(buildingDepth - building_mid2.getDepth())/2;

			this.group.add(building_mid2.group);
		}else{
			top_floor = false;
		}


		if(hasTopFloor){
			let building_top = new Building( min(max(tilesX-shrinkTop,1),tilesX), min(max(tilesZ-shrinkTop,1),tilesZ) ,random(1,2) , top_floor);

			if(building_mid2)building_top.group.position.y = (building_mid2.group.position.y + building_mid2.roofPos) 
				else building_top.group.position.y = (building_mid.group.position.y + building_mid.roofPos) 

			building_top.group.position.x = (buildingWidth - building_top.getWidth())/2;
			building_top.group.position.z = -(buildingDepth - building_top.getDepth())/2;
			this.group.add(building_top.group);	
		}	
	}
}


class Building{
	constructor( tilesX = 11,tilesZ = 11,tilesY = 10, hasFloor = false , hasCeiling = true ){
		this.tilesX = Math.round(tilesX);
		this.tilesY = Math.round(tilesY);
		this.tilesZ = Math.round(tilesZ);

		this.hasFloor = hasFloor;
		this.hasCeiling = hasCeiling;


		this.createSection();
		this.group = this.section.group;

		const extrudeDepth = this.section.extrudeDepth;
		const bevelSize = this.section.bevelSize;
		const rectWidth   = this.section.calculateWidth() / this.tilesX; 
		const rectDepth   = this.section.calculateDepth() / this.tilesZ; 
		
		this.createFloor(extrudeDepth , bevelSize, rectWidth, rectDepth);
	}

	createSection(){
		this.section = new ONE.TopSection(this.tilesX , this.tilesY , this.tilesZ );
	}

	getWidth(){
		return this.section.calculateWidth();
	}

	getDepth(){
		return this.section.calculateDepth();
	}

	calculateRoofPos(){
		return this.section.calculateHeight() ;
	};

	createFloor( extrudeDepth , bevelSize, rectWidth, rectDepth){
		const floorMaterial 	= new THREE.MeshStandardMaterial( { color: getRandomColor() , roughness:1 , metalness:0 } );
		const floorGeomtry = new RoundedBoxGeometry( rectWidth, bevelSize*2, rectDepth, 1, bevelSize/2 );
		const blueFloor = new InstaMesh(rectWidth,extrudeDepth,rectDepth,floorGeomtry,floorMaterial);


		//floor position
		const dummy =  new THREE.Object3D();
		dummy.position.x = - bevelSize;
		dummy.updateMatrix();
		

		if(this.hasFloor)new FLoor(this.tilesX,this.tilesZ,blueFloor,dummy)


		//ceiling position
		dummy.position.y = this.calculateRoofPos(bevelSize)
		dummy.updateMatrix();
		this.roofPos = dummy.position.y ;

		//ceiling
		if(this.hasCeiling)new FLoor(this.tilesX,this.tilesZ,blueFloor,dummy)

		

		blueFloor.create();
		//this.blueFloor = blueFloor;
		this.group.add( blueFloor.mesh );
	}
}

class TopSection_Building extends Building{
	createSection(){
		this.section = new ONE.TopSection(this.tilesX , this.tilesY , this.tilesZ );
	}
}

class BaseSection_Building extends Building{
	createSection(){
		this.section = new ONE.BaseSection(this.tilesX , this.tilesY , this.tilesZ );
	}
}


class MidSection_Building extends Building{
	createSection(){
		let r = rnd(3);
		if(r > 2)
			this.section = new ONE.MidSection_TwoWindows(this.tilesX , this.tilesY , this.tilesZ );
		else if(r > 1)
			this.section = new ONE.MidSection_ThinWindow(this.tilesX , this.tilesY , this.tilesZ );
		else 
			this.section = new ONE.MidSection(this.tilesX , this.tilesY , this.tilesZ );

	}
}

class MidSection_DoubleTile_Building extends Building{
	createSection(){
		let r = random(0,10)

		if(r>4)
			this.section = new TWO_COLS.MidSection_DoubleTile(this.tilesX , this.tilesY , this.tilesZ );
		else if(r>3)
			this.section = new TWO_ROWS.MidSection_DoubleTile(this.tilesX , this.tilesY , this.tilesZ );
		else if(r>2)
			this.section = new ONE.MidSection_DoubleTile_TwoWindows(this.tilesX , this.tilesY , this.tilesZ );
		else if(r > 1)
			this.section = new ONE.MidSection_DoubleTile_OneWindow(this.tilesX , this.tilesY , this.tilesZ );
		else
			this.section = new TWO_ROWS.MidSection_DoubleTile_TwoWindows(this.tilesX , this.tilesY , this.tilesZ );
	}
}

class MidSection_TwoWindows_Building extends Building{
	createSection(){
		this.section = new ONE.MidSection_DoubleTile_TwoWindows(this.tilesX , this.tilesY , this.tilesZ );
	}	
}

class TwoRows_MidSection_Building extends Building{
	createSection(){
		this.section = new TWO_ROWS.MidSection_DoubleTile_TwoWindows(this.tilesX , this.tilesY , this.tilesZ );
	}
}



class FLoor{
	constructor( tilesX,tilesZ , instaMesh , offset ){
		this.tilesX = tilesX;
		this.tilesZ = tilesZ;

		this.addPattern(instaMesh , offset.matrix );
	}

	addPattern( instaMesh , m ) {
		let dummy =  new THREE.Object3D();

		for(let ix = 0 ; ix < this.tilesX ; ix++){
			for(let iz = 0 ; iz < this.tilesZ ; iz++){
				dummy.position.x = ix * instaMesh.width + (instaMesh.width/2);
				dummy.position.y = 0;
				dummy.position.z = -iz * instaMesh.depth - (instaMesh.depth/2);


				dummy.updateMatrix();
				instaMesh.addInstance(dummy.matrix.premultiply(m));
				
			}
		}
	}
}

export {
	BaseSection_Building, 
	TopSection_Building, 
	MidSection_Building , 
	MidSection_TwoWindows_Building , 
	TwoRows_MidSection_Building  , 
	Composed_Building
}