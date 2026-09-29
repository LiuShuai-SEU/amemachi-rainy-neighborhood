import { THREE, box, cyl, sphere, torus, rod, text, point, mat } from '../kit.js';

// All shops share the same metre scale: the street-facing wall is z = 0.
const C = { timber:0x553b31, dark:0x302c2b, wood:0xb47b4d, cream:0xe7d8b2, glass:0xb1dbd4, tile:0x344555, metal:0x69727b, red:0xa63336, green:0x536b48 };
const glass = { opacity:.08, depthWrite:false };

function slab(p,w,d,color=0x66554c) {
  box(p,0,.04,-d/2,w,.08,d,color);
  for(let x=-w/2+.18;x<w/2;x+=.38) box(p,x,.086,-d/2,.018,.012,d-.1,0x352e2a);
}
function shell(p,w,d,h,color) {
  box(p,0,h/2,-d+.09,w,h,.18,color);
  box(p,-w/2+.09,h/2,-d/2,.18,h,d,color);
  box(p,w/2-.09,h/2,-d/2,.18,h,d,color);
}
function windowFrame(p,x,y,z,w,h,wood=C.timber,bars=3) {
  box(p,x,y,z,w,h,.035,C.glass,glass);
  for(const dx of [-w/2,w/2]) box(p,x+dx,y,z+.032,.07,h+.07,.075,wood);
  for(const dy of [-h/2,h/2]) box(p,x,y+dy,z+.032,w,.07,.075,wood);
  for(let i=1;i<bars;i++) box(p,x-w/2+w*i/bars,y,z+.04,.04,h,.07,wood);
}
function lantern(p,x,y,z,r=.20,label='酒',color=0xda6247) {
  const body=sphere(p,x,y,z,r,color,{emissive:0x8f3015,intensity:.45});body.scale.y=1.36;
  for(let i=-3;i<=3;i++) {
    const yy=i*r*.3, rr=r*Math.sqrt(Math.max(.2,1-(yy/(r*1.36))**2));
    torus(p,x,y+yy,z,rr,.009,0x7c3529,{rot:[Math.PI/2,0,0]});
  }
  cyl(p,x,y+r*1.3,z,r*.47,.04,0x2e2a28);
  cyl(p,x,y-r*1.3,z,r*.47,.04,0x2e2a28);
  rod(p,[x,y+r*1.3,z],[x,y+r*1.3+.18,z],.012,0x25292c);
  text(p,label,x,y,z+r*1.01,r*1.1,r*1.7,{color:'#41241e',scale:.66});
}
function plant(p,x,z,y=0,scale=1) {
  cyl(p,x,y+.17*scale,z,.19*scale,.34*scale,0x987052,{top:.25*scale});
  cyl(p,x,y+.34*scale,z,.23*scale,.022,0x302f26);
  for(let i=0;i<5;i++) {
    const a=i*2.4,xx=x+Math.cos(a)*.13*scale,zz=z+Math.sin(a)*.13*scale;
    rod(p,[x,y+.28*scale,z],[xx,y+.60*scale,zz],.014*scale,0x50633e);
    const leaf=sphere(p,xx,y+(.57+.055*(i%2))*scale,zz,.17*scale,i%2?0x648652:0x416548);leaf.scale.set(1,.65,.8);
  }
}
function stool(p,x,z,y=.1) {
  cyl(p,x,y+.61,z,.27,.13,0xb05c41);
  for(const dx of [-.16,.16]) for(const dz of [-.16,.16]) box(p,x+dx,y+.29,z+dz,.055,.54,.055,C.dark);
  torus(p,x,y+.27,z,.22,.025,C.metal,{rot:[Math.PI/2,0,0]});
}
function table(p,x,z,w=1.05,d=.75) {
  box(p,x,.85,z,w,.1,d,C.wood);
  for(const dx of [-w*.36,w*.36]) for(const dz of [-d*.34,d*.34])box(p,x+dx,.46,z+dz,.07,.75,.07,C.timber);
}
function bowl(p,x,y,z,color=0xe7dfc8) {
  cyl(p,x,y+.052,z,.12,.10,color,{top:.17,segments:16});
  cyl(p,x,y+.105,z,.149,.011,0xc69342,{segments:16});
  for(let i=0;i<3;i++)torus(p,x-.05+i*.045,y+.113,z,.055,.009,0xe3cf82,{rot:[Math.PI/2,0,0]});
  sphere(p,x+.04,y+.128,z+.04,.035,0x789651);
  sphere(p,x-.045,y+.126,z-.025,.04,0xe9dca0).scale.y=.34;
  rod(p,[x+.12,y+.12,z-.12],[x+.16,y+.14,z+.15],.007,C.timber);
  rod(p,[x+.145,y+.12,z-.12],[x+.18,y+.14,z+.15],.007,C.timber);
}
function noren(p,x,y,z,w,h,color,chars) {
  rod(p,[x-w/2-.12,y+.08,z],[x+w/2+.12,y+.08,z],.025,C.timber);
  const count=chars.length;
  for(let i=0;i<count;i++) {
    const px=x-w/2+(i+.5)*w/count;
    box(p,px,y-h/2,z,w/count-.025,h,.025,color);
    text(p,chars[i],px,y-h*.5,z+.018,w/count*.77,h*.65,{color:'#f4e9cb',scale:.71});
  }
}
// A closed roof prism and pitched slabs keep the silhouette valid from every camera angle.
function gable(p,w,d,eave,ridge,color=C.tile) {
  const half=w/2, rise=ridge-eave, slope=Math.atan2(rise,half), length=Math.hypot(half,rise);
  const shape=new THREE.Shape();shape.moveTo(-half,eave);shape.lineTo(0,ridge);shape.lineTo(half,eave);shape.closePath();
  const geom=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false,steps:1});
  const m=new THREE.Mesh(geom,mat(0x8b795f));m.position.z=-d+.14;m.castShadow=true;m.receiveShadow=true;p.add(m);
  for(const side of [-1,1]) {
    box(p,side*half/2,(eave+ridge)/2,-d/2+.14,length+.05,.095,d,color,{rot:[0,0,-side*slope]});
    for(let z=-d+.20;z<=.11;z+=.235) {
      rod(p,[side*.04,ridge+.025,z],[side*(half-.035),eave+.055,z],.034,color);
      for(let k=1;k<=3;k++) {
        const t=k/4;
        rod(p,[side*(half*t-.033),ridge-rise*t+.055,z-.104],[side*(half*t-.033),ridge-rise*t+.055,z+.104],.013,0x5b6770);
      }
    }
    rod(p,[side*half,eave-.02,-d+.12],[side*half,eave-.02,.15],.053,0x252f38);
  }
  rod(p,[0,ridge+.07,-d+.1],[0,ridge+.07,.17],.085,color);
}

