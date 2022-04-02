varying vec2 FUV;
varying vec3 FNormal;

void main()
{
	FUV = uv;
	FNormal = normalize(normalMatrix*normal);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);  
}
