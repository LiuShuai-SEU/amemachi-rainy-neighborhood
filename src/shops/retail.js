import { THREE, box, cyl, sphere, torus, rod, mesh, text, point } from '../kit.js';

// All stores use metre units: front pavement at z = 0, street towards +z.
const C={wood:0x674a35,dark:0x283036,metal:0x647580,cream:0xddd3b3,glass:0x8bc7d3,warm:0xffd79b};
const glass={opacity:.07,depthWrite:false,shadow:false};
function group(name){const g=new THREE.Group();g.name=name;return g;}
function block(p,x,y,z,w,h,d,c,o){return box(p,x,y,z,w,h,d,c,o);}
function wallShell(g,w,d,h,c,roof=0x38434b){
  block(g,0,.04,-d/2,w,.08,d,0x8b8780);
  block(g,0,h/2,-d+.07,w,h,.14,c);
  for(const x of [-w/2+.07,w/2-.07])block(g,x,h/2,-d/2,.14,h,d,c);
  block(g,0,h-.11,-d/2,w+.16,.22,d+.18,roof);
  for(const x of [-w/2+.12,w/2-.12])block(g,x,1.4,-.06,.2,2.8,.2,c);
  block(g,0,.14,-.04,w,.16,.2,0x575d60);
}
function frontWindow(g,x,y,z,w,h,frame=C.dark,glow=false){
  block(g,x,y,z,w,h,.025,glow?0xffd292:C.glass,glow?{emissive:0x70521f,intensity:.4}:glass);
  for(const xx of [x-w/2,x+w/2])block(g,xx,y,z+.025,.045,h+.08,.055,frame);
  for(const yy of [y-h/2,y+h/2])block(g,x,yy,z+.025,w+.045,.045,.055,frame);
  block(g,x,y,z+.025,.035,h,.045,frame);
}
function door(g,x,w=1.08,c=C.dark){
  frontWindow(g,x,1.2,.025,w,2.24,c);
  block(g,x,2.37,.02,w+.1,.09,.1,c);
  block(g,x+w*.27,1.13,.085,.04,.4,.07,0xc4c8bd);
  block(g,x,.085,.26,w+.25,.08,.52,0xa09b90);
}
function sideWindow(g,x,y,z,w,h){
  const s=Math.sign(x);block(g,x,y,z,.025,h,w,0x405e6c,{emissive:0x16232a,intensity:.35});
  for(const yy of [y-h/2,y+h/2])block(g,x+s*.025,yy,z,.06,.055,w+.1,C.cream);
  for(const zz of [z-w/2,z+w/2])block(g,x+s*.025,y,zz,.06,h+.08,.06,C.cream);
  block(g,x+s*.03,y,z,.06,h,.035,C.dark);
}
function aircon(g,x,y,z,side=false){
  const a=group('室外空调机');a.position.set(x,y,z);if(side)a.rotation.y=Math.PI/2;g.add(a);
  block(a,0,0,0,.92,.6,.36,0xa0a59a);block(a,0,0,.19,.82,.51,.025,0x687578);
  torus(a,.16,0,.218,.19,.017,0xb8bdb4);for(let k=0;k<7;k++)block(a,-.26+k*.085,0,.226,.017,.43,.018,0xb5b9b0);
  for(const xx of [-.32,.32])block(a,xx,-.37,0,.08,.14,.42,0x58636a);
  return a;
}
function services(g,w,d,h){
  for(const x of [-w/2-.025,w/2+.025]){
    rod(g,[x,.14,-d+.2],[x,h-.12,-d+.2],.035,0x708082);
    for(const yy of [.6,2,Math.min(4,h-.4)])block(g,x,yy,-d+.2,.13,.04,.12,0x8b9897);
  }
  sideWindow(g,w/2+.025,1.55,-d*.64,1.12,.88);
  sideWindow(g,-w/2-.025,1.65,-d*.62,.85,.75);
  aircon(g,w/2+.06,.62,-d*.77,true);
  block(g,0,1.25,-d-.035,.94,2.25,.04,0x525e61);
  block(g,.32,1.16,-d-.085,.05,.18,.05,0xb8b6a6);
  block(g,w*.27,1.5,-d-.05,.56,.74,.08,0xa2aaa5);
  for(let i=0;i<5;i++)block(g,w*.27,1.25+i*.115,-d-.098,.46,.026,.026,0x5b6a70);
}
function roofDetail(g,w,d,h){
  for(const x of [-w/2+.14,w/2-.14])block(g,x,h+.09,-d/2,.12,.16,d,0x728080);
  block(g,0,h+.09,-d+.13,w,.16,.13,0x728080);
  aircon(g,-w*.28,h+.22,-d*.64).scale.y=.55;
  cyl(g,w*.23,h+.15,-d*.7,.12,.26,0x87949a);cyl(g,w*.23,h+.31,-d*.7,.2,.05,0x738186);
}
function ceilingLamp(g,x,y,z,w=1.15){
  block(g,x,y,z,w,.1,.24,0xc0c3b3);block(g,x,y-.055,z,w-.12,.025,.14,0xffe4b4,{basic:true});
}
function pot(g,x,z,s=.28){
  cyl(g,x,s*.6,z,s*.7,s*1.2,0x795946,{top:s*.9});
  for(let i=0;i<5;i++){const a=i*2.4;sphere(g,x+Math.sin(a)*s*.5,s*1.4+i*.06,z+Math.cos(a)*s*.5,s*.48,0x476456);}
}
function awning(g,x,y,z,w,d,c,stripes=false){
  const a=block(g,x,y,z,w,.095,d,c);a.rotation.x=.15;
  block(g,x,y-.16,z+d/2-.02,w,.25,.055,c);
  if(stripes)for(let i=0;i<Math.floor(w/.34);i++){const xx=x-w/2+.17+i*.34;block(g,xx,y-.16,z+d/2+.015,.15,.25,.015,0xc6ba91);}
  for(const xx of [x-w/2+.1,x+w/2-.1])rod(g,[xx,y-.6,z-d/2],[xx,y-.1,z+d/2-.08],.025,0x737d79);
}
function shelf(g,x,z,w,levels=3,goods=8,rot=0,colors=[0xd4bc77,0x668b7e,0xad634e,0xe5d8b8]){
  const s=group('商品棚');s.position.set(x,0,z);s.rotation.y=rot;g.add(s);
  block(s,0,.96,-.15,w,1.82,.08,0xabb0a0);
  for(const xx of [-w/2,w/2])block(s,xx,.96,.02,.045,1.86,.45,0x606b67);
  for(let j=0;j<levels;j++){
    const y=.32+j*.5;block(s,0,y,.035,w,.05,.48,0xbbbaa4);
    for(let i=0;i<goods;i++){
      const xx=-w/2+.13+i*(w-.26)/Math.max(1,goods-1),hh=.17+(i%3)*.045;
      block(s,xx,y+.035+hh/2,.045,.105,hh,.14,colors[(i+j)%colors.length]);
      block(s,xx,y+.055+hh/2,.123,.081,.053,.006,0xf0e8cb);
    }
  }
}
function stool(g,x,z,y=.49,c=0x955d46){cyl(g,x,y,z,.23,.095,c);for(const dx of [-.13,.13])for(const dz of [-.13,.13])rod(g,[x+dx,.1,z+dz],[x+dx*.8,y-.04,z+dz*.8],.025,C.wood);}
function chair(g,x,z,angle=0){
  const q=group('木椅');q.position.set(x,0,z);q.rotation.y=angle;g.add(q);
  block(q,0,.49,0,.46,.075,.46,0x805137);
  for(const xx of [-.17,.17])for(const zz of [-.17,.17])block(q,xx,.275,zz,.04,.45,.04,C.wood);
  for(const xx of [-.18,.18])block(q,xx,.77,-.18,.04,.6,.04,C.wood);
  block(q,0,.96,-.18,.42,.17,.05,0x986449);
}
function table(g,x,z){
  block(g,x,.78,z,.88,.07,.73,0x8c5f3e);cyl(g,x,.42,z,.045,.7,0x474749);block(g,x,.12,z,.55,.06,.4,0x49494a);
  cyl(g,x-.14,.86,z,.09,.11,0xd6d3bd);torus(g,x-.03,.86,z,.05,.012,0xd6d3bd,{rot:[0,Math.PI/2,0]});
  block(g,x+.15,.835,z+.04,.2,.012,.26,0xbdbca4);
}

