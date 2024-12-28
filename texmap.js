/*
CS435
Project 5
Zackary Bowling


project to investigate textures

tasked to create a scene with a tv and a video playing on the tv, and we were to texture 
each part of the scene with a different texture.
*/
let scene, camera, renderer, tvScreen, video, videoTexture, isPlaying = false, isPaused = false;

init();
animate();

function init() {
  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x333333);

  // Camera setup
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5); 

  // Renderer setup
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  createRoom();
  createTV();

  window.addEventListener('resize', onWindowResize, false);
}

function createRoom() {
  // textures
  const brickTexture = new THREE.TextureLoader().load('brick.jpg');
  const carpetTexture = new THREE.TextureLoader().load('carpet.jpg');
  const woodTexture = new THREE.TextureLoader().load('wood.png');
// Floor
  const floorMaterial = new THREE.MeshBasicMaterial({ map: carpetTexture });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
// Wall 1
  const wallMaterial = new THREE.MeshBasicMaterial({ map: brickTexture });
  const wall1 = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
  wall1.position.z = -5;
  wall1.position.y = 2.5;
  scene.add(wall1);
// Wall 2
  const wall2 = wall1.clone();
  wall2.rotation.y = Math.PI / 2;
  wall2.position.set(-5, 2.5, 0);
  scene.add(wall2);
 // Wall 3
  const wall3 = wall1.clone();
  wall3.rotation.y = -Math.PI / 2;
  wall3.position.set(5, 2.5, 0);
  scene.add(wall3);
  // Table
  const tableMaterial = new THREE.MeshBasicMaterial({ map: woodTexture });
  const table = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1), tableMaterial);
  table.position.set(0, 0.5, -3);
  scene.add(table);
}

function createTV() {
  // Video setup
  video = document.createElement('video');
  video.src = 'charlie.mp4';
  video.loop = true;
  video.muted = true;

 // Video texture and black screen texture
 videoTexture = new THREE.VideoTexture(video);
 videoTexture.minFilter = THREE.LinearFilter;
 videoTexture.magFilter = THREE.LinearFilter;

 const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

 // TV screen setup (start with black screen)
 tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1), blackMaterial);
 tvScreen.position.set(0, 1.1, -3.45);
 scene.add(tvScreen);
}

function togglePower() {
 if (isPlaying) {
   // Turn TV off 
   tvScreen.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
   video.pause();
   isPlaying = false;
 } else {
   // Turn TV on 
   tvScreen.material = new THREE.MeshBasicMaterial({ map: videoTexture });
   video.play();
   isPlaying = true;
 }
}

function pauseResume() {
  if (isPlaying) {
    if (isPaused) {
      video.play();
    } else {
      video.pause();
    }
    isPaused = !isPaused;
  }
}

function prevFrame() {
  if (isPlaying && isPaused) {
    video.currentTime = Math.max(0, video.currentTime - 0.1);
  }
}

function nextFrame() {
  if (isPlaying && isPaused) {
    video.currentTime = Math.min(video.duration, video.currentTime + 0.1);
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
