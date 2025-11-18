import * as THREE from './node_modules/three/build/three.module.js';

const width = window.innerWidth/4, height = window.innerHeight/4;

// init

const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// animation

function animate( time ) {
	console.log("meowwww");
	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}