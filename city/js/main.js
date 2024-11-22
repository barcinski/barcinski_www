import * as THREE from 'three';



import * as Building from './building.js';

import { Grid  } from './grid.js';
import { getRandomColor  } from './color.js';

let container
let citySize , city

let sCameraPosition
let POS_FRONT = "front"
let POS_CORNER = "corner"
let POS_TOP = "above"

let camera, scene, renderer;
const frustumSize = 10000;
let perspectiveCamera,ortoCamera;


let isPaused = true;




let dirLight , light;




init();
//render();
animate();
renderer.shadowMap.autoUpdate = false;


function rnd(min , max){
	return Math.floor(Math.random()*(max-min+1)) + min;
}


function generateACity(size){
	//makeRandomPalette()
	//let size = rnd(0.5,3);
	let gsize = size * 100;
	let g = new Grid(gsize,gsize)
    let bs = 125 //blockSize
    let city = new THREE.Group();
    if(Math.random()>.5)city.rotation.y = Math.PI/2;
    let scale = 0.8 / size ;
    city.scale.set(scale,scale,scale)
    for(let i = 0 ; i < g.blocks.length ; i++){
    	let b = g.blocks[i]

    	//if(b.w > 2 && b.h > 2){
    	let building = new Building.Composed_Building( b.w , b.h  , b.height , true , true);

			building.group.position.x = (b.x - gsize/2) * bs;
			building.group.position.z = (b.y + b.h - gsize/2) * bs;

			city.add(building.group);

    }

  return city;
}


function init() {
	container = document.getElementById("glContent");
	// container = document.createElement( 'div' );
	// document.body.appendChild( container );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( getRandomColor() );

	perspectiveCamera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000000 );
	perspectiveCamera.target = new THREE.Vector3();

	const aspect = window.innerWidth / window.innerHeight;
	ortoCamera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 20000 );
	ortoCamera.target = new THREE.Vector3();
	if(aspect>1)ortoCamera.zoom = 0.75 + aspect;
	else ortoCamera.zoom = 2.75 - aspect;
	ortoCamera.updateProjectionMatrix();


	//if(fxrand()>.5){
	if(0){
		camera = perspectiveCamera;
		if(1){
			camera.position.set( 0, 1100, 6000 ) //front view
			sCameraPosition = POS_FRONT
		}
		else{
			camera.position.set( 0, 11000, 0 )// top view
			sCameraPosition = POS_TOP
		}

	}else{
		camera = ortoCamera;
		//if(fxrand()>.5){
		if(1){
			camera.position.set( 5000, 7000, 5000 )//corner view
			sCameraPosition = POS_CORNER
		}
		else{
			camera.position.set( 0, 3000, 4000 )//front view
			sCameraPosition = POS_FRONT
		}
	}
	camera.lookAt(camera.target);
	
	
	scene.add( camera );

	light = new THREE.DirectionalLight( 0xffffff, 0.2 );
	//light = new THREE.AmbientLight( 0xffffff, 0.2 ); // soft white light

	light.position.set(  2000, 2000, - 2000 );
  	scene.add(light);

  let light0 = new THREE.DirectionalLight( 0xffffff, 0.4 );
	light0.position.set(  2000, 2000, 2000 );
 	 scene.add(light0);

  
  //camera.add(light.target);


    

  //citySize = rnd(1,3);
  citySize = 0.5;
  city = generateACity(citySize);
	scene.add(city);

	var planeColor = (window.groundColor) ? groundColor : getRandomColor();
	const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ), new THREE.MeshStandardMaterial( { color: planeColor, depthWrite: false } ) );
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

	dirLight = new THREE.DirectionalLight( 0xffffff );
	dirLight.position.set( - 2000, 6000, 2000 );
	dirLight.castShadow = true;
	dirLight.shadow.mapSize.width = 4096;
	dirLight.shadow.mapSize.height = 4096;

	dirLight.shadow.camera.top = 8000;
	dirLight.shadow.camera.bottom = - 8000;
	dirLight.shadow.camera.left = - 8000;
	dirLight.shadow.camera.right = 8000;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 16000;
	//scene.add( dirLight );

	//dirLight.position.set(0, 10, 0);
  //dirLight.target.position.set(-4, 0, -4);
  scene.add(dirLight);
  //scene.add(dirLight.target);




	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.shadowMap.enabled = true;
	renderer.setPixelRatio( window.devicePixelRatio );
	//renderer.setSize( window.innerWidth, window.innerHeight );
	//renderer.shadowMap.autoUpdate = true;
	container.appendChild( renderer.domElement );
	
	onWindowResize();





	window.addEventListener( 'resize', onWindowResize );
	

}

function onWindowResize() {
	var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; 
	var iw = (iOS) ? screen.width : window.innerWidth, ih = (iOS) ? screen.height : window.innerHeight;

	const portrait = window.matchMedia("(orientation: portrait)").matches;
	if(iOS && !portrait){
		const temp = iw;
		iw = ih;
		ih = temp;
	}
	let aspect = iw / ih;

		

	ortoCamera.left = - frustumSize * aspect / 2;
	ortoCamera.right = frustumSize * aspect / 2;
	ortoCamera.top = frustumSize / 2;
	ortoCamera.bottom = - frustumSize / 2;

	if(aspect>1)
		ortoCamera.zoom = 0.75 + aspect
	else
		ortoCamera.zoom = 2.75 - aspect

	ortoCamera.updateProjectionMatrix();
	


	perspectiveCamera.aspect = iw / ih;
	perspectiveCamera.updateProjectionMatrix();

	

	renderer.setSize( iw, ih );
	render();
	

}



function render() {
	renderer.render( scene, camera );

	
}

var currentFrame = 0;




function animate(){
	requestAnimationFrame(animate);

	var halfPI = Math.PI/4;
	var t = performance.now() * 0.00004 + halfPI;
	var camVpos = 6000 - (window.scrollY/document.documentElement.scrollHeight) * 6500;
	
	if(camVpos < 3500)switchCamera(perspectiveCamera)
	else switchCamera(ortoCamera)
	
	camera.position.set( Math.sin(t)*6000, camVpos, Math.cos(t)*6000 )
	camera.lookAt(0,0,0);

	render();
	currentFrame++;
}

function makeDigits(int){
	return ("0000" + int).slice(-4);
}

function savePng(){
	renderer.render( scene, camera );
	renderer.domElement.toBlob(function(blob){
	  var a = document.createElement('a');
	  var url = URL.createObjectURL(blob);
	  a.href = url;
	  a.download = 'BlockCity.png';
	  a.click();
	});
}


//keyboard handling
document.body.onkeydown = function(event){
	let key = event.key;
	//Take Screenshot
	if(key == 's'){
		renderer.setPixelRatio( window.devicePixelRatio );
		savePng();
	}

	if(key == 'd'){
		renderer.setPixelRatio( window.devicePixelRatio * 2);
		savePng();
	}

	if(key == 'o'){
		switchCamera(ortoCamera)
		if(isPaused)render()
	}

	if(key == 'p'){
		switchCamera(perspectiveCamera)
		if(isPaused)render()
	}

}

function switchCamera(newCamera){
	if(camera === newCamera)return
		camera.remove(light)
		newCamera.add(light)
		scene.remove(camera)
		//newCamera.position.copy(camera.position)
		//newCamera.rotation.copy(camera.rotation)
		camera = newCamera
		scene.add(camera)

}


//export { getRandomColor }