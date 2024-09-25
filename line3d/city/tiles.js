import * as THREE from 'three';

export function getRectShape(rectWidth,rectHeight){
	const rectShape = new THREE.Shape()
		.moveTo(0,0)
		.lineTo(0,rectHeight)
		.lineTo(rectWidth,rectHeight)
		.lineTo(rectWidth,0)
		.lineTo(0,0)

	return rectShape;
}

export function getOneThinWindow(rectWidth,rectHeight){
	const rectShape = new THREE.Shape()
		.moveTo(0,0)
		.lineTo(0,rectHeight)
		.lineTo(rectWidth,rectHeight)
		.lineTo(rectWidth,0)
		.lineTo(0,0)
	


	const holeWidth = 30;
	const holeHeight = 70;
	let holeX = (rectWidth-holeWidth)/2; 
	const holeY = (rectHeight-holeHeight)/2;
	let rectHole = new THREE.Shape()
		.moveTo(holeX,holeY)
		.lineTo(holeWidth+holeX,holeY)
		.lineTo(holeWidth+holeX,holeY+holeHeight)
		.lineTo(holeX,holeY+holeHeight)	
		.lineTo(holeX,holeY)
	

	rectShape.holes.push( rectHole );


	return rectShape;
}


export function getOneTileWindow(rectWidth,rectHeight){
	const rectShape = new THREE.Shape()
		.moveTo(0,0)
		.lineTo(0,rectHeight)
		.lineTo(rectWidth,rectHeight)
		.lineTo(rectWidth,0)
		.lineTo(0,0)
	


	const holeWidth = 60;
	const holeHeight = 70;
	const holeX = (rectWidth-holeWidth)/2; 
	const holeY = (rectHeight-holeHeight)/2;
	const rectHole = new THREE.Shape()
		.moveTo(holeX,holeY)
		.lineTo(holeWidth+holeX,holeY)
		.lineTo(holeWidth+holeX,holeY+holeHeight)
		.lineTo(holeX,holeY+holeHeight)	
		.lineTo(holeX,holeY)
	

	rectShape.holes.push( rectHole );
	return rectShape;
}

export function getOneTileDoor(rectWidth ,rectHeight){
	const rectShape = new THREE.Shape()
		.moveTo(0,0)
		.lineTo(0,rectHeight)
		.lineTo(rectWidth,rectHeight)
		.lineTo(rectWidth,0)
		.lineTo(0,0)
	


	const holeWidth = 50;
	const holeHeight = 150;
	const holeX = (rectWidth-holeWidth)/2; 
	const holeY = (rectHeight-holeHeight)/2;
	const rectHole = new THREE.Shape()
		.moveTo(holeX,holeY)
		.lineTo(holeWidth+holeX,holeY)
		.lineTo(holeWidth+holeX,holeY+holeHeight)
		.lineTo(holeX,holeY+holeHeight)	
		.lineTo(holeX,holeY)
	

	rectShape.holes.push( rectHole );
	return rectShape;
}

export function getDoubleWindow(rectWidth,rectHeight){
		const rectShape = new THREE.Shape()
			.moveTo(0,0)
			.lineTo(0,rectHeight)
			.lineTo(rectWidth,rectHeight)
			.lineTo(rectWidth,0)
			.lineTo(0,0)
		


		const holeWidth = 30;
		const holeHeight = 50;
		let holeX = 10//(rectWidth-holeWidth)/2; 
		const holeY = (rectHeight-holeHeight)/2;
		let rectHole = new THREE.Shape()
			.moveTo(holeX,holeY)
			.lineTo(holeWidth+holeX,holeY)
			.lineTo(holeWidth+holeX,holeY+holeHeight)
			.lineTo(holeX,holeY+holeHeight)	
			.lineTo(holeX,holeY)
		

		rectShape.holes.push( rectHole );

		holeX = 40
		rectHole = new THREE.Shape()
			.moveTo(holeX,holeY)
			.lineTo(holeWidth+holeX,holeY)
			.lineTo(holeWidth+holeX,holeY+holeHeight)
			.lineTo(holeX,holeY+holeHeight)	
			.lineTo(holeX,holeY)

		rectShape.holes.push( rectHole );


		return rectShape;
	}
