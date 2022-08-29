import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.actualRoom;
    // this.room.chilldren.forEach((child) => {
    //   if (child.type === "RectAreaLight") {
    //     this.rectLight = child;
    //   }
    // });
    this.circleFirst = this.experience.world.floor.circleFirst;
    this.circleSecond = this.experience.world.floor.circleSecond;
    this.circleThird = this.experience.world.floor.circleThird;
    GSAP.registerPlugin(ScrollTrigger);

    this.setSmoothScroll();
    this.setScrollTrigger();
  }

  setupASScroll() {
    // https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      ease: 0.3,
      disableRaf: true,
    });

    GSAP.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    });

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      fixedMarkers: true,
    });

    asscroll.on("update", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          ".gsap-marker-start, .gsap-marker-end, [asscroll]"
        ),
      });
    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll();
  }

  setScrollTrigger() {
    //First Section
    this.firstMoveTimeline = new GSAP.timeline({
      scrollTrigger: {
        trigger: ".first-move",
        start: "top top",
        end: "bottom bottom",
        markers: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    this.firstMoveTimeline.to(this.room.position, {
      x: () => {
        return this.sizes.width * 0.0014;
      },
    });
    //Second section
    this.secondMoveTimeline = new GSAP.timeline({
      scrollTrigger: {
        trigger: ".second-move",
        start: "top top",
        end: "bottom bottom",
        markers: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    })
      .to(
        this.room.position,
        {
          x: () => {
            return this.sizes.width * -0.0014;
            // return 1;
          },
          z: () => {
            return this.sizes.height * 0.0032;
          },
        },
        "same"
      )
      .to(
        this.room.scale,
        {
          x: 1.2,
          y: 1.2,
          z: 1.2,
        },
        "same"
      );
    // .to(
    //   this.rectLight,
    //   {
    //     width: 0.5 * 4,
    //     height: 0.7 * 4,
    //   },
    //   "same"
    // );
    //Third section
    this.thirdMoveTimeline = new GSAP.timeline({
      scrollTrigger: {
        trigger: ".third-move",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    }).to(this.camera.orthographicCamera.position, {
      y: 1.5,
      x: -4.1,
    });

    //Circle Animation
    this.firstMoveTimeline = new GSAP.timeline({
      scrollTrigger: {
        trigger: ".first-move",
        start: "top top",
        end: "bottom bottom",
        markers: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    }).to(this.circleFirst.scale, {
      x: 3,
      y: 3,
      z: 3,
    });

    this.secondMoveTimeline = new GSAP.timeline({
      scrollTrigger: {
        trigger: ".second-move",
        start: "top top",
        end: "bottom bottom",
        markers: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    }).to(this.circleSecond.scale, {
      x: 3,
      y: 3,
      z: 3,
    });

    this.thirdMoveTimeline = new GSAP.timeline({
      scrollTrigger: {
        trigger: ".third-move",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    }).to(this.circleThird.scale, {
      x: 3,
      y: 3,
      z: 3,
    });
  }

  resize() {}

  update() {}
}

// ScrollTrigger.matchMedia({
//   //Desktop
//   "(min-width: 969px)": () => {
//     //First section
//     this.firstMoveTimeline = new GSAP.timeline({
//       scrollTrigger: {
//         trigger: ".first-move",
//         start: "top top",
//         end: "bottom bottom",
//         scrub: 0.6,
//         invalidateOnRefresh: true,
//       },
//     });
//     this.firstMoveTimeline.to(this.room.position, {
//       x: () => {
//         return this.sizes.width * 0.0014;
//       },
//     });
//     //Second section
//     this.secondMoveTimeline = new GSAP.timeline({
//       scrollTrigger: {
//         trigger: ".second-move",
//         start: "top top",
//         end: "bottom bottom",
//         scrub: 0.6,
//         invalidateOnRefresh: true,
//       },
//     })
//       .to(
//         this.room.position,
//         {
//           x: () => {
//             return 1;
//           },
//           z: () => {
//             return this.sizes.height * 0.0032;
//           },
//         },
//         "same"
//       )
//       .to(
//         this.room.scale,
//         {
//           x: 0.4,
//           y: 0.4,
//           z: 0.4,
//         },
//         "same"
//       );
//   },

//   //Mobile
//   "(max-width: 968px)": () => {
//     console.log("fired Mobile");
//   },

//   all: function () {},
// });

//First scrollTrigger
//  this.timeline = new GSAP.timeline();
//  this.timeline.to(this.room.position, {
//    x: () => {
//      return this.sizes.width * 0.0012;
//    },
//    scrollTrigger: {
//      trigger: ".first-move",
//      markers: true,
//      start: "top top",
//      end: "bottom bottom",
//      scrub: 0.6,
//      invalidateOnRefresh: true,
//    },
//  });
