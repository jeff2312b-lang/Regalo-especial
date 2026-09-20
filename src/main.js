import * as THREE from "three";

// ============================================================
// ESCENA
// ============================================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010105);

const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0.15, 15);

// ============================================================
// RENDERER
// ============================================================

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

document
  .getElementById("app")
  .appendChild(renderer.domElement);

// ============================================================
// ILUMINACIÓN
// ============================================================

scene.add(
  new THREE.AmbientLight(
    0x8a6425,
    1.35
  )
);

const mainLight =
  new THREE.DirectionalLight(
    0xffd15c,
    4.5
  );

mainLight.position.set(
  -4,
  7,
  8
);

scene.add(mainLight);

const frontLight =
  new THREE.PointLight(
    0xffb52c,
    3.5,
    17
  );

frontLight.position.set(
  0,
  1,
  5
);

scene.add(frontLight);

const sideLight =
  new THREE.PointLight(
    0xffd86a,
    2.2,
    14
  );

sideLight.position.set(
  5,
  3,
  3
);

scene.add(sideLight);

// ============================================================
// COLORES
// ============================================================

const GOLD = [
  0xffb91e,
  0xffc52d,
  0xffd13c,
  0xffd94d,
  0xf6a91a,
  0xffe06a
];

const GREEN = [
  0x294915,
  0x355b19,
  0x416c1d,
  0x507d23
];

// ============================================================
// MATERIALES
// ============================================================

function material(color, roughness = 0.62) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0.04,
    side: THREE.DoubleSide
  });
}

const petalMaterials =
  GOLD.map(c => material(c, 0.56));

const leafMaterials =
  GREEN.map(c => material(c, 0.85));

const centerMaterial =
  material(0x3a1e06, 0.92);

const seedMaterial =
  material(0xa66b12, 0.7);

const stemMaterial =
  material(0x254117, 0.94);

// ============================================================
// GEOMETRÍA DEL PÉTALO
// ============================================================

function createPetalGeometry() {

  const shape =
    new THREE.Shape();

  shape.moveTo(0, 0);

  shape.bezierCurveTo(
    -0.38,
    0.28,
    -0.48,
    0.92,
    -0.18,
    1.48
  );

  shape.bezierCurveTo(
    -0.04,
    1.70,
    0.16,
    1.70,
    0.31,
    1.48
  );

  shape.bezierCurveTo(
    0.56,
    0.90,
    0.44,
    0.30,
    0,
    0
  );

  const geometry =
    new THREE.ShapeGeometry(shape);

  geometry.translate(
    0,
    -0.70,
    0
  );

  return geometry;
}

const petalGeometry =
  createPetalGeometry();

// ============================================================
// GIRASOL
// ============================================================

function createSunflower(scale = 1) {

  const group =
    new THREE.Group();

  group.scale.setScalar(scale);

  const outer = 22;

  for (let i = 0; i < outer; i++) {

    const angle =
      (i / outer) *
      Math.PI *
      2;

    const petal =
      new THREE.Mesh(
        petalGeometry,
        petalMaterials[
          Math.floor(
            Math.random() *
            petalMaterials.length
          )
        ]
      );

    const radius =
      THREE.MathUtils.randFloat(
        0.73,
        0.88
      );

    petal.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      THREE.MathUtils.randFloat(
        -0.02,
        0.06
      )
    );

    petal.rotation.z =
      angle - Math.PI / 2;

    petal.rotation.x =
      THREE.MathUtils.randFloat(
        -0.10,
        0.10
      );

    petal.rotation.y =
      THREE.MathUtils.randFloat(
        -0.08,
        0.08
      );

    petal.scale.set(
      THREE.MathUtils.randFloat(
        0.82,
        1.08
      ),
      THREE.MathUtils.randFloat(
        0.90,
        1.15
      ),
      1
    );

    group.add(petal);
  }

  const middle = 18;

  for (let i = 0; i < middle; i++) {

    const angle =
      (i / middle) *
      Math.PI *
      2 +
      0.17;

    const petal =
      new THREE.Mesh(
        petalGeometry,
        petalMaterials[
          Math.floor(
            Math.random() *
            petalMaterials.length
          )
        ]
      );

    petal.position.set(
      Math.cos(angle) * 0.52,
      Math.sin(angle) * 0.52,
      0.08
    );

    petal.rotation.z =
      angle - Math.PI / 2;

    petal.scale.set(
      0.58,
      0.73,
      1
    );

    group.add(petal);
  }

  const center =
    new THREE.Mesh(
      new THREE.CircleGeometry(
        0.57,
        48
      ),
      centerMaterial
    );

  center.position.z = 0.18;

  group.add(center);

  for (let i = 0; i < 120; i++) {

    const angle =
      i * 2.39996;

    const radius =
      0.055 *
      Math.sqrt(i);

    const seed =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.021,
          5,
          5
        ),
        seedMaterial
      );

    seed.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0.21
    );

    group.add(seed);
  }

  return group;
}

