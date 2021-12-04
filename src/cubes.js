let pointLight;

pointLight = new THREE.PointLight(0x333333);
pointLight.position.set(100, 100, 100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xbbbbbb);
pointLight.position.set(100, 100, -100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0x222222);
pointLight.position.set(100, -100, 100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0x666666);
pointLight.position.set(100, -100, -100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xcccccc);
pointLight.position.set(-100, 100, 100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xcccccc);
pointLight.position.set(-100, -100, 100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xbbbbbb);
pointLight.position.set(-100, -100, -100);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xcccccc);
pointLight.position.set(-100, 100, -100);
scene.add(pointLight);


function marchingcubes() {
    /////////////////////////////////////////////////
    /**
     * Geometry part 3
     */
    resolution = 69;

    effect = new MarchingCubes(resolution, new THREE.MeshLambertMaterial({ color: 0xf8f8f8 }), true, true);
    effect.position.set(0, 0, 0);
    effect.scale.set(30, 30, 30);
    effect.isolation = 100;
    // effect.size = 40;
    effect.enableUvs = false;
    effect.enableColors = false;
    scene.add(effect);
}
marchingcubes();



const numball = 6;

function updateCubes(object, time) {

    object.reset();

    // fill the field with some metaballs
    const subtract = 25;
    const strength = 1.2 / ((Math.sqrt(numball) - 1) / 3 + 1);
    // let index3 = 0;

    // if (S.stage == 3) {
    //     index3 += .01;
    //     bianliang = Math.min(index3 * index3 * index3, 1);
    // } else if (S.stage != 3) {
    //     index3 = 0;
    // }

    for (let i = 0; i < numball; i++) {

        const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
        const bally = Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i)) * 0.3 + .5; // dip into the floor
        const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;

        object.addBall(ballx, bally, ballz, strength * Math.abs(Math.sin(time * .5 + i * 2)) + .2, subtract);
        // object.addBall(0.5, 0.5, 0.5, strength, 4 * bianliang);

        // object.addBall(0.5, 0.5, 0.5, strength, 4);
    }
}