function convenience(){
  const g=group('24時間 青葉マート / 转角便利店'),w=8,d=6,h=3.75;
  // Two glass frontages are structurally open; no opaque side wall hides the shelves.
  block(g,0,.04,-d/2,w,.08,d,0x969b92);block(g,0,1.85,-d+.07,w,3.7,.14,0xc9d0bf);
  block(g,-w/2+.07,1.85,-d/2,.14,3.7,d,0xc9d0bf);
  block(g,0,3.64,-d/2,w+.15,.23,d+.18,0x677775);
  for(const x of [-3.9,-.9,1.7,3.9])block(g,x,1.43,-.015,.1,2.86,.12,0x909e98);
  for(const [x,ww] of [[-2.42,2.8],[2.8,2.1]])frontWindow(g,x,1.35,.012,ww,2.42,0xc0c6b8);
  door(g,.25,1.9,0xb3bdb4);
  for(const z of [-1.5,-4.4]){
    block(g,4,1.4,z,.025,2.48,2.78,C.glass,glass);
    for(const zz of [z-1.39,z+1.39])block(g,4.025,1.4,zz,.07,2.65,.07,0xabb6ac);
    for(const yy of [.16,2.68])block(g,4.025,yy,z,.07,.06,2.78,0xabb6ac);
  }
  for(const z of [-1.5,-4.5])block(g,4,3.09,z,.18,.64,3,0xcdd9c0);
  block(g,0,3.09,.09,8.12,.64,.18,0xe1e8ca);
  for(const [y,c,hh] of [[2.82,0x277b72,.13],[3.33,0x51816b,.12],[3.19,0xa6b449,.075]]){
    block(g,0,y,.193,8.16,hh,.025,c,{basic:true});block(g,4.104,y,-3,.025,hh,6.07,c,{basic:true});
  }
  text(g,'青葉マート',-.25,3.025,.205,3.2,.44,{color:'#22594f'});text(g,'24h',3.35,3.02,.21,.76,.38,{color:'#45784b'});
  text(g,'AOBA MART',4.124,3.04,-2.1,2.7,.38,{ry:Math.PI/2,color:'#22594f'});
  for(let i=0;i<3;i++)shelf(g,-2.25+i*1.5,-3.1,1.14,3,7,0,[0xe1bd67,0x7da58d,0xbe6b51,0xd7dbbf]);
  for(let i=0;i<3;i++){
    const x=-2.7+i*1.33;block(g,x,1.19,-5.63,1.2,2.22,.54,0xc5d1c3);
    frontWindow(g,x,1.28,-5.31,1.06,1.85,0x687e82);block(g,x,2.29,-5.32,1.02,.08,.09,0xd5f4dc,{basic:true});
    for(let j=0;j<4;j++){block(g,x,.48+j*.42,-5.34,.97,.035,.23,0xb7c1b1);for(let k=0;k<5;k++)cyl(g,x-.37+k*.18,.6+j*.42,-5.27,.043,.2,[0x829b5a,0xe0c578,0xbf8475][k%3],{segments:8});}
  }
  block(g,-2.55,.67,-.86,2.55,1.2,.72,0xbcbda6);block(g,-2.55,1.3,-.86,2.68,.08,.8,0x6d7d73);
  block(g,-1.8,1.52,-.91,.48,.37,.1,0x394952,{rot:[-.18,0,0]});block(g,-1.8,1.51,-.842,.4,.26,.015,0x9bbb9e,{basic:true});
  block(g,-2.84,1.64,-.86,.63,.57,.52,0xa2b1aa);frontWindow(g,-2.84,1.65,-.59,.53,.45,0x5a7679);
  for(let i=0;i<6;i++)sphere(g,-3.02+(i%3)*.17,1.48+Math.floor(i/3)*.2,-.57,.067,0xd5a261);
  text(g,'おでん',-2.84,1.99,-.54,.64,.17,{color:'#775934'});
  for(let i=0;i<3;i++)ceilingLamp(g,-2.5+i*2.5,3.24,-2.7,1.4);
  block(g,2.6,.3,.4,1.8,.54,.42,0x788d81);for(let i=0;i<3;i++){block(g,2.04+i*.54,.6,.4,.46,.05,.42,0xa7b1a0);cyl(g,2.04+i*.54,.625,.4,.1,.024,0x334b49);}
  text(g,'分別回収',2.6,.34,.62,1.35,.2,{color:'#dbe4c6'});
  services(g,w,d,3.65);roofDetail(g,w,d,3.7);point(g,0xffe7bc,12,0,2.7,-2.1,9);
  return g;
}

