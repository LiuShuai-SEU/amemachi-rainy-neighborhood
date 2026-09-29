import { THREE, box, cyl, sphere, torus, rod, curve, text, panel, point, mat, seeded } from '../kit.js';

const GLASS = { opacity: .07, depthWrite: false, shadow: false };
const laundryPalette = { wall: 0xe6ebe7, grout: 0xbac6c9, blue: 0x376c9c, steel: 0xa3b8c2, dark: 0x243743 };

function drain(p, x, top, z, bottom = .12, color = 0x677775) {
  rod(p, [x, top, z], [x, bottom + .15, z], .046, color);
  curve(p, [[x, bottom + .22, z], [x, bottom + .07, z], [x, bottom, z + .18]], .046, color);
  for (let y = .52; y < top; y += 1.02) box(p, x, y, z - .018, .16, .05, .12, color);
}

function backEquipment(p, width, depth, wallHeight, color) {
  const back = -depth - .08;
  box(p, -width * .26, 1.22, back, .87, 2.28, .07, color, { edge: true });
  box(p, -width * .26 + .28, 1.17, back - .055, .05, .15, .055, 0xb4beb8);
  box(p, width * .21, .54, back - .17, 1.1, .79, .36, 0xced2c8, { edge: true });
  for (let i = 0; i < 8; i++) box(p, width * .21 - .43 + i * .12, .55, back - .365, .035, .54, .025, 0x8d9895);
  const fan = torus(p, width * .21, .53, back - .387, .24, .019, 0x6f8285);
  fan.rotation.y = Math.PI;
  for (let a = 0; a < 4; a++) {
    const blade = box(p, width * .21, .53, back - .392, .065, .42, .02, 0x819192);
    blade.rotation.z = a * Math.PI / 4;
  }
  curve(p, [[width * .21 + .5, .76, back], [width * .21 + .65, 1.04, back], [width * .21 + .65, 2.65, back]], .026, 0xb9b5a4);
  drain(p, width / 2 - .11, wallHeight, back - .04);
}

function washer(p, x, z, index) {
  const c = laundryPalette;
  box(p, x, .75, z, .78, 1.32, .9, c.wall, { edge: true });
  box(p, x, 1.345, z + .47, .73, .15, .04, 0xd6dee0);
  box(p, x - .14, 1.354, z + .5, .25, .05, .022, 0x435e6c);
  box(p, x - .14, 1.354, z + .517, .17, .019, .009, 0xa9e3da, { basic: true });
  cyl(p, x + .235, 1.35, z + .509, .043, .028, 0x6d838b, { rot: [Math.PI / 2, 0, 0], segments: 12 });
  box(p, x + .112, 1.34, z + .511, .025, .044, .012, c.blue);
  cyl(p, x, .768, z + .479, .294, .045, c.dark, { rot: [Math.PI / 2, 0, 0], segments: 32 });
  torus(p, x, .768, z + .513, .272, .035, 0xb2c0c1);
  torus(p, x, .768, z + .533, .226, .023, 0x374e5b);
  cyl(p, x, .768, z + .516, .21, .012, 0x627f8c, { rot: [Math.PI / 2, 0, 0], segments: 24 });
  torus(p, x, .768, z + .532, .18, .012, 0x9baeb3);
  for (let k = 0; k < 12; k++) {
    const a = k * Math.PI / 6;
    sphere(p, x + Math.cos(a) * .168, .768 + Math.sin(a) * .168, z + .54, .014, 0x385663);
  }
  for (let k = 0; k < 3; k++) {
    const a = k * Math.PI * 2 / 3 + index * .7;
    const fold = box(p, x + Math.cos(a) * .067, .736 + Math.sin(a) * .056, z + .551, .12, .072, .018, [0xcfdfdf, 0xabc9cf, 0xa7c0d0][k]);
    fold.rotation.z = a;
  }
  cyl(p, x, .768, z + .565, .215, .005, 0xd4f0fb, { ...GLASS, rot: [Math.PI / 2, 0, 0], segments: 32 });
  box(p, x + .258, .77, z + .565, .046, .13, .035, 0x253c4d);
  box(p, x, .215, z + .466, .59, .07, .025, 0xbac8c8);
  for (let k = 0; k < 3; k++) box(p, x - .2 + k * .2, .215, z + .484, .13, .017, .012, 0x73898e);
  text(p, `${index + 1}`, x + .255, 1.17, z + .479, .1, .1, { color: '#456777', scale: .68, width: 64 });
}

