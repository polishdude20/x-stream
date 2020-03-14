import * as THREE from "three";
import { TransformControls } from "./TransformControls";
import { OrbitControls } from "./OrbitControls";
import { DragControls } from "./DragControls";
import FourBar from "./vectorFourBar";
import { scaleValues } from "./Utils";
import { STLLoader } from "./STLLoader";
import topArmFile from "../stl/topArm.stl";
import bottomArmFile from "../stl/BottomArm.stl";
import knuckleFile from "../stl/knuckle.stl";
import frameFile from "../stl/Frame.stl";
import wheelFile from "../stl/wheel.stl";
import rearLinkFile from "../stl/SwingLink.stl";
import trailingArmFile from "../stl/TrailingArm.stl";

const link1Length = 223.9;
const link2Length = 419.1;
const link3Length = 168.37;
const link4Length = 619.71;

const Four = new FourBar();

const masterGroup = new THREE.Group();
const suspensionGroupLeft = new THREE.Group();
const suspensionGroupRight = new THREE.Group();
const armTopKnuckleGroupLeft = new THREE.Group();
const armTopKnuckleGroupRight = new THREE.Group();
const knuckleWheelGroupLeft = new THREE.Group();
const knuckleWheelGroupRight = new THREE.Group();
const rearSuspGroupRight = new THREE.Group();
const trailingGroupRight = new THREE.Group();

const parts = {};
let controls = null;
let transControls = null;
let renderer = null;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  7000
);

const scale = 1;

const partNames = [
  "topArmRight",
  "topArmLeft",
  "botArmRight",
  "botArmLeft",
  "knuckleLeft",
  "knuckleRight",
  "wheelRight",
  "wheelLeft",
  "wheelRearRight",
  "frame",
  "bottomRearRightLink",
  "topRearRightLink",
  "trailingArmRight"
];

partNames.forEach(name => {
  parts[name] = new THREE.Mesh();
});

const renderOnce = () => {
  renderer.render(scene, camera);
};

const resizeCanvasToDisplaySize = () => {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderOnce();
  }
};

const applyMaterials = () => {
  const mat = new THREE.MeshPhongMaterial({ color: 0x606060 });
  Object.keys(parts).forEach(key => {
    parts[key].material = mat;
  });
};

const scaleGeometries = () => {
  parts.topArmLeft.scale.set(scale, scale, scale);
  parts.topArmRight.scale.set(scale, scale, scale);
  parts.botArmRight.scale.set(scale, scale, scale);
  parts.botArmLeft.scale.set(scale, scale, scale);
  parts.wheelRight.scale.set(5.5, 5.5, 3.6);
  parts.wheelLeft.scale.set(5.5, 5.5, 3.6);
  parts.wheelRearRight.scale.set(5.5, 5.5, 3.6);
  parts.knuckleLeft.scale.set(scale, scale, scale);
  parts.knuckleRight.scale.set(scale, scale, scale);
  parts.frame.scale.set(scale, scale, scale);
  parts.bottomRearRightLink.scale.set(scale, scale, scale);
  parts.topRearRightLink.scale.set(scale, scale, scale);
  parts.trailingArmRight.scale.set(scale, scale, scale);
};

