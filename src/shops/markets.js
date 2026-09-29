import { THREE, box, cyl, sphere, torus, rod, text, point, mat } from '../kit.js';

// Metres. Each independent asset faces +Z; its rear wall is at -depth.
const C={wood:0x846044,dark:0x40392f,cream:0xe0cfaa,glass:0xaacdcc,steel:0x87969b};
const glass={opacity:.07,depthWrite:false};
function frame(p,x,y,z,w,h,c=0x665340,n=2,lit=false){
  box(p,x,y,z,w,h,.024,lit?0xf2c783:C.glass,lit?{emissive:0xcd9450,intensity:.22}:glass);
  for(const dx of [-w/2,w/2])box(p,x+dx,y,z+.024,.065,h+.08,.08,c);
  for(const dy of [-h/2,h/2])box(p,x,y+dy,z+.024,w,.065,.08,c);
  for(let i=1;i<n;i++)box(p,x-w/2+i*w/n,y,z+.03,.04,h,.085,c);
}
function core(p,w,d,h,c,floor=0x8a8070){
  box(p,0,.04,-d/2,w,.08,d,floor);
  box(p,0,h/2,-d+.075,w,h,.15,c);
  for(const x of [-w/2+.075,w/2-.075])box(p,x,h/2,-d/2,.15,h,d,c);
  for(const x of [-w/2+.12,w/2-.12])box(p,x,1.45,0,.16,2.9,.18,C.wood);
  box(p,0,2.73,.025,w-.17,.32,.18,c);
}
function upper(p,w,d,bottom,top,c){
  box(p,0,bottom,-d/2,w,.16,d,0x655a49);
  box(p,0,(bottom+top)/2,.002,w,top-bottom,.16,c);
}
function brickFace(p,w,lo,hi,z,c=0xc48b63){
  for(let row=0,y=lo+.14;y<hi-.1;y+=.27,row++){
    for(let x=-w/2+.24+(row%2)*.23;x<w/2-.10;x+=.46)
      box(p,x,y,z,.421,.22,.027,(row+Math.round(x*8))%5===0?0xa66d4c:c);
  }
}
function utilities(p,w,d,h,color=0x7a8075){
  // Exterior details remain readable when the assembled street is viewed from the rear.
  const rear=new THREE.Group();rear.position.set(0,0,-d-.011);rear.rotation.y=Math.PI;p.add(rear);
  box(rear,-w*.25,1.17,0,.84,2.15,.035,0x66706b);
  box(rear,-w*.25,1.60,.033,.59,.68,.019,0x819b96,{emissive:0x4b6f6d,intensity:.12});
  box(rear,-w*.25+.28,1.08,.038,.032,.19,.06,0xbbb795);
  box(rear,-w*.25,.09,.055,1.02,.13,.18,0x7e837b);
  frame(rear,w*.24,Math.min(h-1,2.35),.009,1.06,.63,0x635b4b,3,true);
  box(rear,w*.22,.50,.12,.91,.59,.24,0xb0b2a1);
  torus(rear,w*.22,.5,.251,.19,.026,0x606e6e);
  for(let i=0;i<6;i++)box(rear,w*.22-.30+i*.12,.50,.265,.018,.39,.014,0x5b6b6c);
  rod(rear,[w*.22+.36,.70,.05],[w*.22+.36,1.43,.05],.035,0x9b9a85);
  rod(rear,[-w/2+.13,.17,.07],[-w/2+.13,h-.1,.07],.035,color);
  for(const y of [.45,1.9,Math.max(2.4,h-.45)])box(rear,-w/2+.13,y,.05,.11,.05,.14,0x535e5c);
  for(const side of [-1,1]){
    const wall=new THREE.Group();wall.position.set(side*(w/2+.012),0,-d*.6);wall.rotation.y=side*Math.PI/2;p.add(wall);
    frame(wall,0,Math.min(h-1.05,2.24),0,1.0,.72,0x73796d,2,true);
    box(wall,.47,.98,.04,.30,.36,.08,0x85938b);
    rod(wall,[.47,1.18,.045],[.47,2.98,.045],.014,0x555e56);
    if(h>4.8)frame(wall,-.58,4.24,0,.94,.92,0x696654,2,true);
  }
}
function gable(p,w,d,eave,ridge,color){
  const half=w/2+.16, rise=ridge-eave, angle=Math.atan2(rise,half), length=Math.hypot(half,rise);
  const tri=new THREE.Shape();tri.moveTo(-half,eave);tri.lineTo(0,ridge-.05);tri.lineTo(half,eave);tri.closePath();
  const end=new THREE.Mesh(new THREE.ExtrudeGeometry(tri,{depth:d+.2,bevelEnabled:false}),mat(0xc8b48d));
  end.position.z=-d-.07;p.add(end);
  for(const side of [-1,1]){
    box(p,side*half/2,(eave+ridge)/2,-d/2+.035,length+.045,.09,d+.28,color,{rot:[0,0,-side*angle]});
    for(let z=-d-.055;z<=.14;z+=.25)rod(p,[side*.015,ridge+.025,z],[side*half,eave+.024,z],.025,color);
    rod(p,[side*half,eave-.03,-d-.09],[side*half,eave-.03,.18],.04,0x555f62);
  }
  rod(p,[0,ridge+.04,-d-.08],[0,ridge+.04,.18],.06,color);
}
function lamp(p,x,y,z){
  rod(p,[x,y+.22,z-.15],[x,y+.22,z],.025,0x545044);
  cyl(p,x,y+.07,z,.13,.16,0x4e5249,{top:.07});
  cyl(p,x,y-.025,z,.10,.035,0xffd98f,{emissive:0xffc56b,intensity:.7});
}
function plant(p,x,z,s=1,y=0){
  cyl(p,x,y+.16*s,z,.17*s,.31*s,0x9b785d,{top:.22*s});
  for(let k=0;k<6;k++){
    const a=k*2.4,xx=x+Math.cos(a)*.14*s,zz=z+Math.sin(a)*.14*s;
    rod(p,[x,y+.22*s,z],[xx,y+.49*s,zz],.012*s,0x61784e);
    sphere(p,xx,y+(.44+(k%2)*.07)*s,zz,.15*s,k%2?0x597e52:0x789563).scale.set(1,.7,.65);
  }
}
function bench(p,x,z,w=1.2){
  for(let i=0;i<3;i++)box(p,x,.51,z-.18+i*.16,w,.055,.13,C.wood);
  for(const dx of [-w*.36,w*.36])box(p,x+dx,.29,z,.07,.43,.42,C.dark);
}
function menu(p,x,z,rows=['本日のおすすめ','どうぞ ごゆっくり']){
  box(p,x,.70,z,.65,.82,.065,0xb69662,{rot:[-.08,0,0]});
  box(p,x,.72,z+.04,.54,.69,.014,0x324943,{rot:[-.08,0,0]});
  for(let i=0;i<rows.length;i++)text(p,rows[i],x,.88-i*.20,z+.07+i*.015,.47,.13,{color:'#efdfb2',scale:.65});
  for(const dx of [-.25,.25])rod(p,[x+dx,.08,z-.1],[x+dx,1.09,z+.03],.023,C.wood);
}
function display(p,x,z,w,d=.68,color=0xc3a277){
  box(p,x,.49,z,w,.82,d,color);box(p,x,.93,z,w+.04,.09,d+.04,C.wood);
  box(p,x,1.42,z,w+.04,.06,d+.04,C.wood);
  for(const xx of [x-w/2+.025,x+w/2-.025])box(p,xx,1.18,z,.045,.50,d,C.wood);
  box(p,x,1.19,z+d/2+.005,w,.45,.025,C.glass,glass);
  box(p,x,1.46,z,w,.024,d,C.glass,glass);
  box(p,x,1.19,z-d/2,w,.45,.024,C.glass,glass);
  box(p,x,1.40,z-d/2+.04,w-.14,.025,.032,0xffdc8b,{emissive:0xffc46a,intensity:.6});
}
function stripedAwning(p,w,y,depth,c1,c2){
  const segments=Math.round(w/.37),dw=w/segments;
  for(let i=0;i<segments;i++){
    const x=-w/2+(i+.5)*dw,cl=i%2?c1:c2;
    box(p,x,y-.12,depth*.40,dw,.045,depth,cl,{rot:[.30,0,0]});
    box(p,x,y-.30,depth*.88,dw-.005,.18,.035,cl);
  }
  rod(p,[-w/2,y-.39,depth*.86],[w/2,y-.39,depth*.86],.023,0x797b67);
  for(const x of [-w*.43,w*.43])rod(p,[x,y-.54,.02],[x,y-.26,depth*.8],.028,0x747765);
}
function crate(p,x,y,z,w=.68,d=.56){
  box(p,x,y+.025,z,w,.05,d,0x987b4c);
  for(const zz of [z-d/2,z+d/2])for(const yy of [y+.08,y+.21])box(p,x,yy,zz,w,.08,.025,0xb7975c);
  for(const xx of [x-w/2,x+w/2])box(p,xx,y+.145,z,.035,.27,d,0x967044);
  return y+.20;
}
function stool(p,x,z){
  cyl(p,x,.70,z,.24,.09,0x735840);
  for(const dx of [-.15,.15])for(const dz of [-.15,.15])box(p,x+dx,.37,z+dz,.042,.59,.042,0x4f4941);
  torus(p,x,.27,z,.18,.021,0x77746b,{rot:[Math.PI/2,0,0]});
}

