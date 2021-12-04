//importing libraries
import * as THREE from 'three';
//note how OrbitControls is imported seperately
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

// import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'




class Model {
    constructor(obj) {
        // console.log(obj)
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad

        this.isActive = false
this.loader = new OBJLoader()
        // this.loader = new GLTFLoader()
        // this.dracoLoader = new DRACOLoader()
        // this.dracoLoader.setDecoderPath('./draco/')
        // this.loader.setDRACOLoader(this.dracoLoader)

        this.init()
    }

    init() {
        this.loader.load(this.file, (response) => {
            console.log(response)

            /**
             original mesh
             */
            // this.mesh = response.scene.children[0]


            /**
             * material mesh
             */
            this.material = new THREE.MeshBasicMaterial({
                color: 'white',
                wireframe: true
            })
            this.mesh.material = this.material
            /**
             * geometry mesh
             */
            this.geometry = this.mesh.geometry

            // place on load
            this.add()
        })
    }

    add() {
        this.scene.add(this.mesh)
    }
}


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
const sheep = new Model({
    name: 'sheep',
    file: './static/model/SHEEP.OBJ',
    scene: scene
})


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