const renderSetup = canvasRef => {
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef,
    antialias: true
  });

  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  controls.addEventListener("change", renderOnce);


  scene.background = new THREE.Color(0xe5e5e5);

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 1, 1).normalize();
  scene.add(light);

  applyMaterials();
  scaleGeometries();

  knuckleWheelGroupRight.add(parts.knuckleRight);
  knuckleWheelGroupLeft.add(parts.knuckleLeft);

  knuckleWheelGroupRight.add(parts.wheelRight);
  knuckleWheelGroupLeft.add(parts.wheelLeft);

  parts.wheelRight.rotateZ(Math.PI / 2);
  parts.wheelLeft.rotateZ(Math.PI / 2);

  parts.wheelRight.position.set(-220, -95, 0);
  parts.wheelLeft.position.set(-220, -95, 0);

  parts.wheelLeft.rotateX(Math.PI / 2);
  parts.wheelRight.rotateX(Math.PI / 2);

  parts.botArmRight.position.set(0, -158.66, -157.99);
  parts.botArmLeft.position.set(0, -158.66, -157.99);

  knuckleWheelGroupRight.position.set(0, 0, 419.09);
  knuckleWheelGroupLeft.position.set(0, 0, 419.09);

  knuckleWheelGroupRight.rotation.y = 3.14159 / 2;
  knuckleWheelGroupLeft.rotation.y = 3.14159 / 2;

  parts.frame.position.set(-559, -65, -187);
  parts.frame.rotation.y = Math.PI / 2;
  parts.frame.rotateX(+0.2);

  const dragControls = new DragControls(
    [parts.wheelRearRight],
    camera,
    renderer.domElement
  );

  dragControls.addEventListener("dragstart", function (event) {
    controls.enabled = false;
  });

  dragControls.addEventListener("drag", function (event) {
    console.log(event.object.position);
    renderOnce();
  });

  dragControls.addEventListener("dragend", function (event) {
    controls.enabled = true;
  });


  parts.bottomRearRightLink.position.set(-1669.476, 183.76761, -88.413472);
  parts.topRearRightLink.position.set(-1637.77, 352.443809, -84.032);


  parts.trailingArmRight.position.set(-586.16749, -40.7382, 80.05754);
  parts.trailingArmRight.rotateY(Math.PI / 2 + 0.27)
  parts.trailingArmRight.rotateX(Math.PI / 14)

  parts.wheelRearRight.position.set(-1548.52242, 244.26671, 386.4830)

  trailingGroupRight.add(parts.trailingArmRight);
  trailingGroupRight.add(parts.wheelRearRight);

  //rearSuspGroupRight.add(parts.trailingArmRight);
  rearSuspGroupRight.add(parts.bottomRearRightLink);
  rearSuspGroupRight.add(parts.topRearRightLink);

  armTopKnuckleGroupLeft.add(parts.topArmLeft);
  armTopKnuckleGroupRight.add(parts.topArmRight);

  armTopKnuckleGroupLeft.add(knuckleWheelGroupLeft);
  armTopKnuckleGroupRight.add(knuckleWheelGroupRight);

  suspensionGroupRight.add(armTopKnuckleGroupRight);
  suspensionGroupLeft.add(armTopKnuckleGroupLeft);

  suspensionGroupRight.add(parts.botArmRight);
  suspensionGroupLeft.add(parts.botArmLeft);

  suspensionGroupLeft.position.set(0, 0, -370);
  suspensionGroupLeft.rotateY(Math.PI);

  masterGroup.add(trailingGroupRight);
  masterGroup.add(parts.frame);
  masterGroup.add(suspensionGroupRight);
  masterGroup.add(suspensionGroupLeft);
  masterGroup.add(rearSuspGroupRight);

  scene.add(masterGroup);
  masterGroup.position.set(800, 0, 0);

  camera.position.set(1700, 1000, 1200);
  controls.update();

  masterGroup.rotation.z = 0.2;

  resizeCanvasToDisplaySize();
  window.addEventListener("resize", () => resizeCanvasToDisplaySize());

  renderer.render(scene, camera);



  const spin = () => {
    parts.wheelRearRight.rotateZ(-0.1);
    parts.wheelRight.rotateZ(0.1);
    parts.wheelLeft.rotateZ(-0.1);
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(spin);
  }
  window.requestAnimationFrame(spin);


};

export const rotateTrailingArmX = angle => {

  trailingGroupRight.rotateX(angle)
  console.log(parts.trailingArmRight.rotation)
  controls.update();
  renderer.render(scene, camera);
}

export const rotateTrailingArmY = angle => {
  trailingGroupRight.rotateY(angle)
  console.log(parts.trailingArmRight.rotation)
  controls.update();
  renderer.render(scene, camera);
}

export const rotateTrailingArmZ = angle => {
  trailingGroupRight.rotateZ(angle)
  console.log(parts.trailingArmRight.rotation)
  controls.update();
  renderer.render(scene, camera);
}