// ============================================================
// FLORES PEQUEÑAS
// ============================================================

function createSmallFlower(scale = 0.22) {

  const group =
    new THREE.Group();

  const count = 6;

  for (let i = 0; i < count; i++) {

    const angle =
      (i / count) *
      Math.PI *
      2;

    const petal =
      new THREE.Mesh(
        petalGeometry,
        petalMaterials[
          Math.floor(
            Math.random() *
            petalMaterials.length
          )
        ]
      );

    petal.position.set(
      Math.cos(angle) * 0.15,
      Math.sin(angle) * 0.15,
      0
    );

    petal.rotation.z =
      angle - Math.PI / 2;

    petal.scale.set(
      0.20,
      0.30,
      1
    );

    group.add(petal);
  }

  const center =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.075,
        10,
        10
      ),
      seedMaterial
    );

  center.position.z = 0.08;

  group.add(center);

  group.scale.setScalar(scale);

  return group;
}

// ============================================================
// ROSA
// ============================================================

function createRose(scale = 0.6) {

  const group =
    new THREE.Group();

  for (let layer = 0; layer < 4; layer++) {

    const count =
      7 + layer * 2;

    const radius =
      0.10 +
      layer * 0.16;

    for (let i = 0; i < count; i++) {

      const angle =
        (i / count) *
        Math.PI *
        2 +
        layer * 0.42;

      const petal =
        new THREE.Mesh(
          petalGeometry,
          petalMaterials[
            Math.floor(
              Math.random() *
              petalMaterials.length
            )
          ]
        );

      petal.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        layer * 0.045
      );

      petal.rotation.z =
        angle -
        Math.PI / 2;

      petal.scale.set(
        0.28 + layer * 0.07,
        0.43 + layer * 0.07,
        1
      );

      group.add(petal);
    }
  }

  group.scale.setScalar(scale);

  return group;
}

// ============================================================
// TALLOS
// ============================================================

function createHiddenStem(
  start,
  end,
  thickness = 0.025
) {

  const middle =
    new THREE.Vector3()
      .lerpVectors(
        start,
        end,
        0.5
      );

  middle.x +=
    THREE.MathUtils.randFloat(
      -0.10,
      0.10
    );

  const curve =
    new THREE.CatmullRomCurve3([
      start,
      middle,
      end
    ]);

  const geometry =
    new THREE.TubeGeometry(
      curve,
      12,
      thickness,
      5,
      false
    );

  return new THREE.Mesh(
    geometry,
    stemMaterial
  );
}

// ============================================================
// HOJAS
// ============================================================

function createLeaf(
  position,
  scale = 0.7,
  rotation = 0
) {

  const shape =
    new THREE.Shape();

  shape.moveTo(0, 0);

  shape.bezierCurveTo(
    0.30,
    0.30,
    0.90,
    0.34,
    1.35,
    0
  );

  shape.bezierCurveTo(
    0.90,
    -0.36,
    0.30,
    -0.40,
    0,
    0
  );

  const leaf =
    new THREE.Mesh(
      new THREE.ShapeGeometry(shape),
      leafMaterials[
        Math.floor(
          Math.random() *
          leafMaterials.length
        )
      ]
    );

  leaf.position.copy(position);

  leaf.rotation.z =
    rotation;

  leaf.rotation.y =
    THREE.MathUtils.randFloat(
      -0.25,
      0.25
    );

  leaf.scale.setScalar(scale);

  return leaf;
}

