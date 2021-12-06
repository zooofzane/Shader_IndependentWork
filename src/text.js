import * as THREE from 'three'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// import Stats from 'three/examples/jsm/libs/stats.module.js'

// var fontLoader = new FontLoader();
// fontLoader.load("../DINPro-Regular_Regular.typeface.json",function(tex){ 
//     var  textGeo = new THREE.TextGeometry('Test', {
//             size: 10,
//             height: 5,
//             curveSegments: 6,
//             font: tex,
//     });
//     var  color = new THREE.Color();
//     color.setRGB(255, 250, 250);
//     var  textMaterial = new THREE.MeshBasicMaterial({ color: color });
//     var  text = new THREE.Mesh(textGeo , textMaterial);
//     scene.add(text);
// })

var  textGeo = new TextGeometry('Test', {
    size: 10,
    height: 5,
    curveSegments: 6,
    // font: "helvetiker",
    style: "normal"});
var  color = new THREE.Color();
color.setRGB(255, 250, 250);
var  textMaterial = new THREE.MeshBasicMaterial({ color: color });
var  text = new THREE.Mesh(textGeo , textMaterial);


export default Text