function bakery(){
  const p=new THREE.Group();p.name='bakery';const w=5.2,d=5.4;
  core(p,w,d,5.45,0xddc9a4,0xb9956a);upper(p,w,d,3.02,5.48,0xe5d2ac);
  brickFace(p,w,3.03,5.48,.092,0xd8ba91);
  for(const x of [-1.28,1.28]){
    frame(p,x,4.36,.126,1.62,1.48,0x6a7167,2,true);
    box(p,x,4.37,.195,1.61,.035,.04,0x6a7167);
    box(p,x,3.56,.23,1.92,.12,.44,0x94866c);
    for(const side of [-1,1])box(p,x+side*.98,4.35,.16,.26,1.55,.08,0x839181);
  }
  gable(p,w,d,5.48,6.50,0x725349);
  box(p,0,2.80,.16,4.82,.45,.18,0x789386);
  text(p,'雨町ベーカリー',0,2.81,.257,4.32,.34,{color:'#fff1ce',scale:.69});
  stripedAwning(p,4.97,2.60,.78,0xdcc9a1,0x7e9683);
  frame(p,-.91,1.39,.03,2.92,1.92,0x768777,3);
  box(p,-.91,.31,.035,2.96,.43,.16,0xa98760);
  frame(p,1.54,1.24,-.12,1.18,2.30,0x768777,2);
  box(p,1.22,1.19,-.032,.033,.32,.065,0xbbab78);
  display(p,-.91,-.71,2.80,.82,0xc4a375);
  for(let i=0;i<5;i++){
    const x=-2.01+i*.54;box(p,x,1.006,-.69,.46,.025,.66,0x75523d);
    for(let k=0;k<3;k++){
      const z=-.45-k*.22,cl=i%2?0xdca25b:0xc88a44;
      if(i%2===0){sphere(p,x,1.13,z,.115,cl).scale.set(1.65,.72,.85);for(let t=-1;t<=1;t++)box(p,x+t*.065,1.205,z,.018,.01,.13,0xf2c47c,{rot:[0,-.34,0]});}
      else{torus(p,x,1.10,z,.077,.041,cl,{rot:[Math.PI/2,0,0]});sphere(p,x+.022,1.142,z-.01,.021,0x6e4030);}
    }
    text(p,['焼きたて','クロワッサン','塩パン','ドーナツ','あんパン'][i],x,.895,-.278,.43,.11,{color:'#463e32',bg:'#eaddb9',scale:.65});
  }
  // Rear oven, cooling racks and stacked bread trays.
  box(p,1.21,1.09,-4.22,1.76,1.92,.97,0x949f9a);
  for(const y of [.53,1.10,1.67]){box(p,1.21,y,-3.72,1.51,.40,.032,0x53656c);box(p,1.21,y+.12,-3.688,1.34,.038,.08,0xb4b9a9);}
  for(const x of [-2.14,-.20])box(p,x,1.41,-4.22,.075,2.66,.76,C.wood);
  for(const y of [.37,.92,1.47,2.02,2.57]){
    box(p,-1.16,y,-4.2,2.02,.055,.8,0xa78156);
    for(let i=0;i<6;i++)sphere(p,-1.96+i*.31,y+.12,-3.95,.12,0xd39b53).scale.set(1,.65,1.55);
  }
  bench(p,1.78,.50,1.05);menu(p,-2.16,.55,['焼きたてパン','7:00 — 20:00']);
  plant(p,.89,.52,.63);lamp(p,-2.18,2.73,.31);lamp(p,2.18,2.73,.31);
  utilities(p,w,d,5.48);point(p,0xffd399,31,-.25,2.32,-1.9,8);
  return p;
}

