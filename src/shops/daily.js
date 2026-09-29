import { THREE, box, cyl, sphere, torus, rod, curve, text, panel, point, seeded } from '../kit.js';

const E = { edge: true };
const GLASS = { opacity: 0.07, depthWrite: false, shadow: false };
const wood = [0x997044, 0xb88b54, 0x715437, 0x957951];
const bookColors = [0x9b544f, 0x344f59, 0xc5a36e, 0x688578, 0xb97654, 0x716272, 0xe2d0aa, 0x546a86];

function frame(g, x, y, z, w, h, color, cross = false) {
  box(g, x - w / 2, y, z, 0.075, h, 0.09, color, E);
  box(g, x + w / 2, y, z, 0.075, h, 0.09, color, E);
  box(g, x, y - h / 2, z, w, 0.075, 0.09, color, E);
  box(g, x, y + h / 2, z, w, 0.075, 0.09, color, E);
  box(g, x, y, z - 0.025, w - 0.07, h - 0.07, 0.02, 0xb8e4d7, GLASS);
  if (cross) {
    box(g, x, y, z + 0.015, 0.045, h, 0.065, color);
    box(g, x, y, z + 0.015, w, 0.045, 0.065, color);
  }
}

function spot(g, x, y, z, color = 0xffedb5) {
  cyl(g, x, y, z, 0.09, 0.06, 0x3f514a);
  cyl(g, x, y - 0.034, z, 0.075, 0.012, color, { basic: true });
}

function leaves(g, x, y, z, r, color, angle = 0) {
  const leaf = sphere(g, x, y, z, r, color);
  leaf.scale.set(0.55, 1.7, 0.38);
  leaf.rotation.z = angle;
}

function pot(g, x, baseY, z, scale = 1, flowering = false, seed = 1) {
  const rnd = seeded(seed);
  const terracotta = [0xb57355, 0xcfa782, 0x89906d, 0x71877d][seed % 4];
  cyl(g, x, baseY + 0.13 * scale, z, 0.12 * scale, 0.26 * scale, terracotta, { top: 0.17 * scale, segments: 10, edge: true });
  torus(g, x, baseY + 0.25 * scale, z, 0.157 * scale, 0.021 * scale, terracotta, { rot: [Math.PI / 2, 0, 0] });
  cyl(g, x, baseY + 0.255 * scale, z, 0.142 * scale, 0.012 * scale, 0x403d2d);
  for (let s = 0; s < 3; s++) {
    const dx = (rnd() - 0.5) * 0.23 * scale;
    const dz = (rnd() - 0.5) * 0.2 * scale;
    const topY = baseY + (0.5 + rnd() * 0.22) * scale;
    rod(g, [x, baseY + 0.25 * scale, z], [x + dx, topY, z + dz], 0.012 * scale, 0x496d41);
    leaves(g, x + dx - 0.07 * scale, topY - 0.12 * scale, z + dz, 0.063 * scale, 0x6e985a, -0.9);
    leaves(g, x + dx + 0.055 * scale, topY - 0.21 * scale, z + dz, 0.055 * scale, 0x406e48, 0.85);
    if (flowering) {
      const petal = [0xd48a97, 0xf3d691, 0xe9b3a7, 0x9a99be][seed % 4];
      for (let k = 0; k < 4; k++) {
        const a = k * Math.PI / 2;
        sphere(g, x + dx + Math.cos(a) * 0.045 * scale, topY, z + dz + Math.sin(a) * 0.045 * scale, 0.047 * scale, petal);
      }
      sphere(g, x + dx, topY + 0.025 * scale, z + dz, 0.028 * scale, 0xeab867);
    } else {
      leaves(g, x + dx, topY, z + dz, 0.075 * scale, 0x71925d, 0.3);
    }
  }
}

