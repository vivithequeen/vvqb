import * as THREE from '../three/build/three.module.js';
// Use the ESM build of tween.js (CDN) so this module can import it reliably
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js';
import { OBJLoader } from '../three/examples/jsm/loaders/OBJLoader.js';
import { CSS3DObject, CSS3DRenderer } from '../three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from '../three/examples/jsm/loaders/MTLLoader.js';


const width = window.innerWidth / 4, height = window.innerHeight / 4;

// init

const camera = new THREE.PerspectiveCamera(75, width / height, 0.0001, 1000);





const scene = new THREE.Scene();


const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();
mtlLoader.load('blahaj.mtl', (mtl) => {
	mtl.preload();
	objLoader.setMaterials(mtl);
	objLoader.load('blahaj.obj', (root) => {
		scene.add(root);
	});
});



window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height, false);
});



const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setSize(width, height, false);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(1);
renderer.shadowMap.type = THREE.NearestFilter;

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1, 0);



controls.update();
function animate(time) {
	//console.log(`camera-position: x:${camera.position.x.toFixed(3)}, y:${camera.position.y.toFixed(3)}, z:${camera.position.z.toFixed(3)}`);


	if (typeof cssRenderer !== 'undefined') cssRenderer.render(scene, camera);





	controls.update();
	renderer.render(scene, camera);
	// render CSS3D layer (DOM objects) on top of WebGL canvas

}