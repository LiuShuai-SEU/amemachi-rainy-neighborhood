import { THREE, box, cyl, sphere, torus, rod, text, point, seeded } from '../kit.js';

// Each asset uses metres, Y up, a front entrance at Z=0, and a rear at -depth.
// Surfaces on all four elevations are modeled so these assets also work across
// the street or at the end of an alley. Public pavement belongs to the scene.
const C = { wood:0x553d31, dark:0x273440, trim:0xdbcbb0, metal:0x536371,
  stone:0x6c7378, light:0xffdb91, glass:0x253d49, leaf:0x3c6650 };
function group(p,x=0,y=0,z=0,ry=0){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;p.add(g);return g;}
function pane(p,x,y,z,w,h,on=false,ry=0,frame=C.dark){
  const g=group(p,x,y,z,ry);
  box(g,0,0,0,w+.14,h+.14,.08,frame);
  box(g,0,0,.052,w,h,.025,on?0xf6c97c:C.glass,on?{emissive:0xe6a962,intensity:.75}:{});
  for(const sx of [-1,1])box(g,sx*(w/2-.025),0,.082,.05,h,.055,frame);
  for(const sy of [-1,1])box(g,0,sy*(h/2-.025),.082,w,.05,.055,frame);
  box(g,0,0,.089,.045,h,.055,frame);
  box(g,0,-h/2-.08,.06,w+.24,.1,.25,0xb4ac99);
  if(on){box(g,-w*.35,0,.075,w*.2,h*.95,.02,0xd8ba91);box(g,w*.35,0,.075,w*.2,h*.95,.02,0xd8ba91);}
  return g;
}
function glazed(p,x,y,z,w,h,frame=C.metal){
  const g=group(p,x,y,z);box(g,0,0,.035,w,h,.018,0xc7d9cd,{opacity:.18,depthWrite:false,shadow:false});
  for(const side of [-1,1]){box(g,side*w/2,0,.045,.07,h+.08,.09,frame);box(g,0,side*h/2,.045,w,.07,.09,frame);}
  box(g,0,0,.055,.055,h,.075,frame);box(g,0,-h/2-.07,.04,w+.13,.07,.17,0xb9b7a7);return g;
}
function door(p,x,z,{y=.08,w=.95,h=2.3,color=C.wood,glass=false,ry=0,slats=6}={}){
  const g=group(p,x,y,z,ry);box(g,0,h/2,0,w+.15,h+.08,.12,C.dark);
  box(g,0,h/2,.075,w,h,.04,color);
  if(glass)pane(g,0,h*.57,.102,w*.76,h*.68,true,0,C.metal);
  else for(let i=0;i<slats;i++)box(g,-w/2+.10+i*(w-.2)/Math.max(1,slats-1),h/2,.105,.027,h-.15,.025,0x6d5744);
  box(g,w*.34,1.05,.13,.045,.29,.08,0xbdb396);box(g,0,-.025,.12,w+.28,.1,.36,0xa4a49a);return g;
}
function ac(p,x,y,z,ry=0){
  const g=group(p,x,y,z,ry);box(g,0,0,0,.83,.49,.34,0xc2c8bf);box(g,-.16,0,.183,.39,.39,.025,0x65767b);
  torus(g,-.16,0,.204,.16,.017,0x89999c);for(let i=0;i<3;i++)rod(g,[-.31,-.12+i*.12,.215],[0,-.12+i*.12,.215],.012,0x87999b);
  box(g,.26,0,.184,.14,.3,.018,0x939f9c);rod(g,[.42,.09,-.08],[.52,-.55,-.08],.028,0xc7c2ab);
}
function planter(p,x,y,z,{r=.22,seed=1,color=0x806955}={}){
  cyl(p,x,y+r*.65,z,r,r*1.3,color,{top:r*.86,segments:8});cyl(p,x,y+r*1.3,z,r*.82,.03,0x3b342d);
  const rand=seeded(seed);for(let i=0;i<5;i++)sphere(p,x+(rand()-.5)*r*1.3,y+r*1.4+rand()*r*1.2,z+(rand()-.5)*r*1.3,r*.68,i%2?0x466d52:0x618459);
}
function rail(p,x,y,z,w,{h=.85,ry=0,color=C.metal}={}){
  const g=group(p,x,y,z,ry);box(g,0,h,0,w,.06,.07,color);box(g,0,.17,0,w,.04,.05,color);
  const n=Math.max(3,Math.floor(w/.32));for(let i=0;i<=n;i++)box(g,-w/2+i*w/n,h/2,0,.036,h,.04,color);return g;
}
function downpipe(p,x,z,h,color=0x4b565c){
  cyl(p,x,h/2,z,.055,h,color,{segments:8});for(let y=.5;y<h;y+=1.9)torus(p,x,y,z,.068,.017,0x979b91,{rot:[Math.PI/2,0,0]});
}
function mailbox(p,x,y,z,red=false){box(p,x,y,z,.38,.4,.2,red?0xc74336:0x607c83);box(p,x,y+.12,z+.11,.3,.035,.015,0x212c34);box(p,x,y-.09,z+.111,.23,.09,.02,0xd7d5be);}
function roof(p,x,z,w,d,eave,rise,color=0x3d4f5b,tile=true){
  const shape=new THREE.Shape();shape.moveTo(-w/2,0);shape.lineTo(w/2,0);shape.lineTo(0,rise);shape.closePath();
  const geom=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false,steps:1});geom.translate(x,eave,z-d/2);
  const m=new THREE.Mesh(geom,new THREE.MeshToonMaterial({color}));m.castShadow=true;m.receiveShadow=true;p.add(m);
  const length=Math.hypot(w/2,rise),angle=Math.atan2(rise,w/2);
  for(const side of [-1,1]){
    const b=box(p,x+side*w/4,eave+rise/2+.028,z,length,.075,d+.02,color);b.rotation.z=-side*angle;
    if(tile){const cols=Math.ceil(d/.44),rows=Math.ceil(length/.4);for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const t=(r+.5)/rows;const tx=x+side*(w/2)*(1-t),ty=eave+rise*t+.075;
      const tbox=box(p,tx,ty,z-d/2+(c+.5)*d/cols,length/rows-.015,.035,d/cols-.022,(r+c)%3?color:0x50606a);tbox.rotation.z=-side*angle;
    }}
  }
  box(p,x,eave+rise+.0825,z,.13,.075,d+.08,color);
  for(const s of [-1,1])box(p,x+s*w/2,eave+.005,z,.12,.13,d+.12,0x34424c);
}
function flatRoof(p,w,d,h,wall){
  box(p,0,h-.23,-d/2,w,.16,d,0x57646a);
  for(const side of [-1,1])box(p,side*(w/2-.06),h-.16,-d/2,.12,.32,d,wall);
  for(const side of [0,-d])box(p,0,h-.16,side,w,.32,.12,wall);
}
function finish(g,id,nominal){g.name=id;g.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(g),s=b.getSize(new THREE.Vector3());g.userData={assetType:id,units:'metres',front:'+Z',nominal,...{bounds:{min:b.min.toArray(),max:b.max.toArray(),size:s.toArray()}}};return g;}