function produce(){
  const p=new THREE.Group();p.name='produce';const w=5.6,d=5;
  core(p,w,d,5.50,0xb8b29a,0x767d6d);upper(p,w,d,2.98,5.51,0xb4b29b);
  for(let y=3.10;y<5.5;y+=.18)box(p,0,y,.102,w-.16,.012,.026,0x8d9382);
  for(const x of [-1.41,1.35]){
    frame(p,x,4.3,.14,2.25,1.41,0x72796e,3,true);
    box(p,x,3.47,.38,2.47,.12,.72,0x74766a);
    rod(p,[x-1.12,4.01,.70],[x+1.12,4.01,.70],.023,0x626f66);
    for(let k=0;k<10;k++)rod(p,[x-1.10+k*.244,3.57,.70],[x-1.10+k*.244,4.04,.70],.017,0x626f66);
    box(p,x-.45,3.62,.48,.8,.2,.31,0x887b5b);
    for(let k=0;k<4;k++)sphere(p,x-.73+k*.18,3.8,.48,.15,0x627d4d).scale.y=.8;
  }
  // Shallow asymmetric metal roof, old house above the open greengrocer.
  box(p,0,5.63,-d/2,w+.30,.10,d+.26,0x5e736f,{rot:[.045,0,0]});
  for(let x=-w/2-.12;x<=w/2+.13;x+=.28)box(p,x,5.69,-d/2,.022,.024,d+.23,0x87958a,{rot:[.045,0,0]});
  box(p,0,5.88,-d+.02,w+.24,.04,.12,0x52675f);
  box(p,0,2.79,.17,5.11,.44,.20,0x436c4b);
  text(p,'八百屋 みどり',0,2.80,.28,4.55,.34,{color:'#f5e9bf',scale:.77});
  stripedAwning(p,5.36,2.61,.94,0x577e58,0xa9b393);
  box(p,0,2.35,-.03,5.18,.14,.15,0x687564);
  for(const x of [-2.62,2.62])box(p,x,1.28,.0,.12,2.48,.13,0x718478);
  box(p,-2.30,1.33,-.06,.48,2.43,.12,0xa4aa96);
  for(let y=.25;y<2.54;y+=.10)box(p,-2.30,y,.008,.45,.025,.024,0x7f897d);
  for(let row=0;row<2;row++)for(let k=0;k<5;k++){
    if(k===3)continue; // Leave a usable aisle to the weighing counter.
    const x=-1.64+k*.82,z=.42-row*.64,y=.26+row*.46;
    box(p,x,y-.08,z,.72,.18,.59,0x736348);crate(p,x,y,z,.74,.56);
    const colors=[0xa94639,0xdda453,0x71995c,0xb89f52,0x709148];
    for(let f=0;f<6;f++){
      const xx=x-.22+(f%3)*.22,zz=z-.13+Math.floor(f/3)*.24,rr=k===2?.135:.095;
      sphere(p,xx,y+.23,zz,rr,colors[k]).scale.set(1,k===4?1.6:.95,1);
      if(k<2)rod(p,[xx,y+.30,zz],[xx+.016,y+.34,zz],.012,0x4f653d);
    }
    if(row===0)text(p,['トマト','みかん','キャベツ','じゃがいも','だいこん'][k],x,y+.12,z+.299,.59,.13,{color:'#344c37',bg:'#e8dbaa',scale:.67});
  }
  box(p,.05,1.04,-3.98,4.77,.1,.67,0xafa883);
  for(let k=0;k<7;k++){
    const x=-2.23+k*.71;crate(p,x,.11,-4.00,.63,.62);crate(p,x,.45,-4.00,.63,.62);
    crate(p,x,1.11,-4.00,.63,.62);for(let f=0;f<3;f++)sphere(p,x-.17+f*.17,1.40,-4,.10,k%2?0xbb7752:0x97aa63);
  }
  box(p,1.67,1.2,-2.88,1.02,.16,.62,0x83998e);box(p,1.67,1.41,-2.9,.41,.22,.28,0xd6d6b7);
  box(p,1.67,1.59,-2.96,.29,.09,.035,0x324944);text(p,'¥ 380',1.67,1.59,-2.939,.25,.07,{color:'#b4d6a1'});
  box(p,-2.32,.53,.57,.41,.92,.48,0x577c63);for(let y=.15;y<1.0;y+=.13)box(p,-2.32,y,.823,.34,.014,.015,0x94a786);
  utilities(p,w,d,5.50);point(p,0xffd99e,26,0,2.18,-1.72,8);
  return p;
}

