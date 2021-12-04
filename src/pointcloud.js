import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Model from './modelload.js'

/* -------------------------------------------------------------------------- */
/*                                  renderer                                  */
/* -------------------------------------------------------------------------- */
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


/* -------------------------------------------------------------------------- */
/*                               scene & camera                               */
/* -------------------------------------------------------------------------- */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.z = 5;
camera.position.y = 1;


/* -------------------------------------------------------------------------- */
/*                                    mesh                                    */
/* -------------------------------------------------------------------------- */

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
});
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);


/* -------------------------------------------------------------------------- */
/*                              [camera controler]                              */
/* -------------------------------------------------------------------------- */
const controls = new OrbitControls(camera, renderer.domElement);



/* -------------------------------------------------------------------------- */
/*                                   guides                                   */
/* -------------------------------------------------------------------------- */
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


/* -------------------------------------------------------------------------- */
/*                                   models                                   */
/* -------------------------------------------------------------------------- */
// const head = new Model({
//     name: 'head',
//     file: './model/head2.glb',
//     scene: scene,
//     placeOnLoad: true
// })
const sheep = new Model({
    name: 'sheep',
    // file: './model/d8e2bb15-02ec-4b27-81da-c3803d3b1a75_sheep2.glb',
    file:'https://cdn.glitch.me/d8e2bb15-02ec-4b27-81da-c3803d3b1a75%2Fsheep2.glb?v=1637644709388',
   
    // /Users/zane/Desktop/workshop point cloud/static/model/
    scene: scene
})


// const group = new THREE.Group();
// group.add(new Element('SJOz3qjfQXU', 0, 0, 120, 0));
// group.add(new Element('Y2-xZ-1HE-Q', 120, 0, 0, Math.PI / 2));
// group.add(new Element('IrydklNpcFI', 0, 0, -120, Math.PI));
// group.add(new Element('9ubytEsCaS0', -120, 0, 0, -Math.PI / 2));
// scene.add(group);

// Block iframe events when dragging camera

const blocker = document.getElementById('blocker');
blocker.style.display = 'none';

controls.addEventListener('start', function() {

    blocker.style.display = '';

});
controls.addEventListener('end', function() {

    blocker.style.display = 'none';

});


/* -------------------------------------------------------------------------- */
/*                                [window resize]                               */
/* -------------------------------------------------------------------------- */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);


/* -------------------------------------------------------------------------- */
/*                                    loop                                    */
/* -------------------------------------------------------------------------- */
const animate = function() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();