function cafe(){
  const g=group('珈琲 月舟 / 昭和喫茶'),w=5.8,d=5.2,h=6.62;
  wallShell(g,w,d,h,0x8b6250,0x493e39);
  block(g,0,3.28,-d/2,w,.18,d,0x584738);block(g,0,4.95,-.045,w,3.12,.14,0x83513f);
  // Individual staggered brick accents, with gaps left around the arched windows.
  for(let row=0;row<12;row++)for(let col=0;col<10;col++){
    const x=-2.68+col*.55+(row%2)*.16,y=3.52+row*.247;
    if(x>2.72||([-1.7,0,1.7].some(cx=>Math.abs(x-cx)<.6)&&y<5.78))continue;
    block(g,x,y,.045,.48,.18,.035,[0xa3654b,0x986448,0x774936][(col+row)%3]);
  }
  for(const x of [-1.7,0,1.7]){
    const shape=new THREE.Shape();shape.moveTo(-.51,0);shape.lineTo(.51,0);shape.lineTo(.51,1.09);shape.absarc(0,1.09,.51,0,Math.PI,false);shape.closePath();
    mesh(g,new THREE.ShapeGeometry(shape),x,4.02,.075,0xc9ad78,{emissive:0x6e4f26,intensity:.35});
    mesh(g,new THREE.TorusGeometry(.54,.07,6,20,Math.PI),x,5.1,.095,0xbda984);
    for(const dx of [-.54,.54])block(g,x+dx,4.57,.09,.12,1.12,.13,0xbda984);
    block(g,x,4.04,.13,1.2,.11,.27,0xbda984);block(g,x,4.79,.13,.055,1.42,.08,0x4b493b);block(g,x,4.75,.13,1.01,.045,.08,0x4b493b);
    block(g,x,4.22,.18,.94,.14,.09,0x445948);
  }
  for(const x of [-1.8,1.8])frontWindow(g,x,1.39,.015,1.78,2.24,0x564936);
  door(g,0,1.12,0x59452f);awning(g,0,2.9,.35,5.6,.85,0x355547,true);
  text(g,'喫茶 月舟',0,2.75,.815,2,.24,{color:'#ddd3a4'});
  rod(g,[2.7,3.76,-.04],[2.7,3.76,.72],.045,0x423c32);cyl(g,2.7,3.5,.76,.36,.1,0xd9c99d,{rot:[Math.PI/2,0,0],segments:32});
  text(g,'珈琲',2.7,3.5,.82,.64,.3,{color:'#4b4735'});
  for(const [x,z] of [[-1.8,-1.45],[1.7,-1.5],[-1.8,-3.05],[1.7,-3.15]]){table(g,x,z);chair(g,x,z-.62);chair(g,x,z+.64,Math.PI);}
  block(g,0,.69,-4.38,3.4,1.23,.76,0x614839);block(g,0,1.36,-4.38,3.6,.1,.85,0xa48257);
  block(g,.4,1.68,-4.34,.89,.55,.5,0xaeb4aa);block(g,.4,1.9,-4.28,.81,.05,.52,0x627474);
  for(const xx of [.16,.61]){cyl(g,xx,1.64,-4.04,.08,.1,0x2b393b,{rot:[Math.PI/2,0,0]});rod(g,[xx,1.64,-4.04],[xx,1.64,-3.87],.03,0x3b4648);}
  for(let i=0;i<6;i++)cyl(g,-1.37+i*.17,1.49,-4.27,.065,.18,0xd5cbae);
  for(const yy of [1.7,2.35]){block(g,0,yy,-5.02,3.6,.065,.29,0x634a35);for(let i=0;i<8;i++){cyl(g,-1.5+i*.42,yy+.17,-4.99,.095,.27,[0xbb9471,0x4a655c,0xc5b79b][i%3]);}}
  for(const x of [-1.75,1.75]){rod(g,[x,3.15,-2.3],[x,2.65,-2.3],.02,0x514237);cyl(g,x,2.58,-2.3,.22,.15,0xb89958,{top:.09});cyl(g,x,2.49,-2.3,.17,.015,0xffd390,{basic:true});}
  block(g,-2.5,.64,.52,.53,1.02,.07,0x395446,{rot:[-.12,0,0]});text(g,'本日の珈琲',-2.5,.86,.604,.49,.17);text(g,'¥450',-2.5,.54,.64,.42,.17);
  pot(g,2.32,.57,.32);services(g,w,d,h);sideWindow(g,w/2+.03,4.72,-3.85,1.2,1.25);sideWindow(g,-w/2-.03,4.72,-2.6,1.2,1.25);
  for(let i=0;i<10;i++)block(g,0,6.67,-.1-i*.53,6.03,.09,.08,0x635348);
  point(g,0xffcb8b,11,0,2.5,-1.6,8);return g;
}

