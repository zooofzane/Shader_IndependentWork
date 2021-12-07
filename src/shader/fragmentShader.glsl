 varying vec4 vPosition;
varying vec3 vNormal;
varying float vNoiseParam;
varying vec2 vUv;
varying vec3 vNN; 
varying vec3 vEye;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform float uHeight;


vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
   vec3 color = vec3(0.5); 
   vec3 fresnelColor = vec3(1.0, 0.4627, 0.9098);

   /* -------------------------------------------------------------------------- */
/*                                    texture                                 */
/* -------------------------------------------------------------------------- */
   //color related to height;
  color = vec3(vNoiseParam*0.5)+0.4;

/* -------------------------------------------------------------------------- */
/*                                    color patthern                                   */
/* -------------------------------------------------------------------------- */
   //pink and yellow
   float diff = dot(vec3(2., 4., 1.), vNormal) * 0.1;
   vec3 brightness = vec3(1.0, 0.6275, 0.2784);
   vec3 contrast = vec3(0.1451, 0.1451, 0.1451);
   vec3 osc = vec3(6.2);
   vec3 phase = vec3(0.102, 0.4157, 1.0);
  // color *= cosPalette(vUv.y * 0.3, brightness, contrast, osc, phase);
  // color += diff*0.4;





   gl_FragColor = vec4(color, 1.);
  
   //fresnelColor
   // gl_FragColor = vec4(gl_FragColor.rgb, 0.3);
   // gl_FragColor.rgba +=  ( 1.0 - -min(dot(vEye, normalize(vNN) ), 0.0) ) * vec4(fresnelColor,0.0)*0.9;

   //add fog
   #ifdef USE_FOG
      #ifdef USE_LOGDEPTHBUF_EXT
         float depth = gl_FragDepthEXT / gl_FragCoord.w;
      #else
         float depth = gl_FragCoord.z / gl_FragCoord.w;
      #endif
      float fogFactor = smoothstep( fogNear, fogFar, depth );
      gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
   #endif


   // gl_FragColor = vec4(diff);
}