function laundryBasket(p, x, z, color) {
  box(p, x, .135, z, .45, .08, .35, color);
  for (let side = -1; side <= 1; side += 2) {
    box(p, x, .46, z + side * .17, .49, .045, .025, color);
    box(p, x + side * .235, .46, z, .025, .045, .35, color);
    for (let n = 0; n < 6; n++) box(p, x - .21 + n * .084, .31, z + side * .168, .024, .28, .024, color);
    for (let n = 0; n < 4; n++) box(p, x + side * .23, .31, z - .13 + n * .086, .024, .28, .024, color);
    rod(p, [x + side * .235, .44, z - .11], [x + side * .235, .51, z + .1], .014, color);
  }
}

function buildLaundry() {
  const p = new THREE.Group(); p.name = '雨町コインランドリー';
  const c = laundryPalette;
  box(p, 0, .04, -2.5, 6, .08, 5, 0xb7c4c5);
  box(p, -2.94, 1.57, -2.5, .12, 2.98, 5, c.wall);
  box(p, 2.94, 1.57, -2.5, .12, 2.98, 5, c.wall);
  box(p, 0, 1.57, -4.94, 6, 2.98, .12, c.wall);
  box(p, 0, 3.105, -2.5, 6, .15, 5, 0xaab9bb);
  box(p, 0, 3.5, -.055, 6, .8, .19, c.grout);
  box(p, 0, 3.5, -4.91, 6, .8, .18, c.wall);
  box(p, -2.91, 3.5, -2.5, .18, .8, 5, c.wall);
  box(p, 2.91, 3.5, -2.5, .18, .8, 5, c.wall);
  box(p, 0, 3.87, -2.5, 6, .06, 5, 0xdfe5df);
  // Ceramic piers and a low tiled wall leave most of the shop front open.
  box(p, -.85, .34, -.04, 4.12, .52, .13, c.grout);
  for (const x of [-2.84, 1.23, 2.84]) box(p, x, 1.57, -.035, .24, 2.98, .16, c.grout);
  for (let ix = 0; ix < 20; ix++) for (let iy = 0; iy < 3; iy++) {
    box(p, -2.79 + ix * .2, .16 + iy * .17, .039, .187, .155, .027, iy === 0 ? 0xc5d2d1 : 0xf1f1e9);
  }
  for (const x of [-2.84, 1.23, 2.84]) for (let iy = 0; iy < 17; iy++) box(p, x, .17 + iy * .17, .053, .219, .153, .03, iy % 4 === 1 ? 0xdce5e2 : 0xf0f0e8);
  for (let ix = 0; ix < 29; ix++) for (const y of [3.16, 3.74]) box(p, -2.8 + ix * .2, y, .053, .187, .16, .031, 0xedeee5);
  box(p, -.83, 1.58, -.025, 3.82, 1.87, .024, 0xc7e2e8, GLASS);
  for (const x of [-2.73, -.82, 1.08]) box(p, x, 1.59, .025, .055, 1.93, .09, 0x6b8590);
  for (const y of [.61, 2.56]) box(p, -.83, y, .025, 3.88, .063, .12, 0x71858b);
  // The sliding door stays partly open, preserving a clear view through the entrance.
  box(p, 2.63, 1.23, .027, .31, 2.3, .03, 0xcbeaf1, GLASS);
  for (const x of [1.36, 2.48, 2.79]) box(p, x, 1.23, .042, .04, 2.3, .055, 0x687e85);
  box(p, 2.06, 2.4, .047, 1.47, .085, .1, 0x6e8890);
  box(p, 2.49, 1.2, .085, .03, .3, .04, 0xd6ded8);
  box(p, 2.05, .081, .35, 1.38, .004, .61, 0x587881);
  box(p, 0, 3.42, .115, 5.5, .53, .12, c.blue, { edge: true });
  text(p, '雨町コインランドリー', 0, 3.435, .183, 5.14, .39, { color: '#f3f6eb', scale: .7 });
  text(p, '24H  /  WASH & DRY', -.8, .875, .074, 1.91, .15, { color: '#315d7e', scale: .54 });
  box(p, 0, 2.94, -.5, 5.4, .04, .035, 0xc5f0f7, { basic: true });
  for (let i = 0; i < 6; i++) washer(p, -2.3 + i * .92, -4.22, i);
  for (let i = 0; i <= 10; i++) box(p, -2.75 + i * .55, .082, -2.5, .014, .004, 4.8, 0x97acaf);
  for (let i = 0; i <= 8; i++) box(p, 0, .083, -.3 - i * .55, 5.76, .004, .014, 0x99acaf);
  text(p, '洗濯 300円', -.98, 2.22, -4.845, 1.47, .24, { color: '#376b8c', scale: .66 });
  text(p, '乾燥 100円', 1.13, 2.22, -4.845, 1.47, .24, { color: '#376b8c', scale: .66 });
  // Fold table, linens, baskets and a row of molded waiting chairs.
  box(p, -2.21, 1.0, -1.86, .91, .09, 1.64, 0xd9c5a2);
  for (const x of [-2.54, -1.9]) for (const z of [-2.45, -1.27]) rod(p, [x, .1, z], [x, .98, z], .026, 0xa3b7bd);
  for (let i = 0; i < 4; i++) box(p, -2.19, 1.066 + i * .035, -2.22, .5 - i * .024, .032, .36, i % 2 ? 0xbcd1d0 : 0xf0ece0);
  laundryBasket(p, -2.13, -.78, 0x749dae);
  laundryBasket(p, -1.97, -2.12, 0xc4c8ae);
  for (let i = 0; i < 3; i++) {
    const x = -.92 + i * .61;
    box(p, x, .57, -.59, .48, .085, .47, 0x83a5b2, { edge: true });
    box(p, x, .83, -.85, .48, .45, .055, 0x83a5b2);
    for (const dx of [-.17, .17]) rod(p, [x + dx, .09, -.78], [x + dx, .57, -.5], .022, 0x9caeb1);
  }
  box(p, 2.48, 1.19, -1.9, .48, 1.32, .33, 0x527e99, { edge: true });
  box(p, 2.479, 1.44, -1.717, .3, .23, .025, 0xc8dcdd);
  text(p, '両替', 2.48, 1.69, -1.714, .31, .14, { color: '#edf3e6', width: 128 });
  box(p, 2.49, 1.15, -1.714, .19, .037, .016, 0x263a45);
  box(p, 2.49, .89, -1.713, .22, .12, .016, 0x2c4755);
  backEquipment(p, 6, 5, 3.65, 0x81989b);
  point(p, 0xc8e8f4, 17, .2, 2.8, -2.45, 7);
  return p;
}

