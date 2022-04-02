/**
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */

const OutlineShader = {

	uniforms: {
		
		'normal_scene': { value: null },
		'rendered_scene': { value: null },
		'texture_size' : { value: new THREE.Vector2()},
		'opacity' : {value: 1.0}

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
		uniform sampler2D normal_scene;
		uniform vec2 texture_size;
		uniform float opacity;		

		varying vec2 vUv;
		
		float normal_contour_scale = 2.0;
		vec3 contour_color = vec3(0);
		float sobelNormal(sampler2D tex)
		{
		    vec2 size = texture_size;
		    float resx = 0.5 / size.x;
    		    float resy = 0.5 / size.y;
    		    vec3 nx = texture2D(tex, clamp(vUv + vec2(resx, 0), 0.0, 1.0)).xyz;
		    vec3 nx_1 = texture2D(tex, clamp(vUv + vec2(-resx, 0), 0.0, 1.0)).xyz;
    		    vec3 ny = texture2D(tex, clamp(vUv + vec2(0, resy), 0.0, 1.0)).xyz;
		    vec3 ny_1 = texture2D(tex, clamp(vUv + vec2(0, -resy), 0.0, 1.0)).xyz;
		    vec3 nxy = texture2D(tex, clamp(vUv + vec2(resx, resy), 0.0, 1.0)).xyz;
		    vec3 nx_1y = texture2D(tex, clamp(vUv + vec2(-resx, resy), 0.0, 1.0)).xyz;
		    vec3 nxy_1 = texture2D(tex, clamp(vUv + vec2(resx, -resy), 0.0, 1.0)).xyz;
		    vec3 nx_1y_1 = texture2D(tex, clamp(vUv + vec2(-resx, -resy), 0.0, 1.0)).xyz;
    		    vec3 normal = texture2D(tex,vUv).xyz;
                    vec3 d_nx = nx + nx_1 - 2.0*(normal);
                    vec3 d_ny = ny + ny_1 - 2.0*(normal);

		    /*d_nx = -nx_1y + nxy + 2.0 * (-nx_1 + nx) - nx_1y + nxy_1;
		    d_ny = nx_1y - nx_1y_1 + 2.0 * (-ny_1 + ny) + nxy - nxy_1;
		    float Gn = sqrt(pow(length(d_nx),2.0) + pow(length(d_ny ),2.0));
		    return Gn*normal_contour_scale < 1.0 ? 1.0 : 0.0;*/

                    float Gn = (length(d_nx / resx) + length(d_ny / resy)) * 2.0f;
		    return Gn*normal_contour_scale*0.01f < 1.0 ? 1.0 : 0.0;

	    	}
		
		void main() 
		{

			gl_FragColor.w = texture2D(rendered_scene, vUv).w;
			float contour = sobelNormal(normal_scene); /*sobelDepth(depthTexture)*/
			
			
			float attenuation;

			if(opacity <= 1.0)
			  attenuation =  opacity;
			
			attenuation *= step(contour,attenuation - 1.0 + opacity); 
							

			gl_FragColor.xyz = mix(contour_color,texture2D(rendered_scene, vUv).xyz,contour)*attenuation;
		}`

};



