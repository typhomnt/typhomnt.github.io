/**
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */

const LuminosityShader = {

	uniforms: {

		'rendered_scene': { value: null }

	},

	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		#include <common>
		uniform sampler2D rendered_scene;
		varying vec2 vUv;
		void main() {
			vec4 texel = texture2D( rendered_scene, vUv );
			float l = linearToRelativeLuminance( texel.rgb );
			gl_FragColor = vec4( l, l, l, texel.w );
		}`

};