function pharmacy(){
  const g=group('あおぞら薬局 / 街角药局'),w=5.6,d=5,h=6.1;
  wallShell(g,w,d,h,0xc5d4d0,0x7b989e);block(g,0,3.04,-d/2,w,.16,d,0x85a4a6);
  block(g,0,4.64,-.045,w,2.9,.13,0xd5ded5);
  for(let row=0;row<8;row++)for(let col=0;col<12;col++){
    const x=-2.56+col*.464,y=3.24+row*.35;
    if((Math.abs(x+1.32)<.78||Math.abs(x-1.32)<.78)&&y>3.8&&y<5.48)continue;
    block(g,x,y,.03,.438,.322,.018,(row+col)%5===0?0xacc7c6:0xd3e0d7);
  }
  for(const x of [-1.3,1.3]){frontWindow(g,x,4.65,.06,1.52,1.42,0x6d8e96,true);block(g,x,4.65,.115,1.47,.045,.07,0x91a9a9);}
  frontWindow(g,-1.4,1.46,.04,2.25,2.33,0x93aca9);frontWindow(g,1.75,1.46,.04,1.6,2.33,0x93aca9);door(g,.2,1.02,0x77999e);
  block(g,0,2.9,.12,5.65,.48,.21,0xd5e7dc);text(g,'あおぞら薬局',0,2.91,.237,3.8,.36,{color:'#277a7b'});
  block(g,2.47,4.81,.36,.54,1.82,.34,0xdbedda);block(g,2.47,5.2,.55,.12,.5,.045,0x62b7a0,{basic:true});block(g,2.47,5.2,.55,.41,.13,.045,0x62b7a0,{basic:true});text(g,'薬',2.47,4.46,.547,.43,.52,{color:'#348476'});
  for(let i=0;i<3;i++)shelf(g,-1.75+i*1.65,-4.4,1.43,3,7,0,[0xe0e7d2,0x69a6a1,0xc3d3c3,0xd6b086]);
  shelf(g,-1.45,-2.1,1.72,3,7,0,[0xd3d8ad,0xd1a9a5,0x96bbaf]);
  block(g,1.57,.7,-2.82,1.6,1.25,.66,0x9dbdb6);block(g,1.57,1.35,-2.82,1.74,.075,.77,0xe1e3cb);
  block(g,1.82,1.55,-2.9,.4,.31,.1,0x536c70,{rot:[-.15,0,0]});block(g,1.82,1.55,-2.835,.33,.23,.012,0xa2ccbc,{basic:true});
  text(g,'処方せん受付',1.57,.8,-2.478,1.38,.22,{color:'#f0f1d8'});block(g,.94,1.48,-2.74,.23,.2,.23,0xe4e8d4);cyl(g,.94,1.63,-2.74,.042,.16,0xd7ddd0);
  for(const [x,z] of [[-2.25,.56],[-1.27,.56]]){
    block(g,x,.44,z,.73,.69,.42,0x809893);for(let j=0;j<3;j++)for(let k=0;k<3;k++)block(g,x-.23+k*.23,.27+j*.18,z+.23,.18,.13,.06,[0xcddbc4,0xd6bd8d,0xa5c7c5][k]);
  }
  text(g,'日用品',-1.74,.9,.7,1.46,.2,{color:'#ddedd5'});
  block(g,2.05,.5,.38,.87,.14,.42,0x76a299);for(const x of [1.72,2.38])block(g,x,.28,.38,.055,.44,.055,0xb3c3b2);
  for(const x of [-1.6,1.6])ceilingLamp(g,x,2.67,-2.5,1.3);
  services(g,w,d,h);roofDetail(g,w,d,h);sideWindow(g,w/2+.025,4.65,-3.5,1.2,1.2);point(g,0xe5fff1,10,0,2.4,-1.5,8);return g;
}

