<script setup >
    import Ring from "../Ring.vue";
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import { Step } from '../../models/step.ts';
    import { Vector3 } from 'three';
    import gsap from 'gsap'
    import { ScrollTrigger } from 'gsap/ScrollTrigger'
    import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
    import { Observer } from 'gsap/Observer'

    const firstElement = ref(null);
    const firstSilverElement = ref(null);
    const firstSection = ref(null);

    const secondGoldenElement = ref(null);
    const secondSilverElement = ref(null);
    const secondElement = ref(null);
    const secondSection = ref(null);

    const thirdGoldenElement = ref(null);
    const thirdSilverElement = ref(null);
    const thirdSection = ref(null);

    const fourthGoldenElement = ref(null);
    const fourthSilverElement = ref(null);
    const fourthElement = ref(null);
    const fourthSection = ref(null);

    const fifthElement = ref(null);
    const fifthSection = ref(null);
    
    const goldenRingOptions = ref(null);
    const silverRingOptions = ref(null);

    onMounted(() => {
        console.log("MOUNTED......");
        goldenRingOptions.value = 
            {
                model: "../assets/gold_ring.glb",
                steps: [
                    new Step(
                        firstElement,
                        firstSection,
                        new Vector3(0, 0, 1),
                        new Vector3(0, 0, 0),
                        0.5
                    ),
                    new Step(
                        secondGoldenElement,
                        secondSection,
                        new Vector3(-0.36, 0, 0),
                        new Vector3(
                            Math.PI/2.5, Math.PI/6, -Math.PI/3 
                        ),
                        0.2
                    ),
                    new Step(
                        thirdGoldenElement,
                        thirdSection,
                        new Vector3(0, 0, 0),
                        new Vector3(
                            0, 4 * Math.PI, 0
                        ),
                        1.3
                    ), 
                    new Step(
                        fourthElement,
                        fourthSection,
                        new Vector3(0, 0, 0),
                        new Vector3(
                            4 * Math.PI, 4 * Math.PI, 0
                        ),
                        0.9
                    ),
                    new Step(
                        fifthElement,
                        fifthSection,
                        new Vector3(-0.5, 0, 0),
                        new Vector3(
                            0, 0, 0
                        ),
                        0.3
                    )
                ]
            }
        
        silverRingOptions.value = 
            {
                model: "../assets/silver_ring.glb",
                steps: [
                    new Step(
                        firstSilverElement,
                        firstSection,
                        new Vector3(0, 0.2, 0),
                        new Vector3(
                            Math.PI / 1.7, 0, Math.PI
                        ),
                        0.3
                    ), 
                    new Step(
                        secondSilverElement,
                        secondSection,
                        new Vector3(-0.3, 0, 0),
                        new Vector3(
                            Math.PI/2.5, Math.PI/6, -Math.PI/3 
                        ),
                        0.15
                    ) , 
                    new Step(
                        thirdSilverElement,
                        thirdSection,
                        new Vector3(0, 0, 0),
                        new Vector3(
                            0, 4 * Math.PI, 0
                        ),
                        1
                    ) , 
                    new Step(
                        fourthElement,
                        fourthSection,
                        new Vector3(0, 0, 0),
                        new Vector3(
                            4 * Math.PI,  0, 0
                        ),
                        0.58
                    ), 
                    new Step(
                        fifthElement,
                        fifthSection,
                        new Vector3(0.5, 0, 0),
                        new Vector3(
                            0, 4 * Math.PI, 0
                        ),
                        0.3
                    )
                ]
            }

        // secontions = [
        //     firstSection,
        //     secondSection,
        //     thirdSection,
        //     fourthSection,
        //     fifthSection,
        //     sixthSection
        // ]

        const sections = document.querySelectorAll(".sec");
        gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);


        function getSectionPositions() {
          return Array.from(document.querySelectorAll(".sec")).map(section => {
            return section.getBoundingClientRect().top + window.scrollY;
          });
        }

        let points = getSectionPositions();

        window.addEventListener("resize", () => {
          points = getSectionPositions();
        });
        
        // 1. Define your exact predefined pixel positions from the top
        let currentIndex = points.reduce((closest, point, index) => {
          return Math.abs(point - window.scrollY) <
                 Math.abs(points[closest] - window.scrollY)
            ? index
            : closest;
        }, 0);
        let isAnimating = false;

        function goToPoint(index) {
          if (index < 0 || index >= points.length || isAnimating) return;

          isAnimating = true;
          currentIndex = index;

          gsap.to(window, {
            duration: 2,
            scrollTo: {
              y: points[index],
              autoKill: false
            },
            ease: "none",
            overwrite: true,

            onComplete: () => {
              isAnimating = false;
            }
          });
        }
        // 2. Hijack the events instantly before the browser applies momentum
        const observer = Observer.create({
          target: window,
          type: "wheel,touch",
          wheelSpeed: 1,
          tolerance: 15,

          preventDefault: true,

          onPress: () => {
            // Prevent unwanted native touch behavior
          },

          onUp: () => {
            goToPoint(currentIndex + 1);
          },

          onDown: () => {
            goToPoint(currentIndex - 1);
          }
        });
    


    //     ScrollTrigger.create({
    //             trigger: "body",
    //             start: 'top top',
    //             end: 'bottom bottom',
    //             snap: {
    //                 snapTo: (value) => {
    //                     console.log("trying to scroll ......... ");
    //                     const currentScroll = value * ScrollTrigger.maxScroll(window);
    //       
    //                     // Find the closest predefined point in your array
    //                     const closestPoint = sectionPositions.reduce((prev, curr) => 
    //                       Math.abs(curr - currentScroll) < Math.abs(prev - currentScroll) ? curr : prev
    //                     );
    //                     
    //                     // Return the decimal progress of that closest point
    //                     return closestPoint / ScrollTrigger.maxScroll(window);
    //                 },
    //                 duration: { min: 0.2, max: 0.8 }, // Speed of the forced catch-up animation
    //                 ease: "none",             // Smooth transition easing
    //                 delay: 0.05
    //             }
    //         })

    })

</script>

<template src="./PageAr.template.html">
</template>

<style scoped src="./PageAr.styles.css"></style>
