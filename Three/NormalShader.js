const NormalShader = {

	uniforms: {
		

	},

	vertexShader: /* glsl */`
		varying vec2 FUV;
		varying vec3 FNormal;

		void main()
		{
			FUV = uv;
			//Bad compute normal matric properly
			FNormal =  normalize(normalMatrix*normal);
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);  
	}`,

	fragmentShader: /* glsl */`
		varying vec2 vUv;
		varying vec3 FNormal;
		void main() {
			gl_FragColor = vec4(FNormal,1.0);
		}`

};

