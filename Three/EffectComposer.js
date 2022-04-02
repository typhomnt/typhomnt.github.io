/*import {
	BufferGeometry,
	Clock,
	Float32BufferAttribute,
	LinearFilter,
	Mesh,
	OrthographicCamera,
	RGBAFormat,
	Vector2,
	WebGLRenderTarget
} from 'three';
import { CopyShader } from '../CopyShader.js';
import { ShaderPass } from './ShaderPass.js';
import { MaskPass } from './MaskPass.js';
import { ClearMaskPass } from './MaskPass.js';*/

class EffectComposer {

	constructor( renderer ) 
	{

		this.renderer = renderer;
		
		this.renderToScreen = true;

		this.passes = [];
		this.rendered_passes = [];
		this.outmaps = new Map();

		// dependencies

		if ( CopyShader === undefined ) 
		{

			console.error( 'THREE.EffectComposer relies on CopyShader' );

		}

		if ( ShaderPass === undefined ) 
		{

			console.error( 'THREE.EffectComposer relies on ShaderPass' );

		}

		//this.copyPass = new ShaderPass( CopyShader );

		this.clock = new THREE.Clock();

	}

	swapBuffers() {

		const tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	}

	addPass( pass ) {

		this.passes.push( pass );
		pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

	}

	insertPass( pass, index ) {

		this.passes.splice( index, 0, pass );
		pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

	}

	removePass( pass ) {

		const index = this.passes.indexOf( pass );

		if ( index !== - 1 ) {

			this.passes.splice( index, 1 );

		}

	}

	isLastEnabledPass( passIndex ) {

		for ( let i = passIndex + 1; i < this.passes.length; i ++ ) {

			if ( this.passes[ i ].enabled ) {

				return false;

			}

		}

		return true;

	}

	isPassRenderable( pass )
	{

		if(!pass.enabled)
			return false;
		for(let i = 0, il = pass.inputTexturesID.length; i < il; i ++ )
		{	
			if(!this.outmaps.has(pass.inputTexturesID[i]))
			{
				return false;	
			}
		}
		return true;
	}
	
	setPassInputTextures( pass )
	{
		for(let i = 0, il = pass.inputTexturesID.length; i < il; i ++ )
		{
			pass.inputTextures[pass.inputTexturesID[i]] = this.outmaps.get(pass.inputTexturesID[i]);
			
		}
	}
	

	render( deltaTime ) 
	{

		this.rendered_passes = [];
		this.outmaps = new Map();
		var enabled_pass_count = 0;
		for ( let i = 0, il = this.passes.length; i < il; i ++ ) 
		{
			this.passes[i].rendered = false;
			enabled_pass_count += this.passes[i].enabled;
			
		}
		// deltaTime value is in seconds

		if ( deltaTime === undefined ) {

			deltaTime = this.clock.getDelta();

		}

		const currentRenderTarget = this.renderer.getRenderTarget();

		let maskActive = false;

		const pass_loop_max = 100;
		var loop_count = 0;
		while(this.rendered_passes.length !== enabled_pass_count && loop_count < pass_loop_max)
		{
			for ( let i = 0, il = this.passes.length; i < il; i ++ ) 
			{
				if(this.isPassRenderable(this.passes[i]) && this.passes[i].rendered == false)
				{
									
					this.passes[i].renderToScreen = (this.rendered_passes.length == enabled_pass_count - 1);
					
					this.setPassInputTextures(this.passes[i]);
					this.passes[i].render(this.renderer,deltaTime,maskActive);
					this.rendered_passes.push(this.passes[i]);
					this.outmaps.set(this.passes[i].renderTarget.texture.name,this.passes[i].renderTarget);
					this.passes[i].rendered = true;
					this.passes[i].onRendered.call();
				}
			}
			loop_count++;
		}

		if(loop_count > pass_loop_max)
			console.error('EffectComposer exceded pass loop max ' + pass_loop_max)
		

		/*for ( let i = 0, il = this.passes.length; i < il; i ++ ) {

			const pass = this.passes[ i ];

			if ( pass.enabled === false ) continue;

			pass.renderToScreen = ( this.renderToScreen && this.isLastEnabledPass( i ) );
			pass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					const context = this.renderer.getContext();
					const stencil = this.renderer.state.buffers.stencil;

					//context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );
					stencil.setFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime );

					//context.stencilFunc( context.EQUAL, 1, 0xffffffff );
					stencil.setFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( MaskPass !== undefined ) {

				if ( pass instanceof MaskPass ) {

					maskActive = true;

				} else if ( pass instanceof ClearMaskPass ) {

					maskActive = false;

				}

			}

		}

		this.renderer.setRenderTarget( currentRenderTarget );*/

	}

	reset( renderTarget ) {

		if ( renderTarget === undefined ) {

			const size = this.renderer.getSize( new Vector2() );
			this._pixelRatio = this.renderer.getPixelRatio();
			this._width = size.width;
			this._height = size.height;

			renderTarget = this.renderTarget1.clone();
			renderTarget.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

		}

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	}

	setSize( width, height ) {

		this._width = width;
		this._height = height;

		const effectiveWidth = this._width * this._pixelRatio;
		const effectiveHeight = this._height * this._pixelRatio;


		for ( let i = 0; i < this.passes.length; i ++ ) {

			this.passes[ i ].setSize( effectiveWidth, effectiveHeight );

		}

	}

	setPixelRatio( pixelRatio ) {

		this._pixelRatio = pixelRatio;

		this.setSize( this._width, this._height );

	}

}




//export { EffectComposer, Pass, FullScreenQuad };


