/*import {
	ShaderMaterial,
	UniformsUtils
} from 'three';
import { Pass, FullScreenQuad } from './Pass.js'; */

class ShaderPass extends Pass {

	constructor( shader, renderer, inputTexturesID, targetName ) {

		super(renderer, inputTexturesID,targetName);

		if ( shader instanceof THREE.ShaderMaterial ) 
		{

			this.uniforms = shader.uniforms;

			this.material = shader;

		} 
		else if ( shader ) 
		{

			this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			this.material = new THREE.ShaderMaterial( {

				defines: Object.assign( {}, shader.defines ),
				uniforms: this.uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader

			} );

		}

		for(const textureID of this.inputTexturesID)
		{
			var exist_u = false;
			for(const uniform of Object.keys(this.uniforms))
			{
				if(textureID == uniform)
				{
					exist_u = true;
					break;
				}
						
			}
				
			if(!exist_u)
			{
				console.error( 'THREE.ShaderPass: inputTextureIDs not in corresponding Shader' );
			}			
		}

		this.fsQuad = new FullScreenQuad( this.material );

	}

	render( renderer, /*, deltaTime, maskActive */ ) 
	{	
		
		
		for(const textureID  of Object.keys(this.inputTextures))
		{
			if ( this.uniforms[ textureID ] ) 
			{

				this.uniforms[ textureID ].value = this.inputTextures[textureID];

			}
		}

		for(const uniform  of Object.keys(this.uniforms))
		{
			if(uniform == 'texture_size')
				this.uniforms[uniform].value = renderer.getSize( new THREE.Vector2() );
		}

		this.fsQuad.material = this.material;
		
		super.render(renderer)
		if ( this.renderToScreen ) 
		{
			
			this.fsQuad.render( renderer );

		} else 
		{
			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			this.fsQuad.render( renderer );

		}

	}

}

//export { ShaderPass };
