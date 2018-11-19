const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

var scene;
var camera;
var renderCamera;
var renderer;
var gui;
var stats;
var material;
var mesh;
var target;
var startTime = Date.now();
var distance;
var precision;

// options for shader
var options = {
    lightColor: '#ffffff',
    lightIntensity: 1,
    albedo: '#dddddd',
    ambient: '#111111',
    useTexture: true
}

// called after the scene loads
function onLoad(framework) 
{
  scene = framework.scene;
  camera = framework.camera;
  renderCamera = framework.renderCamera;
  renderer = framework.renderer;
  target = framework.target;
  gui = framework.gui;
  stats = framework.stats;
  distance = framework.distance;
  precision = framework.precision;

  window.addEventListener( "resize", onResize, false );

  // set camera position
  camera.position.set(0, 0, 8);
  camera.lookAt(new THREE.Vector3(0,0,0));

  material = new THREE.ShaderMaterial({
      uniforms: {
          // texture: { type: "t", value: null },
          // u_useTexture: { type: 'i', value: options.useTexture },
          // u_albedo: { type: 'v3', value: new THREE.Color(options.albedo) },
          // u_ambient: { type: 'v3', value: new THREE.Color(options.ambient) },
          // u_lightPos: { type: 'v3', value: new THREE.Vector3(30, 50, 40) },
          // u_lightCol: { type: 'v3', value: new THREE.Color(options.lightColor) },
          // u_lightIntensity: { type: 'f', value: options.lightIntensity },
          
          resolution: { type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
          camera :{ type: "v3", value: camera.position },
          target :{ type: "v3", value: target },
          time : { type: "f", value: 0 },
          randomSeed : { type: "f", value: Math.random() },
          fov : { type: "f", value: 45 },
          raymarchMaximumDistance:{ type: "f", value: distance },
          raymarchPrecision:{ type: "f", value: precision},
          color0: {type: "v3", value: new THREE.Vector3(0.9, 0.9, 0.0) }, //yellow
          light0: {type: "v3", value: new THREE.Vector3(-0.5, 0.75, -0.5) },
          color1: {type: "v3", value: new THREE.Vector3(0.0, 0.2, 0.9) }, //blue
          light1: {type: "v3", value: new THREE.Vector3( 0.5, -0.75, 0.5) }
      },
      vertexShader: require('./shaders/sdf-vert.glsl'),
      fragmentShader: require('./shaders/sdf-frag.glsl')
  });

  // add a plane that fits the whole screen for fragment shader
  var geom = new THREE.BufferGeometry();
  geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([ -1,-1,0, 1,-1,0, 1,1,0, -1,-1,0, 1,1,0, -1,1,0]), 3 ) );
  mesh = new THREE.Mesh( geom, material );
  //mesh.material.side = THREE.DoubleSide;
  scene.add(mesh);

  /*
  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  //add amplitude slider for user to adjust
  gui.add(amplitudeText, 'amplitude', 5.0, 40.0);
  */
}

function onResize(e)
{
  console.log("resized window");
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize( width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  if( material != null )
  {
      material.uniforms.resolution.value.x = width;
      material.uniforms.resolution.value.y = height;
  }
}

// called on frame updates
function onUpdate(framework) 
{

  if (material != null && material.uniforms != null)
  {
    material.uniforms[ 'time' ].value = ( Date.now() - startTime ) * .001;
    material.uniforms[ 'randomSeed' ].value = Math.random();
    material.uniforms[ 'fov' ].value = camera.fov * Math.PI / 180;
    material.uniforms[ 'raymarchMaximumDistance' ].value = distance;
    material.uniforms[ 'raymarchPrecision' ].value = precision;
    material.uniforms[ 'camera' ].value = camera.position;
    material.uniforms[ 'target' ].value = target;
    camera.lookAt( target );
  }

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
