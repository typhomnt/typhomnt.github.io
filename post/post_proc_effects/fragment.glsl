varying vec2 FUV;
varying vec3 FNormal;

void main()
{
	gl_FragColor = vec4(FNormal,1.0);
}