function fishmonger(){
  const p=new THREE.Group();p.name='fishmonger';const w=4.8,d=5.2;
  core(p,w,d,3.30,0xa9bbb4,0x7e9c9b);
  box(p,0,3.35,-d/2,5.10,.14,d+.26,0x506b78);
  for(let x=-2.37;x<2.5;x+=.29)box(p,x,3.442,-d/2,.025,.03,d+.21,0x6e8790);
  box(p,1.15,3.54,-4.15,.7,.22,.54,0x9aaca8);cyl(p,1.15,3.74,-4.15,.20,.12,0x859697);
  box(p,0,2.96,.16,4.41,.51,.19,0x426e83);
  text(p,'鮮魚 さざなみ',0,2.97,.265,4.0,.36,{color:'#eee9ce',scale:.74});
  stripedAwning(p,4.64,2.76,.81,0x447b93,0x809fa7);
  // The right shutter is lowered: quiet late-evening business rhythm.
  box(p,1.41,1.57,.005,1.55,2.12,.115,0x8a9d9b);
  for(let y=.53;y<=2.62;y+=.105)box(p,1.41,y,.07,1.51,.031,.035,0x657f83);
  box(p,1.41,.51,.09,1.55,.09,.10,0x496269);
  box(p,1.4,.70,.10,.25,.045,.04,0x40555b);
  frame(p,-1.12,1.23,-.17,2.15,2.20,0x688489,2);
  box(p,-1.10,.43,-.025,2.22,.66,.13,0xafc5b8);
  for(let x=-2.11;x<.01;x+=.24)for(let y=.18;y<.73;y+=.19)box(p,x,y,.049,.22,.17,.022,0xc7d7c7);
  // A sloped iced display has whole fish, fillet trays and hand-written price cards.
  box(p,-1.1,.69,-.60,2.16,1.01,.85,0x8fada9);
  box(p,-1.1,1.23,-.60,2.22,.09,.90,0xd0dacf);
  box(p,-1.1,1.29,-.60,2.08,.055,.78,0xd8e3d8);
  for(let k=0;k<6;k++){
    const x=-1.96+k*.34,z=-.62+(k%2)*.16;
    for(let j=0;j<3;j++)box(p,x-.10+j*.1,1.34,z-.15,.065,.052,.075,0xe3eee6,{rot:[.1,.5+j,.1]});
    const fish=sphere(p,x,1.40,z,.13,k%2?0x788f93:0x819fa7);fish.scale.set(.63,.49,2.1);
    const tail=new THREE.Shape();tail.moveTo(-.1,0);tail.lineTo(.1,0);tail.lineTo(0,.17);tail.closePath();
    const fin=new THREE.Mesh(new THREE.ShapeGeometry(tail),mat(0x6d878c,{double:true}));fin.rotation.x=-Math.PI/2;fin.position.set(x,1.39,z-.25);p.add(fin);
    sphere(p,x+.055,1.43,z+.18,.012,0x263b41);
  }
  text(p,'本日の鮮魚',-1.07,.93,-.159,1.01,.19,{bg:'#e7e5d0',color:'#3e626c',scale:.76});
  box(p,-.44,1.01,-4.25,3.61,.15,.94,0xa7bfba);
  for(const x of [-1.47,-.2,1.1]){box(p,x,1.115,-4.28,1.03,.08,.67,0x557d82);box(p,x,1.13,-4.28,.83,.025,.50,0x739b9d);}
  for(let x=-2.06;x<2.11;x+=.25)for(let y=1.26;y<2.5;y+=.21)box(p,x,y,-5.105,.235,.196,.022,(Math.round(x*11)+Math.round(y*12))%8?0xb4ccc5:0x8cadab);
  rod(p,[1.11,1.14,-4.62],[1.11,1.63,-4.62],.027,0xc7ccc0);rod(p,[1.11,1.63,-4.62],[1.11,1.63,-4.32],.027,0xc7ccc0);
  for(let k=0;k<3;k++){
    box(p,1.38,.20+k*.22,-1.05,.85,.20,.63,0xd1dad0);box(p,1.38,.307+k*.22,-1.05,.88,.035,.67,0xe4e8dc);
    box(p,1.38,.22+k*.22,-.728,.52,.045,.018,0x889f97);
  }
  cyl(p,1.97,.36,.55,.23,.54,0x69858c);cyl(p,1.97,.643,.55,.25,.034,0x92a8a5);
  text(p,'本日売切',1.10,1.89,.133,.90,.31,{bg:'#d9d8bc',color:'#445e67',scale:.69});
  utilities(p,w,d,3.3);point(p,0xdbebd4,20,-.7,2.49,-1.79,7);
  return p;
}