function apartment(){
  const g=new THREE.Group(),wall=0xa7aaa0;
  box(g,.52,4.91,-3.3,6.76,9.66,6.4,wall);box(g,.52,.14,-3.25,6.76,.12,6.5,0x666f71);
  // Three outdoor access galleries, with an actual flight of stairs on the west.
  for(let f=0;f<3;f++){
    const y=.08+f*3.17;
    box(g,.52,y+.05,.2,6.76,.16,.7,0x808e90);
    for(let unit=0;unit<3;unit++){
      const x=-1.67+unit*2.2;door(g,x-.55,0,{y,w:.79,h:2.24,color:f%2?0x5b797b:0x768985,slats:0});
      pane(g,x+.42,y+1.5,.012,.65,.73,(unit+f)%3===0);
      box(g,x-.12,y+2.56,.015,.2,.1,.11,0xf5d9a1,{emissive:0xfac36c,intensity:.9});
      text(g,`${f+1}0${unit+1}`,x-.55,y+2.43,.102,.38,.14,{color:'#ede5c9'});
    }
    if(f>0){rail(g,.53,y+.12,.59,6.76,{h:.92});rail(g,3.85,y+.12,.17,.84,{h:.92,ry:Math.PI/2});}
    for(const sx of [-2.83,.5,3.87])box(g,sx,y+1.6,.51,.1,3.17,.1,0x5c747d);
    if(f<2){
      const n=17;for(let k=0;k<n;k++){const sy=y+(k+1)*3.17/n,sz=-6.08+(k+.5)*5.46/n;box(g,-3.38,sy-.055,sz,1,.11,5.46/n+.015,0x76848a);}
      for(const x of [-3.91,-2.86]){rod(g,[x,y+.8,-6.1],[x,y+3.95,-.62],.039,0x607b82);for(let k=0;k<7;k++){let t=k/6;rod(g,[x,y+t*3.17,-6.1+t*5.48],[x,y+.8+t*3.17,-6.1+t*5.48],.028,0x607b82);}}
      box(g,-3.38,y+3.15,-.32,1,.15,.65,0x879799);
    }
    // Rear balconies remain visible from the opposite side of the block.
    for(let j=0;j<3;j++){
      const x=-1.66+j*2.2;pane(g,x,y+1.49,-6.51,1.42,1.9,(j+f)%3!==1,Math.PI);
      box(g,x,y+.13,-6.78,1.96,.13,.56,0x8e9895);rail(g,x,y+.18,-7.04,1.96,{h:.93});
      ac(g,x+.62,y+.53,-6.68,Math.PI);if((j+f)%2===0)planter(g,x-.62,y+.21,-6.77,{r:.16,seed:j+f*5});
      if(f===1&&j===1){rod(g,[x-.65,y+2.49,-6.86],[x+.65,y+2.49,-6.86],.025,0xc2c3b5);for(let k=0;k<3;k++)box(g,x-.42+k*.41,y+2.08,-6.86,.3,.64,.034,[0xd5d7cb,0x778d9d,0xb29ba4][k]);}
    }
    for(const z of [-1.6,-4.3])pane(g,3.91,y+1.65,z,.87,1.24,f!==1,Math.PI/2);
  }
  // Flat roof with screened small tank, exhaust, aerial and utility lines.
  box(g,.52,9.84,-3.27,6.96,.2,6.58,0x636f76);
  for(const x of [-2.93,3.97])box(g,x,10.22,-3.27,.12,.56,6.58,0xa6b0a9);
  for(const z of [.02,-6.56])box(g,.52,10.22,z,7.02,.56,.12,0xa6b0a9);
  cyl(g,2.7,10.15,-4.7,.38,.61,0x899b9a);box(g,2.7,9.89,-4.7,1,.1,1,0x434f56);
  downpipe(g,3.94,-6.37,9.7);downpipe(g,-2.82,-6.37,9.7);
  for(let i=0;i<4;i++)mailbox(g,-1.4+i*.42,.65,.65);
  text(g,'あまねハイツ',2.3,2.71,.14,2.3,.33,{color:'#e6e0c7'});
  return finish(g,'apartment',{width:7.8,depth:6.5,height:10.5});
}

