uniform float uTime;
uniform float uSize;
uniform float uNoise;
uniform float ustate;
uniform float uHeight;

varying vec3 vColor;
varying vec3 vNormal;
varying vec4 vPosition;
varying vec3 vNN; 
varying vec3 vEye;
varying vec2 vUv;
varying float vNoiseParam;

attribute vec3 aRandom;


/**
noise
*/
// Classic Perlin 3D Noise 
// by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return  n_xyz+0.3;
}




float circleSDF(vec2 st, vec2 center){
    return length(st-center);// (>0)
}

float curveSDF(vec2 st, float center){
  return abs(st.x-center+sin(st.y * 0.7)*1.);
}



float generateHeight(vec3 pos){
    float hill = 0.;
    //create a flat path
    float scale = 0.;
    float width = 4.5;
    scale = smoothstep(width/2.-1.2,width/2.+1.2,curveSDF(pos.xy,0.0));
    
    //make the hill noise from front to back
    float a = step(pos.x,0.)*2.-1.;
    a*=0.4;

   vec3 p = vec3(pos.x*0.4+uTime*a,pos.y*0.3+uTime*0.4,pos.z);
   hill += uHeight * cnoise(p);
   hill += 1.* cnoise(vec3(pos.x*0.2+uTime*a,pos.y*0.3+0.5,pos.z));
   hill += 1.* cnoise(vec3(pos.x*0.6+uTime*a,pos.y*0.1+0.5,pos.z));
 //  vec3 p2 = vec3(1.,pos.y*0.2+1.,pos.z)*0.7;
 //  hill += 7.7 * cnoise(p2);
   hill *= scale *0.9;
   hill += 0.5* cnoise(pos*0.2);
   return hill;
}

float getDist(vec3 pos) { //get distance to the plane from the a input position
    float distToGround = pos.z +  generateHeight(pos);
    return distToGround;
}

vec3 estimateNormal(vec3 p) {
    float SMALL_NUMMBER = 0.001;
    vec3 n = vec3(
        getDist(vec3(p.x + SMALL_NUMMBER, p.yz)) -
        getDist(vec3(p.x - SMALL_NUMMBER, p.yz)),
        getDist(vec3(p.x, p.y + SMALL_NUMMBER, p.z)) -
        getDist(vec3(p.x, p.y - SMALL_NUMMBER, p.z)),
        getDist(vec3(p.xy, p.z + SMALL_NUMMBER)) -
        getDist(vec3(p.xy, p.z - SMALL_NUMMBER))
    );
    return normalize(n);
}


void main() {
    vNormal = estimateNormal(position);
    vUv = uv;
    mat4 LM = modelMatrix;
          LM[2][3] = 0.0;
          LM[3][0] = 0.0;
          LM[3][1] = 0.0;
          LM[3][2] = 0.0;

    vec4 GN = LM * vec4(normal.xyz, 1.0);

    vNN = normalize(GN.xyz);
    vEye = normalize(GN.xyz-cameraPosition);


    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    mvPosition.y += generateHeight(position);
    mvPosition.y -=1.;

    vPosition = mvPosition;
    vNoiseParam = generateHeight(position);

    gl_Position = projectionMatrix * mvPosition;
    
   

   

   

}