function deli(){
  const p=new THREE.Group();p.name='deli';const w=4.6,d=5;
  core(p,w,d,5.74,0xb0785a,0x9a8a6f);upper(p,w,d,2.94,5.68,0x9b7057);
  brickFace(p,w,2.98,5.65,.094,0xb7805e);
  for(const x of [-1.25,.60]){
    frame(p,x,4.29,.13,1.17,1.80,0x526261,2,true);
    box(p,x,4.29,.20,1.15,.038,.04,0x526261);
    box(p,x,3.33,.19,1.45,.12,.36,0xc1af89);
    for(const yy of [3.52,5.27])box(p,x,yy,.14,1.37,.10,.16,0xc4ae87);
  }
  box(p,0,5.77,-d/2,w+.32,.16,d+.26,0x535e5a);
  for(const x of [-w/2+.02,w/2-.02])box(p,x,5.95,-d/2,.14,.30,d,0xad8060);
  box(p,0,5.95,-d+.06,w,.30,.14,0xad8060);
  box(p,0,5.98,.05,w,.22,.14,0xba9470);
  box(p,0,2.73,.19,4.16,.46,.19,0xa74f3d);text(p,'お惣菜・精肉 まる福',0,2.74,.294,3.91,.31,{color:'#ffe6b8',scale:.66});
  // Red and white vertical name board projects from the right pier.
  box(p,1.83,4.39,.29,.58,2.41,.20,0xe6d5ad);
  for(let k=0;k<4;k++)text(p,['ま','る','福','肉'][k],1.83,5.23-k*.55,.40,.45,.48,{color:'#9f4736',scale:.79});
  box(p,1.83,5.66,.28,.67,.12,.26,0xa94e38);
  frame(p,-.66,1.39,.035,2.78,1.89,0x674934,3);box(p,-.66,.32,.04,2.84,.46,.15,0x996b4d);
  frame(p,1.41,1.24,-.08,1.11,2.3,0x674934,1);
  box(p,1.11,1.16,-.006,.04,.25,.065,0xc3b188);
  box(p,0,2.40,.32,4.36,.1,.91,0x904939,{rot:[.15,0,0]});
  display(p,-.67,-.68,2.79,.77,0xb88f65);
  for(let k=0;k<5;k++){
    const x=-1.75+k*.54;box(p,x,1.014,-.65,.46,.025,.62,0xc7c7b2);
    for(let r=0;r<3;r++){
      const z=-.46-r*.19;
      if(k<3){sphere(p,x-.09,1.10,z,.083,0xb48246).scale.y=.60;sphere(p,x+.09,1.10,z,.083,0xca9958).scale.y=.60;}
      else{box(p,x,1.084,z,.31,.076,.14,k%2?0xd6aa8e:0xa86c60);box(p,x-.04,1.125,z,.028,.007,.12,0xe5c4a5,{rot:[0,.25,0]});}
    }
    text(p,['コロッケ','とんかつ','唐揚げ','豚ロース','牛肉'][k],x,.894,-.28,.42,.11,{color:'#594332',bg:'#e7d1a7',scale:.67});
  }
  box(p,.95,1.40,-4.24,1.65,2.63,.99,0xabc0b5);
  frame(p,.95,1.52,-3.73,1.40,2.11,0x5c7873,2);
  for(let y=.66;y<2.5;y+=.45){box(p,.95,y,-4.12,1.41,.045,.70,0xc0c9b5);for(let k=0;k<4;k++)box(p,.44+k*.34,y+.10,-3.94,.27,.15,.30,0xd7b99b);}
  box(p,-1.14,.99,-3.63,1.57,.16,1.13,0x929b8e);
  for(const x of [-1.53,-.79]){box(p,x,1.11,-3.58,.54,.09,.71,0x394a46);cyl(p,x,1.20,-3.58,.20,.15,0x8b968d);}
  box(p,-1.16,2.45,-3.94,1.77,.35,1.09,0x7f908a);box(p,-1.15,2.76,-4.1,.58,.34,.47,0x8c9a90);
  menu(p,-1.79,.52,['夕ごはんのおかず','コロッケ 120円']);plant(p,1.97,.54,.68);
  utilities(p,w,d,5.70);point(p,0xffce8a,29,-.17,2.13,-1.5,8);
  return p;
}

