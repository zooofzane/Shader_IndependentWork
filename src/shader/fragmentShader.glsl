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
uniform int uColPatternIndex;


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
   vec3 colPattern1[4] = vec3[](vec3(1.0, 0.6275, 0.2784),vec3(0.1451, 0.1451, 0.1451),vec3(6.2),vec3(0.102, 0.4157, 1.0));
   vec3 colPattern2[4] = vec3[](vec3(0.1216, 0.1098, 0.8549),vec3(0.6863, 0.3843, 0.3843),vec3(1.3,0.1,1.2),vec3(0.651, 0.0314, 0.8392));
   vec3 brightness,contrast,osc,phase;
 

   if(uColPatternIndex==0){    
    brightness = colPattern1[0];
    contrast =  colPattern1[1];
    osc =  colPattern1[2];
    phase =  colPattern1[3];
   }else{
    brightness = colPattern2[0];
    contrast =  colPattern2[1];
    osc =  colPattern2[2];
    phase =  colPattern2[3];
   }
   //gradient color

   color = cosPalette(vUv.y * 0.3, brightness, contrast, osc, phase);
   
   //add light
   float diff = dot(normalize(vec3(3.0, -7., 1.)), vNormal);
   diff += 0.7;
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