function townhouse(){
  const g=new THREE.Group(),w=4.8,d=5.5;
  box(g,0,2.73,-2.82,w,5.3,5.34,0xb8b1a0);box(g,0,.18,-2.75,w,.22,d,0x777e79);
  for(let y=.54;y<5.4;y+=.24)for(const x of [-2.405,2.405])box(g,x,y,-2.82,.026,.025,5.34,0x958d7e);
  roof(g,0,-2.73,5.16,5.84,5.48,1.30,0x465866);
  door(g,-1.18,-.09,{color:0x694e35});
  box(g,-1.18,2.62,.29,1.58,.12,1.0,0x526775);for(const x of [-1.91,-.46])box(g,x,1.34,.68,.085,2.62,.085,0x735b43);
  pane(g,1.11,1.4,-.054,1.52,1.55,true);pane(g,-.86,4.09,-.03,1.67,1.5,true);pane(g,1.31,4.09,-.03,.9,1.5,false);
  box(g,.05,3.12,.31,3.85,.17,.84,0x8a9390);rail(g,.05,3.2,.74,3.85,{h:.96,color:0x65737a});
  for(const x of [-1.88,1.98])rail(g,x,3.2,.35,.84,{h:.96,ry:Math.PI/2});
  for(const x of [-1.4,1.45])planter(g,x,3.25,.36,{r:.19,seed:x<0?13:14});
  rod(g,[-.86,5.07,.45],[.9,5.07,.45],.025,0xa9b4ae);for(let k=0;k<3;k++)box(g,-.61+k*.48,4.74,.45,.35,.47,.03,[0xbbc8cd,0xddc7be,0xa1b4b2][k]);
  for(const side of [-1,1])for(const f of [0,1])for(const z of [-1.75,-4.45])pane(g,side*2.414,1.45+f*2.63,z,.83,1.1,side===-1&&f===1,side*Math.PI/2);
  for(const x of [-1.28,1.2])for(const f of [0,1])pane(g,x,1.55+f*2.55,-5.52,1.1,1.22,f===0&&x>0,Math.PI);
  ac(g,2.45,.67,-3.1,Math.PI/2);ac(g,-1.53,.62,-5.71,Math.PI);
  downpipe(g,2.48,-5.41,5.54);downpipe(g,-2.48,-.04,5.54);
  // A compact covered parking/cycle bay fits within the private frontage.
  const canopy=box(g,1.15,2.64,.46,2.2,.055,1.01,0x90a5a7,{opacity:.64});canopy.rotation.x=.065;
  for(const x of [.1,2.2])box(g,x,1.32,.88,.045,2.64,.045,0x5e7379);
  box(g,2.26,.41,.21,.2,.73,1.57,0x7a817b);box(g,1.34,.41,.92,1.98,.73,.18,0x7a817b);
  for(let i=0;i<9;i++)box(g,.52+i*.22,.65,1.024,.018,.025,.01,0x4d5d5f);
  planter(g,1.75,.77,.71,{r:.2,seed:32});planter(g,2.2,.8,-.23,{r:.25,seed:34});
  mailbox(g,-2.15,1.23,.66);box(g,-2.15,.57,.61,.075,1.12,.08,0x4c626b);text(g,'森田',-2.15,1.58,.8,.33,.16,{color:'#efe9d7'});
  return finish(g,'townhouse',{width:w,depth:d,height:6.9});
}

