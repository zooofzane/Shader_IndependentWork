import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Model from './model';
// import marchingcubes from './cubes';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
// import { Int8Attribute } from 'three';
// let camera, scene, renderer, composer;
// let glitchPass;
let effect;
let effectSobel;

const params = {
    enable: true
};
/*------------------------------
Renderer
------------------------------*/
function Element(id, x, y, z, ry) {

    const div = document.createElement('div');
    div.style.width = '60px';
    div.style.height = '45px';
    div.style.backgroundColor = '#000';

    const iframe = document.createElement('iframe');
    iframe.style.width = '60px';
    iframe.style.height = '45px';
    iframe.style.border = '0px';
    iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('');
    div.appendChild(iframe);

    const object = new CSS3DObject(div);
    object.position.set(x, y, z);
    object.rotation.y = ry;

    return object;

};

const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas
});


renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);


const renderer2 = new CSS3DRenderer();
renderer2.setSize(window.innerWidth, window.innerHeight);
// container.appendChild(renderer2.domElement);

/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 1, 1000);
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.z = 5;
camera.position.y = 1;


/*------------------------------
Mesh
------------------------------*/
// const geometry = new THREE.BoxGeometry(2, 2, 2);
// const material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00,
// });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);


/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls(camera, canvas);
// const controls2 = new OrbitControls(camera, renderer2.domElement);
// const controlss = new TrackballControls(camera, renderer2.domElement);
// controlss.rotateSpeed = 4;
// controls.enableDamping = true;
// controls.minDistance = 10;
// 			controls.maxDistance = 100;


/*------------------------------
Helpers
------------------------------*/
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

let pointLight;

pointLight = new THREE.PointLight(0x333333);
pointLight.position.set(100, 100, 100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xbbbbbb);
pointLight.position.set(100, 100, -100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0x222222);
pointLight.position.set(100, -100, 100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0x666666);
pointLight.position.set(100, -100, -100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xcccccc);
pointLight.position.set(-100, 100, 100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xcccccc);
pointLight.position.set(-100, -100, 100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xbbbbbb);
pointLight.position.set(-100, -100, -100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xcccccc);
pointLight.position.set(-100, 100, -100);
scene.add(pointLight);


function marchingcubes() {
    /////////////////////////////////////////////////
    /**
     * Geometry part 3
     */
    let resolution = 20;

    effect = new MarchingCubes(resolution, new THREE.MeshLambertMaterial({ color: 0xf8f8f8 }), true, true);
    effect.position.set(0, 0, 0);
    effect.scale.set(2, 2, 2);
    effect.isolation = 100;
    // effect.size = 40;
    effect.enableUvs = false;
    effect.enableColors = false;
    scene.add(effect);
}
marchingcubes();


// 
// 
// text
// 
// 
const textloader = new THREE.FontLoader();
textloader.load('./static/font/DINCond-Black.otf', function(font) {

    const textgeometry = new THREE.TextGeometry('Hello three.js!', {
        font: font,
        size: 0.2,
        height: 0.05,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 5,
    });

    textgeometry.rotateX(Math.PI);

    const textmaterial = new THREE.MeshStandardMaterial({
        color: 0x99ffff
    });

    const objectToCurve = new THREE.Mesh(textgeometry, textmaterial);

    flow = new Flow(objectToCurve);
    flow.updateCurve(0, curve);
    scene.add(flow.object3D);

});





// 
// 
// 
// MarchingCubes
// 
// 
// 
const numball = 6;

function updateCubes(object, time) {

    object.reset();

    // fill the field with some metaballs
    const subtract = 5;
    const strength = 1.2 / ((Math.sqrt(numball) - 1) / 3 + 1);

    for (let i = 0; i < numball; i++) {

        const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
        const bally = Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i)) * 0.3 + .5; // dip into the floor
        const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;

        object.addBall(ballx, bally, ballz, strength * Math.abs(Math.sin(time * .5 + i * 2)) + .2, subtract);
        // object.addBall(0.5, 0.5, 0.5, strength, 4 * bianliang);

        // object.addBall(0.5, 0.5, 0.5, strength, 4);
    }
}





/*------------------------------
models
------------------------------*/
const head = new Model({
    name: 'head',
    file: './model/head2.glb',
    scene: scene,
    placeOnLoad: true
})
const sheep = new Model({
    name: 'sheep',
    file: './model/sheep2.glb',
    scene: scene
})

/*------------------------------
controllers
------------------------------*/
const buttons = document.querySelectorAll('.button')
buttons[0].addEventListener('click', () => {
    head.addnoise()
    sheep.remove()
})
buttons[1].addEventListener('click', () => {
    head.remove()
    sheep.add()
})




const group = new THREE.Group();
group.add(new Element('SJOz3qjfQXU', 0, 0, 120, 0));
group.add(new Element('Y2-xZ-1HE-Q', 120, 0, 0, Math.PI / 2));
group.add(new Element('IrydklNpcFI', 0, 0, -120, Math.PI));
group.add(new Element('9ubytEsCaS0', -120, 0, 0, -Math.PI / 2));
scene.add(group);

// Block iframe events when dragging camera

const blocker = document.getElementById('blocker');
blocker.style.display = 'none';

controls.addEventListener('start', function() {

    blocker.style.display = '';

});
controls.addEventListener('end', function() {

    blocker.style.display = 'none';

});

// controlss.addEventListener('start', function() {

//     blocker.style.display = '';

// });
// controlss.addEventListener('end', function() {

//     blocker.style.display = 'none';

// });



/**
 * Animate
 */



// const elapsedTime = clock.getElapsedTime()

// updata material
// material.uniforms.uTime.value = elapsedTime

// Update controls
// controls.update()

// Call tick again on the next frame
// window.requestAnimationFrame(tick)





/*------------------------------
Resize
------------------------------*/
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const glitchPass = new GlitchPass();
composer.addPass(glitchPass);

const effectGrayScale = new ShaderPass(LuminosityShader);
composer.addPass(effectGrayScale);

// Sobel operator     

effectSobel = new ShaderPass(SobelOperatorShader);
effectSobel.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio;
effectSobel.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio;
composer.addPass(effectSobel);



window.addEventListener('resize', onWindowResize, false);



/*------------------------------
Loop
------------------------------*/
const clock = new THREE.Clock()

const animate = function() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // renderer2.render(scene, camera);
    updateCubes(effect, clock.getElapsedTime(), numball);
    if (head.isActive) {
        head.pmaterial.uniforms.uTime.value = clock.getElapsedTime()
        head.pmaterial.uniforms.uNoise.value = Math.sin(clock.getElapsedTime() * .1)
        composer.render();
        head.pmaterial.uniforms.ustate.value = 0
        let e = Math.min(Math.random() + Math.random() + Math.random())

        if (e < .5) {
            sheep.show()
                // sheep.isActive = false
        } else {
            sheep.no()
                // sheep.isActive = true
        }
    }
    if (sheep.isActive) {
        sheep.pmaterial.uniforms.ustate.value = 1

        sheep.pmaterial.uniforms.uTime.value = clock.getElapsedTime()
    }



};
animate();