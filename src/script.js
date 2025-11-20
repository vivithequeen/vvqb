import * as THREE from '../three/build/three.module.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(0.4, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();
material.magFilter = THREE.NearestFilter;
material.minFilter = THREE.NearestFilter;

const mesh = new THREE.Mesh(geometry, material);
// move debug cube away so it doesn't overlap the loaded model
mesh.position.set(-2, 0, 0);

const loader = new GLTFLoader();

loader.load('monkey.glb', function (gltf) {
	console.log('GLTF loaded:', gltf);

	// Replace materials on all meshes in the glTF so they don't use unexpected textures/shaders
	gltf.scene.traverse(function (obj) {
		if (obj.isMesh) {
			obj.material = new THREE.MeshNormalMaterial();
			obj.material.needsUpdate = true;
			// ensure geometry bounding info is available
			if (obj.geometry && obj.geometry.computeBoundingBox) obj.geometry.computeBoundingBox();
		}
	});

	scene.add(gltf.scene);

	// Fit camera to the loaded model
	const box = new THREE.Box3().setFromObject(gltf.scene);
	const size = box.getSize(new THREE.Vector3());
	const center = box.getCenter(new THREE.Vector3());
	const maxDim = Math.max(size.x, size.y, size.z);
	if (maxDim > 0) {
		const fov = camera.fov * (Math.PI / 180);
		let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
		cameraZ *= 1.5; // add some padding
		camera.position.set(center.x, center.y, center.z + cameraZ);
		camera.lookAt(center);
		camera.updateProjectionMatrix();
	}

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

// animation

scene.traverse(function(object) {
  if (object.isMesh) {
    // You can also print specific properties of the mesh, for example:
    console.log("Mesh Name:", object.name);
    // console.log("Mesh Position:", object.position);
    // console.log("Mesh Geometry:", object.geometry);
    //console.log("Mesh Material:", object.material);
  }
});
function animate(time) {
	console.log("meowwww");
	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render(scene, camera);

}