function closedGable(p, cx, cz, span, run, eave, ridge, color, alongX = false) {
  const s = new THREE.Shape();
  s.moveTo(-span / 2, eave - .13); s.lineTo(span / 2, eave - .13);
  s.lineTo(span / 2, eave); s.lineTo(0, ridge); s.lineTo(-span / 2, eave); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: run, bevelEnabled: false, steps: 1, curveSegments: 1 });
  geo.translate(0, 0, -run / 2);
  const m = new THREE.Mesh(geo, mat(color)); m.position.set(cx, 0, cz);
  if (alongX) m.rotation.y = Math.PI / 2;
  m.castShadow = m.receiveShadow = true; p.add(m); return m;
}

function timberWindow(p, x) {
  box(p, x, 1.7, .036, 1.67, 1.63, .035, 0xd1e0d5, GLASS);
  for (const dx of [-.86, 0, .86]) box(p, x + dx, 1.7, .076, .06, 1.74, .11, 0x655044);
  for (const y of [.85, 1.68, 2.55]) box(p, x, y, .076, 1.79, .065, .12, 0x655044);
  for (const dx of [-.58, -.29, .29, .58]) box(p, x + dx, 1.71, .083, .027, 1.63, .06, 0x9e8a6d);
  box(p, x, .785, .14, 1.91, .11, .32, 0x6a5240);
}

