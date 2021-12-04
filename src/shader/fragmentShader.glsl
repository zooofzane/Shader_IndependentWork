<<<<<<< Updated upstream



// void main() {
//     float strength = distance(gl_PointCoord, vec2(0.5));
//     strength = 1.0 - step(0.5,strength);
//     vec3 color =mix(vec3(0.0),vColor, strength); 

//     // gl_FragColor = vec4(color,1.0);
//         gl_FragColor = vec4(1.0);
// }


<<<<<<< HEAD
     gl_FragColor = vec4(color,1.0);
    // gl_FragColor = vec4(diff+0.8);
=======
void main() {
      float strength = distance(gl_PointCoord, vec2(0.5));
      strength = 1.0 - step(0.5, strength);
      vec3 color = vec3(1.0);

      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      gl_FragColor = vec4(color, 1.0);
>>>>>>> Stashed changes
=======
void main() {
     float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - step(0.5,strength);
       vec3 color =vec3(1.0); 

 gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
 gl_FragColor = vec4(color,1.0);
>>>>>>> parent of 34c394c (        update vertex shader)
}