import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertex from './shader/vertexShader.glsl'
import fragment from './shader/fragmentShader.glsl'

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
// ambient light
scene.add(new THREE.AmbientLight('blue', 0.1));
// directional light
var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(100, 100, -20);
scene.add(light);


/* -------------------------------------------------------------------------- */
/*                                    mesh                                    */
/* -------------------------------------------------------------------------- */

const planeGeometry = new THREE.PlaneGeometry(10, 10, 1500,1500);
const planeMaterial = new THREE.ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
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
 scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
 scene.add(axesHelper);



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
const clock = new THREE.Clock();
const animate = function() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    planeMaterial.uniforms.uTime.value = clock.getElapsedTime();
};
animate();