function clinic(){
  const g=new THREE.Group(),w=6.6,d=5.5,wall=0xd5d3c6;
  box(g,0,6.03,-d/2,w,5.94,d,wall);box(g,0,1.52,-5.35,w,2.9,.3,wall);
  box(g,-3.16,1.52,-2.69,.28,2.9,5.36,wall);box(g,3.16,1.52,-2.69,.28,2.9,5.36,wall);
  box(g,0,.16,-2.72,w,.16,d,0xbbb6a4);box(g,0,2.9,-2.72,w,.18,d,0xc7c8b8);
  door(g,-1.86,.005,{w:1.2,h:2.44,color:0xa9baba,glass:true});
  glazed(g,.98,1.57,.005,3.8,2.22,0x738f93);
  box(g,1.0,1.46,.17,3.83,.37,.012,0xd9e6d9,{opacity:.79});
  text(g,'雨町デンタル',.94,1.45,.19,2.7,.27,{color:'#497f7a'});
  box(g,0,2.99,.055,6.75,.48,.23,0x6b9693);text(g,'雨町歯科クリニック',0,3.0,.185,5.25,.31,{color:'#f3efda'});
  // Waiting area, reception and dental chair visible through the shopfront.
  box(g,1.95,.65,-1.23,1.3,1.05,.55,0xb7c4b6);box(g,1.95,1.22,-1.23,1.42,.12,.7,0xf0dfb6);
  box(g,1.95,1.43,-1.1,.36,.31,.055,0x394d59);box(g,1.95,1.24,-1.15,.04,.13,.09,0x777e78);
  for(let j=0;j<3;j++){const x=-1.3+j*.61;box(g,x,.52,-1.73,.51,.12,.54,0x82aaa2);box(g,x,.91,-1.98,.51,.74,.08,0x82aaa2);for(const dx of [-.2,.2])box(g,x+dx,.29,-1.73,.04,.46,.36,0x6c7b7f);}
  box(g,1.7,.75,-3.38,.76,.28,1.48,0x92bbad);box(g,1.7,1.18,-3.85,.76,.68,.16,0x92bbad);cyl(g,1.7,.4,-3.38,.21,.42,0x708e90);
  rod(g,[2.51,.2,-3.36],[2.51,1.9,-3.36],.05,0xbdc7b9);rod(g,[2.51,1.9,-3.36],[1.94,2.14,-3.04],.04,0xbdc7b9);sphere(g,1.94,2.1,-3.04,.16,0xeae6c3);
  text(g,'受付',1.95,.86,-.93,.7,.22,{color:'#476564'});
  for(const f of [0,1]){
    const y=4.52+f*2.88;
    for(const x of [-2.13,0,2.13])pane(g,x,y,.02,1.22,1.45,(f===0&&x===0)||f===1,0,0x829997);
    for(const x of [-2.13,0,2.13])pane(g,x,y,-5.515,1.22,1.45,x===0,Math.PI,0x829997);
    for(const s of [-1,1])for(const z of [-1.35,-3.91])pane(g,s*3.314,y,z,1.15,1.45,f===0&&s===1,s*Math.PI/2,0x829997);
    for(const x of [-2.25,2.25])ac(g,x,y-.92,-5.63,Math.PI);
  }
  for(const y of [3.32,6.2,8.97]){box(g,0,y,.04,6.64,.13,.14,0xacb6ab);box(g,0,y,-5.55,6.64,.13,.14,0xacb6ab);}
  // Ceramic courses, shallow exterior tile joints and individual waiting-room books.
  for(const side of [-1,1])for(let k=0;k<15;k++)box(g,side*3.311,3.51+k*.34,-2.75,.018,.018,5.45,0xb4bdb2);
  for(let k=0;k<8;k++){box(g,-2.67,1.18+k*.072,-3.58,.4,.05,.25,[0x869b8b,0xc7b590,0x8a9ca9][k%3]);}
  box(g,-2.67,.64,-3.58,.59,.96,.47,0xc2b79b);box(g,-2.67,1.14,-3.58,.68,.06,.54,0xe0d1b0);
  for(let k=0;k<6;k++)box(g,-2.81+k*.061,1.34,-3.58,.032,.26,.23,0xb89777);
  box(g,2.92,1.79,-3.1,.035,.62,.47,0xe8dcc1);text(g,'健診',2.89,1.84,-3.1,.42,.23,{ry:-Math.PI/2,color:'#688678'});
  flatRoof(g,6.6,5.5,9.2,wall);
  box(g,3.29,5.08,.33,.25,3.39,.69,0x558b87);box(g,3.29,5.08,.689,.22,3.27,.025,0xdce6ca);
  for(let i=0;i<4;i++)text(g,'雨町歯科'[i],3.29,6.19-i*.72,.711,.24,.43,{color:'#487976'});
  text(g,'診療 9:00–19:00',-.06,2.51,.175,2.1,.21,{color:'#53756f'});
  for(const x of [-3,3])planter(g,x,.08,.61,{r:.26,seed:x<0?25:26});
  box(g,-2.78,.57,.71,.45,.9,.09,0xe1ddc4);text(g,'歯科',-2.78,.71,.768,.4,.23,{color:'#467e7a'});text(g,'受付中',-2.78,.42,.768,.4,.15,{color:'#467e7a'});
  downpipe(g,3.39,-5.28,8.97);point(g,0xffdea9,12,0,2.38,-1.2,5.5);
  return finish(g,'clinic',{width:w,depth:d,height:9.2});
}

