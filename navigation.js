import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OrbitControls } from "https://esm.sh/three/addons/controls/OrbitControls.js";

// ATUALIZAÇÂO 1.5.2 

// fazendo aparecer uma linha branca nos planetas quando passar o mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let pulseTime = 0;

function createOutline(mesh) {
    const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.8
    });
    const outline = new THREE.Mesh(mesh.geometry.clone(), outlineMaterial);
    outline.scale.multiplyScalar(1.1);
    mesh.add(outline);
    return outline;
}

window.addEventListener("mousemove", (event) => {
    const rect = render.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetObjects);

    if (intersects.length > 0) {
        const hovered = intersects[0].object;
        const name = planetNames[hovered.uuid];
        if (name) {
            tooltip.innerText = name;
            tooltip.style.left = event.clientX + 10 + "px";
            tooltip.style.top = event.clientY + 10 + "px";
            tooltip.style.display = "block";
        }
    } else {
        tooltip.style.display = "none";
    }
});

// constantes para ajudar nos eventos
const defaultCameraPos = new THREE.Vector3(40, 60, 370);
const defaultTarget = new THREE.Vector3(0, 0, 0);
var g = 1;

// comandos
window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "f") {
    g+=0.5;
    camera.position.copy(defaultCameraPos);
    controls.target.copy(defaultTarget);
    controls.update();
  }
  if(event.key.toLowerCase() === "d"){
    g-=0.5;  //para todos
  }
  if(event.key.toLowerCase() === "r"){
    g=1;
  }
});

// Constante para escalar o universo
const SCALE = 1e-6;

// Cena, câmera, renderizador, controles
let scene = new THREE.Scene();

//luz no centro (que seria o sol)
const sunLight = new THREE.PointLight(0xffffff, 1.5, 0, 0); 
scene.add(sunLight);

let camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.5,
    3000 

);
camera.position.set(40, 60, 370); // começa em um frame legalzin
let positionatual = null;
window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const target = new THREE.Vector3();
    switch(key) {
        case '1' : //Mercúrio
            MercuryMesh.getWorldPosition(target);
            positionatual = MercuryMesh;
            break;
        case '2': //Vênus
            VenusMesh.getWorldPosition(target);
            positionatual = VenusMesh;
            break;
        case '3': //Terra
            worldMesh.getWorldPosition(target);
            positionatual = worldMesh;
            break;
        case '4': //Marte
            marsMesh.getWorldPosition(target);
            positionatual = marsMesh;
            break;
        case '5': //júpiter
            JupiterMesh.getWorldPosition(target);
            positionatual = JupiterMesh;
            break;
        case '6': //Saturno
            SaturnMesh.getWorldPosition(target);
            positionatual = SaturnMesh;
        break;
        case '7': // Urano
            UranoMesh.getWorldPosition(target);
            positionatual = UranoMesh;
            break;
        case '8': // Netuno
            NeptuneMesh.getWorldPosition(target);
            positionatual = NeptuneMesh;
            break;
        case '9': //parar o movimento dos planetas
            g = 0;
            break;
        case '0': //Resetar a camera
            positionatual = null;  //camera para de seguir
            camera.position.set(40, 60, 370);
            controls.target.set(0, 10, 0);
            controls.update();
            return;     
    }
    
});
let render = new THREE.WebGLRenderer({ alpha: true, antialias: true });
render.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(render.domElement);

// Loader de textura
const textureLoader = new THREE.TextureLoader();

// Universo (esfera gigante ao redor)
const universeTexture = textureLoader.load("textures/universe-texture.jpg");
const universeTexture2 = textureLoader.load("textures/universe-texture1.jpg");
const universeGeometry = new THREE.SphereGeometry(1000, 1000, 2000);
const universeMaterial = new THREE.MeshStandardMaterial({
    map: universeTexture, universeTexture2,
    side: THREE.BackSide
});
const universeMesh = new THREE.Mesh(universeGeometry, universeMaterial);
scene.add(universeMesh);

// Sol
const sunTexture = textureLoader.load("textures/Sol.jpg");
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
const sunObj = new THREE.Object3D();
sunObj.add(sunMesh);
scene.add(sunObj);
sunMesh.position.set(0, 0, 0);

