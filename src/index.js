import './styles/index.scss';
import './assets/fonts/Roboto-Regular.ttf';
import './component.js';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

var canvas = document.getElementById("babylon");
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
  });
};
function $_GET(key) {
    var p = window.location.search;
    p = p.match(new RegExp(key + '=([^&=]+)'));
    return p ? p[1] : false;
}
var createScene = async function() {
  const scene = await BABYLON.SceneLoader.LoadAsync(
    "scene/",
    "girl.glb",
    engine
);
BABYLON.SceneLoader.ImportMesh("", "scene/","boots.glb", scene, function(newMeshes, particleSystems, skeletons, animationGroups) {
  scene.getMeshByName("hair_base001_primitive0").visibility=.6
  scene.getMeshByName("DarkMagicBoots_Retopo_Vert_mesh").dispose();
  scene.getMeshByName("hair_base001_primitive0").material.metallic=.2
})

//let camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3( 0.32161276833553787, -0.16917787249847976, -1.9667089450908692), scene);
//camera.angularSensibilityY = 3000;
//camera.angularSensibilityX = 3000;
//camera.lowerRadiusLimit = .1;
//camera.wheelPrecision = 30;
//camera.setTarget(BABYLON.Vector3.Zero());
//camera.attachControl(canvas, true);

function addCamera() {
      scene.createDefaultCamera(true, true, true);

     var helperCamera = scene.cameras.pop();
     scene.cameras.push(helperCamera);
     let rads = []
       scene.meshes.forEach((item, i) => {
         rads.push(item.getBoundingInfo().boundingSphere.maximum.x)
     });


     helperCamera.radius = Math.max.apply(null, rads)*5;
     //helperCamera.alpha = Math.PI / 4;
     //helperCamera.beta = Math.PI / 4;
}

addCamera()

//let lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/studio.env", scene);
let lighting = new BABYLON.HDRCubeTexture("scene/textures/blackhole-03-low.hdr", scene, 128, false, true, false, true);
lighting.name = "runyonCanyon";
//lighting.level = 15;
lighting.gammaSpace = false;
scene.environmentTexture = lighting;
scene.createDefaultSkybox(scene.environmentTexture, true, 1000);
scene.getMeshByName("hdrSkyBox").visibility=0;

//let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
//let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
//skyboxMaterial.backFaceCulling = false;
//skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("scene/textures/skybox/skybox", scene);
//skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
//skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
//skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
//skybox.material = skyboxMaterial;

  return scene;
};

var asyncEngineCreation = async function() {
  console.log(createDefaultEngine())
  try {
    return createDefaultEngine();
  } catch (e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    return createDefaultEngine();
  }
}
window.initFunction = async function() {

  engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  scene = await createScene();
  window.scene = scene;
};
window.initFunction().then(() => {
  sceneToRender = scene
  engine.runRenderLoop(function() {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

// Resize
window.addEventListener("resize", function() {
  engine.resize();
});
