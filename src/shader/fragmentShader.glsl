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

uniform vec3 uColArray[4];


vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
   vec3 color = vec3(0.5); 
   vec3 fresnelColor = vec3(1.0, 1.0, 1.0);

   /* -------------------------------------------------------------------------- */
/*                                    texture                                 */
/* -------------------------------------------------------------------------- */
   //color related to height;
 // color = vec3(vNoiseParam*0.5)+0.4;

/* -------------------------------------------------------------------------- */
/*                                    color patthern                                   */
/* -------------------------------------------------------------------------- */
   //gradient color
   vec3 brightness = uColArray[0];
   vec3 contrast =  uColArray[1];
   vec3 osc =  uColArray[2];
   vec3 phase =  uColArray[3];
   color = cosPalette(vUv.y * 0.3, brightness, contrast, osc, phase);
   
   //add light
   float diff = dot(normalize(vec3(0.5, -1., 0.)), vNormal);
   diff += 1.;
   diff *= 0.2;
   color += diff;

   gl_FragColor = vec4(color, 1.);
  
   // fresnelColor
   // gl_FragColor = vec4(gl_FragColor.rgb, 0.0);
   // gl_FragColor.rgba +=  ( 1.0- -min(dot(vEye, normalize(vNN) ), 0.0) ) * vec4(fresnelColor,1.0)*0.7;

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