function books(g, x, y, z, width, rows, seed = 1, depth = 0.3) {
  const rnd = seeded(seed);
  const rowH = 0.43;
  box(g, x, y + rows * rowH / 2, z - depth / 2, width, rows * rowH + 0.08, 0.065, 0x584732);
  for (const side of [-1, 1]) box(g, x + side * width / 2, y + rows * rowH / 2, z, 0.055, rows * rowH + 0.08, depth, 0x99764d, E);
  for (let row = 0; row <= rows; row++) box(g, x, y + row * rowH, z, width, 0.045, depth + 0.045, 0xaa8355, E);
  for (let row = 0; row < rows; row++) {
    let offset = -width / 2 + 0.065;
    while (offset < width / 2 - 0.14) {
      const bw = 0.07 + rnd() * 0.065;
      const bh = 0.22 + rnd() * 0.14;
      const bz = z + 0.015 + rnd() * 0.025;
      const c = bookColors[Math.floor(rnd() * bookColors.length)];
      box(g, x + offset + bw / 2, y + row * rowH + bh / 2 + 0.026, bz, bw - 0.011, bh, depth * 0.79, c, E);
      if (rnd() > 0.66) box(g, x + offset + bw / 2, y + row * rowH + bh * 0.76, bz + depth * 0.4, bw * 0.63, 0.016, 0.006, 0xd8c79b);
      offset += bw;
    }
  }
}

