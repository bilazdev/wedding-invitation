<template src="./Page.template.html"></template>
<style scoped src="./Page.styles.css"></style>
<script setup >
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ElementInSection } from './element-in-section.ts'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const secondElement = ref(null)
const secondSection = ref(null)
const firstSection = ref(null)
const firstElement = ref(null)
const header = ref(null)
const canvasContainer = ref(null)

let scene
let camera
let renderer
let ring
let animationFrame
let scrollTrigger

let cameraZ = 5;
let threeHeight;
let threeWidth;

const getViewportSize = () => ({
  width: firstSection.value.getBoundingClientRect().width,
  height: firstSection.value.getBoundingClientRect().height
})


const initThree = () => {
    scene = new THREE.Scene()
    scene.background = null

    // const aspect = window.innerWidth / window.innerHeight

    const { width, height } = getViewportSize()

    camera = new THREE.OrthographicCamera(
      0,
      width,
      height,
      0,
      0.1,
      1000
    )
    camera.position.set(0, 0, 10)

    camera.position.z = 10
    camera.lookAt(0, 0, 0)


     camera.position.set(0, 0, 10)

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

      canvasContainer.value.appendChild(
        renderer.domElement
      )
    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        2
    )

    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(
        0xffffff,
        4
    )

    keyLight.position.set(3, 5, 5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(
        0xffffff,
        2
    )

    fillLight.position.set(-4, 2, 3)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(
        0xffffff,
        3
    )

    rimLight.position.set(0, -2, -5)
    scene.add(rimLight)

    const vFov = (camera.fov * Math.PI) / 180; // convert vertical FOV to radians
    threeHeight = 2 * Math.tan(vFov / 2) * cameraZ; // visible height at distance
    threeWidth = threeHeight * camera.aspect; // visible width at distance

    const loader = new GLTFLoader()

    loader.load(
        new URL(
            '../../assets/gold_ring.glb',
            import.meta.url
        ).href,

        (gltf) => {
            ring = gltf.scene

            const box = new THREE.Box3().setFromObject(ring)

            const size = box.getSize(
              new THREE.Vector3()
            )

            const maxDimension = Math.max(
              size.x,
              size.y,
              size.z
            )

            // Desired ring size in pixels
            const desiredSize = 100

            const scale =
              desiredSize / maxDimension

            ring.scale.setScalar(scale)


            ring.position.set(0, 0, 0);
            ring.position.set(
              width / 2,
              height / 2,
              0
            )
            ring.position.x = width / 2
            ring.position.y = height / 2

            const firstElementPosition = new ElementInSection(firstElement.value, firstSection.value)
                .getElementThreeJsPointAtCenter(threeWidth, threeHeight)

            console.log({firstElementPosition})

            ring.position.set(firstElementPosition.x, firstElementPosition.y, 0);
            

            scene.add(ring)
            ring.rotation.set(
                Math.PI / 2,
                0,
                0
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
    //ScrollTrigger.config({ ignoreMobileResize: true });




    scrollTrigger = ScrollTrigger.create({
        trigger: header.value,

        start: 'top bottom',
        end: 'bottom',

        scrub: true,

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

             // ring.rotation.y =
             //     progress * Math.PI * 4

             // ring.rotation.x =
             //     progress * Math.PI * 0.5

            // ring.position.y = 
            //      progress * -1.3;

            // ring.position.x = 
            //      progress * 0.2;

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

onMounted(() => {
    initThree()
    animate()

    window.addEventListener(
        'resize',
        handleResize
    )
})

onBeforeUnmount(() => {
    window.removeEventListener(
        'resize',
        handleResize
    )

    if (animationFrame) {
        cancelAnimationFrame(animationFrame)
    }

    if (scrollTrigger) {
        scrollTrigger.kill()
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
</script>
