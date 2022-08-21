import * as THREE from "three";
import Experience from "../Experience";
// import GSAP from "gsap";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;

    // this.lerp = {
    //   current: 0,
    //   target: 0,
    //   ease: 0.1,
    // };

    this.setModel();
    this.setAnimation();
    // this.onMouseMove();
  }
  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }
      if (child.name === "Glass") {
        child.material = new THREE.MeshPhysicalMaterial();
        child.material.roughness = 0;
        child.material.color.set(0x549dd2);
        child.material.ior = 3;
        child.material.transmission = 1;
        child.material.opacity = 1;
      }
      if (child.name === "Screen") {
        child.material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }
    });

    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(1, 1, 1);
  }
  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    this.rotate = this.mixer.clipAction(this.room.animations[0]);
    this.rotate.play();
  }
  // onMouseMove() {
  //   window.addEventListener("mousemove", (e) => {
  //     console.log(e);
  //   });
  // }

  resize() {}

  update() {
    // this.lerp = {
    //   current: 0,
    //   target: 0,
    //   ease: 0.1,
    // };
    this.mixer.update(this.time.delta * 0.0009);
  }
}