function florist() {
  const g = new THREE.Group();
  g.name = '花と葉 — 独立花店';
  box(g, 0, 0.04, -2.4, 5.4, 0.08, 4.8, 0xb5b2a1, E);
  box(g, 0, 1.68, -4.73, 5.4, 3.2, 0.14, 0xe1d5b4, E);
  box(g, -2.63, 1.65, -2.4, 0.14, 3.14, 4.8, 0xe3ddc4, E);
  box(g, 2.63, 1.65, -2.4, 0.14, 3.14, 4.8, 0xcdc7ac, E);
  box(g, 0, 3.35, -2.6, 5.58, 0.16, 4.45, 0x3c6154, E);
  // The elevated glazed bay makes an asymmetric greenhouse silhouette.
  box(g, -1.13, 3.56, -1.4, 2.7, 0.055, 2.9, 0xb9e8dc, { ...GLASS, opacity: 0.14, rot: [0, 0, -0.14] });
  for (let z = -2.78; z < 0.12; z += 0.68) rod(g, [-2.49, 3.75, z], [0.23, 3.37, z], 0.033, 0x466d5c);
  rod(g, [-2.49, 3.75, -2.85], [-2.49, 3.75, 0.05], 0.043, 0x466d5c);
  rod(g, [0.23, 3.37, -2.85], [0.23, 3.37, 0.05], 0.043, 0x466d5c);
  for (const x of [-2.59, 0.46, 2.57]) box(g, x, 1.57, 0, 0.16, 2.98, 0.19, 0x47705a, E);
  box(g, 0, 2.83, 0, 5.3, 0.18, 0.19, 0x557964, E);
  box(g, -1.06, 0.45, -0.06, 2.91, 0.73, 0.18, 0xc7d0b1, E);
  frame(g, -1.06, 1.69, 0.01, 2.88, 1.74, 0x446850, true);
  frame(g, 1.45, 1.26, 0.035, 1.77, 2.32, 0x3f6a52);
  box(g, 1.46, 0.29, 0.06, 1.64, 0.32, 0.06, 0x4b745b, E);
  rod(g, [1.94, 1.04, 0.13], [1.94, 1.35, 0.13], 0.022, 0xc3a86d);
  box(g, 1.5, 3.17, 0.05, 1.95, 0.52, 0.12, 0xf0e0b3, E);
  text(g, '花と葉', 1.5, 3.18, 0.117, 1.7, 0.37, { color: '#36593f' });
  text(g, 'FLOWERS & GREEN', 1.5, 2.99, 0.12, 1.55, 0.12, { color: '#567348', scale: 0.62 });
  box(g, -0.02, 2.82, 0.48, 5.5, 0.045, 1.03, 0xc1e3d5, { ...GLASS, opacity: 0.17, rot: [0.13, 0, 0] });
  for (const x of [-2.6, -1.3, 0, 1.3, 2.6]) rod(g, [x, 2.895, -0.03], [x, 2.75, 1], 0.027, 0x648775);
  rod(g, [-2.75, 2.75, 0.99], [2.73, 2.75, 0.99], 0.035, 0x4a705b);
  // Separate stepped racks leave the entrance clear.
  for (let tier = 0; tier < 3; tier++) {
    const y = 0.14 + tier * 0.34;
    const z = 0.76 - tier * 0.22;
    box(g, -1.25, y, z, 2.8, 0.055, 0.34, 0x987651, E);
    for (const x of [-2.43, -0.09]) box(g, x, y / 2, z, 0.06, y, 0.08, 0x42624b);
    for (let n = 0; n < 5; n++) pot(g, -2.32 + n * 0.53, y + 0.029, z, 0.76, (n + tier) % 2 === 0, 10 + n + tier * 6);
  }
  pot(g, 2.31, 0.08, 0.61, 1.25, false, 28);
  pot(g, 2.3, 0.08, 0.08, 0.95, true, 22);
  // The workbench, tools, wrapping rolls, and cut flowers remain visible.
  box(g, 0.8, 1.08, -3.45, 2.7, 0.11, 0.95, 0xb39164, E);
  for (const x of [-0.34, 1.94]) for (const z of [-3.82, -3.08]) box(g, x, 0.56, z, 0.09, 1, 0.09, 0x4f624c, E);
  box(g, 0.8, 0.32, -3.45, 2.5, 0.05, 0.85, 0x9d7e56, E);
  for (let n = 0; n < 4; n++) {
    cyl(g, 0.2 + n * 0.35, 1.17, -3.4, 0.067, 0.53, [0xd6bd89, 0x91a38e, 0xd6b8b2, 0xe2d9bd][n], { rot: [Math.PI / 2, 0, 0] });
    box(g, -0.12 + n * 0.48, 0.52, -3.48, 0.36, 0.36, 0.6, 0xba9b66, E);
  }
  box(g, 1.6, 1.175, -3.15, 0.48, 0.025, 0.3, 0xe2dcc4);
  rod(g, [1.54, 1.2, -3.21], [1.77, 1.2, -3.07], 0.014, 0x77827c);
  rod(g, [1.53, 1.2, -3.07], [1.75, 1.2, -3.2], 0.014, 0x77827c);
  for (let n = 0; n < 4; n++) pot(g, -2.13 + n * 0.62, 0.08, -4.05, 1.05, n % 2 === 1, 33 + n);
  box(g, -2.2, 1.2, -2.05, 0.6, 0.055, 2.6, 0xab9065, E);
  for (let n = 0; n < 3; n++) pot(g, -2.19, 1.23, -1.16 - n * 0.76, 0.83, false, 41 + n);
  text(g, '本日の花', -1.38, 0.61, 0.999, 0.6, 0.2, { bg: '#344b3d', color: '#e3d4ae' });
  for (const x of [-1.5, 0.2, 1.75]) spot(g, x, 3.15, -1.9);
  point(g, 0xffe0ad, 27, 0.1, 2.55, -2.35, 7);
  return g;
}

