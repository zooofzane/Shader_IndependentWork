
 // varying vec3 vPosition;
varying vec3 vNormal;


void main() {
//      float strength = distance(gl_PointCoord, vec2(0.5));
//      strength = 1.0 - step(0.5,strength);

     float diff = dot(vec3(2.,4.,0.),vNormal);
     vec3 color =vec3(0.4941, 0.098, 0.098); 

     gl_FragColor = vec4(color,1.0);
    // gl_FragColor = vec4(diff+0.8);
}