// ============================================================
// RAMO
// ============================================================

const bouquet =
  new THREE.Group();

scene.add(bouquet);

// ============================================================
// FLORES PRINCIPALES
// ============================================================

const mainFlowers = [
  [-3.00, 2.65, -0.20, 0.88, -0.12],
  [-1.82, 3.30, -0.28, 0.84, 0.04],
  [-0.62, 3.70, -0.35, 0.92, -0.05],
  [0.72, 3.77, -0.32, 0.96, 0.03],
  [1.90, 3.36, -0.24, 0.86, 0.08],
  [3.02, 2.66, -0.18, 0.90, -0.08],
  [-2.48, 2.18, 0.55, 0.78, -0.12],
  [-1.18, 2.40, 0.72, 0.83, 0.05],
  [0.10, 2.32, 0.84, 0.80, -0.04],
  [1.46, 2.42, 0.68, 0.82, 0.07],
  [2.58, 2.08, 0.55, 0.79, -0.08]
];

mainFlowers.forEach(
  ([x, y, z, size, rotation], index) => {

    const flower =
      createSunflower(size);

    flower.position.set(
      x,
      y,
      z
    );

    flower.rotation.z =
      rotation;

    flower.userData.floatOffset =
      index * 0.5;

    bouquet.add(flower);

    const start =
      new THREE.Vector3(
        THREE.MathUtils.randFloat(
          -0.38,
          0.38
        ),
        -0.18,
        -0.05
      );

    const end =
      new THREE.Vector3(
        x * 0.52,
        y - 0.92,
        z - 0.20
      );

    const stem =
      createHiddenStem(
        start,
        end,
        index < 6
          ? 0.027
          : 0.022
      );

    bouquet.add(stem);
  }
);

// ============================================================
// FLORES EXTRA
// ============================================================

const extraFlowers = [
  [-3.30, 1.88, 0.75, 0.52],
  [-2.82, 2.38, 0.88, 0.48],
  [-1.82, 1.80, 0.82, 0.52],
  [-0.78, 1.98, 0.94, 0.47],
  [0.50, 1.92, 0.96, 0.50],
  [1.65, 1.96, 0.88, 0.51],
  [2.68, 1.80, 0.72, 0.53],
  [3.22, 2.23, 0.62, 0.48]
];

extraFlowers.forEach(
  ([x, y, z, scale], index) => {

    const flower =
      createSmallFlower(scale);

    flower.position.set(
      x,
      y,
      z
    );

    flower.rotation.z =
      Math.random() *
      Math.PI *
      2;

    flower.userData.floatOffset =
      20 + index;

    bouquet.add(flower);
  }
);

// ============================================================
// ROSAS
// ============================================================

const roses = [
  [-2.95, 1.68, 0.92, 0.58],
  [-1.50, 1.60, 1.00, 0.54],
  [-0.10, 1.74, 1.06, 0.57],
  [1.32, 1.66, 0.98, 0.58],
  [2.78, 1.68, 0.88, 0.55]
];

roses.forEach(
  ([x, y, z, scale], index) => {

    const rose =
      createRose(scale);

    rose.position.set(
      x,
      y,
      z
    );

    rose.rotation.z =
      THREE.MathUtils.randFloat(
        -0.25,
        0.25
      );

    rose.userData.floatOffset =
      30 + index;

    bouquet.add(rose);
  }
);

// ============================================================
// HOJAS
// ============================================================

