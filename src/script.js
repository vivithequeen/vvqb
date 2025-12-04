import * as THREE from '../three/build/three.module.js';
// Use the ESM build of tween.js (CDN) so this module can import it reliably
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js';
import { OBJLoader } from '../three/examples/jsm/loaders/OBJLoader.js';
import { CSS3DObject, CSS3DRenderer } from '../three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from '../three/examples/jsm/loaders/MTLLoader.js';


const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera(75, width / height, 0.0001, 1000);





const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFF5F2);

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();
// make sure loader resolves texture names from public root
mtlLoader.setResourcePath('/');

let x_blahaj = 7;
let y_blahaj = 7;
const meow = [];

let cachedRoot = null; // single loaded root (with materials/textures) we'll clone

const textureLoader = new THREE.TextureLoader();

function preloadTexturesFromMaterialCreator(mtl) {
	// extract texture filenames from the parsed materialsInfo and preload them
	const urls = new Set();
	try {
		for (const matName in mtl.materialsInfo) {
			const mat = mtl.materialsInfo[matName];
			for (const prop in mat) {
				// common texture properties in MTL parsing
				if (prop.startsWith('map_') || prop.includes('bump') || prop.includes('norm') || prop.includes('disp')) {
					const val = mat[prop];
					if (typeof val === 'string' && val.trim()) {
						// MaterialCreator.getTextureParams will parse modifiers and give url
						let params = null;
						if (typeof mtl.getTextureParams === 'function') params = mtl.getTextureParams(val);
						const url = params && params.url ? (mtl.baseUrl || '') + params.url : (mtl.baseUrl || '') + val;
						if (url) urls.add(url);
					}
				}
			}
		}
	} catch (e) {
		console.warn('preload parsing failed', e);
	}

	const loads = [...urls].map(url => {
		return new Promise((resolve, reject) => {
			textureLoader.load(url, () => resolve(url), undefined, (err) => {
				console.warn('Texture preload failed for', url, err);
				// resolve anyway so missing textures don't block grid creation
				resolve(url);
			});
		});
	});

	return Promise.all(loads);
}

function createGridFromRoot(root, cols, rows) {
	// remove previous instances (don't touch lights/UI)
	meow.forEach(m => scene.remove(m));
	meow.length = 0;

	const spacingX = window.innerWidth / (71 * cols);
	const spacingY = window.innerHeight / (71 * rows);

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			const clone = root.clone(true);
			const posX = (i - (cols - 1) / 2) * spacingX;
			const posY = ((rows - 1) / 2 - j) * spacingY;
			clone.position.set(posX, posY, 0);
			clone.rotation.set(0, Math.PI, 0);
			meow.push(clone);
			scene.add(clone);
		}
	}
}

// Load MTL/OBJ once, preload textures first, then cache root and spawn initial grid
mtlLoader.load('/blahaj.mtl', (mtl) => {
	// the mtl here is a MaterialCreator instance
	mtl.preload();
	// make sure textures referenced by the mtl are loaded before loading the OBJ
	preloadTexturesFromMaterialCreator(mtl).then(() => {
		objLoader.setMaterials(mtl);
		objLoader.load('/blahaj.obj', (root) => {
			cachedRoot = root;
			// center/root orientation
			cachedRoot.position.set(0, 0, 0);
			cachedRoot.rotation.set(0, Math.PI, 0);
			createGridFromRoot(cachedRoot, x_blahaj, y_blahaj);
		}, undefined, (err) => console.error('OBJ load error:', err));
	});
}, undefined, (err) => console.error('MTL load error:', err));





window.addEventListener('resize', () => {
	const w = window.innerWidth, h = window.innerHeight;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h, false);
	if (typeof cssRenderer !== 'undefined') cssRenderer.setSize(w, h);
});



const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, alpha : true, antialias: false });
renderer.setSize(width, height, false);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(1);
renderer.shadowMap.type = THREE.NearestFilter;
renderer.setClearColor(0x000000, 0);
camera.position.set(0, 0, 10);


const shark_bar = document.getElementById('shark_bar');

shark_bar.addEventListener('input', function () {
	x_blahaj = this.value;
	y_blahaj = this.value;
	meowwww();
})

console.log(meow);
function meowwww() {
	// remove only previously added models and reuse cachedRoot if available
	meow.forEach(m => scene.remove(m));
	meow.length = 0;

	if (cachedRoot) {
		createGridFromRoot(cachedRoot, x_blahaj, y_blahaj);
		return;
	}

	// fallback: load MTL/OBJ once, preload textures then cache & spawn grid
	mtlLoader.load('/blahaj.mtl', (mtl) => {
		mtl.preload();
		preloadTexturesFromMaterialCreator(mtl).then(() => {
			objLoader.setMaterials(mtl);
			objLoader.load('/blahaj.obj', (root) => {
				cachedRoot = root;
				cachedRoot.position.set(0, 0, 0);
				cachedRoot.rotation.set(0, Math.PI, 0);
				createGridFromRoot(cachedRoot, x_blahaj, y_blahaj);
			}, undefined, (err) => console.error('OBJ load error (meowwww fallback):', err));
		});
	}, undefined, (err) => console.error('MTL load error (meowwww fallback):', err));
}
function animate(time) {
	console.log(`camera-position: x:${camera.position.x.toFixed(3)}, y:${camera.position.y.toFixed(3)}, z:${camera.position.z.toFixed(3)}`);


	if (typeof cssRenderer !== 'undefined') cssRenderer.render(scene, camera);

	meow.forEach((m, index) => {
		// rotate each model with a time-based, nicely scaled value
		// `time` is in milliseconds so scale it down
		m.rotation.x = time / 2000 + index * 0.05;
		m.rotation.y = time / 1000 + index * 0.03;
		m.rotation.z = time / 1500 + index * 0.02;
	});




	renderer.render(scene, camera);
	// render CSS3D layer (DOM objects) on top of WebGL canvas

}