import { EventEmitter } from "events";
import Experience from "./Experience";
import GSAP from "gsap";
import convert from "./Utils/convertDivsToSpan";

export default class Preloader extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.world = this.experience.world;
    this.device = this.sizes.device;

    this.sizes.on("switchdevice", (device) => {
      this.device = device;
    });

    this.world.on("worldready", () => {
      this.setAssets();
      this.playIntro();
    });
  }
  setAssets() {
    convert(document.querySelector(".intro-text"));
    convert(document.querySelector(".hero-main-title"));
    convert(document.querySelector(".hero-main-description"));
    convert(document.querySelector(".hero-second-subheading"));
    convert(document.querySelector(".second-sub"));
    this.room = this.experience.world.room.actualRoom;
    this.roomChildren = this.experience.world.room.roomChildren;
  }
  firstIntro() {
    return new Promise((resolve) => {
      this.timeline = new GSAP.timeline();

      if (this.device === "desktop") {
        this.timeline
          .to(this.roomChildren.IntroCube.scale, {
            x: 1.4,
            y: 1.4,
            z: 1.4,
            ease: "back.out(2.5)",
            duration: 0.7,
          })
          .to(this.room.position, {
            x: -1,
            ease: "power1.out",
            duration: 0.7,
            onComplete: resolve,
          });
      } else {
        this.timeline
          .to(this.roomChildren.IntroCube.scale, {
            x: 1.4,
            y: 1.4,
            z: 1.4,
            ease: "back.out(2.5)",
            duration: 0.7,
          })
          .to(this.room.position, {
            z: -1,
            ease: "power1.out",
            duration: 0.7,
            onComplete: resolve,
          });
      }
      this.timeline
        .to(".intro-text .animated-is", {
          yPercent: -100,
          stagger: 0.05,
          ease: "back.out(1.7)",
          onComplete: resolve,
        })
        .to(
          "arrow-svg-wrapper",
          {
            opacity: 1,
          },
          "same"
        )
        .to(
          ".toggle-bar",
          {
            opacity: 1,
            onComplete: resolve,
          },
          "same"
        );
    });
  }
  secondIntro() {
    return new Promise((resolve) => {
      this.secondTimeline = new GSAP.timeline();

      if (this.device === "desktop") {
        this.secondTimeline
          .to(
            ".intro-text .animated-is",
            {
              yPercent: 100,
              stagger: 0.05,
              ease: "back.in(1.7)",
            },
            "fadeout"
          )
          .to(
            "arrow-svg-wrapper",
            {
              opacity: 0,
            },
            "fadeout"
          )
          .to(
            this.room.position,
            {
              x: 0,
              y: 0,
              z: 0,
              ease: "power1.out",
            },
            "same"
          )
          .to(
            this.roomChildren.IntroCube.rotation,
            {
              y: 2 * Math.PI + Math.PI / 4,
              ease: "power2.out",
              duration: 1,
            },
            "same"
          )
          .to(
            this.roomChildren.IntroCube.scale,
            {
              x: 7.349,
              y: 7.349,
              z: 7.349,
            },
            "same"
          )
          .to(
            this.camera.orthographicCamera.position,
            {
              y: 2.5,
            },
            "same"
          )
          .to(
            this.roomChildren.IntroCube.position,
            {
              x: 0.011203,
              y: 0.008214,
              z: 0.038261,
            },
            "same"
          )
          .set(this.roomChildren.Wall.scale, {
            x: 1,
            y: 1,
            z: 1,
          })
          .to(this.roomChildren.IntroCube.scale, {
            x: 0,
            y: 0,
            z: 0,
          })
          .to(
            ".hero-main-title .animated-is",
            {
              yPercent: -100,
              stagger: 0.07,
              ease: "back.out(1.7)",
            },
            "introtext"
          )
          .to(
            ".hero-main-description .animated-is",
            {
              yPercent: -100,
              stagger: 0.07,
              ease: "back.out(1.7)",
            },
            "introtext"
          )
          .to(
            ".first-sub .animated-is",
            {
              yPercent: -100,
              stagger: 0.07,
              ease: "back.out(1.7)",
            },
            "introtext"
          )
          .to(
            ".second-sub .animated-is",
            {
              yPercent: -100,
              stagger: 0.07,
              ease: "back.out(1.7)",
            },
            "introtext"
          )
          .to(this.roomChildren.Floor.scale, {
            x: 1,
            y: 1,
            z: 1,
          })
          .to(this.roomChildren.Torus.scale, {
            x: 1,
            y: 1,
            z: 1,
          })
          .to(this.roomChildren.Glass.scale, {
            x: 1,
            y: 1,
            z: 1,
          })
          .to(".arrow-svg-wrapper", {
            opacity: 0,
          });
      } else {
        this.secondTimeline.to(this.room.position, {
          x: 0,
          y: 0,
          z: 0,
          ease: "power1.out",
          duration: 0.7,
        });
      }
    });
  }

  onScroll(e) {
    if (e.deltaY > 0) {
      window.removeEventListener("wheel", this.scrollOnceEvent);
      this.playSecondIntro();
    }
  }

  async playIntro() {
    await this.firstIntro();
    console.log("continue");
    this.scrollOnceEvent = this.onScroll.bind(this);
    window.addEventListener("wheel", this.scrollOnceEvent);
  }

  async playSecondIntro() {
    await this.secondIntro();
  }
}
