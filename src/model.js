import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import vertex from './shader/vertexShader.glsl'
import fragment from './shader/fragmentShader.glsl'




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

            /**
             * particlesmaterial mesh
             */
            // this.pmaterial = new THREE.PointsMaterial({
            //     color: 'white',
            //     size: .02
            // })

            this.pmaterial = new THREE.ShaderMaterial({
                depthWrite: false,
                depthTest: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    uTime: { value: 0 },
                    uSize: { value: 0 },
                    uNoise: { value: 0 },
                    ustate: { value: 0 },
                }

                // transparent: true
            })


            /**
             * particles geometry
             */
            const sampler = new MeshSurfaceSampler(this.mesh).build()
            const numParticles = 30000
            this.particlesGeometry = new THREE.BufferGeometry()
            const particlesPosition = new Float32Array(numParticles * 3)
            const particlesRandomness = new Float32Array(numParticles * 3)
            for (let i = 0; i < numParticles; i++) {
                const newPosition = new THREE.Vector3()
                sampler.sample(newPosition)
                particlesPosition.set([
                    newPosition.x,
                    newPosition.y,
                    newPosition.z
                ], i * 3)
                particlesRandomness.set([Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                ], i * 3)
            }

            this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))
            this.particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(particlesRandomness, 3))
                // console.log

            /**
             * particles
             */
            // this.particles = new THREE.Points(this.geometry, this.pmaterial)
            this.particles = new THREE.Points(this.particlesGeometry, this.pmaterial)

            // place on load
            if (this.placeOnLoad) {
                this.add()
            }
        })




    }

    add() {
        this.scene.add(this.particles)
        this.isActive = true
        this.pmaterial.uniforms.ustate.value = 1
        gsap.to(this.pmaterial.uniforms.uSize, {
            value: 1,
            delay: .6
        })
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

    remove() {
        gsap.to(this.pmaterial.uniforms.uSize, {
            value: 0,
            onComplete: () => {
                this.pmaterial.uniforms.ustate.value = 1
                this.scene.remove(this.particles)
                this.isActive = false
            },
            // delay: .6
        })
    }
}
export default Model