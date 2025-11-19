import * as THREE from './node_modules/three/build/three.module.js';

const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 0.4, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();
material.magFilter = THREE.NearestFilter;
material.minFilter = THREE.NearestFilter;

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer( { canvas, antialias: false } );
renderer.setSize( width, height, false );
renderer.setAnimationLoop( animate );
renderer.setPixelRatio(1);
renderer.shadowMap.type = THREE.NearestFilter;

// animation

function animate( time ) {
	console.log("meowwww");
	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}