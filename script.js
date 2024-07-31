import * as THREE from "three";

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);


// Create a camera and positions it
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
//adds the renderer to the html document
const d = document.body.appendChild(renderer.domElement);
//tells the renderer to support shadow
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// directional to simulate light reflection on the earth
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(7, 1, 7.5);
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 100
scene.add(directionalLight)

//add light helper to see the light source position
// const helper = new THREE.DirectionalLightHelper(directionalLight, 0xffffff)
// scene.add(helper);


camera.position.z = 10;
//creathing earth and moon's sphere
const earthGeometry = new THREE.SphereGeometry(2, 32, 16);
const moonGeometry = new THREE.SphereGeometry(0.5, 32, 16);
//loader to load textures.
const loader = new THREE.TextureLoader();
let earth;
let moon;


//loading moon's material and rendering moon
loader.load('https://upload.wikimedia.org/wikipedia/commons/d/db/Moonmap_from_clementine_data.png',
  function(texture) {
    const moonMaterial = new THREE.MeshStandardMaterial({ map: texture });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.x = 5
    moon.position.z = -5
    moon.receiveShadow = true;
    moon.castShadow = true;
    scene.add(moon);
  },
  undefined,
  function(error) {
    console.error('An error occurred while loading the texture', error);
  }
);

//loading eath's material and rendering earth
loader.load(
  'https://upload.wikimedia.org/wikipedia/commons/c/cf/WorldMap-A_non-Frame.png',
  function(texture) {
    const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.receiveShadow = true;
    //I'll comment this out, so you see the moon rotating round it's the orbit.
    // earth.castShadow = true; 
    scene.add(earth);
    renderer.render(scene, camera);
  },
  undefined,
  function(error) {
    console.error('An error occurred while loading the texture', error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  render();
}

const orbitRadius = 5;
let angle = 0;

function render() {
  if (earth) {
    earth.rotation.y += 0.001
  };
  if (moon) {
    // Updating the Moon's position to orbit around the Earth
    moon.rotation.y += 0.01;
    moon.rotation.x += 0.01;
    // Increment the angle to simulate orbit
    angle += 0.01; 
    moon.position.set(
      orbitRadius * Math.cos(angle),
      0,
      orbitRadius * Math.sin(angle)
    );
  }
  // cameraControls.update();
  renderer.render(scene, camera);
}

animate();