import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import {
    TextGeometry
} from 'three/examples/jsm/geometries/TextGeometry.js'
import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'

// var typeface = require('three.regular.helvetiker');
// THREE.typeface_js.loadFace(typeface);

// import vertex from './shader/vertexShader.glsl'
// import fragment from './shader/fragmentShader.glsl'
// import Text from './text.js'

/* -------------------------------------------------------------------------- */
/*                                  renderer                                  */
/* -------------------------------------------------------------------------- */
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// console.log(Text);

// console.log(111);

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
/*                                    text                                    */
/* -------------------------------------------------------------------------- */

let fontLoader = new FontLoader();
// fontLoader.load("./DINPro-Regular_Regular.typeface.json",function(tex){
    // fontLoader.load("three/examples/fonts/helvetiker_regular.typeface.json",function(tex){
    fontLoader.load("https://threejs.org//examples/fonts/helvetiker_regular.typeface.json",function(tex){
    // fontLoader.load("three.regular.helvetiker/index.js",function(tex){
// fontLoader.load("./helvetiker_regular.typeface.json", function (tex) {
    let textGeo = new TextGeometry('Test', {
        size: .1,
        height: .1,
        curveSegments: 6,
        font: "helvetiker",
        font: tex,
        // font: "DINPro-Regular",
        // style: "normal"
    });
    let color = new THREE.Color();
    color.setRGB(255, 250, 250);
    let textMaterial = new THREE.MeshBasicMaterial({
        color: color
    });
    let text = new THREE.Mesh(textGeo, textMaterial);
    scene.add(text);
});



/* -------------------------------------------------------------------------- */
/*                                    light                                   */
/* -------------------------------------------------------------------------- */
const dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
dirLight.position.set(0, 0, 1).normalize();
scene.add(dirLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 100, 90);
scene.add(pointLight);



/* -------------------------------------------------------------------------- */
/*                                    mesh                                    */
/* -------------------------------------------------------------------------- */

const planeGeometry = new THREE.PlaneGeometry(10, 10, 1500,1500);
const planeMaterial = new THREE.ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
  //  blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        uTime: { value: 0 },
        uNoise: { value: 0 },
        // wPlane: {},
        // hPlane: {},
    }
});
console.log(planeGeometry);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);


/* -------------------------------------------------------------------------- */
/*                              [camera controler]                              */
/* -------------------------------------------------------------------------- */
const controls = new OrbitControls(camera, renderer.domElement);



/* -------------------------------------------------------------------------- */
/*                                   guides                                   */
/* -------------------------------------------------------------------------- */
const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);



const blocker = document.getElementById('blocker');
blocker.style.display = 'none';

controls.addEventListener('start', function () {

    blocker.style.display = '';

});
controls.addEventListener('end', function () {

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
const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();