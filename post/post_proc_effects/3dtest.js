//import "./style.css"
//import * as THREE from "./three"
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import * as dat from 'dat.gui'

// Debug
//const gui = new dat.GUI()

//Loader
var loader = new THREE.FileLoader();

function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
    var vertex_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
        var fragment_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType('text');
        fragment_loader.load(fragment_url, function (fragment_text) {
            onLoad(vertex_text, fragment_text);
        });
    }, onProgress, onError);
}

function LoadOBJ(file)
{
    // instantiate a loader
    const obj_loader = new OBJLoader();

    // load a resource
    obj_loader.load(
        // resource URL
        file,
        // called when resource is loaded
        function ( object ) {

            scene.add( object );

        },
        // called when loading is in progresses
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}


// Canvas
const canvas = document.querySelector("#glCanvas")


// Scene
const scene = new THREE.Scene()

// Objects
//const geometry = new THREE.TorusKnotGeometry( 1, 0.3, 128, 64 );
const geometry = new THREE.DodecahedronGeometry(1,0);
//load shader in asymetric fashion
/*ShaderLoader('vertex.glsl','fragment.glsl',
             function(vertex, fragment)
             {
                 // Materials
                 const material = new THREE.ShaderMaterial( {

                     uniforms: {
                     },

                     vertexShader:vertex,

                     fragmentShader: fragment

                 } );
                 // Mesh
                 const sphere = new THREE.Mesh(geometry,material)
                 scene.add(sphere)

             })*/


const material = new THREE.MeshStandardMaterial()
material.color = new THREE.Color(0xff0000)


const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

LoadOBJ('../../Models/bunny.obj')

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: canvas.width,
    height: canvas.height
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = canvas.width
    sizes.height = canvas.height

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2



// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
scene.add(camera)

// Effect Composer
//
const composer = new EffectComposer(renderer);

//
const normal_uniforms = THREE.UniformsUtils.clone( NormalShader.uniforms );

const normal_material = new THREE.ShaderMaterial( {

                defines: Object.assign( {}, NormalShader.defines ),
                uniforms: normal_uniforms,
                vertexShader: NormalShader.vertexShader,
                fragmentShader: NormalShader.fragmentShader

            } );




const renderPass = new RenderPass( scene, camera,renderer, [], "rendered_scene" );
composer.addPass( renderPass );

const normalPass = new RenderPass( scene, camera,renderer, [], "normal_scene" , normal_material);
composer.addPass( normalPass );

const outlinePass = new ShaderPass( OutlineShader, renderer, ["rendered_scene","normal_scene"]);
composer.addPass( outlinePass );
/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    //renderer.render(scene, camera)

    // Render with composer
    composer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