const leaves = [
  [-3.15, 0.48, 0.55, 0.72, 2.60],
  [-2.72, 0.24, 0.62, 0.66, 2.85],
  [-2.38, 0.74, 0.58, 0.68, 2.55],
  [-1.98, 0.14, 0.72, 0.70, 2.75],
  [-1.52, 0.55, 0.68, 0.74, 2.80],
  [-1.05, -0.02, 0.76, 0.67, 2.95],
  [-0.55, 0.46, 0.82, 0.70, 2.75],
  [0.00, 0.08, 0.82, 0.68, 0.30],
  [0.58, 0.43, 0.80, 0.70, 0.35],
  [1.10, 0.00, 0.70, 0.70, 0.38],
  [1.58, 0.50, 0.66, 0.76, 0.38],
  [2.05, 0.16, 0.64, 0.72, 0.42],
  [2.52, 0.62, 0.55, 0.74, 0.34],
  [2.95, 0.24, 0.54, 0.70, 0.22],
  [-0.88, 0.82, 0.72, 0.58, 2.80],
  [0.84, 0.80, 0.68, 0.62, 0.32]
];

leaves.forEach(
  ([x, y, z, scale, rotation], index) => {

    const leaf =
      createLeaf(
        new THREE.Vector3(
          x,
          y,
          z
        ),
        scale,
        rotation
      );

    leaf.userData.floatOffset =
      50 + index;

    bouquet.add(leaf);
  }
);

// ============================================================
// FLORES PEQUEÑAS ADICIONALES
// ============================================================

for (let i = 0; i < 14; i++) {

  const angle =
    THREE.MathUtils.randFloat(
      -2.7,
      2.7
    );

  const x =
    Math.sin(angle) * 2.45;

  const y =
    THREE.MathUtils.randFloat(
      1.25,
      2.55
    );

  const flower =
    createSmallFlower(
      THREE.MathUtils.randFloat(
        0.15,
        0.23
      )
    );

  flower.position.set(
    x,
    y,
    THREE.MathUtils.randFloat(
      0.65,
      1.0
    )
  );

  flower.rotation.z =
    Math.random() *
    Math.PI *
    2;

  bouquet.add(flower);
}

// ============================================================
// ENVOLTURA — VIOLETA INTENSO
// ============================================================

function createWrapper() {

  const group =
    new THREE.Group();

  const shape =
    new THREE.Shape();

  shape.moveTo(
    -2.15,
    -0.18
  );

  shape.quadraticCurveTo(
    -1.48,
    0.04,
    -0.75,
    -0.08
  );

  shape.quadraticCurveTo(
    -0.28,
    0.02,
    0,
    -0.06
  );

  shape.quadraticCurveTo(
    0.30,
    0.02,
    0.77,
    -0.08
  );

  shape.quadraticCurveTo(
    1.50,
    0.04,
    2.15,
    -0.18
  );

  shape.quadraticCurveTo(
    2.00,
    -1.05,
    1.58,
    -2.15
  );

  shape.quadraticCurveTo(
    1.12,
    -3.15,
    0.70,
    -4.02
  );

  shape.quadraticCurveTo(
    0.32,
    -4.38,
    0,
    -4.27
  );

  shape.quadraticCurveTo(
    -0.32,
    -4.38,
    -0.70,
    -4.02
  );

  shape.quadraticCurveTo(
    -1.12,
    -3.15,
    -1.58,
    -2.15
  );

  shape.quadraticCurveTo(
    -2.00,
    -1.05,
    -2.15,
    -0.18
  );

  const paper =
    new THREE.Mesh(
      new THREE.ShapeGeometry(shape),
      new THREE.MeshStandardMaterial({
        color: 0x7b2cbf,
        roughness: 0.64,
        metalness: 0.05,
        transparent: true,
        opacity: 0.97,
        side: THREE.DoubleSide
      })
    );

  paper.position.z = 1.35;

  group.add(paper);

  const foldMaterial =
    new THREE.LineBasicMaterial({
      color: 0xb96ee8,
      transparent: true,
      opacity: 0.48
    });

  const folds = [
    -1.50,
    -1.16,
    -0.82,
    -0.43,
    0,
    0.43,
    0.82,
    1.16,
    1.50
  ];

  folds.forEach(
    x => {

      const points = [
        new THREE.Vector3(
          x * 0.52,
          -4.00,
          1.37
        ),
        new THREE.Vector3(
          x * 0.68,
          -2.35,
          1.37
        ),
        new THREE.Vector3(
          x,
          -0.10,
          1.37
        )
      ];

      const geometry =
        new THREE.BufferGeometry()
          .setFromPoints(points);

      group.add(
        new THREE.Line(
          geometry,
          foldMaterial
        )
      );
    }
  );

  const edgePoints = [
    [-2.15, -0.18],
    [-1.48, 0.04],
    [-0.75, -0.08],
    [-0.28, 0.02],
    [0, -0.06],
    [0.30, 0.02],
    [0.77, -0.08],
    [1.50, 0.04],
    [2.15, -0.18]
  ].map(
    ([x, y]) =>
      new THREE.Vector3(
        x,
        y,
        1.40
      )
  );

  const edgeGeometry =
    new THREE.BufferGeometry()
      .setFromPoints(
        edgePoints
      );

  group.add(
    new THREE.Line(
      edgeGeometry,
      new THREE.LineBasicMaterial({
        color: 0xe8c8ff,
        transparent: true,
        opacity: 0.96
      })
    )
  );

  return group;
}