function post(){
  const g=new THREE.Group(),w=5,d=5,wall=0xbdb7a5;
  box(g,0,1.85,-4.87,w,3.54,.26,wall);box(g,-2.38,1.85,-2.4,.24,3.54,4.8,wall);box(g,2.38,1.85,-2.4,.24,3.54,4.8,wall);
  box(g,0,.17,-2.5,w,.18,d,0xada89b);box(g,0,3.48,-2.5,w,.2,d,0xc5c2b0);
  for(const x of [-2.35,-.3,2.35])box(g,x,1.48,-.01,.17,2.8,.2,0x877e6c);
  door(g,-1.32,.015,{w:1.42,h:2.5,glass:true,color:0xb0b8aa});glazed(g,1.06,1.48,.02,2.35,2.62,0x7c857e);
  box(g,0,3.05,.05,5.13,.55,.2,0xa44934);text(g,'雨町郵便局',.33,3.05,.163,3.47,.33,{color:'#f3e6cb'});text(g,'〒',-1.94,3.04,.17,.58,.4,{color:'#ffe8cd'});
  // Shallow hipped-looking canopy with a real closed gable and rows of tiles.
  roof(g,0,-2.45,5.45,5.38,3.53,.75,0x794d3c);
  for(const s of [-1,1])for(const z of [-1.62,-3.65])pane(g,s*2.51,1.71,z,1.0,1.53,false,s*Math.PI/2,0x8a8e81);
  for(const x of [-1.39,1.38])pane(g,x,1.8,-5.015,1.1,1.43,x>0,Math.PI,0x8a8e81);
  // Counter, service windows, packing shelf and cabinets are separate meshes.
  box(g,.74,.65,-1.93,3.4,1.16,.74,0xb39162);box(g,.74,1.29,-1.93,3.56,.13,.83,0xe2d5b6);
  for(let j=0;j<3;j++){const x=-.43+j*1.1;box(g,x,1.51,-1.83,.45,.35,.08,0x495e68);box(g,x,1.31,-1.88,.08,.16,.18,0x707d7e);box(g,x,1.56,-2.3,.88,.41,.035,0xb9cfcb,{opacity:.4});text(g,String(j+1),x,2.67,-2.2,.31,.23,{bg:'#9c4837'});}
  box(g,-1.65,.65,-3.72,.98,1.15,1.1,0xb1ad95);box(g,1.0,1.54,-4.51,2.39,2.4,.3,0xa0a898);
  for(let row=0;row<5;row++)for(let col=0;col<6;col++){const x=.04+col*.38,y=.62+row*.43;box(g,x,y,-4.34,.32,.35,.04,0xb9c1ad);box(g,x,y+.055,-4.307,.13,.015,.018,0x52605b);}
  // Traditional freestanding pillar box on the private forecourt.
  cyl(g,-2.0,.8,.66,.245,1.42,0xae382b,{segments:14});cyl(g,-2,1.55,.66,.29,.11,0xb64935,{segments:14});box(g,-2,1.28,.902,.28,.08,.025,0x372c2a);
  text(g,'〒',-2,.91,.912,.28,.3,{color:'#f5e5c5'});box(g,-2,.46,.91,.24,.19,.035,0xded0b2);box(g,-2,.07,.66,.54,.14,.5,0x656963);
  planter(g,2.17,.08,.5,{r:.22,seed:39});text(g,'ゆうちょ銀行',1.02,2.55,.13,1.65,.22,{color:'#eae9ca'});
  ac(g,2.56,.65,-4.1,Math.PI/2);downpipe(g,-2.49,-4.83,3.57);point(g,0xffda92,10,0,2.57,-1.2,5);
  return finish(g,'post',{width:w,depth:d,height:4.4});
}

