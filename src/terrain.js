import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import vertex from './shader/vertexShader.glsl'
import fragment from './shader/fragmentShader.glsl'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import * as dat from 'dat.gui'


// var typeface = require('three.regular.helvetiker');
// THREE.typeface_js.loadFace(typeface);

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


/* -------------------------------------------------------------------------- */
/*                               scene & camera                               */
/* -------------------------------------------------------------------------- */
const scene = new THREE.Scene();
const bgColor = new THREE.Color("black");
//0xefd1b5
scene.background = bgColor;
scene.fog = new THREE.Fog(bgColor, 1., 2000.);
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;
camera.position.y = 1;


/* -------------------------------------------------------------------------- */
/*                                     gui                                    */
/* -------------------------------------------------------------------------- */
// const gui = new dat.GUI();
// gui.add(material.uniforms.uFrequency, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)





/* -------------------------------------------------------------------------- */
/*                                    text                                    */
/* -------------------------------------------------------------------------- */

let fontLoader = new FontLoader();
// fontLoader.load("./DINPro-Regular_Regular.typeface.json",function(tex){
// fontLoader.load("three/examples/fonts/helvetiker_regular.typeface.json",function(tex){
fontLoader.load("https://threejs.org//examples/fonts/helvetiker_regular.typeface.json", function (tex) {
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
//scene.add(dirLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 100, 90);
//scene.add(pointLight);



/* -------------------------------------------------------------------------- */
/*                                    mesh                                    */
/* -------------------------------------------------------------------------- */
//terrain
const planeGeometry = new THREE.PlaneGeometry(20, 20, 1500, 1500);
var planeMaterial = new THREE.ShaderMaterial({
    //    depthWrite: false,
    //    depthTest: false,
    // blending: THREE.AdditiveBlending,
    transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        uTime: {
            value: 0
        },
        uNoise: {
            value: 0
        },
        fogColor: {
            type: "c",
            value: scene.fog.color
        },
        fogNear: {
            type: "f",
            value: scene.fog.near
        },
        fogFar: {
            type: "f",
            value: scene.fog.far
        },
        uHeight: {
            value: 3.1
        }
    },
    fog: true,
});


const terrainMesh = new THREE.Mesh(planeGeometry, planeMaterial);
terrainMesh.rotation.x = -Math.PI / 2;
scene.add(terrainMesh);



let sunGeometry = new THREE.PlaneGeometry(50, 50);
let sunMaterial = new THREE.ShaderMaterial({
    vertexShader: `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float rotation = 0.0;
    vec3 scale = vec3(1., 1., 1.);
  
    vec3 alignedPosition = position * scale;
    vec2 pos = alignedPosition.xy;
  
    vec2 rotatedPosition;
    rotatedPosition.x = cos(rotation) * alignedPosition.x - sin(rotation) * alignedPosition.y;
    rotatedPosition.y = sin(rotation) * alignedPosition.x + cos(rotation) * alignedPosition.y;
  
    vec4 finalPosition;
  
    finalPosition = modelViewMatrix * vec4(1.0, 0.0, 0.0, 1.0);
    finalPosition.xy += rotatedPosition;
    finalPosition = projectionMatrix * finalPosition;
  
    gl_Position = finalPosition;
  }`,
    fragmentShader: `
  varying vec2 vUv;
  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}
  float circleSDF(vec2 st) {
    return length(st - 0.5) * 2.; // map (-0.5,0.5) to (-1,1)
}
  void main() {
      vec3 col = vec3(0.);

      vec3 brightness = vec3(0.749, 0.3333, 0.8314);
      vec3 contrast = vec3(0.1804, 0.1804, 0.1804);
      vec3 osc = vec3(2.2);
      
      //very great pink and orange
      vec3 phase = vec3(0.7922, 0.7608, 0.3059);
  
      col += cosPalette(vUv.y * 0.3, brightness, contrast, osc, phase);

      float circle = 1.-circleSDF(vUv);
      gl_FragColor = mix(vec4(0.), vec4(col,1.0), smoothstep(0.,0.0,circle));

  }
  `,
    transparent: true,
    // blending:THREE.AdditiveBlending,
    uniforms: {
        uTime: {
            value: 0
        },
    }
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.z = -90;
scene.add(sun);




/* -------------------------------------------------------------------------- */
/*                              [camera controler]                              */
/* -------------------------------------------------------------------------- */
const controls = new OrbitControls(camera, renderer.domElement);



/* -------------------------------------------------------------------------- */
/*                                   guides                                   */
/* -------------------------------------------------------------------------- */
const gridHelper = new THREE.GridHelper(10, 10);
//scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
//scene.add(axesHelper);



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
/*                                    GUI                                    */
/* -------------------------------------------------------------------------- */


const gui = new GUI(),
    propsLocal = {
        get height() {

            return planeMaterial.uniforms.uHeight.value;

        },
        set height(v) {

            planeMaterial.uniforms.uHeight.value = v;

        }
    };


const Terrain = gui.addFolder('Terrain');
const texture = gui.addFolder('Texture');
const colorPattern = gui.addFolder('ColorPattern');
Terrain.add(propsLocal, 'height', 0., 10.);

// gui.add( params, 'colorMap', [ 'rainbow', 'cooltowarm', 'blackbody', 'grayscale' ] ).onChange( function () {

//     updateColors();
//     render();

// } );
/* -------------------------------------------------------------------------- */
/*                                    loop                                    */
/* -------------------------------------------------------------------------- */
const clock = new THREE.Clock();
const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    planeMaterial.uniforms.uTime.value = clock.getElapsedTime();
};
animate();