function record(){
  const g=group('港レコード / 黑胶唱片店'),w=4.6,d=4.8,h=6.1;
  wallShell(g,w,d,h,0x344959,0x32404e);block(g,0,3.01,-d/2,w,.18,d,0x526271);block(g,0,4.63,-.045,w,2.94,.15,0x314957);
  for(let i=0;i<24;i++)block(g,-2.18+i*.19,4.62,.046,.07,2.96,.03,i%3===0?0x4c6068:0x3c515f);
  for(const x of [-1.1,1.1]){frontWindow(g,x,4.73,.08,1.3,1.68,0xa0a098,true);block(g,x,4.73,.14,1.3,.065,.09,0x303d47);}
  frontWindow(g,-.85,1.4,.025,2.5,2.35,0x55656a);door(g,1.2,1.0,0x76694e);
  block(g,0,2.85,.13,4.63,.45,.22,0xb69463);text(g,'港レコード',0,2.86,.251,3.17,.35,{color:'#273d4c'});
  rod(g,[-1.87,3.95,-.02],[-1.87,3.95,.77],.035,0x9f9c83);cyl(g,-1.87,3.61,.8,.41,.075,0x202b35,{rot:[Math.PI/2,0,0],segments:32});
  for(const r of [.15,.23,.31,.365])torus(g,-1.87,3.61,.844,r,.006,0x65737b);cyl(g,-1.87,3.61,.855,.113,.015,0xcf9b66,{rot:[Math.PI/2,0,0],segments:24});
  text(g,'VINYL',-1.87,3.61,.874,.19,.08,{color:'#283844'});
  const bins=[[-1.16,-1.18],[.15,-1.65],[-1.17,-2.52],[.17,-3.13]];
  for(const [x,z] of bins){
    block(g,x,.89,z,1.07,.37,.65,0x8b6945);for(const xx of [x-.43,x+.43])block(g,xx,.43,z,.06,.82,.42,0x5d4936);
    for(let row=0;row<2;row++)for(let i=0;i<12;i++){
      const zz=z-.23+i*.044,xx=x-.255+row*.5;block(g,xx,1.105,zz,.45,.38,.021,[0xa97855,0x547d84,0xd1bd8c,0x76876a,0x876969][(i+row)%5],{rot:[-.18,0,0]});
    }
    for(const xx of [x-.27,x+.27])block(g,xx,1.36,z-.2,.21,.16,.023,0xc5c3a6);
  }
  // Listening counter, turntable and headphones.
  block(g,1.3,.79,-3.9,1.42,1.4,.63,0x786348);block(g,1.3,1.53,-3.9,1.55,.08,.76,0x353c3d);
  block(g,1.19,1.64,-3.85,.64,.13,.48,0xa2a291);cyl(g,1.12,1.72,-3.84,.21,.026,0x283138,{segments:32});cyl(g,1.12,1.74,-3.84,.062,.018,0xd0b181);
  rod(g,[1.42,1.74,-3.99],[1.46,1.76,-3.77],.013,0xbfc1b0);rod(g,[1.46,1.76,-3.77],[1.23,1.76,-3.74],.012,0xbfc1b0);
  for(const x of [.71,1.89]){block(g,x,1.92,-4.14,.28,.65,.31,0x293840);cyl(g,x,1.9,-3.974,.091,.017,0x59666b,{rot:[Math.PI/2,0,0],segments:16});cyl(g,x,2.1,-3.974,.045,.017,0x87928a,{rot:[Math.PI/2,0,0]});}
  mesh(g,new THREE.TorusGeometry(.105,.02,6,18,Math.PI),1.82,1.69,-3.83,0x9a9f91);
  for(const xx of [1.715,1.925])block(g,xx,1.65,-3.83,.055,.1,.075,0x3b484b);
  for(let i=0;i<6;i++){block(g,.77+i*.17,1.64,-4.17,.11,.17,.04,[0xaa976b,0x779290,0x936f70][i%3]);block(g,.77+i*.17,1.64,-4.145,.07,.07,.005,0xd4ceb0);}
  for(let i=0;i<6;i++){
    const x=-1.74+(i%3)*1.08,y=1.04+Math.floor(i/3)*1.13;
    block(g,x,y,-4.695,.83,.83,.045,[0xc49a69,0x46727a,0xb76d58,0x8a8568][i%4]);torus(g,x,y,-4.66,.25,.018,0x3a4650);text(g,['BLUE NIGHT','CITY POP','JAZZ','MINATO'][i%4],x,y-.31,-4.646,.7,.12);
  }
  for(const z of [-1.28,-2.7,-4.1])ceilingLamp(g,0,2.66,z,.84);
  block(g,-1.89,.67,.47,.53,1.17,.07,0x424b4d,{rot:[-.1,0,0]});text(g,'中古レコード',-1.89,.93,.57,.49,.17);text(g,'NEW IN',-1.89,.57,.61,.45,.17,{color:'#e5bb79'});
  services(g,w,d,h);roofDetail(g,w,d,h);sideWindow(g,w/2+.025,4.65,-3.3,.94,1.2);point(g,0xffd3a0,8,0,2.36,-1.5,7);return g;
}