bouquet.add(
  createWrapper()
);

// ============================================================
// LAZO
// ============================================================

function createRibbon() {

  const group =
    new THREE.Group();

  const ribbonMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x5a189a,
      roughness: 0.36,
      metalness: 0.14,
      side: THREE.DoubleSide
    });

  const leftShape =
    new THREE.Shape();

  leftShape.moveTo(0, 0);

  leftShape.bezierCurveTo(
    -0.55,
    0.42,
    -1.20,
    0.50,
    -1.58,
    0.10
  );

  leftShape.bezierCurveTo(
    -1.82,
    -0.20,
    -1.22,
    -0.62,
    -0.58,
    -0.46
  );

  leftShape.bezierCurveTo(
    -0.28,
    -0.36,
    -0.12,
    -0.16,
    0,
    -0.08
  );

  const left =
    new THREE.Mesh(
      new THREE.ShapeGeometry(
        leftShape
      ),
      ribbonMaterial
    );

  left.position.set(
    0,
    -0.46,
    1.68
  );

  const right =
    left.clone();

  right.scale.x = -1;

  const knot =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.25,
        24,
        18
      ),
      ribbonMaterial
    );

  knot.position.set(
    0,
    -0.46,
    1.80
  );

  group.add(
    left,
    right,
    knot
  );

  return group;
}

bouquet.add(
  createRibbon()
);

// ============================================================
// HALO
// ============================================================

function createGlowTexture() {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 128;
  canvas.height = 128;

  const ctx =
    canvas.getContext("2d");

  const gradient =
    ctx.createRadialGradient(
      64,
      64,
      0,
      64,
      64,
      64
    );

  gradient.addColorStop(
    0,
    "rgba(255,225,120,1)"
  );

  gradient.addColorStop(
    0.25,
    "rgba(255,190,45,0.48)"
  );

  gradient.addColorStop(
    0.55,
    "rgba(255,150,20,0.10)"
  );

  gradient.addColorStop(
    1,
    "rgba(255,120,0,0)"
  );

  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    128,
    128
  );

  return new THREE.CanvasTexture(
    canvas
  );
}

const halo =
  new THREE.Sprite(
    new THREE.SpriteMaterial({
      map:
        createGlowTexture(),
      color:
        0xffbd32,
      transparent: true,
      opacity: 0.28,
      blending:
        THREE.AdditiveBlending,
      depthWrite: false
    })
  );

halo.position.set(
  0,
  0.8,
  -2.5
);

halo.scale.set(
  11,
  11,
  1
);

scene.add(halo);

// ============================================================
// PARTÍCULAS
// ============================================================

const particleCount = 780;

const positions =
  new Float32Array(
    particleCount * 3
  );

const speeds =
  new Float32Array(
    particleCount
  );

const phases =
  new Float32Array(
    particleCount
  );