function ramen() {
  const p=new THREE.Group();p.name='ramen';const w=4.8,d=4.8;
  slab(p,w,d,0x6d6254);shell(p,w,d,3.17,0xbfb299);
  // Low single-storey body, black flat roof, burgundy fabric fascia.
  box(p,0,3.17,-2.37,4.92,.19,4.94,0x35404a);
  box(p,0,3.29,-2.38,4.70,.08,4.66,0x46515a);
  for(const x of [-2.26,2.26]) box(p,x,1.5,0,.17,3.0,.16,C.timber);
  box(p,0,2.81,.02,4.63,.31,.19,C.timber);
  box(p,0,2.83,.18,4.30,.55,.14,0x9a3234,{rot:[-.13,0,0]});
  text(p,'らーめん 雨宿り',0,2.84,.29,3.8,.44,{color:'#f6ddb7',scale:.67});
  box(p,0,3.15,.29,4.6,.085,.77,0x552e2e,{rot:[-.16,0,0]});
  box(p,-.58,.49,.015,2.69,.83,.16,0x673f30);
  for(let x=-1.84;x<.68;x+=.17)box(p,x,.48,.11,.035,.81,.04,0x845b42);
  windowFrame(p,-.60,1.73,.018,2.60,1.59,C.timber,4);
  box(p,.84,1.23,.0,.1,2.46,.13,C.timber);
  windowFrame(p,1.55,1.20,-.08,1.27,2.32,C.timber,2);
  box(p,1.09,1.11,.02,.055,.24,.055,0xb5a679);
  noren(p,1.54,2.38,.18,1.25,.54,0x9e3838,['麺','処']);
  lantern(p,-2.02,2.16,.53,.22,'麺');
  lantern(p,2.08,2.16,.43,.18,'味');
  // Open sightlines reveal bar seats, bowls and the tiled working kitchen.
  box(p,-.63,1.02,-1.2,2.75,.13,.57,0xcd9967);
  box(p,-.63,.56,-1.29,2.64,.85,.35,0x654231);
  for(const x of [-1.53,-.64,.24]) {stool(p,x,-.50);bowl(p,x,1.09,-1.17);}
  box(p,-.2,.99,-3.62,3.86,.13,.72,0x9baba9);
  box(p,-.2,.53,-3.67,3.82,.8,.62,0x7e9092);
  for(let x=-1.87;x<=1.5;x+=.34) for(let y=1.15;y<=2.7;y+=.28)box(p,x,y,-4.687,.32,.26,.023,0xc8c9b6);
  box(p,-1.25,1.14,-3.56,1.15,.10,.55,0x34393e);
  for(const x of [-1.52,-1.0]) {
    torus(p,x,1.23,-3.57,.18,.04,0x263039,{rot:[Math.PI/2,0,0]});
    cyl(p,x,1.45,-3.57,.17,.37,0xb1b8b3,{top:.20});
    cyl(p,x,1.65,-3.57,.21,.035,0xc0c7c1);sphere(p,x,1.69,-3.57,.035,C.dark);
  }
  box(p,-1.24,2.60,-3.69,1.62,.32,.92,0x717b7e);
  box(p,-1.24,2.93,-3.77,.49,.38,.47,0x81898b);
  cyl(p,-1.24,3.63,-3.77,.19,.61,0x78858e);
  cyl(p,-1.24,3.96,-3.77,.27,.08,0x495864);
  box(p,1.11,1.07,-3.54,.71,.10,.52,0x5f747a);
  box(p,1.11,1.12,-3.54,.57,.035,.39,0x263c49);
  rod(p,[1.1,1.15,-3.79],[1.1,1.48,-3.79],.025,0xb6c1bd);
  rod(p,[1.1,1.48,-3.79],[1.1,1.48,-3.59],.025,0xb6c1bd);
  box(p,.15,2.15,-4.50,1.50,.10,.31,C.wood);
  for(let i=0;i<7;i++){cyl(p,-.47+i*.20,2.27,-4.49,.062,.15,0xe7dcc0);}
  text(p,'おしながき',-.55,2.47,-4.668,.94,.27,{color:'#382e2a',scale:.72});
  box(p,-2.025,1.1,.54,.46,1.97,.62,0xd4c7ab);
  box(p,-2.025,1.62,.861,.35,.31,.015,0x305257,{emissive:0x538b81,intensity:.8});
  text(p,'食券',-2.025,1.94,.861,.36,.20,{color:'#8c302b',scale:.80});
  for(let row=0;row<4;row++)for(let col=0;col<3;col++)box(p,-2.145+col*.12,1.32-row*.15,.865,.082,.075,.018,row%2?0xad4836:0xdbaa50);
  box(p,-2.02,.47,.861,.28,.13,.024,0x3e4241);
  box(p,-2.02,.17,.53,.55,.12,.69,C.dark);
  plant(p,2.16,.60,0,.64);
  // A compact roof compressor and wall utility add a readable side silhouette.
  box(p,1.35,3.5,-3.6,.91,.36,.67,0xaaa991);
  for(let i=0;i<5;i++)box(p,1.04+i*.15,3.51,-3.249,.025,.24,.025,0x4b5c60);
  point(p,0xffc575,30,-.1,2.37,-1.30,7);
  return p;
}

