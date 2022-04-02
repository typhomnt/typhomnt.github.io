/*import {
	BufferGeometry,
	Float32BufferAttribute,
	OrthographicCamera,
	Mesh
} from 'three';*/

class Pass 
{


	constructor(renderer, inputTexturesID, targetName, target) 
	{

		// if set to true, the pass is processed by the composer
		this.enabled = true;

		// if set to true, the pass indicates to swap read and write buffer after rendering
		this.needsSwap = true;

		// if set to true, the pass clears its buffer before rendering
		this.clear = false;

		// if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
		this.renderToScreen = false;

		{
			var renderTarget = target;
			if ( target  === undefined ) 
			{
				const parameters = {
					minFilter: THREE.LinearFilter,
					magFilter: THREE.LinearFilter,
					format: THREE.RGBAFormat,
					type: THREE.FloatType
				};

				const size = renderer.getSize( new THREE.Vector2() );
				const pixelRatio = renderer.getPixelRatio();
				const width = size.width;
				const height = size.height;

				renderTarget = new THREE.WebGLRenderTarget( width * pixelRatio, height * pixelRatio, parameters );

			}

			if(targetName == undefined)
				targetName = 'renderTarget';
			
			renderTarget.texture.name = targetName;
			this.renderTarget =  renderTarget;
		}

		this.resizable = true;

		this.rendered = false;
		
		if(inputTexturesID == undefined)
			inputTexturesID = [];

		this.inputTexturesID = inputTexturesID;

		this.inputTextures = new Object();

		this.onRendered = () => void 0;

	}

	setSize( /* width, height */ ) {}

	SetRenderTarget(renderer, target,name)
	{
		if ( target  === undefined ) 
		{

			const parameters = {
				minFilter: THREE.LinearFilter,
				magFilter: THREE.LinearFilter,
				format: THREE.RGBAFormat,
				type: THREE.FloatType
			};

			const size = renderer.getSize( new THREE.Vector2() );
			pixelRatio = renderer.getPixelRatio();
			width = size.width;
			height = size.height;

			renderTarget = new THREE.WebGLRenderTarget( width * pixelRatio, height * pixelRatio, parameters );

		}
		else
		{
			renderTarget = target;
		}
		if(name == undefined)
			name = 'renderTarget'
		renderTarget.texture.name = name;
		this.renderTarget =  renderTarget;
	}

	render(  renderer, /*deltaTime, maskActive  */) 
	{
		var target = this.renderTarget;
		if(this.renderToScreen)
		{
		 	target = null;
		}
		renderer.setRenderTarget(target);
		

		//console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );

	}

	

}

// Helper for passes that need to fill the viewport with a single quad.

const _camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

// https://github.com/mrdoob/three.js/pull/21358

const _geometry = new THREE.BufferGeometry();
_geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
_geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );

class FullScreenQuad {

	constructor( material ) {

		this._mesh = new THREE.Mesh( _geometry, material );

	}

	dispose() {

		this._mesh.geometry.dispose();

	}

	render( renderer ) {

		renderer.render( this._mesh, _camera );

	}

	get material() {

		return this._mesh.material;

	}

	set material( value ) {

		this._mesh.material = value;

	}

}

//export { Pass, FullScreenQuad };
