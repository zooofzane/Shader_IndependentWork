import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
// import vertex from './shader/vertexShader.glsl'
// import fragment from './shader/fragmentShader.glsl'




class Model {
    constructor(obj) {
        // console.log(obj)
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad

        this.isActive = false

        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')
        this.loader.setDRACOLoader(this.dracoLoader)

        this.init()
    }

    init() {
        this.loader.load(this.file, (response) => {
            // console.log(response)

            /**
             original mesh
             */
            this.mesh = response.scene.children[0]

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

    addnoise() {
        this.scene.add(this.particles)
        this.isActive = true
        this.pmaterial.uniforms.ustate.value = 0
        gsap.to(this.pmaterial.uniforms.uSize, {
            value: 1,
            delay: .6
        })

    }


    show() {
        this.scene.add(this.particles)
        this.isActive = true
        this.pmaterial.uniforms.uSize.value = 1
        this.pmaterial.uniforms.ustate.value = 1
    }

    no() {
        this.scene.add(this.particles)
        this.isActive = true
        this.pmaterial.uniforms.uSize.value = 0
        this.pmaterial.uniforms.ustate.value = 1
    }
}
export default Model