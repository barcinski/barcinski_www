import * as THREE from 'three';


export function getTwoRectWindows(rectWidth,rectHeight){
	const rectShape = new THREE.Shape()
		.moveTo(0,0)
		.lineTo(0,rectHeight)
		.lineTo(rectWidth,rectHeight)
		.lineTo(rectWidth,0)
		.lineTo(0,0)
	


	const holeWidth = 40;
	const holeHeight = 50;
	let holeX = 30//(rectWidth-holeWidth)/2; 
	const holeY = (rectHeight-holeHeight)/2;
	let rectHole = new THREE.Shape()
		.moveTo(holeX,holeY)
		.lineTo(holeWidth+holeX,holeY)
		.lineTo(holeWidth+holeX,holeY+holeHeight)
		.lineTo(holeX,holeY+holeHeight)	
		.lineTo(holeX,holeY)
	

	rectShape.holes.push( rectHole );

	holeX = 95
	rectHole = new THREE.Shape()
		.moveTo(holeX,holeY)
		.lineTo(holeWidth+holeX,holeY)
		.lineTo(holeWidth+holeX,holeY+holeHeight)
		.lineTo(holeX,holeY+holeHeight)	
		.lineTo(holeX,holeY)

	rectShape.holes.push( rectHole );


	return rectShape;
}


export function getTopSection(rectWidth,rectHeight){
	

		const rectShape = new THREE.Shape()
			.moveTo(0,0)
			.lineTo(0,rectHeight)
			.lineTo(rectWidth,rectHeight)
			.lineTo(rectWidth,0)
			.lineTo(0,0)
		


		const holeWidth = 50*2;
		const holeHeight = 110*2;
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