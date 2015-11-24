"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Drinking Bird Model exercise                                               //
// Your task is to complete the model for the drinking bird                   //
// Please work from the formal blueprint dimensions and positions shown at    //
// https://www.udacity.com/wiki/cs291/notes                                   //
//                                                                            //
// The following forms and sizes should be used:                              //
// Hat: cylinder. color blue (cylinderMaterial)                               //
//      Diameter top 80, bottom, full height 80, edge 10                      //
// Head: sphere, red (sphereMaterial), diameter 104                           //
// Middle of base: cube, color orange (cubeMaterial), width 77, length 194    //
// Feet: cube, color orange, width 6, length 194, height 52                   //
// Legs: cube, color orange, width 6, length 64, height 386                   //
// Body: sphere, red, diameter 116                                            //
// Spine: cylinder, blue, diameter 24, length 390                             //
//                                                                            //
// So that the exercise passes, and the spheres and cylinders look good,      //
// all SphereGeometry calls should be of the form:                            //
//     SphereGeometry( radius, 32, 16 );                                      //
// and CylinderGeometry calls should be of the form:                          //
//     CylinderGeometry( radiusTop, radiusBottom, height, 32 );               //
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, $, document, window, dat*/

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = true;

function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColorHex( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 40000 );
	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);

	camera.position.set( -480, 659, -619 );
	cameraControls.target.set(4,301,92);

	fillScene();
}

// Supporting frame for the bird - base + legs + feet
function createCube(p1,p2,h) {
   var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x020304, side: THREE.DoubleSide } );
   var cube = new THREE.Geometry();
   var red,green,blue,white;
   red = new THREE.Color(0xff0000);
   green = new THREE.Color(0x00ff00);
   blue = new THREE.Color(0x0000ff);
   white = new THREE.Color(0x000000);
   cube.vertices.push(new THREE.Vector3(p1.x, p1.y, 0));
   cube.vertices.push(new THREE.Vector3(p2.x, p1.y, 0));
   cube.vertices.push(new THREE.Vector3(p2.x, p2.y, 0));
   cube.vertices.push(new THREE.Vector3(p1.x, p2.y, 0));
   cube.vertices.push(new THREE.Vector3(p1.x, p1.y, h));
   cube.vertices.push(new THREE.Vector3(p2.x, p1.y, h));
   cube.vertices.push(new THREE.Vector3(p2.x, p2.y, h));
   cube.vertices.push(new THREE.Vector3(p1.x, p2.y, h));
   cube.faces.push(new THREE.Face4(3,2,1,0));
   cube.faces.push(new THREE.Face4(0,1,5,4));
   cube.faces.push(new THREE.Face4(1,2,6,5));
   cube.faces.push(new THREE.Face4(2,3,7,6));
   cube.faces.push(new THREE.Face4(3,0,4,7));
   cube.faces.push(new THREE.Face4(4,5,6,7));
   cube.faces[0].vertexColors = [white,blue,white,red];
   cube.faces[5].vertexColors = [white,white,green,white];
   var mesh = new THREE.Mesh(cube,cubeMaterial);
   scene.add(mesh);
}

function fillScene() {
	// SCENE
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 3000, 6000 );
	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );
	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -400, 200, -300 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	if (ground) {
		Coordinates.drawGround({size:1000});
	}
	if (gridX) {
		Coordinates.drawGrid({size:1000,scale:0.01});
	}
	if (gridY) {
		Coordinates.drawGrid({size:1000,scale:0.01, orientation:"y"});
	}
	if (gridZ) {
		Coordinates.drawGrid({size:1000,scale:0.01, orientation:"z"});
	}
	if (axes) {
		Coordinates.drawAllAxes({axisLength:300,axisRadius:2,axisTess:50});
	}
	createCube(new THREE.Vector2(0,0), new THREE.Vector2(100,100), 100);
}
//
function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
	{
		gridX = effectController.newGridX;
		gridY = effectController.newGridY;
		gridZ = effectController.newGridZ;
		ground = effectController.newGround;
		axes = effectController.newAxes;

		fillScene();
	}
	renderer.render(scene, camera);
}

function setupGui() {

	effectController = {

		newGridX: gridX,
		newGridY: gridY,
		newGridZ: gridZ,
		newGround: ground,
		newAxes: axes
	};

	var gui = new dat.GUI();
	gui.add(effectController, "newGridX").name("Show XZ grid");
	gui.add( effectController, "newGridY" ).name("Show YZ grid");
	gui.add( effectController, "newGridZ" ).name("Show XY grid");
	gui.add( effectController, "newGround" ).name("Show ground");
	gui.add( effectController, "newAxes" ).name("Show axes");
}

try {
	init();
	setupGui();
	addToDOM();
	animate();
}
catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}