function izakaya() {
  const p=new THREE.Group();p.name='izakaya';const w=5.8,d=5.2;
  slab(p,w,d,0x59483b);shell(p,w,d,5.73,0x9c8667);
  box(p,0,3.02,-d/2,w,.20,d,C.timber);
  for(const x of [-2.78,0,2.78])box(p,x,2.90,.035,.18,5.8,.19,0x43332c);
  for(const y of [.20,2.70,3.03,5.63])box(p,0,y,.03,w,.18,.19,C.timber);
  // Left dining window, recessed central entrance, and a narrow right display.
  box(p,-1.56,.42,.01,2.34,.70,.15,C.timber);
  windowFrame(p,-1.56,1.61,.01,2.31,1.72,C.timber,7);
  box(p,2.07,.43,.015,1.48,.72,.15,C.timber);
  windowFrame(p,2.05,1.64,.01,1.38,1.75,C.timber,4);
  box(p,.58,.115,-.19,1.27,.15,.78,0x726b5c);
  box(p,.58,.09,.34,1.39,.12,.38,0x847865);
  windowFrame(p,.59,1.25,-.55,1.16,2.32,C.timber,4);
  box(p,1.02,1.1,-.49,.045,.22,.05,0xb39c6b);
  noren(p,.60,2.36,-.20,1.25,.62,0x5e3840,['居','酒','屋']);
  box(p,0,2.91,.23,6.03,.12,.88,C.tile,{rot:[-.14,0,0]});
  for(let x=-2.93;x<2.95;x+=.23)rod(p,[x,2.97,-.20],[x,2.84,.69],.035,0x4d5d67);
  for(const x of [-2.27,-1.14,1.6,2.5])lantern(p,x,2.36,.62,.195,x<0?'酒':'肴');
  box(p,-1.54,2.57,.09,2.09,.31,.10,C.dark);
  text(p,'雨音 酒場',-1.54,2.58,.153,1.91,.24,{color:'#e5c792',scale:.81});
  // Upstairs has a shallow balcony and shoji windows, giving the tall shop a different massing.
  for(const x of [-1.40,1.40]) {
    windowFrame(p,x,4.42,.035,2.42,1.86,C.timber,7);
    for(const yy of [3.86,4.22,4.58,4.94])box(p,x,yy,.09,2.43,.042,.062,C.timber);
    box(p,x,4.42,-.10,2.30,1.77,.022,0xe5cba0,{opacity:.52,depthWrite:false,emissive:0xae7840,intensity:.16});
  }
  box(p,0,3.50,.26,5.42,.16,.71,0x634b39);
  box(p,0,4.13,.56,5.42,.10,.10,C.timber);
  box(p,0,3.64,.56,5.42,.08,.09,C.timber);
  for(let x=-2.6;x<=2.61;x+=.26)box(p,x,3.88,.56,.055,.62,.065,0x47392f);
  for(const x of [-2.55,2.55])box(p,x,4.02,.56,.095,1.03,.095,C.timber);
  for(const x of [-2.1,1.93])plant(p,x,.32,3.59,.59);
  gable(p,6.08,5.52,5.81,6.60);
  // A wooden vertical name board avoids repeating the other shops' horizontal branding.
  box(p,2.64,4.82,.34,.39,1.13,.17,0x44352c);
  for(let i=0;i<3;i++)text(p,['雨','音','亭'][i],2.64,5.14-i*.30,.432,.31,.31,{color:'#ecd2a0',scale:.77});
  for(const x of [-1.60,1.78]) {
    table(p,x,-1.37,1.15,.85);
    for(const z of [-.76,-1.97]) {
      box(p,x,.48,z,.95,.10,.34,0x8e6140);
      for(const xx of [x-.34,x+.34])box(p,xx,.27,z,.06,.40,.06,C.timber);
    }
    bowl(p,x-.23,.91,-1.37);cyl(p,x+.27,1.02,-1.38,.065,.20,0xe5dcc5);
    cyl(p,x+.06,1.065,-1.54,.066,.29,0x6a8664,{top:.028});
  }
  box(p,-.25,1.07,-3.55,4.45,.13,.56,0xaf7d4b);
  box(p,-.25,.59,-3.60,4.35,.83,.37,C.timber);
  box(p,-.4,2.0,-4.91,4.4,1.53,.28,0x473a31);
  for(const y of [1.35,1.82,2.29,2.73]) {
    box(p,-.4,y,-4.69,4.39,.065,.49,C.wood);
    if(y<2.5)for(let i=0;i<12;i++) {
      const x=-2.43+i*.36,cl=i%3===0?0x938762:i%3===1?0x476956:0x866240;
      cyl(p,x,y+.185,-4.62,.060,.29,cl,{top:.043});cyl(p,x,y+.365,-4.62,.027,.07,cl);
      box(p,x,y+.17,-4.554,.067,.09,.012,0xdccfac);
    }
  }
  // Menu stand stays within the shared footway allowance.
  box(p,1.16,.80,.77,.62,.80,.08,0x9c7b50,{rot:[-.12,0,0]});
  box(p,1.16,.81,.817,.51,.66,.012,0x263d36,{rot:[-.12,0,0]});
  text(p,'本日のおすすめ',1.16,1.02,.85,.46,.13,{color:'#eee1be',scale:.70});
  text(p,'焼鳥  刺身',1.16,.83,.871,.44,.14,{color:'#eee1be',scale:.68});
  text(p,'日本酒',1.16,.62,.891,.40,.13,{color:'#e4be76',scale:.75});
  for(const dx of [-.23,.23])rod(p,[1.16+dx,.06,.58],[1.16+dx,1.1,.77],.026,C.wood);
  plant(p,-2.60,.48,0,.66);
  point(p,0xffb665,38,0,2.41,-1.62,9);
  return p;
}

