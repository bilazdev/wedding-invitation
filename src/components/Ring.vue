<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
    import * as THREE from 'three'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import gsap from 'gsap'
    import { ScrollTrigger } from 'gsap/ScrollTrigger'
    import { ElementInSection } from './page/element-in-section.ts'

    const props = defineProps({
      options: {
        type: Object, // A Vue ref object is passed down
        default: null
      }
    })

    const canvasContainer = ref(null)

    const start = (options) => {
        gsap.registerPlugin(ScrollTrigger)

        const firstStep = options.steps[0]
        const firstSection = firstStep.sectionElement;
        const firstElement = firstStep.element;



        let scene
        let camera
        let renderer
        let ring
        let animationFrame
        let scrollTrigger

        let cameraZ = 5;
        let threeHeight;
        let threeWidth;
        let maxDimension = 0

        const getViewportSize = () => ({
          width: firstSection.getBoundingClientRect().width,
          height: firstSection.getBoundingClientRect().height
        })


        const initThree = () => {
            //Scene
            scene = new THREE.Scene()
            scene.background = null

            //Camera
            const { width, height } = getViewportSize()

            camera = new THREE.OrthographicCamera(
              0,
              width,
              height,
              0,
              0.001,
              10000
            )
            camera.position.set(0, 0, 1000)
            camera.lookAt(0, 0, 0)

            // Renderer
            renderer = new THREE.WebGLRenderer({
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance'
            })
            renderer.setPixelRatio(
              Math.min(window.devicePixelRatio, 2)
            )
            renderer.setSize(width, height)
            renderer.setClearColor(0x000000, 0)
            renderer.outputColorSpace = THREE.SRGBColorSpace;

            renderer.outputColorSpace = THREE.SRGBColorSpace;      // default, keep it
            renderer.toneMapping = THREE.ACESFilmicToneMapping;    // natural highlight roll-off
            renderer.toneMappingExposure = 1.0;    

            canvasContainer.value.appendChild(
              renderer.domElement
            )

            // Light
            const ambientLight = new THREE.AmbientLight(
                0xffffff,
                0.5
            )
            scene.add(ambientLight)
            const keyLight = new THREE.DirectionalLight(
                0xffffff,
                2
            )


            keyLight.position.set(3, 5, 5)
            scene.add(keyLight)
            const fillLight = new THREE.DirectionalLight(
                0xffffff,
                0
            )

            fillLight.position.set(-4, 2, 3)
            scene.add(fillLight)

            const rimLight = new THREE.DirectionalLight(
                0xffffff,
                0
            )

            rimLight.position.set(0, -2, -5)
            scene.add(rimLight)

            // const key = new THREE.DirectionalLight(0xfff1dc, 2.0); key.position.set(3, 4, 5);
            // const fill = new THREE.DirectionalLight(0xdfe8ff, 0.6); fill.position.set(-4, 1, 2);
            // scene.add(key, fill);

            // const vFov = (camera.fov * Math.PI) / 180; // convert vertical FOV to radians
            // threeHeight = 2 * Math.tan(vFov / 2) * cameraZ; // visible height at distance
            // threeWidth = threeHeight * camera.aspect; // visible width at distance

            const loader = new GLTFLoader()
            
            loader.load(
                new URL(
                    options.model,
                    import.meta.url
                ).href,

                (gltf) => {
                    ring = gltf.scene

                    ring.traverse((child) => {
                      if (child.isMesh && child.material) {
                        child.material.metalness = 0; 
                      }
                    });

                    const box = new THREE.Box3().setFromObject(ring)

                    const size = box.getSize(
                      new THREE.Vector3()
                    )

                    maxDimension = Math.max(
                      size.x,
                      size.y,
                      size.z
                    )

                    // Desired ring size in pixels
                    const desiredSize = firstStep.getSize()

                    const scale =
                      desiredSize / maxDimension

                    ring.scale.setScalar(scale)


                    const firstElementPosition = firstStep.getCentroidPosition()

                    console.log({firstElementPosition})
                    ring.position.set(
                        firstElementPosition.x,
                        firstElementPosition.y,
                        0 
                    );
                    

                    scene.add(ring)
                    ring.rotation.set(
                        firstStep.rotation.x,
                        firstStep.rotation.y,
                        firstStep.rotation.z,
                    )

                    initScrollAnimation()
                },

                undefined,

                (error) => {
                    console.error(
                        'Failed to load gold_ring.glb:',
                        error
                    )
                }
            )
        }


        const initScrollAnimation = () => {
            if (!ring) return
            ScrollTrigger.normalizeScroll(true);

            options.steps.forEach((step, index) => {
                if(index == 0) return;
                const lastStep = options.steps[index - 1];

                scrollTrigger = ScrollTrigger.create({
                    trigger: step.sectionElement,

                    start: 'top bottom',
                    end: 'top',

                    scrub: 1,

                    onUpdate: (self) => {
                        const progress = self.progress

                        /*
                         * Rotate the ring based on scroll progress.
                         *
                         * 0      = 0°
                         * 0.25   = 180°
                         * 0.5    = 360°
                         * 1      = 720°
                         *
                         * Scrolling upward automatically reverses
                         * because progress decreases.
                         */

                        const lastPostion = lastStep.getCentroidPosition()
                        const newPosition = step.getCentroidPosition()
                        const movementVectorY = newPosition.y - lastPostion.y; 
                        const movementVectorX = newPosition.x - lastPostion.x; 
                        const movementVectorZ = newPosition.z - lastPostion.z; 

                        const lastRotation = lastStep.rotation;
                        const newRotation = step.rotation;
                        const rotationVectorY = newRotation.y - lastRotation.y;
                        const rotationVectorX = newRotation.x - lastRotation.x;
                        const rotationVectorZ = newRotation.z - lastRotation.z;


                        const oldScale = lastStep.getSize() / maxDimension;
                        const newScale = step.getSize() / maxDimension;
                        const scaleVector = newScale - oldScale;
                            

                         ring.rotation.y =
                             progress * rotationVectorY + lastRotation.y

                         ring.rotation.x =
                             progress *  rotationVectorX  + lastRotation.x

                         ring.rotation.z =
                             progress *  rotationVectorZ  + lastRotation.z

                         ring.position.y =
                             progress * movementVectorY + lastPostion.y

                         ring.position.x =
                             progress *  movementVectorX  + lastPostion.x

                         ring.position.z =
                             progress *  movementVectorZ  + lastPostion.z


                    ring.scale.setScalar(progress * scaleVector + oldScale)

                        // ring.scale.setScalar(progress * 0.015);

                        // const secondSectionTop = secondSection.value.getBoundingClientRect().top;
                        // const secondSectionHeight = secondSection.value.getBoundingClientRect().height;
                        // const secondNameTop = secondName.value.getBoundingClientRect().top;

                        // const secondNamePosition = (secondNameTop - secondSectionTop) / secondSectionHeight ;

                        // ring.position.y = -progress * (height / 2) * secondNamePosition

                        // console.log("secondNamePosition: ",secondNamePosition);
                        // console.log("height: ", height);

                        // const secondSectionLeft = secondSection.value.getBoundingClientRect().left;
                        // const secondSectionWidth = secondSection.value.getBoundingClientRect().width;
                        // const secondNameLeft = secondName.value.getBoundingClientRect().left;

                        // const secondNamePositionX = (secondNameLeft - secondSectionLeft) / secondSectionWidth ;

                        // ring.position.x = progress * (width / 2) * secondNamePositionX

                    }
                })
            })

        }



        const animate = () => {
            animationFrame = requestAnimationFrame(animate)

            renderer.render(
                scene,
                camera
            )
        }

        const handleResize = () => {
            if (!camera || !renderer) return

            camera.aspect =
                window.innerWidth /
                window.innerHeight

            camera.updateProjectionMatrix()

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            )
        }

        initThree()
        animate()

        window.addEventListener(
            'resize',
            handleResize
        )

        onBeforeUnmount(() => {
            window.removeEventListener(
                'resize',
                handleResize
            )

            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }

            if (scrollTrigger) {
                scrollTrispace-aroundgger.kill()
            }

            // Dispose Three.js resources
            if (scene) {
                scene.traverse((object) => {
                    if (object.geometry) {
                        object.geometry.dispose()
                    }

                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach((material) => {
                                material.dispose()
                            })
                        } else {
                            object.material.dispose()
                        }
                    }
                })
            }

            if (renderer) {
                renderer.dispose()

                if (
                    renderer.domElement &&
                    renderer.domElement.parentNode
                ) {
                    renderer.domElement.parentNode.removeChild(
                        renderer.domElement
                    )
                }
            }
        })
    }


    onMounted(() => {
        watch(() => props.options, (options) => {
          if (options) {
            console.log("STARTING............")
            start(options)
          }
        }, { immediate: true }) // Check immediately in case it's already mounted
    })

</script>

<template>
    <div ref="canvasContainer" class="ring-container"></div>
</template>

<style scoped>
    .ring-section {
        top: 0;
        width: 100%;
        height: 100vh;
        background: transparent;
    }

    .ring-container {
        z-index: 99999;
        position: fixed;
        top: 0;

        width: 100vw;
        height: 100vh;

        pointer-events: none;

        background: transparent;
    }

    .ring-container canvas {
        display: block;

        width: 100%;
        height: 100%;

        background: transparent;
    }
</style>



