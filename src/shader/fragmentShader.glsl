
 // varying vec3 vPosition;
varying vec3 vNormal;
   varying vec3 vNN;
   varying vec3 vEye;

void main() {
//      float strength = distance(gl_PointCoord, vec2(0.5));
//      strength = 1.0 - step(0.5,strength);
 vec3 fresnelColor = vec3(1.0, 0.4627, 0.9098);

     float diff = dot(vec3(2.,4.,0.),vNormal)*0.1;
     vec3 color =vec3(0.5529, 0.5529, 0.5529); 
      color += diff;
     gl_FragColor = vec4(color,1.0);

  //  gl_FragColor.rgba +=  ( 1.0 - -min(dot(vEye, normalize(vNN) ), 0.0) ) * vec4(fresnelColor,0.9)*0.9;

    // gl_FragColor = vec4(diff);
}