function closedshop(){
  const g=new THREE.Group(),w=4.8,d=5;
  box(g,0,2.8,-2.5,w,5.45,d,0x776756);box(g,0,.2,-2.5,w,.25,d,0x747575);
  for(const side of [-1,1])for(let y=.5;y<5.48;y+=.23)box(g,side*2.414,y,-2.52,.035,.03,4.95,0x51473e);
  for(let y=.5;y<5.48;y+=.23)box(g,0,y,-5.016,4.8,.03,.035,0x51473e);
  // Closed metal roller shutter is the main first-floor surface.
  box(g,0,1.38,.032,4.24,2.54,.11,0x41494a);
  for(let i=0;i<27;i++)box(g,0,.2+i*.087,.12,4.06,.071,.051,i%5===0?0x82867e:0x919289);
  for(const x of [-2.17,2.17])box(g,x,1.45,.14,.13,2.78,.13,0x5b655f);
  box(g,0,.18,.165,4.15,.13,.09,0x454f4d);box(g,.12,.72,.164,.24,.09,.028,0x4d5a58);
  box(g,0,2.88,.07,4.77,.64,.22,0x63786a);text(g,'森田  日用雑貨',0,2.89,.19,4.15,.39,{color:'#c6bda0',weight:600});
  for(let i=0;i<11;i++){const rand=seeded(40+i);box(g,-2.15+rand()*4.3,2.67+rand()*.43,.184,.07+rand()*.21,.012,.01,0x78826c);}
  box(g,0,3.38,.33,5.08,.1,.92,0x414f53,{rot:[.1,0,0]});
  for(const x of [-1.23,1.23]){pane(g,x,4.36,.03,1.35,1.24,x<0,0,0x504438);for(const s of [-1,1])box(g,x+s*.82,4.36,.01,.21,1.4,.08,0x554a3d);}
  rail(g,0,3.65,.35,4.3,{h:.65,color:0x5b6056});box(g,0,3.62,.14,4.38,.11,.57,0x777972);
  planter(g,1.62,3.73,.1,{r:.16,seed:49});
  for(const s of [-1,1])for(const z of [-1.62,-3.79])pane(g,s*2.42,4.27,z,.88,1.15,s===1&&z<-3,s*Math.PI/2,0x574d42);
  for(const x of [-1.23,1.23]){pane(g,x,4.2,-5.025,1.12,1.24,x>0,Math.PI,0x574d42);pane(g,x,1.62,-5.025,.83,.9,false,Math.PI,0x574d42);}
  roof(g,0,-2.46,5.19,5.5,5.4,.78,0x414f55);
  downpipe(g,-2.5,-.04,5.48,0x66594b);downpipe(g,2.5,-4.95,5.48,0x66594b);ac(g,2.45,1.01,-3.45,Math.PI/2);
  box(g,-1.69,1.83,.169,.51,.66,.02,0xc2b594);text(g,'お休み',-1.69,1.93,.186,.41,.2,{color:'#66594a'});text(g,'水曜日',-1.69,1.71,.186,.41,.16,{color:'#66594a'});
  for(const x of [-1.94,1.87])planter(g,x,.08,.55,{r:.2,seed:52+Math.floor(x)});
  box(g,1.18,.32,.27,.63,.42,.42,0x77664b);for(let i=0;i<4;i++)box(g,.95+i*.15,.39,.492,.035,.32,.027,0x4d493a);
  text(g,'森田商店',0,5.1,.067,1.4,.18,{color:'#a6987c'});
  return finish(g,'closedshop',{width:w,depth:d,height:6.3});
}