function lockers(p, x, z, columns, rows, unit = .42) {
  box(p, x, .13 + rows * unit / 2, z, columns * unit + .08, rows * unit + .06, .43, 0x47392f);
  for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
    const xx = x + (col - (columns - 1) / 2) * unit, yy = .16 + (row + .5) * unit;
    box(p, xx, yy, z + .239, unit - .033, unit - .038, .035, (row + col) % 3 === 0 ? 0xb99b69 : 0xc6ab7b);
    box(p, xx + unit * .29, yy, z + .266, .025, .054, .022, 0x665544);
    box(p, xx - unit * .19, yy + .085, z + .259, .068, .037, .01, 0xf0e4ca);
  }
}

function buildSento() {
  const p = new THREE.Group(); p.name = '雨町湯';
  const cream = 0xdfd3b2, wood = 0x71523a, darkwood = 0x4c3d32, roof = 0x485d62;
  box(p, 0, .04, -3, 7.4, .08, 6, 0xb3b6a5);
  box(p, -3.62, 1.61, -3, .16, 3.06, 6, cream);
  box(p, 3.62, 1.61, -3, .16, 3.06, 6, cream);
  box(p, 0, 1.61, -5.92, 7.4, 3.06, .16, cream);
  // The front remains physically open behind the noren and the transparent side windows.
  for (const x of [-2.53, 2.53]) {
    box(p, x, .42, -.018, 2.34, .68, .15, cream);
    box(p, x, 2.83, -.018, 2.34, .55, .15, cream);
    timberWindow(p, x);
  }
  for (const x of [-3.57, -1.39, 1.39, 3.57]) box(p, x, 1.61, .04, .16, 3.06, .22, wood);
  box(p, 0, 3.08, .04, 7.4, .19, .26, darkwood);
  for (const x of [-3.62, 3.62]) for (const z of [-1.5, -3, -4.5]) box(p, x, 1.63, z, .18, 3.02, .14, wood);
  // A closed main hip-free gable volume with raised cylindrical ceramic courses.
  closedGable(p, 0, -3, 6.44, 7.8, 3.27, 4.69, roof, true);
  for (let ix = 0; ix <= 28; ix++) {
    const x = -3.78 + ix * .27;
    rod(p, [x, 3.31, .21], [x, 4.735, -3], .045, ix % 3 === 0 ? 0x5d7375 : 0x52686c);
    rod(p, [x, 4.735, -3], [x, 3.31, -6.21], .045, ix % 3 === 0 ? 0x607476 : 0x52686c);
    box(p, x, 3.25, .227, .22, .12, .12, 0x455b60);
    box(p, x, 3.25, -6.227, .22, .12, .12, 0x455b60);
    cyl(p, x, 4.75, -3, .104, .25, 0x5d7275, { rot: [0, 0, Math.PI / 2], segments: 10 });
  }
  for (let n = 1; n < 10; n++) {
    const dz = n * .321, yy = 4.72 - dz * 1.42 / 3.22;
    rod(p, [-3.9, yy, -3 + dz], [3.9, yy, -3 + dz], .017, 0x354b51);
    rod(p, [-3.9, yy, -3 - dz], [3.9, yy, -3 - dz], .017, 0x354b51);
  }
  // Elevated entrance gable, enclosed on all sides, with visible front timber work.
  closedGable(p, 0, -.64, 3.45, 2.9, 4.02, 5.45, 0x40565c);
  for (let iz = 0; iz < 13; iz++) {
    const z = .76 - iz * .23;
    rod(p, [-1.72, 4.06, z], [0, 5.493, z], .04, 0x5f7275);
    rod(p, [0, 5.493, z], [1.72, 4.06, z], .04, 0x5f7275);
  }
  for (const x of [-1.32, -.88, -.44, .44, .88, 1.32]) {
    const y = 5.49 - Math.abs(x) * 1.43 / 1.725;
    rod(p, [x, y, .81], [x, y, -2.09], .02, 0x2e4850);
  }
  rod(p, [0, 5.51, .87], [0, 5.51, -2.14], .095, 0x566d73);
  rod(p, [-1.72, 4, .87], [0, 5.44, .87], .085, darkwood);
  rod(p, [0, 5.44, .87], [1.72, 4, .87], .085, darkwood);
  box(p, 0, 4.02, .82, 3.51, .13, .15, darkwood);
  box(p, 0, 4.61, .825, .12, 1.08, .12, wood);
  box(p, 0, 4.37, .827, 2.4, .1, .13, wood);
  for (const x of [-1.46, 1.46]) {
    box(p, x, 2.07, .59, .19, 3.98, .19, darkwood);
    box(p, x, .29, .59, .3, .42, .3, 0x8a8a74);
    rod(p, [x, 3.59, .59], [x * .65, 3.99, .59], .062, wood);
  }
  box(p, 0, 3.66, .56, 3.08, .58, .19, cream);
  box(p, 0, 3.39, .56, 3.11, .12, .25, darkwood);
  box(p, 0, 3.66, .684, 1.71, .44, .085, 0x513d2f, { edge: true });
  text(p, '雨町湯', 0, 3.67, .735, 1.5, .32, { color: '#ece2bb', scale: .75 });
  for (let i = 0; i < 13; i++) box(p, -1.2 + i * .2, 2.92, .29, .032, .68, .073, wood);
  for (const y of [2.57, 3.26]) box(p, 0, y, .29, 2.62, .068, .09, darkwood);
  rod(p, [-1.32, 2.46, .41], [1.32, 2.46, .41], .033, darkwood);
  for (let i = 0; i < 5; i++) {
    const x = -1.028 + i * .514;
    box(p, x, 2.08, .431, .49, .71 + (i % 2) * .023, .022, i % 2 ? 0x2e546b : 0x345e75);
    box(p, x, 1.746, .447, .475, .014, .012, 0x577a8e);
  }
  text(p, 'ゆ', 0, 2.096, .452, .7, .58, { color: '#eee8d4', scale: .84 });
  box(p, 0, .082, .49, 2.76, .004, .96, 0x8a978d);
  for (let i = 0; i < 8; i++) box(p, -1.24 + i * .355, .085, .51, .014, .004, .91, 0x667b74);
  // Compact bench and shoe lockers stand inside the common frontage allowance.
  for (let i = 0; i < 3; i++) box(p, -2.65, .54, .29 + i * .105, 1.55, .068, .09, 0x9c754d);
  for (const x of [-3.16, -2.14]) for (const z of [.3, .48]) box(p, x, .295, z, .075, .42, .075, darkwood);
  box(p, -2.65, .85, .235, 1.56, .24, .06, 0x9c754d);
  lockers(p, 2.84, .17, 3, 3, .29);
  text(p, '下足', 2.84, 1.235, .392, .62, .17, { color: '#6c563e', scale: .62, width: 256 });
  // Interior lockers, a slatted divider and an actual recessed-looking bath.
  lockers(p, -2.23, -4.98, 5, 4, .45);
  for (let i = 0; i < 11; i++) box(p, -.58, 1.31, -4.76 + i * .2, .05, 2.46, .045, 0x8f764f);
  for (const y of [.19, 2.51]) box(p, -.58, y, -3.76, .1, .1, 2.15, darkwood);
  box(p, 1.92, .245, -4.32, 2.45, .33, 2.55, 0x768f8b);
  box(p, 1.92, .424, -4.32, 2.14, .03, 2.22, 0x80b9b8, { emissive: 0x214d51, intensity: .17 });
  for (const x of [.67, 3.17]) box(p, x, .47, -4.32, .18, .17, 2.74, 0xc3cdb9);
  for (const z of [-2.97, -5.67]) box(p, 1.92, .47, z, 2.67, .17, .18, 0xc3cdb9);
  for (let i = 0; i < 8; i++) box(p, .88 + i * .3, .562, -2.97, .015, .012, .18, 0x789992);
  for (let i = 0; i < 3; i++) {
    cyl(p, 2.55 - i * .6, .18, -2.28, .17, .19, 0xcab174, { segments: 12 });
    torus(p, 2.55 - i * .6, .29, -2.28, .14, .022, 0x997e44, { rot: [Math.PI / 2, 0, 0] });
  }
  box(p, -.07, .54, -2.6, .74, .12, 1.08, 0xb29162);
  for (const x of [-.29, .15]) for (const z of [-2.95, -2.24]) box(p, x, .3, z, .07, .44, .07, wood);
  panel(p, 1.89, 2.01, -5.817, 2.77, 1.29, 0x9cb8b8);
  text(p, '富士の湯', 1.91, 2.38, -5.8, 1.38, .26, { color: '#f1e7c8', scale: .64 });
  for (let i = 0; i < 10; i++) box(p, -3.39 + i * .69, .083, -2.81, .014, .004, 5.45, 0x909e8e);
  for (let i = 0; i < 8; i++) box(p, 0, .084, -.34 - i * .68, 7.11, .004, .014, 0x909e8e);
  // Brick-ring chimney: the top cap defines the exact 9.4 m module height.
  const chimneyX = 2.48, chimneyZ = -5.13;
  cyl(p, chimneyX, 4.49, chimneyZ, .36, 8.82, 0x9a765d, { segments: 16 });
  for (let i = 0; i < 29; i++) {
    const y = .23 + i * .297;
    torus(p, chimneyX, y, chimneyZ, .361, .013, 0xc2aa87, { rot: [Math.PI / 2, 0, 0] });
    for (let j = 0; j < 3; j++) {
      const a = j * Math.PI * 2 / 3 + (i % 2) * Math.PI / 3;
      const seam = box(p, chimneyX + Math.sin(a) * .36, y + .139, chimneyZ + Math.cos(a) * .36, .014, .255, .015, 0xbda783);
      seam.rotation.y = a;
    }
  }
  for (const y of [5.95, 7.78, 8.91]) torus(p, chimneyX, y, chimneyZ, .373, .026, 0x5b6462, { rot: [Math.PI / 2, 0, 0] });
  cyl(p, chimneyX, 9.01, chimneyZ, .43, .15, 0x687370, { segments: 16 });
  for (const dx of [-.27, .27]) for (const dz of [-.27, .27]) rod(p, [chimneyX + dx, 9.075, chimneyZ + dz], [chimneyX + dx, 9.24, chimneyZ + dz], .021, 0x56615e);
  cyl(p, chimneyX, 9.31, chimneyZ, .55, .18, 0x4e615e, { top: .42, segments: 16 });
  backEquipment(p, 7.4, 6, 3.1, 0x837866);
  point(p, 0xffdfa7, 23, -.05, 2.77, -1.91, 8);
  return p;
}

export const serviceShops = [
  { id: 'laundry', name: '投币洗衣店', subtitle: '白瓷砖平顶 · 六台滚筒洗衣机', width: 6, depth: 5, height: 3.9, color: '#5487a5', build: buildLaundry },
  { id: 'sento', name: '钱汤澡堂', subtitle: '瓦坡顶门楼 · 砖砌高烟囱', width: 7.4, depth: 6, height: 9.4, color: '#a58b65', build: buildSento },
];