function sushi(){
  const p=new THREE.Group();p.name='sushi';const w=5,d=5.2;
  core(p,w,d,3.05,0xd7c9a8,0xa08b6a);
  for(let x=-2.35;x<2.41;x+=.23)if(x<.20||x>2.20)box(p,x,.31,.04,.19,.46,.10,0x71553d);
  for(const x of [-2.34,-.10,2.34])box(p,x,1.56,.045,.13,2.97,.15,0x805d40);
  box(p,0,2.85,.09,4.81,.30,.20,0x957044);
  frame(p,-1.28,1.47,.044,1.88,1.71,0x8e704c,6);
  frame(p,1.16,1.24,-.18,1.87,2.3,0x8e704c,5);
  box(p,.42,1.15,-.108,.037,.28,.045,0x4a4b3c);
  gable(p,w,d,3.10,4.40,0x53665e);
  box(p,0,3.13,.21,5.13,.14,.13,0x7c6747);box(p,0,3.71,.195,.12,1.07,.12,0x7c6747);
  // A short white entrance curtain and cedar name plank are deliberately restrained.
  rod(p,[.13,2.51,.15],[2.21,2.51,.15],.023,0x70613f);
  for(let k=0;k<4;k++){
    const x=.41+k*.50;box(p,x,2.17,.16,.48,.65,.023,0xe4dbc0);
    text(p,['鮨','雨','月','亭'][k],x,2.18,.177,.35,.41,{color:'#3a4d44',scale:.68});
  }
  box(p,-1.29,2.64,.20,1.77,.41,.16,0xaf8a53);text(p,'鮨 雨月',-1.29,2.65,.287,1.56,.31,{color:'#3d4438',scale:.77});
  lamp(p,-2.02,2.70,.34);lamp(p,2.07,2.70,.34);
  // Visible hinoki counter, stools, ingredient case, plates and individual nigiri.
  box(p,-.53,1.04,-1.03,3.2,.16,.66,0xc6a16b);box(p,-.53,.56,-1.16,3.10,.84,.38,0x745539);
  for(const x of [-1.62,-.60,.40]){
    stool(p,x,-.44);box(p,x,1.135,-1.00,.54,.026,.32,0x36524c);
    for(let k=0;k<2;k++){
      const xx=x-.13+k*.25;sphere(p,xx,1.191,-1.01,.082,0xe5dec3).scale.set(.71,.59,1.1);
      box(p,xx,1.24,-1.01,.12,.040,.18,k?0xc98e75:0xd6b18c,{rot:[0,.12,0]});
    }
    cyl(p,x+.30,1.235,-1.03,.052,.17,0x68836d);
  }
  box(p,-.41,1.25,-1.47,2.79,.22,.32,0x7a9282);
  box(p,-.41,1.39,-1.47,2.81,.036,.35,0xbdc9b3);box(p,-.41,1.3,-1.295,2.72,.19,.018,C.glass,glass);
  for(let k=0;k<8;k++)box(p,-1.59+k*.33,1.28,-1.43,.27,.06,.16,k%2?0xcc9b84:0xa5736f);
  box(p,0,1.02,-3.95,4.29,.15,.73,0xbd9864);box(p,0,.54,-4,4.13,.81,.53,0x70563f);
  for(const y of [1.64,2.21,2.72]){
    box(p,-.38,y,-4.87,3.41,.058,.35,0x8d7049);
    for(let k=0;k<8;k++){
      const x=-1.83+k*.40;
      cyl(p,x,y+.15,-4.78,.057,.24,k%3?0x759078:0xb7a26c,{top:.04});cyl(p,x,y+.29,-4.78,.023,.07,0x597463);
      box(p,x,y+.15,-4.721,.07,.075,.009,0xddd0a6);
    }
  }
  for(let k=0;k<5;k++)cyl(p,1.54,1.13+k*.028,-3.89,.21,.029,0xd9d6bb);
  bench(p,-1.45,.51,1.45);plant(p,2.15,.51,.69);plant(p,-2.15,.43,.63);
  for(const x of [-1.91,-1.00]){box(p,x,.59,.51,.45,.06,.31,0x677b5e);}
  utilities(p,w,d,3.07);point(p,0xffd19a,26,-.23,2.36,-2.03,8);
  return p;
}