function bookstore() {
  const g = new THREE.Group();
  g.name = '月灯古書 — 二階建て旧書店';
  box(g, 0, 0.04, -2.5, 4.6, 0.08, 5, 0x756454, E);
  box(g, 0, 3.15, -2.5, 4.6, 0.16, 5, 0x6f5842, E);
  box(g, 0, 3.05, -4.93, 4.6, 5.94, 0.14, 0xb6a487, E);
  for (const side of [-1, 1]) box(g, side * 2.23, 3.05, -2.5, 0.14, 5.94, 5, 0xa79a81, E);
  // Individually expressed aged timber structure, rather than a flat facade.
  for (const x of [-2.2, -0.18, 2.2]) box(g, x, 1.59, 0, 0.16, 3.02, 0.19, 0x584935, E);
  box(g, 0, 2.71, 0.035, 4.48, 0.57, 0.22, 0x67513b, E);
  text(g, '月 灯 古 書', 0, 2.73, 0.154, 3.93, 0.4, { color: '#dbc8a0', weight: 600 });
  frame(g, -1.17, 1.31, 0.025, 1.87, 2.3, 0x6a5238, true);
  frame(g, 0.97, 1.27, 0.025, 2.1, 2.3, 0x675035);
  box(g, 1.87, 1.27, 0.11, 0.028, 0.33, 0.04, 0xab9667);
  box(g, -1.17, 0.3, 0.045, 1.8, 0.35, 0.06, 0x756047, E);
  text(g, 'OPEN', 1.15, 1.8, 0.08, 0.56, 0.21, { bg: '#39483f', color: '#e4ce9e' });
  // Upper windows occupy real holes bounded by plaster panels.
  box(g, 0, 3.59, -0.015, 4.6, 0.72, 0.14, 0xb3a58b, E);
  box(g, 0, 5.77, -0.015, 4.6, 0.38, 0.14, 0xb3a58b, E);
  for (const x of [-2.15, 0, 2.15]) box(g, x, 4.77, -0.02, x === 0 ? 0.64 : 0.3, 1.65, 0.14, 0xc0b397, E);
  for (const x of [-1.12, 1.12]) {
    frame(g, x, 4.77, 0.065, 1.55, 1.67, 0x5f513b, true);
    box(g, x, 3.94, 0.12, 1.78, 0.075, 0.29, 0x75654d, E);
    box(g, x, 4.8, -0.22, 1.47, 1.5, 0.015, 0xe6c483, { opacity: 0.1, depthWrite: false });
    text(g, x < 0 ? '読書室' : '古本', x, 4.38, 0.131, 0.82, 0.28, { color: '#e1cfaa', weight: 500 });
  }
  for (const x of [-2.26, 0, 2.26]) box(g, x, 4.63, 0.09, 0.07, 2.65, 0.09, 0x6a5b43);
  box(g, 0, 3.29, 0.1, 4.61, 0.12, 0.1, 0x685540, E);
  // Two broad roof planes meet along a shallow ridge.
  const pitch = 0.255;
  for (const side of [-1, 1]) {
    box(g, side * 1.19, 6.2, -2.5, 2.5, 0.1, 5.35, 0x4b5754, { edge: true, rot: [0, 0, -side * pitch] });
    for (let n = 0; n < 7; n++) rod(g, [side * 0.02, 6.56, -5.12 + n * 0.82], [side * 2.43, 5.93, -5.12 + n * 0.82], 0.026, 0x69726a);
  }
  box(g, 0, 6.53, -2.5, 0.13, 0.1, 5.4, 0x738077, E);
  box(g, 0, 5.93, 0.11, 4.92, 0.12, 0.24, 0x665b48, E);
  for (const x of [-2.35, 2.35]) cyl(g, x, 3.04, 0.0, 0.044, 5.82, 0x5e6557);
  // Complete books with visible spines on shelves at both floors.
  books(g, -0.15, 0.17, -4.47, 3.72, 5, 182, 0.37);
  const leftShelf = new THREE.Group();
  leftShelf.position.set(-1.94, 0, -2.18);
  leftShelf.rotation.y = Math.PI / 2;
  g.add(leftShelf);
  books(leftShelf, 0, 0.17, 0, 2.72, 4, 389, 0.33);
  books(g, -1.05, 3.3, -1.13, 1.65, 3, 618, 0.3);
  books(g, 1.0, 3.3, -1.16, 1.7, 3, 895, 0.3);
  box(g, 1.4, 0.93, -2.3, 1.07, 0.1, 0.8, 0x9e7e53, E);
  box(g, 1.4, 0.49, -2.3, 0.99, 0.8, 0.67, 0x776346, E);
  box(g, 1.32, 1.035, -2.29, 0.38, 0.11, 0.29, 0x414842, E);
  box(g, 1.36, 1.15, -2.47, 0.35, 0.26, 0.055, 0x46504a, E);
  panel(g, 1.36, 1.15, -2.438, 0.27, 0.18, 0xb2c2a7);
  // Waist-high sidewalk sale cart, confined to this shop's pavement zone.
  box(g, -1.08, 0.61, 0.53, 2.12, 0.07, 0.73, 0x8d6e49, E);
  for (const x of [-1.98, -0.18]) for (const z of [0.26, 0.79]) box(g, x, 0.34, z, 0.06, 0.57, 0.06, 0x71593c);
  for (const x of [-2.11, -0.05]) box(g, x, 0.74, 0.53, 0.06, 0.22, 0.75, 0xa48760, E);
  box(g, -1.08, 0.73, 0.88, 2.12, 0.22, 0.06, 0xa48760, E);
  for (let n = 0; n < 14; n++) {
    const x = -1.98 + n * 0.14;
    box(g, x, 0.79, 0.48, 0.095, 0.27 + (n % 3) * 0.025, 0.37, bookColors[n % bookColors.length], { edge: true, rot: [-0.17, 0, 0] });
  }
  text(g, '古本  ¥100〜', -1.07, 0.73, 0.916, 1.11, 0.18, { color: '#382f26', bg: '#cfbc90' });
  box(g, 2.38, 2.38, -3.48, 0.32, 0.69, 0.96, 0xa1a18c, E);
  for (let i = 0; i < 6; i++) box(g, 2.542, 2.17 + i * 0.077, -3.48, 0.013, 0.019, 0.76, 0x4e5c55);
  curve(g, [[2.39, 2.04, -3.74], [2.4, 1.7, -3.9], [2.41, 0.12, -3.91]], 0.025, 0x777d69);
  for (const x of [-1.2, 1.1]) spot(g, x, 2.99, -0.93, 0xffdfa1);
  point(g, 0xffca87, 27, 0.1, 2.37, -2.2, 7);
  return g;
}