// segundo sol para tentar dar um efeito legal no projeto
const sun2Texture = textureLoader.load("textures/Sol.jpg");
const sun2Geometry = new THREE.SphereGeometry(10.3, 32, 32);
const sun2Material = new THREE.MeshBasicMaterial({
    map: sun2Texture,
    depthTest: true,
    depthWrite: true,
    transparent: true,
    opacity: 0.3,
});
const sun2Mesh = new THREE.Mesh(sun2Geometry, sun2Material);
const sun2Obj = new THREE.Object3D();
sun2Obj.add(sun2Mesh);
scene.add(sun2Obj);
sun2Mesh.position.set(0, 0, 0);
sun2Mesh.rotation.y += 0.001; // rotação própria do sol


// Mercurio
const MercuryTexture = textureLoader.load("textures/Mercurio.jpg");
const MercuryGeometry = new THREE.SphereGeometry(0.38, 32, 32);
const MercuryMaterial = new THREE.MeshStandardMaterial({
    map: MercuryTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const MercuryMesh = new THREE.Mesh(MercuryGeometry, MercuryMaterial);
MercuryMesh.position.set(20, 0, 0); // 20 unidades de distância do Sol
const MercuryObj = new THREE.Object3D();
MercuryObj.add(MercuryMesh);
scene.add(MercuryObj);

// Venus
const VenusTexture = textureLoader.load("textures/Venus.jpg");
const VenusGeometry = new THREE.SphereGeometry(0.95, 32, 32);
const VenusMaterial = new THREE.MeshStandardMaterial({
    map: VenusTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const VenusMesh = new THREE.Mesh(VenusGeometry, VenusMaterial);
VenusMesh.position.set(30, 0, 0);  //30 unidades de distancia do sol
const VenusObj = new THREE.Object3D();
VenusObj.add(VenusMesh);
scene.add(VenusObj);

// Terra (Grupo que fará a Terra orbitar o Sol) 
let lastEarthRotation = 0;
let earthYears = 2025;

const earthOrbit = new THREE.Object3D();
scene.add(earthOrbit);

// Grupo que contém Terra e nuvens (rotação própria)
const earthGroup = new THREE.Object3D();
earthOrbit.add(earthGroup);

// Terra
const worldTexture = textureLoader.load("textures/small-world.jpg");
const worldGeometry = new THREE.SphereGeometry(1, 32, 32);
const worldMaterial = new THREE.MeshStandardMaterial({
    map: worldTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const worldMesh = new THREE.Mesh(worldGeometry, worldMaterial);
worldMesh.position.set(40, 0, 0); // Distância do Sol
earthGroup.add(worldMesh);

// Nuvens da Terra
const cloudTexture = textureLoader.load("textures/small-world-clouds.png");
const cloudGeometry = new THREE.SphereGeometry(1.05, 32, 32);
const cloudMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.8,
    depthTest: true,
    depthWrite: false
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloudMesh.position.set(40, 0, 0); // Mesma posição da Terra
earthGroup.add(cloudMesh);

// Grupo da órbita da Lua (ao redor da Terra)
const moonOrbit = new THREE.Object3D();
moonOrbit.position.set(40, 0, 0); // Orbitando a Terra
earthOrbit.add(moonOrbit); // Lua orbita Terra que orbita Sol

// Lua
const moonTexture = textureLoader.load("textures/Lua.jpg");
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.set(2, 0, 0); // Distância da Terra
moonOrbit.add(moonMesh);

// Marte
const marsTexture = textureLoader.load("textures/Marte.jpg");
const marsGeometry = new THREE.SphereGeometry(0.60, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({
    map: marsTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
marsMesh.position.set(50, 0, 0);
const marsObj = new THREE.Object3D();
marsObj.add(marsMesh);
scene.add(marsObj);

const MarsGroup = new THREE.Object3D();

const marsOrbit = new THREE.Object3D();
marsOrbit.add(MarsGroup);
scene.add(marsOrbit);

MarsGroup.add(marsObj); // assim marte e suas luas giram juntos

// Órbita de Fobos ao redor de Marte
const FobosOrbit = new THREE.Object3D();
FobosOrbit.position.set(50, 0, 0); // mesma posição de Marte
MarsGroup.add(FobosOrbit);

// Fobos (lua de Marte)
const FobosTexture = textureLoader.load("textures/Lua.jpg");
const FobosGeometry = new THREE.SphereGeometry(0.15, 32, 32);
const FobosMaterial = new THREE.MeshStandardMaterial({
    map: FobosTexture,
    map: FobosTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const FobosMesh = new THREE.Mesh(FobosGeometry, FobosMaterial);
FobosMesh.position.set(1.5, 0, 0); // distância de Marte
FobosOrbit.add(FobosMesh);

// Órbita de Deimos ao redor de Marte
const DeimosOrbit = new THREE.Object3D();
DeimosOrbit.position.set(50, 0, 0); // mesma posição de Marte
MarsGroup.add(DeimosOrbit);

// Deimos (segunda lua de Marte)
const DeimosTexture = textureLoader.load("textures/Lua.jpg");
const DeimosGeometry = new THREE.SphereGeometry(0.10, 32, 32);
const DeimosMaterial = new THREE.MeshStandardMaterial({
    map: DeimosTexture,
map: FobosTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const DeimosMesh = new THREE.Mesh(DeimosGeometry, DeimosMaterial);
DeimosMesh.position.set(2.3, 0, 0); // um pouco mais longe que Fobos
DeimosOrbit.add(DeimosMesh);


// Jupiter
const JupiterTexture = textureLoader.load("textures/Jupiter.jpg");
const JupiterGeometry = new THREE.SphereGeometry(11.2, 32, 32);
const JupiterMaterial = new THREE.MeshStandardMaterial({
    map: JupiterTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const JupiterMesh = new THREE.Mesh(JupiterGeometry, JupiterMaterial);
JupiterMesh.position.set(75,0,0);
const JupiterObj = new THREE.Object3D();
JupiterObj.add(JupiterMesh);
scene.add(JupiterObj);

//Saturno
const SaturnTexture = textureLoader.load("textures/Saturno.jpg");
const SaturnGeometry = new THREE.SphereGeometry(9.5, 32, 32);
const SaturnMaterial = new THREE.MeshStandardMaterial({
    map: SaturnTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const SaturnMesh = new THREE.Mesh(SaturnGeometry, SaturnMaterial);
SaturnMesh.position.set(0,0,0);

// Textura e mesh dos anéis de Saturno
const SaturnRingTexture = textureLoader.load("textures/Anel_de_Saturno.png");
const SaturnRingGeometry = new THREE.CylinderGeometry(
    16.5, // raio superior
    11.0, // raio inferior
    0.1,  // altura (espessura dos anéis)
    100,  // segmentos radiais
    1,    // segmentos em altura
    true  // openEnded = sem tampas
);

const SaturnRingMaterial = new THREE.MeshStandardMaterial({
    map: SaturnRingTexture,
    side: THREE.DoubleSide,
    depthTest: true,
    depthWrite: true,
    transparent: true // anel levemente transparente
});

const SaturnRingMesh = new THREE.Mesh(SaturnRingGeometry, SaturnRingMaterial);
SaturnRingMesh.rotation.x = Math.PI / 6;
SaturnRingMesh.rotation.z = THREE.MathUtils.degToRad(26.7); // inclinação de Saturno real
SaturnRingMesh.position.set(0, 0, 0);

// Grupo do planeta com seus anéis
const SaturnObj = new THREE.Object3D();
SaturnObj.add(SaturnMesh);
SaturnObj.add(SaturnRingMesh);
SaturnObj.position.set(0, 0, 0); // posição em relação ao Sol

// Grupo da órbita (translação)
const SaturnOrbit = new THREE.Object3D();
SaturnOrbit.add(SaturnObj);
scene.add(SaturnOrbit);

// Urano
const UranoTexture = textureLoader.load("textures/Uranos.jpg");
const UranoGeometry = new THREE.SphereGeometry(4, 32, 32);
const UranonMaterial = new THREE.MeshStandardMaterial({
    map: UranoTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const UranoMesh = new THREE.Mesh(UranoGeometry, UranonMaterial);
const UranoOrbit = new THREE.Object3D();
scene.add(UranoOrbit);
UranoMesh.position.set(75, 0, 0);
UranoOrbit.add(UranoMesh);

// Netuno
const NeptuneTexture = textureLoader.load("textures/Netuno.jpg");
const NeptuneGeometry = new THREE.SphereGeometry(3.88, 32, 32);
const NeptuneMaterial = new THREE.MeshStandardMaterial({
    map: NeptuneTexture,
    depthTest: true,
    depthWrite: true,
    transparent: false
});
const NeptuneMesh = new THREE.Mesh(NeptuneGeometry, NeptuneMaterial);
const NeptuneObj = new THREE.Object3D();
NeptuneObj.add(NeptuneMesh);
NeptuneObj.position.set(0,0,0);
scene.add(NeptuneObj);

// OrbitControls
const controls = new OrbitControls(camera, render.domElement);
controls.minDistance = 1;
controls.maxDistance = 1500;
controls.enableDamping = true;

// Eixos de referência
scene.add(new THREE.AxesHelper(10));

// Criação dos contornos (silhuetas)
MercuryMesh.userData.outline = createOutline(MercuryMesh);
VenusMesh.userData.outline = createOutline(VenusMesh);
worldMesh.userData.outline = createOutline(worldMesh);
marsMesh.userData.outline = createOutline(marsMesh);
JupiterMesh.userData.outline = createOutline(JupiterMesh);
SaturnMesh.userData.outline = createOutline(SaturnMesh);
UranoMesh.userData.outline = createOutline(UranoMesh);
NeptuneMesh.userData.outline = createOutline(NeptuneMesh);

// mostrando os nomes dos planetas
const tooltip = document.getElementById('tooltip');
const planetObjects = [
    MercuryMesh, VenusMesh, worldMesh, marsMesh,
    JupiterMesh, SaturnMesh, UranoMesh, NeptuneMesh
];

const planetNames = {
    [MercuryMesh.uuid]: "1° - Mercúrio:\nO menor planeta e o mais\npróximo do Sol. Não possui\natmosfera significativa e tem\nvariações extremas de temperatura.",
    [VenusMesh.uuid]: "2° - Vênus:\nSemelhante em tamanho à Terra,\nmas com atmosfera densa e quente\ndevido ao efeito estufa intenso.",
    [worldMesh.uuid]: "3° - Terra:\nNosso lar. O único planeta com\nvida conhecida. Possui água líquida\ne atmosfera rica em oxigênio.",
    [marsMesh.uuid]: "4° - Marte:\nChamado de 'planeta vermelho'.\nTem calotas polares, montanhas\ngigantes e sinais de água antiga.",
    [JupiterMesh.uuid]: "5° - Júpiter:\nO maior planeta do Sistema Solar.\nGigante gasoso com uma Grande\nMancha Vermelha e muitas luas.",
    [SaturnMesh.uuid]: "6° - Saturno:\nFamoso por seus anéis feitos de\ngelo e poeira. Também possui\nmuitas luas ao seu redor.",
    [UranoMesh.uuid]: "7° - Urano:\nGigante gelado com coloração\nazul-esverdeada. Gira quase\ndeitado em relação ao Sol.",
    [NeptuneMesh.uuid]: "8° - Netuno:\nO mais distante do Sol.\nPossui ventos poderosos e\numa atmosfera azul intensa."
};

// criando as linhas das orbitas dos planetas
function createOrbitLine(radius, segments = 128, color = 0xffffff) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
            Math.cos(theta) * radius,
            0,
            Math.sin(theta) * radius
        ));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2
    });
    return new THREE.LineLoop(geometry, material);
}

// Orbita de Mercúrio
const orbitMercury = createOrbitLine(20, 128, 0xaaaaaa);
scene.add(orbitMercury);

// Orbita de Vênus
const orbitVenus = createOrbitLine(30, 128, 0xffaa88);
scene.add(orbitVenus);

// Orbita da Terra
const orbitEarth = createOrbitLine(40, 128, 0x00aaff);
scene.add(orbitEarth);

// Orbita de Marte
const orbitMars = createOrbitLine(50, 128, 0xff5533);
scene.add(orbitMars);

// Orbita de Júpiter
const orbitJupiter = createOrbitLine(75, 128, 0xffddaa);
scene.add(orbitJupiter);

// Orbita de Saturno
const orbitSaturn = createOrbitLine(115, 128, 0xffeecc);
scene.add(orbitSaturn);

// Orbita de Urano
const orbitUranus = createOrbitLine(150, 128, 0xaaffff);
scene.add(orbitUranus);

// Orbita de Netuno
const orbitNeptune = createOrbitLine(180, 128, 0x8899ff);
scene.add(orbitNeptune);

// Loop de animação
let passouPorZero = true;

function animate() {
    requestAnimationFrame(animate);

    // Rotação e posição dos planetas
    sunMesh.rotation.y += 0.001;
    earthOrbit.rotation.y += 0.001*g;
    MercuryMesh.rotation.y += 0.001;
    MercuryObj.rotation.y += 0.0047*g;
    VenusObj.rotation.y += 0.0035*g;
    VenusMesh.rotation.y += -0.001;
    marsOrbit.rotation.y += 0.0005 * g;
    marsMesh.rotation.y += 0.007;
    VenusMesh.rotation.y += -0.0001;
    JupiterObj.rotation.y += 0.0002*g;
    JupiterMesh.rotation.y += 0.003;
    SaturnMesh.rotation.y += 0.0025;
    SaturnObj.rotation.y += 0.00010*g;
    UranoMesh.rotation.y += -0.002;
    UranoOrbit.rotation.y += -0.00007*g;
    NeptuneObj.rotation.y += 0.00003*g;
    NeptuneMesh.rotation.y += 0.002;
    cloudMesh.rotation.y -= 0.005;
    worldMesh.rotation.y += 0.002;
    moonOrbit.rotation.y += 0.004*g;
    marsMesh.rotation.y += 0.0005;

    FobosOrbit.rotation.y += 0.01 * g;
    DeimosOrbit.rotation.y += 0.006 * g;


    MercuryMesh.position.x = 20;
    worldMesh.position.x = 40;
    cloudMesh.position.x = 40;
    marsMesh.position.x = 50;
    JupiterMesh.position.x = 75;
    SaturnMesh.position.x = 115;
    SaturnRingMesh.position.x = 115;
    UranoMesh.position.x = 150;
    NeptuneMesh.position.x = 180;

    controls.update();

    if (positionatual) { //faz a camera seguir o planeta 
        const pos = new THREE.Vector3();
        positionatual.getWorldPosition(pos);
        camera.position.set(pos.x, pos.y + 10, pos.z + 40);
        controls.target.copy(pos);
        controls.update();
    }

   // Atualiza silhueta (efeito pulsar)
    pulseTime += 0.01;
    planetObjects.forEach(p => {
    if (p.userData.outline) {
        p.userData.outline.visible = false;
        p.userData.outline.scale.setScalar(1.1 + Math.sin(pulseTime) * 0.05);
    }
    });

    const intersects = raycaster.intersectObjects(planetObjects);
    if (intersects.length > 0) {
        const hovered = intersects[0].object;
        if (hovered.userData.outline) {
            hovered.userData.outline.visible = true;
        }
    }

    render.render(scene, camera);

    // Translação da Terra
    earthOrbit.rotation.y += 0.001 * g;

    // Normaliza a rotação atual entre 0 e 2π
    const normalizedRotation = (earthOrbit.rotation.y % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

    // Detecta a passagem pela origem
    if (!passouPorZero && normalizedRotation < 0.1) {
        if (g > 0) {
            earthYears += 1;
        } else if (g < 0) {
            earthYears -= 1;
        }
        console.log(`Ano ${earthYears}`);
        passouPorZero = true;
    }

    // Libera a trava depois que já passou bem longe do zero
    if (normalizedRotation > 1.0) {
        passouPorZero = false;
    }

    // Atualiza valor antigo para próxima comparação
    lastEarthRotation = earthOrbit.rotation.y;

    document.getElementById('year-counter').textContent = `Ano: ${earthYears}`;

}

animate();