function wagashi() {
  const p=new THREE.Group();p.name='wagashi';const w=5.6,d=4.6;
  slab(p,w,d,0x99816a);shell(p,w,d,3.17,0xe2d4b1);
  for(const x of [-2.67,-.29,2.67])box(p,x,1.52,.02,.16,3.04,.18,0x70513a);
  box(p,0,2.88,.025,5.5,.30,.20,0x806045);
  box(p,-1.49,.31,.018,2.33,.43,.17,0x89745c);
  box(p,1.96,.31,.018,1.34,.43,.17,0x89745c);
  for(let x=-2.45;x<-.45;x+=.44)box(p,x,.30,.113,.40,.37,.02,0xa49076);
  for(let x=1.51;x<2.5;x+=.44)box(p,x,.30,.113,.40,.37,.02,0xa49076);
  windowFrame(p,-1.48,1.62,.025,2.19,1.86,0x806044,4);
  windowFrame(p,.47,1.24,-.06,1.28,2.32,0x806044,3);
  box(p,.04,1.13,.02,.045,.25,.055,0x514535);
  windowFrame(p,1.96,1.64,.025,1.15,1.86,0x806044,3);
  noren(p,.50,2.44,.22,1.52,.70,0x48634b,['茶','寮']);
  box(p,-1.40,2.85,.17,1.74,.46,.12,0x6b523b);
  text(p,'和菓子 こもれび',-1.40,2.86,.239,1.60,.32,{color:'#f4e3ba',scale:.66});
  gable(p,5.91,4.93,3.15,4.40,0x56645f);
  // Cream gable ends, timber beams, and an engraved round crest.
  box(p,0,3.19,.166,5.77,.12,.12,0x786047);
  box(p,0,3.68,.168,.11,.98,.11,0x786047);
  cyl(p,0,3.80,.235,.29,.055,0xbdae86,{rot:[Math.PI/2,0,0],segments:32});
  text(p,'茶',0,3.80,.271,.41,.41,{color:'#4e6246',scale:.72});
  // Display cabinet is transparent and contains individual wagashi on lacquer trays.
  box(p,-1.42,.55,-.64,2.08,.96,.73,0x8d6240);
  box(p,-1.42,1.07,-.64,2.11,.09,.76,0xbc9766);
  box(p,-1.42,1.52,-.64,2.11,.07,.76,0xbc9766);
  for(const x of [-2.44,-.40])box(p,x,1.29,-.64,.045,.46,.73,0x806044);
  box(p,-1.42,1.3,-.257,2.07,.42,.023,C.glass,glass);
  box(p,-1.42,1.55,-.64,2.11,.023,.75,C.glass,glass);
  box(p,-1.42,1.29,-1.011,2.07,.42,.023,C.glass,glass);
  for(let i=0;i<4;i++) {
    const x=-2.19+i*.49;
    box(p,x,1.14,-.63,.40,.025,.49,0x4d3e32);
    for(let k=0;k<3;k++) {
      const yy=1.22,z=-.46-k*.15;
      if(i===0) {
        const cake=sphere(p,x,yy,z,.085,0xddbdba);cake.scale.y=.75;
        for(let t=0;t<5;t++){const a=t*Math.PI*.4; sphere(p,x+Math.cos(a)*.045,yy+.012,z+Math.sin(a)*.045,.046,0xf0d1cc).scale.y=.7;}
        sphere(p,x,yy+.045,z,.02,0xd9b75e);
      } else if(i===1) {
        sphere(p,x,yy,z,.075,0xabc59b).scale.y=.75;
        box(p,x,yy+.02,z,.023,.018,.11,0x6a8959,{rot:[0,.4,0]});
      } else if(i===2) {
        box(p,x,yy-.017,z,.14,.075,.11,0x54352d);
        box(p,x,yy+.024,z,.14,.012,.11,0x87614c);
      } else {
        const sweet=sphere(p,x,yy,z,.072,0xf0e8cb);sweet.scale.y=.65;
        sphere(p,x,yy+.041,z,.024,0x9b5959);
      }
    }
    text(p,['桜餅','抹茶','羊羹','大福'][i],x,1.02,-.243,.31,.11,{color:'#3c3829',bg:'#e8dfbb',scale:.72});
  }
  box(p,1.95,.98,-.71,1.02,.1,.72,0xab8356);
  for(const x of [1.58,2.32])box(p,x,.56,-.71,.08,.78,.08,C.timber);
  for(let i=0;i<3;i++){
    cyl(p,1.66+i*.29,1.17,-.66,.094,.28,0x73815b);cyl(p,1.66+i*.29,1.32,-.66,.098,.032,0xbcab75);
    text(p,'茶',1.66+i*.29,1.17,-.556,.10,.15,{color:'#efe3ba',scale:.75});
  }
  // Rear shelves, parcels and a tea service remain visible through the shop front.
  box(p,-.15,.92,-3.55,4.47,.12,.68,0xa37e54);
  box(p,-.15,.50,-3.60,4.32,.73,.44,C.timber);
  for(const y of [1.42,2.0,2.60]){
    box(p,-.75,y,-4.26,3.46,.08,.45,0x97704d);
    for(let i=0;i<7;i++){
      const x=-2.16+i*.47;
      box(p,x,y+.14,-4.18,.35,.22,.25,i%2?0xcebb93:0x71835d);
      box(p,x,y+.15,-4.046,.055,.23,.012,0xe7dab7);
    }
  }
  sphere(p,1.34,1.12,-3.54,.16,0x706a4d).scale.y=.77;
  cyl(p,1.34,1.25,-3.54,.10,.03,0x706a4d);
  torus(p,1.33,1.26,-3.54,.13,.02,0x484a38);
  rod(p,[1.46,1.11,-3.54],[1.62,1.2,-3.54],.041,0x706a4d);
  for(const x of [1.8,2.1])cyl(p,x,1.06,-3.51,.065,.14,0xdfd7ae);
  box(p,-1.46,.51,.59,1.94,.115,.52,0x9d754d);
  for(const x of [-2.21,-.71])box(p,x,.28,.59,.12,.46,.37,C.timber);
  for(let x=-2.31;x<-0.6;x+=.27)box(p,x,.576,.59,.018,.015,.50,0x655239);
  box(p,-1.84,.62,.59,.56,.065,.37,0xb6423c);
  box(p,2.22,.29,.59,.63,.50,.57,0xab8955);
  box(p,2.22,.66,.61,.53,.25,.49,0xc1a168);
  for(const y of [.15,.39,.58,.73])box(p,2.22,y,.887,.63,.035,.025,0x766443);
  text(p,'宇治茶',2.22,.29,.902,.49,.22,{color:'#435238',scale:.76});
  plant(p,-2.57,.55,0,.57);
  lantern(p,2.31,2.48,.47,.19,'茶',0xe4c485);
  point(p,0xffd294,30,-.45,2.45,-1.4,8);
  return p;
}

export const foodShops = [
  {id:'ramen',name:'雨宿拉面店',subtitle:'红色布檐 · 售票机 · 开放吧台',width:4.8,depth:4.8,height:4.0,color:'#bd5949',build:ramen},
  {id:'izakaya',name:'雨音居酒屋',subtitle:'双层木格栅 · 瓦檐阳台 · 暖灯笼',width:5.8,depth:5.2,height:6.76,color:'#c7945e',build:izakaya},
  {id:'wagashi',name:'木漏日和菓子店',subtitle:'传统坡瓦顶 · 绿暖帘 · 点心橱窗',width:5.6,depth:4.6,height:4.56,color:'#96aa75',build:wagashi},
];