function barberChair(g, x, z) {
  cyl(g, x, 0.14, z, 0.35, 0.13, 0x616e69, E);
  cyl(g, x, 0.38, z, 0.09, 0.4, 0xa7b2a7);
  box(g, x, 0.66, z, 0.65, 0.18, 0.62, 0x744e48, E);
  box(g, x, 1.02, z + 0.25, 0.65, 0.66, 0.13, 0x734942, { edge: true, rot: [-0.08, 0, 0] });
  box(g, x, 1.43, z + 0.29, 0.37, 0.17, 0.14, 0x906052, E);
  for (const side of [-1, 1]) {
    box(g, x + side * 0.39, 0.87, z + 0.01, 0.1, 0.1, 0.57, 0x443f38, E);
    rod(g, [x + side * 0.38, 0.65, z - 0.13], [x + side * 0.38, 0.86, z - 0.13], 0.027, 0x9ba99c);
    rod(g, [x + side * 0.38, 0.64, z + 0.18], [x + side * 0.38, 0.87, z + 0.18], 0.027, 0x9ba99c);
  }
  rod(g, [x - 0.23, 0.57, z - 0.27], [x - 0.23, 0.28, z - 0.69], 0.024, 0xa2b0a2);
  rod(g, [x + 0.23, 0.57, z - 0.27], [x + 0.23, 0.28, z - 0.69], 0.024, 0xa2b0a2);
  box(g, x, 0.27, z - 0.7, 0.59, 0.045, 0.25, 0x778c80, E);
  for (let n = 0; n < 4; n++) box(g, x - 0.2 + n * 0.13, 0.3, z - 0.7, 0.025, 0.008, 0.2, 0x43594e);
}