function bicycle(p,x,z,angle=0,color=0x6e9ba0){
  const g=group('自行车');g.position.set(x,.015,z);g.rotation.y=angle;p.add(g);
  const a=[-.49,.36,0],b=[.49,.36,0],s=[-.17,.77,0],c=[-.05,.36,0],f=[.35,.79,0];
  for(const xx of [-.49,.49]){
    torus(g,xx,.36,0,.315,.03,0x313a3b);torus(g,xx,.36,0,.286,.012,0xb2b7ac);
    for(let k=0;k<8;k++){const t=k*Math.PI/4;rod(g,[xx,.36,.012],[xx+Math.cos(t)*.286,.36+Math.sin(t)*.286,.012],.004,0x8e9d9e);}
    cyl(g,xx,.36,0,.045,.1,0xaab4b0,{rot:[Math.PI/2,0,0],segments:8});
  }
  for(const [u,v] of [[a,s],[s,c],[c,a],[s,f],[f,c],[f,b]])rod(g,u,v,.026,color);
  rod(g,[-.17,.75,0],[-.2,.94,0],.019,0xa6b2b1);block(g,-.23,.94,0,.29,.065,.15,0x37413f);
  rod(g,[.35,.79,0],[.38,1,0],.019,0xa6b2b1);rod(g,[.38,1,-.22],[.38,1,.22],.02,0xa6b2b1);
  for(const zz of [-.2,.2])rod(g,[.38,1,zz],[.48,1,zz],.028,0x343c3c);
  torus(g,-.05,.36,.05,.105,.018,0x81928f);rod(g,[-.05,.36,.07],[.1,.27,.07],.016,0xb0b5a7);block(g,.12,.27,.1,.11,.04,.13,0x37423f);
  rod(g,[-.28,.68,-.13],[-.74,.68,-.13],.013,0x8b9a93);rod(g,[-.74,.68,-.13],[-.51,.39,-.13],.013,0x8b9a93);
  block(g,.49,.81,0,.33,.23,.3,0x6f8580,{opacity:.75});for(let i=0;i<4;i++)block(g,.49,.73+i*.055,.157,.34,.013,.014,0xabb5a6);
}
function cycle(){
  const g=group('山田サイクル / 自行车维修'),w=6,d=5.3,h=3.5;
  wallShell(g,w,d,h,0x738781,0x526463);block(g,0,3.69,-2.6,6.23,.12,5.5,0x78918e,{rot:[.07,0,0]});
  for(let i=0;i<31;i++)block(g,-3+i*.2,3.75,-2.6,.065,.07,5.52,0x91a4a0,{rot:[.07,0,0]});
  for(let i=0;i<22;i++)for(const s of [-1,1])block(g,s*3.075,1.72,-.15-i*.238,.034,3.3,.055,0x8c9c92);
  for(const x of [-2.87,2.87])block(g,x,1.49,.09,.16,2.97,.2,0x576966);
  block(g,0,3.03,.075,5.72,.53,.21,0xb8c2a4);text(g,'山田サイクル',0,3.05,.198,3.5,.34,{color:'#314f4b'});
  text(g,'修理 ・ パンク ・ 自転車',0,2.71,.209,3.3,.21,{color:'#e0d8b5'});
  // Rolling shutter retained overhead, open enough to see the workshop.
  for(let i=0;i<7;i++)block(g,0,2.66-i*.075,.03,5.64,.065,.055,0x718781);
  block(g,0,2.12,.04,5.69,.06,.085,0x4f6462);
  block(g,-.92,.84,-4.2,3.34,.13,.91,0xa1865d);for(const x of [-2.24,.39])for(const z of [-4.55,-3.91])block(g,x,.44,z,.085,.78,.085,0x475f5b);
  block(g,-.92,1.79,-5.06,3.2,1.48,.06,0x9a9c7a);
  for(let r=0;r<7;r++)for(let c=0;c<14;c++)cyl(g,-2.34+c*.22,1.21+r*.2,-5.01,.014,.011,0x445853,{rot:[Math.PI/2,0,0],segments:6});
  for(let i=0;i<10;i++){
    const x=-2.17+i*.274,yy=1.88+(i%2)*.35;
    rod(g,[x,yy,-4.96],[x+.03,yy-.39,-4.96],.019,0xb3b9a4);torus(g,x,yy,-4.954,.055,.017,0xa5b2a5);
    if(i%3===0)block(g,x+.04,yy-.38,-4.94,.09,.2,.06,0x9b654d);
  }
  block(g,-1.57,1.05,-4.09,.36,.24,.25,0x647d7d);block(g,-1.57,1.22,-4.09,.55,.11,.13,0x8d9d91);rod(g,[-1.57,1.1,-3.87],[-1.57,.83,-3.87],.022,0xaab6a5);
  for(let i=0;i<7;i++){cyl(g,-.96+i*.17,1.08,-4.34,.055,.32,[0xa49a64,0x628d86,0x936750][i%3]);}
  block(g,1.95,.79,-4.72,1.35,1.42,.65,0x5a7269);for(let i=0;i<5;i++){block(g,1.95,.27+i*.26,-4.366,1.18,.2,.035,0x809188);block(g,1.95,.28+i*.26,-4.33,.3,.035,.035,0xb0b49d);}
  bicycle(g,-1.8,-1.8,.12,0xb99765);bicycle(g,.13,-2.15,-.07,0x71998f);bicycle(g,1.7,-1.8,.12,0x91624e);bicycle(g,-.62,.64,0,0x5e8594);
  for(let i=0;i<3;i++)torus(g,-2.9,2.01,-1.3-i*.91,.33,.043,0x2f3f3c,{rot:[0,Math.PI/2,0]});
  for(const z of [-1.2,-3.35])ceilingLamp(g,0,3.25,z,1.6);
  block(g,2.51,.62,.5,.51,1.05,.06,0xbcbc8d,{rot:[-.13,0,0]});text(g,'修理',2.51,.85,.602,.41,.28,{color:'#435f54'});text(g,'受付中',2.51,.48,.65,.44,.19,{color:'#435f54'});
  cyl(g,2.4,.29,-.6,.16,.5,0x92694f);rod(g,[2.4,.5,-.6],[2.4,1.1,-.6],.03,0xa8b2a1);rod(g,[2.22,1.1,-.6],[2.58,1.1,-.6],.03,0x454f47);
  services(g,w,d,h);point(g,0xffe2b1,10,0,2.7,-1.5,8);return g;
}

