import * as THREE from '../three/build/three.module.js';
// Use the ESM build of tween.js (CDN) so this module can import it reliably
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera(90, width / height, 0.01, 10);
camera.position.z = 0;
camera.position.y = 0;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(0.4, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();
material.magFilter = THREE.NearestFilter;
material.minFilter = THREE.NearestFilter;

const mesh = new THREE.Mesh(geometry, material);
// move debug cube away so it doesn't overlap the loaded model
mesh.position.set(-0.5, 0, 0);

const loader = new GLTFLoader();

loader.load('monkey.glb', function (gltf) {
	console.log('GLTF loaded:', gltf);

	// Replace materials on all meshes in the glTF so they don't use unexpected textures/shaders
	gltf.scene.traverse(function (obj) {
		if (obj.isMesh) {
			obj.material = new THREE.MeshNormalMaterial();
			obj.material.needsUpdate = true;
			obj.position.set(0,0,0);
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
renderer.setSize(width/2, height/2, false);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(1);
renderer.shadowMap.type = THREE.NearestFilter;

let camTween = null;

const myButton = document.getElementById("lookLeft");

myButton.addEventListener("click", function() {
	if (camTween) camTween.stop(); // stop any running tween
	camTween = new TWEEN.Tween(camera.rotation)
		.to({ x: 0, y: 1.57079632679, z: 0 }, 3000)
		.easing(TWEEN.Easing.Cubic.Out)
		.onStart(() => console.log('camera tween started'))
		.onComplete(() => console.log('camera tween complete'))
		.start();
});



function animate(time) {
	console.log("meowwww");
	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	// Update tweens every frame (no argument needed, uses internal clock)
	TWEEN.update();
	renderer.render(scene, camera);
}