function stoneLantern(p,x,z){
  box(p,x,.16,z,.59,.28,.58,0x7b8079);box(p,x,.36,z,.39,.15,.38,0x94958a);cyl(p,x,.73,z,.13,.65,0x81877e,{segments:6});
  box(p,x,1.07,z,.49,.14,.47,0x999b8c);box(p,x,1.3,z,.36,.36,.35,0x777f75);box(p,x,1.31,z+.182,.23,.22,.014,0xe4c986,{emissive:0xd29d51,intensity:.7});
  const cap=meshCone(p,x,1.58,z,.4,.3,4,0x8b9184);cap.rotation.y=Math.PI/4;sphere(p,x,1.81,z,.075,0x91978b);
}
function meshCone(p,x,y,z,r,h,n,color){return cyl(p,x,y,z,r,h,color,{top:0,segments:n});}
function tree(p,x,z,seed=1){
  const r=seeded(seed);rod(p,[x,.08,z],[x-.14,2.86,z-.1],.11,0x5c4c3b);
  for(let i=0;i<5;i++){const a=i*1.25+.4,ex=x+Math.cos(a)*.55,ez=z+Math.sin(a)*.48;rod(p,[x-.05,1.75+i*.16,z],[ex,2.72+r()*.44,ez],.045,0x655340);}
  for(let i=0;i<12;i++){const a=i*2.4,rr=.2+r()*.32;sphere(p,x+Math.cos(a)*rr,2.91+r()*.7,z+Math.sin(a)*rr,.30+r()*.12,i%2?0x3a6150:0x456e51);}
}
function shrine(){
  const g=new THREE.Group();
  // No public street base: these are the shrine's own stone steps and pathway.
  for(let k=0;k<5;k++)box(g,0,.08+k*.055,-.08-k*.32,1.58,.13,.49,0x838a80);
  for(let k=0;k<4;k++)box(g,0,.23,-1.75-k*.55,1.46,.14,.48,k%2?0x7a837e:0x92978a);
  box(g,0,.44,-3.18,2.78,.43,2.3,0x747f78);box(g,0,1.45,-3.25,2.35,1.72,1.87,0x7d4c32);
  for(const x of [-1.06,0,1.06])for(const z of [-2.34,-4.16])box(g,x,1.56,z,.15,2.2,.15,0xa46b3c);
  for(let i=0;i<17;i++)box(g,-1+i*.125,1.48,-2.297,.066,1.7,.058,0xb58951);
  box(g,0,2.41,-3.25,2.59,.17,2.1,0x74472f);
  roof(g,0,-3.23,3.04,2.5,2.51,1.12,0x42554e);
  // The ridge detail stays below the specified asset height.
  rod(g,[-.31,3.57,-3.84],[.27,4.12,-3.84],.055,0xa38851);rod(g,[.31,3.57,-3.84],[-.27,4.12,-3.84],.055,0xa38851);
  rod(g,[-.31,3.57,-2.65],[.27,4.12,-2.65],.055,0xa38851);rod(g,[.31,3.57,-2.65],[-.27,4.12,-2.65],.055,0xa38851);
  for(const z of [-2.94,-3.42])box(g,0,3.8,z,1.04,.11,.11,0xa08550);
  // Offering box, bell rope and small hanging plaques.
  box(g,0,.86,-1.89,1.1,.54,.63,0x795438);for(let i=0;i<9;i++)box(g,-.45+i*.113,1.15,-1.89,.055,.05,.61,0xb3955d);
  text(g,'奉納',0,.87,-1.565,.48,.25,{color:'#d9c391'});rod(g,[0,2.62,-2.08],[0,1.38,-2.08],.039,0xc6ac74);sphere(g,0,2.69,-2.08,.12,0xa09a66);
  for(let i=0;i<5;i++)box(g,-.87+i*.43,2.38,-2.14,.17,.25,.014,0xe4d8b9,{rot:[0,0,(i%2?.21:-.21)]});
  // Red torii marks the frontage; main gate geometry reaches Y = 4.7.
  for(const x of [-1.52,1.52]){
    cyl(g,x,.19,-.18,.24,.27,0x555f5e,{segments:10});cyl(g,x,2.01,-.18,.14,3.5,0xa6382c,{top:.12,segments:12});
    box(g,x,3.59,-.18,.35,.16,.37,0x9c3529);
  }
  box(g,0,3.41,-.18,3.73,.18,.24,0xa33c2d);box(g,0,3.97,-.18,4.1,.21,.34,0x9d392c);
  box(g,0,4.17,-.18,4.38,.18,.47,0x304b48);for(const side of [-1,1]){const b=box(g,side*2.02,4.31,-.18,.65,.17,.47,0x304b48);b.rotation.z=side*.35;}
  box(g,0,3.75,-.18,.2,.51,.22,0xa33d2c);box(g,0,3.67,.02,.4,.55,.045,0xb29451);text(g,'雨守',0,3.7,.05,.32,.18,{color:'#333f37'});
  // Fine rope and zigzag papers remain individual editable parts.
  rod(g,[-1.45,3.11,-.03],[0,2.97,-.03],.035,0xaa9365);rod(g,[0,2.97,-.03],[1.45,3.11,-.03],.035,0xaa9365);
  for(let j=0;j<5;j++){let x=-1.06+j*.53;for(let k=0;k<3;k++)box(g,x+(k%2?.055:0),2.91-k*.1,-.016,.08,.15,.016,0xe7dfc1,{rot:[0,0,k%2?.55:-.55]});}
  stoneLantern(g,-1.78,-1.24);stoneLantern(g,1.78,-1.24);tree(g,-1.75,-3.62,41);tree(g,1.75,-3.79,44);
  // Boundary stones and the private forecourt's fine gravel are actual geometry.
  for(const side of [-1,1])for(let k=0;k<16;k++)box(g,side*2.27,.1,-.95-k*.249,.18,.17,.22,0x737d73);
  for(let k=0;k<12;k++)box(g,-2.12+k*.385,.1,-4.72,.34,.17,.18,0x737d73);
  const gravel=seeded(217);for(let k=0;k<30;k++){const side=k%2?1:-1;cyl(g,side*(.92+gravel()*1.16),.068,-.85-gravel()*3.69,.032+gravel()*.035,.035,0x858b7a,{segments:5});}
  // Closely spaced perimeter pickets and a plaque rack define the tiny lot.
  for(const side of [-1,1]){
    for(let k=0;k<17;k++)box(g,side*2.35,.55,-.92-k*.235,.065,.9,.07,0x785d43);
    for(const y of [.31,.77])box(g,side*2.35,y,-2.86,.08,.07,4.1,0x8a6e4d);
  }
  for(let k=0;k<21;k++)box(g,-2.34+k*.234,.57,-4.92,.07,.95,.07,0x785d43);
  for(const y of [.31,.79])box(g,0,y,-4.92,4.76,.07,.08,0x8a6e4d);
  for(const x of [-1.98,-.92])box(g,x,1.1,-2.12,.055,1.71,.055,0x826a48);box(g,-1.45,1.98,-2.12,1.28,.1,.36,0x556453);
  for(let j=0;j<2;j++)for(let k=0;k<4;k++){const x=-1.87+k*.28;box(g,x,1.66-j*.4,-2.08,.2,.25,.025,0xc3a46b);text(g,'願',x,1.66-j*.4,-2.06,.12,.14,{color:'#67523c'});}
  box(g,2.14,1.03,-.3,.53,1.44,.1,0x89938b);text(g,'雨守神社',2.14,1.12,-.242,.39,.36,{color:'#2e4545'});
  // Tiny stone apex gives the lot a consistent 4.7 m maximum for layout tools.
  cyl(g,0,4.57,-.18,.09,.26,0x344c45,{top:0,segments:4});
  return finish(g,'shrine',{width:5,depth:5,height:4.7});
}

export const urbanBuildings = [
  {id:'apartment',name:'雨音公寓',subtitle:'外廊楼梯 · 阳台生活',width:7.8,depth:6.5,height:10.5,color:'#929f99',build:apartment},
  {id:'townhouse',name:'森田家',subtitle:'两层住宅 · 门廊花园',width:4.8,depth:5.5,height:6.9,color:'#ada48c',build:townhouse},
  {id:'clinic',name:'雨町牙科',subtitle:'街角诊所 · 楼上办公室',width:6.6,depth:5.5,height:9.2,color:'#83aba2',build:clinic},
  {id:'post',name:'雨町邮局',subtitle:'社区邮政 · 红色邮筒',width:5,depth:5,height:4.4,color:'#a5533f',build:post},
  {id:'closedshop',name:'森田杂货铺',subtitle:'打烊卷帘 · 旧木住宅',width:4.8,depth:5,height:6.3,color:'#81795f',build:closedshop},
  {id:'shrine',name:'雨守神社',subtitle:'口袋神社 · 鸟居参道',width:5,depth:5,height:4.7,color:'#a64e3e',build:shrine},
];
