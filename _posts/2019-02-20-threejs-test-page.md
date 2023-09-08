---
layout: default
title: three.js test page
tags: 3d
icon: tree.png
---
<html>
<script src="/assets/js/three.js"></script>
<script src="/assets/js/OrbitControls.js"></script>
<script src="/assets/js/GLTFLoader.js"></script>
<div class="display"></div>
<script>
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
var controls = new THREE.OrbitControls( camera );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 20, 10, 30 );
controls.update();

function animate() {
    requestAnimationFrame( animate );
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render( scene, camera );
}

var display = document.getElementsByClassName("display")[0]
display.appendChild( renderer.domElement );
renderer.domElement.style.width  = "600px"
renderer.domElement.style.height = "400px"

var loader = new THREE.GLTFLoader();
loader.load(
   "/3d/lowpoly_island.glb",
   function ( gltf ) {
        console.log(gltf)
        gltf.scene.traverse(function ( node ) {
  	        if ( node.isMesh ) node.material.side = THREE.DoubleSide;
        });
       scene.add(gltf.scene)
   },
);

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xfffeff, 1 );
scene.add( directionalLight );

animate()
</script>
</html>