for (
  let i = 0;
  i < particleCount;
  i++
) {

  const radius =
    THREE.MathUtils.randFloat(
      2.7,
      7.2
    );

  const angle =
    Math.random() *
    Math.PI *
    2;

  positions[i * 3] =
    Math.cos(angle) *
    radius;

  positions[i * 3 + 1] =
    THREE.MathUtils.randFloat(
      -5,
      6
    );

  positions[i * 3 + 2] =
    THREE.MathUtils.randFloat(
      -1,
      4
    );

  speeds[i] =
    THREE.MathUtils.randFloat(
      0.15,
      0.55
    );

  phases[i] =
    Math.random() *
    Math.PI *
    2;
}

const particleGeometry =
  new THREE.BufferGeometry();

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    positions,
    3
  )
);

const particleMaterial =
  new THREE.PointsMaterial({
    color: 0xffcf4c,
    size: 0.045,
    transparent: true,
    opacity: 0.72,
    blending:
      THREE.AdditiveBlending,
    depthWrite: false
  });

const particles =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  );

scene.add(particles);

// ============================================================
// PÉTALOS FLOTANTES
// ============================================================

function createFloatingPetal() {

  const shape =
    new THREE.Shape();

  shape.moveTo(0, 0);

  shape.bezierCurveTo(
    -0.25,
    0.22,
    -0.35,
    0.60,
    -0.12,
    0.86
  );

  shape.bezierCurveTo(
    0,
    1.02,
    0.18,
    1.00,
    0.29,
    0.82
  );

  shape.bezierCurveTo(
    0.42,
    0.52,
    0.30,
    0.20,
    0,
    0
  );

  const petal =
    new THREE.Mesh(
      new THREE.ShapeGeometry(shape),
      new THREE.MeshBasicMaterial({
        color:
          GOLD[
            Math.floor(
              Math.random() *
              GOLD.length
            )
          ],
        transparent: true,
        opacity:
          THREE.MathUtils.randFloat(
            0.45,
            0.86
          ),
        side: THREE.DoubleSide,
        blending:
          THREE.AdditiveBlending,
        depthWrite: false
      })
    );

  petal.scale.set(
    THREE.MathUtils.randFloat(
      0.15,
      0.34
    ),
    THREE.MathUtils.randFloat(
      0.18,
      0.42
    ),
    1
  );

  petal.position.set(
    THREE.MathUtils.randFloat(
      -6.4,
      6.4
    ),
    THREE.MathUtils.randFloat(
      -5,
      5.8
    ),
    THREE.MathUtils.randFloat(
      0.2,
      4
    )
  );

  petal.rotation.set(
    THREE.MathUtils.randFloat(
      -0.5,
      0.5
    ),
    THREE.MathUtils.randFloat(
      -0.8,
      0.8
    ),
    Math.random() *
      Math.PI *
      2
  );

  petal.userData = {
    speed:
      THREE.MathUtils.randFloat(
        0.10,
        0.30
      ),
    drift:
      THREE.MathUtils.randFloat(
        0.25,
        0.70
      ),
    rotation:
      THREE.MathUtils.randFloat(
        -0.012,
        0.012
      ),
    wave:
      Math.random() *
      Math.PI *
      2
  };

  return petal;
}

const floatingPetals =
  new THREE.Group();

scene.add(
  floatingPetals
);

for (let i = 0; i < 46; i++) {
  floatingPetals.add(
    createFloatingPetal()
  );
}

// ============================================================
// FRASES FLOTANTES
// ============================================================

const floatingWords =
  new THREE.Group();

scene.add(floatingWords);

function createTextTexture(
  text,
  fontSize = 42
) {

  const canvas =
    document.createElement("canvas");

  canvas.width = 512;
  canvas.height = 128;

  const ctx =
    canvas.getContext("2d");

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.font =
    `600 ${fontSize}px Arial, sans-serif`;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Brillo exterior
  ctx.shadowColor =
    "rgba(255, 220, 120, 0.95)";

  ctx.shadowBlur = 24;

  ctx.fillStyle =
    "rgba(255, 224, 145, 1)";

  ctx.fillText(
    text,
    canvas.width / 2,
    canvas.height / 2
  );

  // Texto principal
  ctx.shadowBlur = 7;

  ctx.fillStyle =
    "rgba(255, 248, 220, 1)";

  ctx.fillText(
    text,
    canvas.width / 2,
    canvas.height / 2
  );

  const texture =
    new THREE.CanvasTexture(canvas);

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.needsUpdate = true;

  return texture;
}

