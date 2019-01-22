// CREATE SCENE AND RENDERER
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000 );

// CREATE RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ADD CONTROLS
controls = new THREE.OrbitControls(camera,renderer.domElement)

camera.position.z = 2;

var level;
pixelColor('./static/ressources/level/map/amazonie.png').then(function(data) {
  level = data;
  console.log(level);
});

// translateImageToArray('./static/ressources/level/map/amazonie.png').then(function() {
//   console.log("done loading image");
// });



// create shape
// var geometry = new THREE.BoxGeometry(50,50,50);

// var textPath = './static/ressources/textures/world/amazonie/background/'
// var cubeMaterials = [
//   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(textPath + 'city1.png'), side: THREE.DoubleSide} ), // RIGHT
//   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(textPath + 'city1.png'), side: THREE.DoubleSide} ), // LEFT
//   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(textPath + 'city1.png'), side: THREE.DoubleSide} ), // TOP
//   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(textPath + 'city2.png'), side: THREE.DoubleSide} ), // BOTTOM
//   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(textPath + 'city1.png'), side: THREE.DoubleSide} ), // FRONT
//   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(textPath + 'city1.png'), side: THREE.DoubleSide} )  // BACK
// ];
//
// var material = new THREE.MeshFaceMaterial(cubeMaterials);
// // var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: true} );
// var cube = new THREE.Mesh(geometry, material);
// cube.position.y = 24;
// scene.add(cube);

// MAIN FUNCTIONS OF THE GAME

// game logic
var update = function() {

};

// draw scene
var render = function() {
  renderer.render(scene, camera);
};

// run game loop(update, render, repeat)
var gameLoop = function() {
  requestAnimationFrame(gameLoop);
  update();
  render();
}

gameLoop();