export const loadAllGeometry = canvasRef => {
  const loader = new STLLoader();
  console.log("Loading Geometry");
  const loadTopArm = () =>
    new Promise(resolve => {
      console.log("Loading TopArm");
      loader.load(
        topArmFile,
        resolve,
        () => console.log("progress"),
        err => console.log("error-" + err)
      );
    });
  const loadBottomArm = () =>
    new Promise(resolve => {
      console.log("Loading TopArm");
      loader.load(
        bottomArmFile,
        resolve,
        () => console.log("progress"),
        err => console.log("error-" + err)
      );
    });
  const loadWheel = () =>
    new Promise(resolve => {
      console.log("Loading TopArm");
      loader.load(
        wheelFile,
        resolve,
        () => console.log("progress"),
        err => console.log("error-" + err)
      );
    });
  const loadFrontKnuckle = () =>
    new Promise(resolve => {
      console.log("Loading TopArm");
      loader.load(
        knuckleFile,
        resolve,
        () => console.log("progress"),
        err => console.log("error-" + err)
      );
    });
  const loadFrame = () =>
    new Promise(resolve => {
      console.log("Loading TopArm");
      loader.load(
        frameFile,
        resolve,
        () => console.log("progress"),
        err => console.log("error-" + err)
      );
    });
  const loadRearLink = () =>
    new Promise(resolve => {
      console.log("Loading RearLink");
      loader.load(
        rearLinkFile,
        resolve,
        () => console.log("progress"),
        err => console.log("error-" + err)
      );
    });
  const loadTrailingArm = () =>
    new Promise(resolve => {
      console.log("Loading Trailing Arm");
      loader.load(
        trailingArmFile,
        resolve,
        () => console.log("progress"),
        err => console.log("error-" + err)
      );
    });
  const promises = [
    loadTopArm(),
    loadBottomArm(),
    loadWheel(),
    loadFrontKnuckle(),
    loadFrame(),
    loadRearLink(),
    loadTrailingArm()
  ];
  console.log("Waiting For Promises");

  Promise.all(promises).then(
    ([topArm, botArm, wheel, frontKnuckle, frame, rearLink, trailingArm]) => {
      parts.topArmLeft.geometry = topArm;
      parts.topArmRight.geometry = topArm;
      parts.botArmLeft.geometry = botArm;
      parts.botArmRight.geometry = botArm;
      parts.wheelLeft.geometry = wheel;
      parts.wheelRight.geometry = wheel;
      parts.wheelRearRight.geometry = wheel;
      parts.knuckleLeft.geometry = frontKnuckle;
      parts.knuckleRight.geometry = frontKnuckle;
      parts.frame.geometry = frame;
      parts.bottomRearRightLink.geometry = rearLink;
      parts.topRearRightLink.geometry = rearLink;
      parts.trailingArmRight.geometry = trailingArm;
      console.log("All STL Loaded! Promises Resolved");
      renderSetup(canvasRef);
    }
  );
};



export const animate = (left, right) => {
  armTopKnuckleGroupLeft.rotation.x = scaleValues(
    left,
    0,
    100,
    Math.PI / 4,
    -Math.PI / 7
  );
  armTopKnuckleGroupRight.rotation.x = scaleValues(
    right,
    0,
    100,
    Math.PI / 4,
    -Math.PI / 7
  );

  const angleLeft =
    armTopKnuckleGroupLeft.rotation.x +
    Math.PI / 2.0 +
    45.0 * (Math.PI / 180.0);
  const angleRight =
    armTopKnuckleGroupRight.rotation.x + Math.PI / 2.0 + 45 * (Math.PI / 180);

  const outputLeft = Four.outputAngle(
    link2Length,
    link3Length,
    link4Length,
    link1Length,
    angleLeft
  );
  const outputRight = Four.outputAngle(
    link2Length,
    link3Length,
    link4Length,
    link1Length,
    angleRight
  );
  const couplerLeft = Four.couplerAngle(
    link2Length,
    link3Length,
    link4Length,
    link1Length,
    angleLeft
  );
  const couplerRight = Four.couplerAngle(
    link2Length,
    link3Length,
    link4Length,
    link1Length,
    angleRight
  );

  parts.botArmLeft.rotation.x =
    outputLeft.open - Math.PI / 2 - 45 * (Math.PI / 180);
  parts.botArmRight.rotation.x =
    outputRight.open - Math.PI / 2 - 45 * (Math.PI / 180);
  knuckleWheelGroupLeft.rotation.x =
    -couplerLeft.open +
    50 * (Math.PI / 180) -
    armTopKnuckleGroupLeft.rotation.x;
  knuckleWheelGroupRight.rotation.x =
    -couplerRight.open +
    50 * (Math.PI / 180) -
    armTopKnuckleGroupRight.rotation.x;

  parts.wheelRight.rotation.x += 0.1;
  parts.wheelLeft.rotation.x += -0.1;

  controls.update();
  renderer.render(scene, camera);
};
