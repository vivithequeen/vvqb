import * as THREE from '../three/build/three.module.js';
// Use the ESM build of tween.js (CDN) so this module can import it reliably
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera(75, width / height, 0.0001, 10);
camera.position.z = 0;
camera.position.y = 0.04;

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
			obj.position.set(0,0,0);
			obj.scale.set(0.01,0.01,0.01);
			// ensure geometry bounding info is available
			
			
		}
	});

	scene.add(gltf.scene);


}, undefined, function (error) {

	console.error('GLTF load error:', error);

});
scene.add(mesh);


const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setSize(width, height, false);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(1);
renderer.shadowMap.type = THREE.NearestFilter;

let camTween = null;

const myButton = document.getElementById("lookLeft");

myButton.addEventListener("click", function() {
	if (camTween) camTween.stop(); // stop any running tween
	camTween = new TWEEN.Tween(camera.rotation)
		.to({ x: 0, y: -1.57079632679, z: 0 }, 2000)
		.easing(TWEEN.Easing.Cubic.Out)
		.onStart(() => console.log('camera tween started'))
		.onComplete(() => console.log('camera tween complete'))
		.start();
});

let keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false
};

const moveSpeed = 0.05; // Movement speed per frame

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'w') keysPressed.w = true;
    if (e.key.toLowerCase() === 'a') keysPressed.a = true;
    if (e.key.toLowerCase() === 's') keysPressed.s = true;
    if (e.key.toLowerCase() === 'd') keysPressed.d = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'w') keysPressed.w = false;
    if (e.key.toLowerCase() === 'a') keysPressed.a = false;
    if (e.key.toLowerCase() === 's') keysPressed.s = false;
    if (e.key.toLowerCase() === 'd') keysPressed.d = false;
});


function animate(time) {
	console.log("meowwww");
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
	renderer.render(scene, camera);
}