function curvedAwning(p,w,y,depth){
  const vertices=[],uv=[],idx=[],nx=12,nz=18;
  for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++){
    const a=iz/nz*Math.PI/2;vertices.push(-w/2+w*ix/nx,y-.57*(1-Math.cos(a)),depth*Math.sin(a));uv.push(ix/nx,iz/nz);
  }
  for(let iz=0;iz<nz;iz++)for(let ix=0;ix<nx;ix++){
    const a=iz*(nx+1)+ix,b=a+nx+1;idx.push(a,b,a+1,b,b+1,a+1);
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  const awning=new THREE.Mesh(g,mat(0x8b4735,{double:true}));awning.castShadow=true;p.add(awning);
  rod(p,[-w/2,y-.57,depth],[w/2,y-.57,depth],.033,0xd1af78);
  for(let x=-w/2;x<=w/2+.01;x+=w/6){
    const points=[];for(let j=0;j<=12;j++){const a=j/12*Math.PI/2;points.push(new THREE.Vector3(x,y-.574*(1-Math.cos(a))+.006,depth*Math.sin(a)));}
    const path=new THREE.CatmullRomCurve3(points);const seam=new THREE.Mesh(new THREE.TubeGeometry(path,18,.011,5,false),mat(0xaa6b4a));p.add(seam);
  }
}
function curry(){
  const p=new THREE.Group();p.name='curry';const w=4.5,d=4.8;
  core(p,w,d,5.98,0xc0a567,0x998263);upper(p,w,d,3.03,5.98,0xc4a75f);
  box(p,0,3.14,.11,w-.13,.15,.16,0x8b7347);
  for(const x of [-1.19,.90]){
    frame(p,x,4.60,.107,1.25,1.62,0x775b3f,2,true);
    box(p,x,4.60,.175,1.24,.036,.036,0x775b3f);box(p,x,3.72,.21,1.52,.10,.39,0x927745);
    box(p,x,4.6,.146,1.10,1.48,.015,0xafa17b,{opacity:.16,depthWrite:false});
    for(const side of [-1,1]){
      box(p,x+side*.76,4.60,.14,.19,1.72,.075,0x8b764c);
      for(let j=0;j<7;j++)box(p,x+side*.76,3.91+j*.228,.19,.17,.05,.027,0x695d43,{rot:[.18,0,0]});
    }
  }
  // Slanted roof rises toward the back; the front remains tall and narrow.
  box(p,0,6.13,-d/2,w+.29,.11,d+.25,0x695d49,{rot:[.070,0,0]});
  for(let x=-2.29;x<2.33;x+=.26)box(p,x,6.191,-d/2,.023,.025,d+.23,0x897a5e,{rot:[.07,0,0]});
  box(p,0,6.378,-d-.05,w+.29,.044,.10,0x5c5848);
  box(p,-.78,2.81,.155,2.48,.50,.20,0xead3a0);text(p,'カレー食堂',-.78,2.82,.264,2.20,.35,{color:'#794534',scale:.78});
  box(p,1.75,4.06,.31,.53,1.65,.22,0x914d34);
  for(let k=0;k<3;k++)text(p,['カ','レ','ー'][k],1.75,4.59-k*.48,.431,.40,.42,{color:'#f4d392',scale:.79});
  curvedAwning(p,4.18,2.63,.75);
  frame(p,-1.04,1.27,.027,1.91,2.18,0x77553b,3);
  frame(p,.76,1.24,-.20,1.10,2.30,0x77553b,1);box(p,.48,1.12,-.128,.037,.24,.06,0xc1a573);
  box(p,-1.04,.32,.03,1.94,.44,.15,0x8f6c43);
  // Freestanding food-model cabinet, within the common entrance allowance.
  box(p,1.70,.84,.32,.60,1.54,.58,0x89633e);
  frame(p,1.70,1.08,.623,.48,.96,0xc0a16a,1);box(p,1.70,1.61,.32,.64,.09,.61,0xb59765);
  for(const yy of [.72,1.16]){
    box(p,1.70,yy,.34,.51,.037,.47,0xc4aa78);
    cyl(p,1.70,yy+.035,.38,.17,.027,0xe4dcc0,{segments:20});
    sphere(p,1.77,yy+.077,.38,.091,0xe6dabb).scale.set(.64,.42,1.02);
    sphere(p,1.64,yy+.071,.38,.092,0x936633).scale.set(.78,.31,1.04);
    sphere(p,1.65,yy+.10,.43,.023,0xba8642);sphere(p,1.63,yy+.10,.32,.027,0xa56d37);
  }
  text(p,'チキンカレー',1.70,.57,.627,.48,.11,{color:'#e7d1a5',scale:.73});
  text(p,'本日営業中',1.70,1.45,.627,.46,.11,{color:'#eadbbc',scale:.73});
  box(p,-1.03,.96,-1.13,1.89,.13,.67,0xbb905b);box(p,-1.03,.51,-1.17,1.76,.79,.39,0x715339);
  for(const x of [-1.6,-.52]){stool(p,x,-.52);cyl(p,x,1.055,-1.12,.20,.027,0xdad3af);sphere(p,x-.045,1.09,-1.12,.115,0xa57537).scale.set(1,.25,.8);cyl(p,x+.33,1.14,-1.17,.045,.17,0xa8b6a2);}
  box(p,-.29,1.03,-3.9,3.53,.12,.73,0x889186);box(p,-.29,.55,-3.94,3.41,.84,.51,0x7b8579);
  for(const x of [-1.39,-.61]){cyl(p,x,1.30,-3.94,.23,.43,0x89958a);cyl(p,x,1.52,-3.94,.24,.028,0xb4b5a0);sphere(p,x,1.56,-3.94,.042,0x4e5b52);}
  box(p,-.96,2.43,-4.01,1.93,.31,.96,0x77867d);box(p,-.96,2.80,-4.17,.48,.45,.40,0x79877f);
  for(const yy of [1.66,2.20,2.70]){
    box(p,.95,yy,-4.58,1.55,.055,.28,0x9f7d4c);
    for(let k=0;k<5;k++){cyl(p,.33+k*.30,yy+.14,-4.54,.075,.23,k%2?0xad8649:0x8f6741);cyl(p,.33+k*.30,yy+.27,-4.54,.078,.035,0xceb68b);box(p,.33+k*.30,yy+.14,-4.462,.10,.07,.01,0xe0ce99);}
  }
  // Pencil menu strips, timber ceiling battens and small condiment tins.
  for(let k=0;k<7;k++){
    const x=-1.75+k*.42;box(p,x,2.40,-4.691,.28,.53,.018,0xd9c28f);
    text(p,['豆','野菜','チキン','海老','辛口','甘口','日替り'][k],x,2.41,-4.677,.22,.34,{color:'#67513a',scale:.62});
  }
  for(let z=-.65;z>-4.3;z-=.62)box(p,0,2.94,z,4.22,.065,.10,0x77603f);
  for(let k=0;k<4;k++){
    cyl(p,-1.64+k*.30,1.17,-1.37,.055,.15,k%2?0x978057:0xb39c68);
    cyl(p,-1.64+k*.30,1.26,-1.37,.058,.033,0xc8b589);
  }
  menu(p,-1.79,.54,['スパイス香る','雨の日カレー']);plant(p,.35,.58,.71);lamp(p,-1.98,2.84,.32);
  utilities(p,w,d,5.98);point(p,0xffd18a,27,-.27,2.22,-1.87,8);
  return p;
}

