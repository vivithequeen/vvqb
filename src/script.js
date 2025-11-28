import * as THREE from '../three/build/three.module.js';
// Use the ESM build of tween.js (CDN) so this module can import it reliably
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { CSS3DObject, CSS3DRenderer } from '../three/examples/jsm/renderers/CSS3DRenderer.js';
const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera(75, width / height, 0.0001, 1000);
camera.position.set(0,0.834,0.005);


const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(0.4, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();
material.magFilter = THREE.NearestFilter;
material.minFilter = THREE.NearestFilter;

const mesh = new THREE.Mesh(geometry, material);
// move debug cube away so it doesn't overlap the loaded model
mesh.position.set(-0.5, 0, 0);

const loader = new GLTFLoader();

loader.load('meow.glb', function (gltf) {
	console.log('GLTF loaded:', gltf);

	// Replace materials on all meshes in the glTF so they don't use unexpected textures/shaders
	gltf.scene.traverse(function (obj) {
		if (obj.isMesh) {
			obj.material = new THREE.MeshNormalMaterial();
			obj.material.needsUpdate = true;
			obj.position.set(0, 0, 0);
			obj.scale.set(0.01, 0.01, 0.01);
			// ensure geometry bounding info is available


		}
	});

	scene.add(gltf.scene);


}, undefined, function (error) {

	console.error('GLTF load error:', error);

});
scene.add(mesh);


// create a visible DOM element to attach with CSS3DObject

const testthingy = document.getElementById('base-screen');
if (!testthingy) console.warn('No element with id "base-screen" found — CSS3DObject will not render.');






// correct constructor call — CSS3DObject is the class itself

const css3DObject = testthingy ? new CSS3DObject(testthingy) : null;
// restore the previous small scale so the overlay matches the project's original behaviour
if (css3DObject) {
	css3DObject.position.set(-0.520, 0.799, -0.70);
	css3DObject.rotation.y = 0;
	css3DObject.scale.set(0.001935, 0.00205, 0.001);
}

scene.add(css3DObject);

// create CSS3D renderer and add it to document so DOM objects are visible
const cssRenderer = new CSS3DRenderer();

cssRenderer.setSize(width, height);

cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.left = '0';
cssRenderer.domElement.style.pointerEvents = 'none'; // avoids blocking pointer events on the canvas
// ensure the CSS renderer sits above the WebGL canvas so objects are visible
cssRenderer.domElement.style.zIndex = '10';
// if you'd like the DOM element to be interactive, set pointerEvents = 'auto' instead
document.body.appendChild(cssRenderer.domElement);





const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setSize(width/4, height/4, false);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(1);
renderer.shadowMap.type = THREE.NearestFilter;

let camTween = null;

const myButton = document.getElementById("lookLeft");

myButton.addEventListener("click", function () {
	if (camTween) camTween.stop(); // stop any running tween
	camTween = new TWEEN.Tween(camera.rotation)
		.to({ x: 0, y: -1.23918377, z: 0 }, 500)
		.easing(TWEEN.Easing.Cubic.Out)
		.onStart(() => console.log('camera tween started'))
		.onComplete(() => console.log('camera tween complete'))
		.start();
});

let keysPressed = {
	w: false,
	a: false,
	s: false,
	d: false,
	q: false,
	e: false
};

const moveSpeed = 0.05; // Movement speed per frame

document.addEventListener('keydown', (e) => {
	if (e.key.toLowerCase() === 'w') keysPressed.w = true;
	if (e.key.toLowerCase() === 'a') keysPressed.a = true;
	if (e.key.toLowerCase() === 's') keysPressed.s = true;
	if (e.key.toLowerCase() === 'd') keysPressed.d = true;
	if (e.key.toLowerCase() === 'q') keysPressed.q = true;
	if (e.key.toLowerCase() === 'e') keysPressed.e = true;
});

document.addEventListener('keyup', (e) => {
	if (e.key.toLowerCase() === 'w') keysPressed.w = false;
	if (e.key.toLowerCase() === 'a') keysPressed.a = false;
	if (e.key.toLowerCase() === 's') keysPressed.s = false;
	if (e.key.toLowerCase() === 'd') keysPressed.d = false;
	if (e.key.toLowerCase() === 'q') keysPressed.q = false;
	if (e.key.toLowerCase() === 'e') keysPressed.e = false;
});


function animate(time) {
	console.log(`camera-position: x:${camera.position.x.toFixed(3)}, y:${camera.position.y.toFixed(3)}, z:${camera.position.z.toFixed(3)}`);
	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	// Update tweens every frame (no argument needed, uses internal clock)
	TWEEN.update();
	
	if (keysPressed.w) {
		camera.translateZ(-moveSpeed); // Move forward
	}
	if (keysPressed.s) {
		camera.translateZ(moveSpeed); // Move backward
	}
	if (keysPressed.a) {
		camera.translateX(-moveSpeed); // Move left
	}
	if (keysPressed.d) {
		camera.translateX(moveSpeed); // Move right
	}
	if (keysPressed.e) {
		camera.translateY(moveSpeed); // Move up
	}
	if (keysPressed.q) {
		camera.translateY(-moveSpeed); // Move down
	}
	if (typeof cssRenderer !== 'undefined') cssRenderer.render(scene, camera);
	renderer.render(scene, camera);
	// render CSS3D layer (DOM objects) on top of WebGL canvas
	
}