function createFloatingText(
  text,
  x,
  y,
  z,
  scale = 1,
  speed = 0.35,
  phase = 0,
  rotation = 0
) {

  const texture =
    createTextTexture(text, 48);

  const material =
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
      depthTest: false,
      blending:
        THREE.AdditiveBlending
    });

  const sprite =
    new THREE.Sprite(material);

  sprite.position.set(
    x,
    y,
    z
  );

  // FRASES MÁS GRANDES
  sprite.scale.set(
    3.25 * scale,
    0.82 * scale,
    1
  );

  sprite.rotation.z =
    rotation;

  sprite.userData = {
    baseX: x,
    baseY: y,
    baseZ: z,
    speed,
    phase,
    drift:
      THREE.MathUtils.randFloat(
        0.12,
        0.28
      ),
    rotationSpeed:
      THREE.MathUtils.randFloat(
        -0.0008,
        0.0008
      )
  };

  floatingWords.add(sprite);

  return sprite;
}

// ============================================================
// FRASES
// ============================================================

createFloatingText(
  "I LOVE YOU",
  -4.45,
  3.35,
  3.2,
  0.92,
  0.34,
  0.0,
  -0.035
);

createFloatingText(
  "FOREVER",
  4.20,
  3.85,
  2.9,
  0.78,
  0.28,
  1.2,
  0.035
);

createFloatingText(
  "WITH LOVE",
  -4.65,
  0.35,
  3.4,
  0.70,
  0.32,
  2.3,
  -0.025
);

createFloatingText(
  "FOR YOU",
  4.35,
  0.55,
  3.0,
  0.74,
  0.30,
  3.1,
  0.028
);

createFloatingText(
  "MY LOVE",
  -4.05,
  -2.25,
  3.0,
  0.68,
  0.27,
  4.4,
  -0.025
);

createFloatingText(
  "ALWAYS",
  4.25,
  -2.15,
  2.8,
  0.68,
  0.31,
  5.2,
  0.025
);

createFloatingText(
  "LOVE ♡",
  -3.85,
  5.0,
  2.6,
  0.60,
  0.24,
  6.0,
  -0.02
);

createFloatingText(
  "♡",
  3.85,
  4.85,
  2.7,
  0.68,
  0.29,
  7.0,
  0.04
);

// ============================================================
// DESTELLOS
// ============================================================

const sparkleCount = 65;

const sparklePositions =
  new Float32Array(
    sparkleCount * 3
  );

for (
  let i = 0;
  i < sparkleCount;
  i++
) {

  sparklePositions[i * 3] =
    THREE.MathUtils.randFloat(
      -6,
      6
    );

  sparklePositions[i * 3 + 1] =
    THREE.MathUtils.randFloat(
      -4.8,
      5.8
    );

  sparklePositions[i * 3 + 2] =
    THREE.MathUtils.randFloat(
      0,
      3
    );
}

const sparkleGeometry =
  new THREE.BufferGeometry();

sparkleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    sparklePositions,
    3
  )
);

const sparkleMaterial =
  new THREE.PointsMaterial({
    color: 0xffedaa,
    size: 0.085,
    transparent: true,
    opacity: 0.82,
    blending:
      THREE.AdditiveBlending,
    depthWrite: false
  });

const sparkles =
  new THREE.Points(
    sparkleGeometry,
    sparkleMaterial
  );

scene.add(sparkles);

// ============================================================
// MOUSE
// ============================================================

let mouseX = 0;
let mouseY = 0;

window.addEventListener(
  "mousemove",
  event => {

    mouseX =
      (
        event.clientX /
        window.innerWidth -
        0.5
      ) * 2;

    mouseY =
      (
        event.clientY /
        window.innerHeight -
        0.5
      ) * 2;
  }
);