export const marketShops=[
  {id:'bakery',name:'雨町面包店',subtitle:'奶油砖墙 · 山形坡顶 · 出炉面包',width:5.2,depth:5.4,height:6.60,color:'#d6b18a',build:bakery},
  {id:'produce',name:'绿叶青果店',subtitle:'旧住宅底商 · 绿色伸缩棚 · 果蔬木箱',width:5.6,depth:5,height:5.90,color:'#86a06a',build:produce},
  {id:'fishmonger',name:'涟漪鲜鱼铺',subtitle:'蓝色布棚 · 瓷砖水池 · 夜间半闭卷帘',width:4.8,depth:5.2,height:3.80,color:'#7ca4b0',build:fishmonger},
  {id:'deli',name:'丸福熟食肉铺',subtitle:'红砖二楼 · 竖向白招牌 · 熟食陈列柜',width:4.6,depth:5,height:6.10,color:'#c38561',build:deli},
  {id:'sushi',name:'雨月寿司店',subtitle:'青灰瓦檐 · 白色短帘 · 桧木寿司吧',width:5,depth:5.2,height:4.50,color:'#c6b786',build:sushi},
  {id:'curry',name:'雨日咖喱食堂',subtitle:'芥黄窄楼 · 弧形布棚 · 模型菜橱窗',width:4.5,depth:4.8,height:6.40,color:'#c5a461',build:curry},
];
