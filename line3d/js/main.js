import * as THREE from 'three';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { getRandomColor  } from '../city/color.js';
//import Stats from 'three/addons/libs/stats.module.js';


var container;

var camera, scene, renderer, effect;
var stats;
var mesh, geometry;
var lines;	
var skybox;

var dummy;
var positions = [0,0,0];


var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;




//document.addEventListener( 'mousemove', onDocumentMouseMove, false );

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('touchmove', onTouchMove);
document.addEventListener('touchstart', onTouchMove);

init();
animate();



function init() {
	
	//container = document.createElement( 'div' );
	container = document.getElementById("glContent");

	//if(foo)document.body.insertBefore(container, foo);
	//document.body.appendChild( container );

	//alert(myContent.offsetHeight + " " + window.innerHeight);
	
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );

	scene = new THREE.Scene();

	var geometry = new THREE.SphereGeometry( 100, 32, 16 );


	
	addSkybox();

	addDummy();

	addLines();

	addInstancedBoxes();
	

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

	

	window.addEventListener( 'resize', onWindowResize, false );

}

function addDummy(){
	var geometry = new THREE.BoxGeometry( 100, 100, 100 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	dummy = cube;
	//scene.add( cube );
}

function addLines() {
		var material = new LineMaterial( {

		color: 0xffff00,
		linewidth: 2.5, // in world units with size attenuation, pixels otherwise
		vertexColors: false,

		dashed: false,
		alphaToCoverage: false,

	} );

	var geometry = new LineGeometry();
	
	geometry.setPositions( positions );
	


	lines = new Line2( geometry, material);

	scene.add(lines);

	
}



function addInstancedBoxes(){
	
	const amount = 7;
	const count = Math.pow( amount, 3 );

	const geometry = new THREE.BoxGeometry(200, 200, 200);
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

	const mesh = new THREE.InstancedMesh( geometry, material, count );
	let i = 0;
	const offset = ( amount - 1 ) / 2;

	const matrix = new THREE.Matrix4();
	const color = new THREE.Color();
	

	for ( let x = 0; x < amount; x ++ ) {

		for ( let y = 0; y < amount; y ++ ) {

			for ( let z = 0; z < amount; z ++ ) {

				
				matrix.makeScale (1,Math.random()*4+1,1)
				matrix.setPosition( (Math.random()-.5)*20000, (Math.random()-.5)*20000 , (Math.random()-.5)*20000 );
								

				mesh.setMatrixAt( i, matrix );
				color.setHex(getRandomColor())
				mesh.setColorAt( i, color );

				i ++;

			}

		}

	}

	skybox.add( mesh );

}

function addSkybox(){
	// image
	var topColor = "#E5DBA4";
	var bottomColor = "#CFC17B";
	var textureTop = new THREE.Texture( generateTexture(topColor , topColor) );
	var textureBottom = new THREE.Texture( generateTexture(bottomColor , bottomColor) );
	var textureSide = new THREE.Texture( generateTexture( topColor , bottomColor) );
	
	var images = [textureSide.image,textureSide.image,textureTop.image,textureBottom.image,textureSide.image,textureSide.image];
	var cubetexture = new THREE.CubeTexture( images );
	cubetexture.needsUpdate = true;

	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = cubetexture;

	var material = new THREE.ShaderMaterial( {

		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		side: THREE.BackSide

	} )

	skybox = new THREE.Mesh( new THREE.BoxGeometry( 100000, 100000, 100000 ), material );
	
	scene.add( skybox );
}


function generateTexture(color1 , color2) {

	var size = 512;

	// create canvas
	var canvas = document.createElement( 'canvas' );
	canvas.width = size;
	canvas.height = size;

	// get context
	var context = canvas.getContext( '2d' );

	// draw gradient
	context.rect( 0, 0, size, size );
	var gradient = context.createLinearGradient( 0, 0, 0, size );
	gradient.addColorStop(0, color1); 
	gradient.addColorStop(1, color2); 
	context.fillStyle = gradient;
	context.fill();

	return canvas;

}



function onWindowResize() {

	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove(event) {

	mouseX = ( event.clientX - windowHalfX ) * 10;
	mouseY = ( event.clientY - windowHalfY ) * 10;

}



    

function onMouseMove(event) {

	mouseX = ( event.clientX - windowHalfX ) * 10;
	mouseY = ( event.clientY - windowHalfY ) * 10;

}
 
function onTouchMove(e) {
    //do something with e.touches[0].clientX or e.touches[0].clientY

    mouseX = ( e.touches[0].clientX - windowHalfX ) * 10;
	mouseY = ( e.touches[0].clientY - windowHalfY ) * 10;
   
 
}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	//stats.update();

}

var sideSpeed = 0;
var upRotationSpeed = 0;
var forwardSpeed = 0.1;

function render() {
	
	var timer = 0.0001 * Date.now();

	
	sideSpeed = mouseX * 0.00002;
	upRotationSpeed = mouseY * 0.00001;


	dummy.translateZ(-10);
	dummy.rotateY (sideSpeed);
	dummy.rotateX (upRotationSpeed);



	scene.remove(lines);
	positions.push(dummy.position.x)
	positions.push(dummy.position.y)
	positions.push(dummy.position.z)

	if(positions.length > 9000){
		positions.shift();
		positions.shift();
		positions.shift();
	}
	
	

	var gem = new LineGeometry();
	gem.setPositions( positions );

	
	
	lines = new Line2( gem, lines.material);
	lines.computeLineDistances();
	lines.scale.set( 1, 1, 1 );

	
	scene.add(lines);

	camera.position.copy( dummy.position);
	camera.rotation.copy( dummy.rotation);
	
	skybox.position.copy(camera.position);
		
	
	
	camera.translateZ(1000);




	renderer.render( scene, camera );


}