// ============================================================
// ANIMACIÓN
// ============================================================

const clock =
  new THREE.Clock();

function animate() {

  requestAnimationFrame(
    animate
  );

  const time =
    clock.getElapsedTime();

  // Movimiento del ramo
  bouquet.rotation.y +=
    (
      mouseX * 0.045 -
      bouquet.rotation.y
    ) * 0.025;

  bouquet.rotation.x +=
    (
      -mouseY * 0.025 -
      bouquet.rotation.x
    ) * 0.025;

  bouquet.position.y =
    Math.sin(
      time * 0.55
    ) * 0.035;

  // Movimiento orgánico
  bouquet.children.forEach(
    object => {

      if (
        object.userData &&
        object.userData.floatOffset !==
        undefined
      ) {

        object.rotation.z +=
          Math.sin(
            time * 0.65 +
            object.userData.floatOffset
          ) * 0.00035;
      }
    }
  );

  // ==========================================================
  // PARTÍCULAS
  // ==========================================================

  const particlePositions =
    particleGeometry
      .attributes
      .position
      .array;

  for (
    let i = 0;
    i < particleCount;
    i++
  ) {

    const index =
      i * 3;

    particlePositions[
      index + 1
    ] +=
      speeds[i] * 0.002;

    particlePositions[index] +=
      Math.sin(
        time *
          speeds[i] +
          phases[i]
      ) * 0.0015;

    if (
      particlePositions[
        index + 1
      ] > 6
    ) {

      particlePositions[
        index + 1
      ] = -5;
    }
  }

  particleGeometry
    .attributes
    .position
    .needsUpdate = true;

  // ==========================================================
  // PÉTALOS
  // ==========================================================

  floatingPetals.children.forEach(
    petal => {

      petal.position.y +=
        petal.userData.speed *
        0.009;

      petal.position.x +=
        Math.sin(
          time *
            petal.userData.drift +
            petal.userData.wave
        ) * 0.003;

      petal.rotation.z +=
        petal.userData.rotation;

      petal.rotation.x =
        Math.sin(
          time * 0.7 +
          petal.userData.wave
        ) * 0.35;

      petal.rotation.y =
        Math.cos(
          time * 0.5 +
          petal.userData.wave
        ) * 0.40;

      if (
        petal.position.y > 6
      ) {

        petal.position.y =
          -5.2;

        petal.position.x =
          THREE.MathUtils.randFloat(
            -6.4,
            6.4
          );
      }
    }
  );

  // ==========================================================
  // FRASES
  // ==========================================================

  floatingWords.children.forEach(
    word => {

      const data =
        word.userData;

      word.position.y =
        data.baseY +
        Math.sin(
          time *
            data.speed +
            data.phase
        ) * 0.12;

      word.position.x =
        data.baseX +
        Math.sin(
          time *
            data.drift +
            data.phase
        ) * 0.08;

      word.position.z =
        data.baseZ +
        Math.sin(
          time * 0.45 +
          data.phase
        ) * 0.04;

      word.rotation.z +=
        data.rotationSpeed;

      // Brillo más visible
      word.material.opacity =
        0.82 +
        Math.sin(
          time * 1.2 +
          data.phase
        ) * 0.10;
    }
  );

  // ==========================================================
  // DESTELLOS
  // ==========================================================

  sparkleMaterial.opacity =
    0.58 +
    Math.sin(
      time * 2.1
    ) * 0.20;

  // ==========================================================
  // HALO
  // ==========================================================

  halo.material.opacity =
    0.24 +
    Math.sin(
      time * 0.7
    ) * 0.035;

  const haloScale =
    10.8 +
    Math.sin(
      time * 0.5
    ) * 0.22;

  halo.scale.set(
    haloScale,
    haloScale,
    1
  );

  // ==========================================================
  // LUZ
  // ==========================================================

  frontLight.intensity =
    3.3 +
    Math.sin(
      time * 1.1
    ) * 0.18;

  // ==========================================================
  // RENDER
  // ==========================================================

  renderer.render(
    scene,
    camera
  );
}

animate();

// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);