function cabinet(g,x,z,ry=0,color=0x80536b){
  const a=group('街机');a.position.set(x,0,z);a.rotation.y=ry;g.add(a);
  block(a,0,.52,0,.64,.91,.64,color);block(a,0,1.22,-.12,.65,.62,.41,0x333d49);
  block(a,0,1.28,.104,.49,.4,.02,0x476f73,{basic:true,rot:[-.13,0,0]});
  for(let i=0;i<4;i++)block(a,-.165+i*.11,1.2+Math.sin(i)*.1,.128,.07,.07,.01,[0xd5ac68,0x829ca0,0xb1849e,0xc6c599][i],{basic:true});
  block(a,0,.94,.31,.68,.095,.35,0xb0a895,{rot:[.13,0,0]});cyl(a,-.16,1.055,.35,.035,.08,0x556575);sphere(a,-.16,1.11,.35,.05,0x975b59);
  for(let j=0;j<3;j++)cyl(a,.03+j*.09,1.014,.37,.032,.02,[0xb98161,0x709e93,0x9c7599][j]);
  block(a,0,1.65,-.085,.73,.25,.5,color);block(a,0,1.66,.177,.58,.15,.022,0xdab590,{basic:true});text(a,'GAME',0,1.66,.192,.45,.115,{color:'#544d57'});
  block(a,.17,.61,.336,.13,.16,.018,0x27333b);block(a,.17,.655,.348,.076,.015,.01,0xa7b2a5);
  for(const xx of [-.32,.32])block(a,xx,.095,.1,.07,.08,.52,0x26353c);
}
function arcade(){
  const g=group('ゲーム コスモ / 社区游戏厅'),w=6,d=6,h=6.8;
  wallShell(g,w,d,h,0x685267,0x514556);block(g,0,3.29,-d/2,w,.18,d,0x493c4a);block(g,0,5.01,-.05,w,3.22,.14,0x6e4e60);
  for(let row=0;row<11;row++)for(let col=0;col<11;col++){
    const x=-2.73+col*.51+(row%2)*.14,y=3.55+row*.28;
    if(x>2.8||(y>4.6&&y<5.7&&[-1.65,0,1.65].some(cx=>Math.abs(x-cx)<.53)))continue;
    block(g,x,y,.04,.445,.215,.025,(col+row)%3===0?0x805868:0x654e60);
  }
  for(const x of [-1.65,0,1.65]){frontWindow(g,x,5.13,.07,1.03,.93,0x3c4755,true);for(let i=0;i<4;i++)block(g,x,4.78+i*.21,.122,1.0,.043,.05,0x58616b);}
  for(const x of [-2.58,2.58])block(g,x,1.54,.065,.55,2.88,.22,0x8c6975);
  for(const x of [-2.25,2.25])rod(g,[x,.2,.17],[x,2.91,.17],.019,0xb78b9a,{basic:true});
  frontWindow(g,-1.18,1.47,.07,1.6,2.58,0x61727a);frontWindow(g,1.18,1.47,.07,1.6,2.58,0x61727a);door(g,0,.82,0x616d74);
  block(g,0,3.01,.19,5.75,.46,.31,0x354754);text(g,'ゲーム コスモ',0,3.02,.365,3.85,.36,{color:'#d9b2a8'});
  block(g,2.57,4.62,.35,.62,2.15,.4,0x394b58);for(let i=0;i<4;i++)text(g,'GAME'[i],2.57,5.37-i*.49,.563,.45,.4,{color:'#d8c39a'});
  for(const x of [-2,-1.1,-.2])cabinet(g,x,-3.25,0,[0x8e6575,0x668284,0x987254][Math.round((x+2)/.9)]);
  for(const z of [-1.28,-2.42,-3.57])cabinet(g,2.32,z,-Math.PI/2,0x79708b);
  cabinet(g,-1.87,-1.35,.14,0x6d8290);
  // Crane game, coin changer and stools give the arcade a neighbourhood scale.
  block(g,.68,.47,-5.2,1.16,.79,.79,0xa28799);frontWindow(g,.68,1.19,-4.789,1.05,1.12,0x85999a);block(g,.68,1.84,-5.2,1.24,.19,.85,0xc1b293);
  for(const xx of [.12,1.24])block(g,xx,1.19,-4.79,.055,1.18,.055,0xacb8ad);
  for(let i=0;i<6;i++){
    const x=.33+(i%3)*.31,z=-5.08-Math.floor(i/3)*.24; sphere(g,x,.98,z,.13,[0xc0a884,0x9bb6a2,0xb091a0][i%3]);sphere(g,x,1.14,z,.08,[0xc0a884,0x9bb6a2,0xb091a0][i%3]);
  }
  rod(g,[.68,1.75,-5.15],[.68,1.44,-5.15],.012,0xc1c2af);for(const dx of [-.1,.1])rod(g,[.68,1.44,-5.15],[.68+dx,1.32,-5.15],.014,0xa3b2ae);
  block(g,-2.15,.88,-5.41,.62,1.58,.53,0xb3b7a3);text(g,'両替',-2.15,1.28,-5.13,.4,.24,{color:'#4c696c'});block(g,-2.15,.94,-5.12,.24,.06,.025,0x485c60);block(g,-2.15,.55,-5.11,.33,.16,.04,0x40535a);
  for(const [x,z] of [[-1.92,-2.43],[-1,-2.43],[-.16,-2.43]])stool(g,x,z,.41,0x7d635f);
  block(g,-2.69,1.4,.208,.4,.68,.023,0xbdab89);text(g,'営業中',-2.69,1.44,.23,.33,.16,{color:'#5e4d4d'});
  for(const z of [-1.5,-4.6])ceilingLamp(g,0,3.05,z,1.1);
  services(g,w,d,h);roofDetail(g,w,d,h);sideWindow(g,w/2+.025,5.12,-4.15,1.16,.95);point(g,0xf6cddf,8,0,2.5,-1.7,8);return g;
}

export const retailShops=[
  {id:'convenience',name:'青葉便利店',subtitle:'转角玻璃 · 24 小时营业',width:8,depth:6,height:4.1,color:0x67a695,build:convenience},
  {id:'cafe',name:'月舟昭和喫茶',subtitle:'红砖拱窗 · 手冲咖啡',width:5.8,depth:5.2,height:7,color:0xa56e51,build:cafe},
  {id:'pharmacy',name:'青空药局',subtitle:'白蓝瓷砖 · 社区日用品',width:5.6,depth:5,height:6.5,color:0x8ec1b4,build:pharmacy},
  {id:'record',name:'港唱片店',subtitle:'深蓝狭楼 · 黑胶与 City Pop',width:4.6,depth:4.8,height:6.5,color:0x577f96,build:record},
  {id:'cycle',name:'山田自行车店',subtitle:'波纹铁棚 · 街坊维修',width:6,depth:5.3,height:4.2,color:0x91ad95,build:cycle},
  {id:'arcade',name:'宇宙游戏厅',subtitle:'旧式街机 · 节制霓虹',width:6,depth:6,height:7.2,color:0xab849d,build:arcade},
];