function barber() {
  const g = new THREE.Group();
  g.name = '理容みどり — 薄荷色理髪店';
  box(g, 0, 0.04, -2.4, 4.8, 0.08, 4.8, 0xd1cbb4, E);
  // Checkerboard tiles stop at the interior floor boundary.
  for (let ix = 0; ix < 10; ix++) for (let iz = 0; iz < 10; iz++) {
    if ((ix + iz) % 2 === 0) box(g, -2.16 + ix * 0.48, 0.086, -0.24 - iz * 0.48, 0.469, 0.012, 0.469, 0x607d6c);
  }
  box(g, 0, 1.61, -4.73, 4.8, 3.06, 0.14, 0xc5d7be, E);
  for (const side of [-1, 1]) box(g, side * 2.33, 1.61, -2.4, 0.14, 3.06, 4.8, 0x93bca6, E);
  for (const side of [-1, 1]) for (let row = 0; row < 6; row++) for (let col = 0; col < 9; col++) {
    box(g, side * 2.249, 0.22 + row * 0.22, -0.37 - col * 0.48, 0.021, 0.197, 0.456, row === 5 ? 0x749c84 : ((row + col) % 3 === 0 ? 0xcbd9c2 : 0xd8dec7));
  }
  box(g, 0, 3.19, -2.4, 4.88, 0.17, 4.9, 0x526f62, E);
  box(g, 0, 3.42, -0.055, 4.8, 0.64, 0.25, 0x98c5af, E);
  box(g, 0, 3.78, -0.055, 2.48, 0.24, 0.25, 0xaed0bb, E);
  box(g, 0, 3.9, -0.055, 2.57, 0.045, 0.3, 0xe1dbb9, E);
  for (const x of [-1.83, 1.83]) box(g, x, 3.75, -0.055, 1.25, 0.045, 0.3, 0xe1dbb9, E);
  for (const x of [-2.3, 0.72, 2.3]) box(g, x, 1.45, 0, 0.17, 2.73, 0.18, 0xc4d8bb, E);
  box(g, 0, 2.73, 0, 4.56, 0.14, 0.19, 0x365f50, E);
  frame(g, -0.8, 1.44, 0.025, 2.82, 2.25, 0x3e6f5b);
  box(g, -0.8, 0.26, 0.015, 2.91, 0.36, 0.2, 0x7aab92, E);
  frame(g, 1.5, 1.28, 0.025, 1.33, 2.33, 0x3c6856);
  box(g, 1.5, 0.31, 0.057, 1.22, 0.33, 0.08, 0x62947b, E);
  rod(g, [1.96, 1.01, 0.15], [1.96, 1.36, 0.15], 0.021, 0xbab99b);
  box(g, 0, 3.09, 0.09, 4.29, 0.49, 0.07, 0xe1dabb, E);
  text(g, '理容 みどり', 0, 3.1, 0.132, 3.5, 0.36, { color: '#355b4d', weight: 700 });
  text(g, 'BARBER SHOP', 0, 3.68, 0.078, 1.81, 0.14, { color: '#41634e', scale: 0.72 });
  text(g, 'CUT · SHAVE', -0.81, 1.88, 0.07, 1.97, 0.18, { color: '#e8dfb8', weight: 500 });
  // The barber pole uses continuous coloured helical tubes within a clear case.
  const px = -2.43, pz = 0.27;
  box(g, -2.42, 1.85, 0.1, 0.26, 0.055, 0.37, 0x395b4b);
  cyl(g, px, 1.95, pz, 0.14, 1.04, 0xe4e1cb, { segments: 24 });
  for (const [phase, color] of [[0, 0xb65d55], [Math.PI, 0x47799a]]) {
    const pts = [];
    for (let n = 0; n <= 56; n++) {
      const a = phase + n / 56 * Math.PI * 5.2;
      pts.push([px + Math.cos(a) * 0.147, 1.46 + n / 56 * 0.98, pz + Math.sin(a) * 0.147]);
    }
    curve(g, pts, 0.039, color);
  }
  cyl(g, px, 1.95, pz, 0.192, 1.07, 0xbde0d9, GLASS);
  for (const y of [1.38, 2.51]) cyl(g, px, y, pz, 0.211, 0.12, 0x365d51, E);
  sphere(g, px, 2.62, pz, 0.13, 0xece0b8, { basic: true });
  // Real counter and mirrors. The pale reflective panels have a subtle inner frame.
  for (const x of [-1.25, 0.53]) {
    box(g, x, 1.9, -4.56, 1.24, 1.63, 0.08, 0x8d7954, E);
    panel(g, x, 1.9, -4.512, 1.1, 1.46, 0x91b0aa);
    panel(g, x - 0.28, 1.92, -4.505, 0.065, 1.34, 0xc2d4c9, { opacity: 0.55, depthWrite: false });
    box(g, x, 1.06, -4.26, 1.51, 0.09, 0.67, 0xbaa27a, E);
    box(g, x, 0.54, -4.41, 1.41, 0.94, 0.44, 0x567963, E);
    for (const dx of [-0.36, 0.36]) {
      box(g, x + dx, 0.69, -4.176, 0.65, 0.26, 0.023, 0x70947b, E);
      box(g, x + dx, 0.4, -4.176, 0.65, 0.26, 0.023, 0x70947b, E);
      box(g, x + dx, 0.71, -4.15, 0.18, 0.025, 0.04, 0xb6b191);
      box(g, x + dx, 0.42, -4.15, 0.18, 0.025, 0.04, 0xb6b191);
    }
    for (let n = 0; n < 5; n++) {
      cyl(g, x - 0.56 + n * 0.115, 1.23, -4.34, 0.042, 0.23, [0xa8c0b3, 0xe3ddc1, 0x537866, 0x968260, 0xc2a678][n], E);
      cyl(g, x - 0.56 + n * 0.115, 1.36, -4.34, 0.025, 0.035, 0x424f44);
    }
    box(g, x + 0.4, 1.127, -4.14, 0.37, 0.035, 0.21, 0xe7e0c7, E);
    box(g, x + 0.4, 1.168, -4.14, 0.37, 0.035, 0.21, 0xb7c6ab, E);
    // Comb teeth and scissors are separate native geometry on the countertop.
    box(g, x + 0.07, 1.117, -4.055, 0.24, 0.015, 0.025, 0x423e34);
    for (let n = 0; n < 8; n++) box(g, x - 0.032 + n * 0.029, 1.117, -4.084, 0.009, 0.015, 0.075, 0x423e34);
    torus(g, x + 0.44, 1.197, -4.105, 0.032, 0.009, 0xabb5a7, { rot: [Math.PI / 2, 0, 0] });
    torus(g, x + 0.54, 1.197, -4.105, 0.032, 0.009, 0xabb5a7, { rot: [Math.PI / 2, 0, 0] });
    rod(g, [x + 0.44, 1.197, -4.105], [x + 0.54, 1.197, -4.29], 0.009, 0xabb5a7);
    rod(g, [x + 0.54, 1.197, -4.105], [x + 0.44, 1.197, -4.29], 0.009, 0xabb5a7);
    barberChair(g, x, -2.96);
    box(g, x, 2.85, -4.48, 1.02, 0.08, 0.12, 0xe8e0bc, { basic: true });
  }
  // Basin and curved water tap beside the chairs.
  box(g, 1.87, 0.64, -3.72, 0.66, 1.1, 0.8, 0xa1b99e, E);
  const basin = sphere(g, 1.86, 1.16, -3.7, 0.39, 0xe3e3cb);
  basin.scale.set(0.91, 0.3, 1);
  const basinWell = sphere(g, 1.86, 1.23, -3.69, 0.27, 0x667f73);
  basinWell.scale.set(0.97, 0.08, 1.03);
  curve(g, [[2.12, 1.19, -3.83], [2.12, 1.48, -3.83], [1.92, 1.48, -3.8], [1.92, 1.35, -3.78]], 0.026, 0xc1c4ac);
  // Low waiting bench and magazines at the shop window.
  box(g, -1.29, 0.52, -0.78, 1.52, 0.15, 0.59, 0xb39b64, E);
  box(g, -1.29, 0.86, -0.49, 1.52, 0.58, 0.11, 0x9e865b, E);
  for (const x of [-1.93, -0.65]) box(g, x, 0.29, -0.8, 0.07, 0.41, 0.48, 0x466650, E);
  for (let n = 0; n < 3; n++) box(g, -1.4, 0.62 + n * 0.035, -0.83, 0.39, 0.033, 0.3, bookColors[n], E);
  box(g, 0.07, 0.55, -0.78, 0.59, 0.9, 0.26, 0x8c7950, E);
  for (let n = 0; n < 5; n++) box(g, -0.14 + n * 0.1, 0.91, -0.63, 0.087, 0.44 - (n % 2) * 0.04, 0.029, bookColors[n], { edge: true, rot: [-0.1, 0, 0] });
  text(g, '予約受付中', 1.51, 1.83, 0.079, 0.99, 0.24, { color: '#ece1bc', weight: 500 });
  text(g, '9:00 — 19:00', 1.51, 1.61, 0.079, 0.98, 0.14, { color: '#ece1bc', weight: 500 });
  box(g, 2.07, 0.79, -1.59, 0.37, 0.71, 0.45, 0x738474, E);
  for (let n = 0; n < 8; n++) box(g, 2.07, 0.53 + n * 0.071, -1.358, 0.3, 0.024, 0.018, 0x4f685a);
  // Fine tile courses give the lower facade the distinctive old barber-shop scale.
  for (let n = 0; n < 15; n++) box(g, -2.17 + n * 0.198, 0.265, 0.121, 0.007, 0.28, 0.012, 0xa6c7ab);
  for (const y of [0.17, 0.29, 0.41]) box(g, -0.8, y, 0.127, 2.9, 0.009, 0.013, 0xa6c7ab);
  spot(g, -1.23, 3.06, -1.5, 0xffecc3);
  spot(g, 1.05, 3.06, -1.5, 0xffecc3);
  cyl(g, 1.95, 2.5, -4.57, 0.24, 0.07, 0x5e765f, { rot: [Math.PI / 2, 0, 0] });
  cyl(g, 1.95, 2.5, -4.523, 0.207, 0.018, 0xe1dcc0, { rot: [Math.PI / 2, 0, 0] });
  for (let n = 0; n < 12; n++) {
    const a = n / 12 * Math.PI * 2;
    sphere(g, 1.95 + Math.sin(a) * 0.177, 2.5 + Math.cos(a) * 0.177, -4.502, 0.011, 0x49634f);
  }
  rod(g, [1.95, 2.5, -4.489], [1.91, 2.61, -4.489], 0.012, 0x415848);
  rod(g, [1.95, 2.5, -4.487], [2.07, 2.47, -4.487], 0.009, 0x415848);
  point(g, 0xffdfad, 28, 0.1, 2.57, -2.3, 7);
  return g;
}

export const dailyShops = [
  { id: 'florist', name: '花与叶花店', subtitle: '不对称绿框 · 斜玻璃雨棚 · 阶梯花架', width: 5.4, depth: 4.8, height: 3.8, color: '#83ad8f', build: florist },
  { id: 'bookstore', name: '月灯旧书店', subtitle: '两层窄楼 · 木格窗 · 街边旧书摊', width: 4.6, depth: 5, height: 6.6, color: '#bba17b', build: bookstore },
  { id: 'barber', name: '绿叶理发店', subtitle: '薄荷立面 · 阶梯女儿墙 · 三色理容灯', width: 4.8, depth: 4.8, height: 3.93, color: '#97c3ac', build: barber },
];
