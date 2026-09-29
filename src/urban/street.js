import {THREE,box,cyl,sphere,torus,rod,curve,text,mat,seeded,batchStatic} from '../kit.js';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {district} from '../catalog.js';

function pavement(p,x,z,w,d,color=0x778489){
  box(p,x,.15,z,w,.23,d,color,{edge:true});
  for(let a=x-w/2+.72;a<x+w/2;a+=.92)box(p,a,.269,z,.015,.008,d-.04,0x5c7078);
  for(let a=z-d/2+.6;a<z+d/2;a+=.86)box(p,x,.269,a,w-.04,.008,.013,0x61777d);
}
function tree(p,x,z,s=1){
  box(p,x,.32,z,1.25*s,.25,1.25*s,0x9caa9e,{edge:true});box(p,x,.456,z,1.11*s,.025,1.11*s,0x454a3a);
  rod(p,[x,.45,z],[x,2.5*s,z],.10*s,0x675746);
  for(let i=0;i<7;i++){const a=i*2.4;const m=sphere(p,x+Math.cos(a)*.5*s,2.0*s+(i%3)*.34*s,z+Math.sin(a)*.5*s,.65*s,[0x51765d,0x3a6354,0x5c7e61][i%3]);m.scale.y=1.2;}
}
function bench(p,x,z,ry=0){const g=new THREE.Group();g.position.set(x,.28,z);g.rotation.y=ry;p.add(g);for(let i=0;i<4;i++)box(g,0,.45,-.22+i*.13,1.8,.08,.10,0x8b7658);for(let i=0;i<3;i++)box(g,0,.68+i*.13,-.29,1.8,.10,.06,0x917c5e);for(const xx of [-.62,.62]){box(g,xx,.22,0,.09,.44,.45,0x384f55);rod(g,[xx,.3,-.26],[xx,1.03,-.29],.035,0x3a4e57);}}
function pole(p,x,z){
  cyl(p,x,4,z,.10,8,0x667c85,{segments:10});box(p,x,7.3,z,1.35,.10,.13,0x91a2a6);
  for(const a of [-.55,0,.55])cyl(p,x+a,7.47,z,.055,.25,0xaaaead);
  box(p,x+.2,5.7,z,.38,.8,.37,0x899995,{edge:true});for(let i=0;i<3;i++)box(p,x,.6+i*.18,z+.103,.19,.075,.01,0xc6b974);
  curve(p,[[x,5.75,z],[x,6,z],[x+.30,6.16,z],[x+.9,6.1,z]],.047,0xa5b6b1);
  box(p,x+.95,6.06,z,.66,.11,.26,0x869997);box(p,x+.95,5.99,z,.53,.014,.20,0xffdcaa,{basic:true});
}
function bicycle(p,x,z,ry=0,c=0x7baca6){
  const g=new THREE.Group();g.position.set(x,.28,z);g.rotation.y=ry;p.add(g);
  for(const xx of [-.64,.64]){torus(g,xx,.40,0,.37,.035,0x263b44);torus(g,xx,.40,.006,.32,.015,0xa8b7b6);for(let i=0;i<8;i++){const a=i*Math.PI/4;rod(g,[xx,.40,.012],[xx+Math.cos(a)*.31,.4+Math.sin(a)*.31,.012],.006,0x819ba5);}}
  for(const [a,b] of [[[-.64,.4,0],[-.2,.5,0]],[[-.2,.5,0],[-.32,.98,0]],[[-.32,.98,0],[-.64,.4,0]],[[-.32,.98,0],[.38,.92,0]],[[-.2,.5,0],[.38,.92,0]],[[.38,.92,0],[.64,.4,0]],[[.38,.92,0],[.31,1.22,0]]])rod(g,a,b,.024,c);
  box(g,-.32,1.04,0,.30,.07,.19,0x493c33);rod(g,[.31,1.21,-.19],[.31,1.21,.19],.024,0xa8b4b3);box(g,.65,1.10,0,.35,.24,.34,0x768a8a,{edge:true});rod(g,[-.2,.5,0],[-.3,.02,.2],.018,0x4b5d63);
}
function car(p,x,z,ry=0,c=0x879b9b,van=false,ground=.08){
  const g=new THREE.Group();g.position.set(x,ground,z);g.rotation.y=ry;p.add(g);g.name=van?'配達用の軽バン':'軽自動車';
  box(g,0,.48,0,1.54,.57,3.0,c,{edge:true});box(g,0,.97,van?-.20:-.12,1.44,.59,van?2.42:1.95,c,{edge:true});
  box(g,0,1.03,van?1.025:.87,1.23,.36,.035,0x405761);box(g,0,1.03,van?-1.425:-1.105,1.22,.33,.035,0x475e63);
  for(const xx of [-.733,.733]){box(g,xx,1.04,.39,.018,.33,.65,0x425964);box(g,xx,1.04,-.48,.018,.33,.66,0x425964);box(g,xx,.74,.35,.025,.038,.17,0xa6b4b1);}
  for(const xx of [-.78,.78])for(const zz of [-.94,.93]){cyl(g,xx,.28,zz,.25,.17,0x1f2f36,{rot:[0,0,Math.PI/2],segments:14});cyl(g,xx*1.017,.28,zz,.13,.18,0x869b9f,{rot:[0,0,Math.PI/2],segments:12});}
  for(const xx of [-.51,.51]){box(g,xx,.52,1.515,.31,.17,.035,0xe9dfa7,{basic:true});box(g,xx,.50,-1.515,.24,.15,.035,0x8b343a,{emissive:0x632229,intensity:.25});}
  box(g,0,.30,1.527,.35,.13,.02,0xcabd72);box(g,0,.30,-1.527,.35,.13,.02,0xcabd72);
}
function pedestrian(p,x,z,ry,c){
  const g=new THREE.Group();g.name='傘をさす歩行者';g.position.set(x,.28,z);g.rotation.y=ry;p.add(g);
  for(const xx of [-.11,.11]){rod(g,[xx,.13,0],[xx,.70,0],.067,0x2d3d4d);box(g,xx,.06,.06,.15,.1,.27,0x233641);}
  cyl(g,0,1.0,0,.21,.64,c,{top:.15,segments:8});sphere(g,0,1.44,0,.14,0xcba98a);
  rod(g,[-.17,1.18,0],[-.18,.94,.13],.054,c);rod(g,[.17,1.18,0],[.15,1.04,.29],.055,c);rod(g,[.15,1.0,.28],[.15,1.87,.28],.015,0xc3c8bc);
  const umbrella=new THREE.Mesh(new THREE.ConeGeometry(.63,.29,10,1,true),mat(c,{double:true}));umbrella.position.set(.15,1.89,.28);g.add(umbrella);sphere(g,.15,2.05,.28,.04,0xc2c7b8);
  for(let i=0;i<10;i++){const a=i*Math.PI/5;rod(g,[.15,2.03,.28],[.15+Math.cos(a)*.63,1.744,.28+Math.sin(a)*.63],.006,0x819ba3);}
}
function vending(p,x,z,ry=0){const g=new THREE.Group();g.position.set(x,.27,z);g.rotation.y=ry;p.add(g);box(g,0,1.03,0,1.05,2.05,.7,0xc2c4b5,{edge:true});box(g,-.10,1.29,.36,.72,1.11,.03,0x466a72);box(g,-.10,1.29,.38,.64,1.03,.02,0x9fcfc5,{emissive:0x90c5bb,intensity:.35});for(let j=0;j<3;j++)for(let i=0;i<5;i++)cyl(g,-.35+i*.125,.96+j*.31,.43,.037,.18,[0x9b5c43,0x5a949b,0xc1ae76,0x7b9274][(i+j)%4]);box(g,0,.47,.38,.62,.21,.03,0x2d4551);box(g,.4,1.15,.37,.12,.52,.02,0x2a414d);text(g,'DRINK',0,1.88,.37,.84,.18,{color:'#33525a'});}
function parking(p){
  const x=39.5,z=18;box(p,x,.283,z,13,.022,14.2,0x344c59);
  for(let i=0;i<4;i++){const xx=34.6+i*3.15;box(p,xx,.301,18,.055,.01,5.5,0xb4bcad);box(p,xx+1.50,.301,15.24,2.98,.01,.055,0xb4bcad);text(p,String(i+1),xx+1.5,.308,16.1,.7,.6,{rx:-Math.PI/2,color:'#c1c4ae'});box(p,xx+1.5,.38,15.7,1.35,.16,.20,0x9aa699);}
  car(p,36.15,18,0,0xb9b9a8,false,.29);car(p,42.45,18,0,0x6b8a95,false,.29);car(p,39.3,18,0,0xa16555,false,.29);
  cyl(p,45,2.1,12.6,.08,4.2,0x7a8b90);box(p,45,4.12,12.6,1.5,.9,.15,0xc4ac5e);text(p,'P',45,4.16,12.69,.6,.69,{color:'#183d46'});box(p,45,.95,13.6,.65,1.35,.55,0x8b9a8b,{edge:true});text(p,'精算機',45,1.35,13.895,.55,.16,{color:'#e5ddad'});
}
function shelter(p,x,z){
  for(const xx of [-1.5,1.5])rod(p,[x+xx,.27,z],[x+xx,2.8,z],.055,0x738a90);box(p,x,2.85,z,3.4,.12,1.25,0x526d73,{edge:true});bench(p,x,z-.3);
  cyl(p,x+2,.27+1.4,z,.035,2.8,0xb0b4a2);cyl(p,x+2,2.87,z,.25,.08,0xc7b67b,{rot:[Math.PI/2,0,0]});text(p,'雨町',x+2,2.89,z+.052,.4,.18,{color:'#41666d'});box(p,x+2,2.05,z,.42,.75,.065,0xc3c2a9);for(let i=0;i<6;i++)box(p,x+2,2.30-i*.09,z+.036,.29,.013,.008,0x6a8085);
}
export function createStreet(){
  const root=new THREE.Group();root.name='共有街路と生活小物';
  box(root,district.centerX,-.40,0,89,.8,52,0x263e4d,{edge:true});box(root,district.centerX,.017,0,88.9,.04,51.9,0x324955);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(88.8,51.8),new THREE.MeshStandardMaterial({color:0x213744,metalness:.3,roughness:.43}));road.rotation.x=-Math.PI/2;road.position.set(district.centerX,.047,0);road.receiveShadow=true;root.add(road);
  const detail=new THREE.Group();root.add(detail);
  for(const [x,w] of [[-22,36],[25.5,43]])for(const z of [-7.65,7.65])pavement(detail,x,z,w,8.5);
  for(const [x,w] of [[-22,36],[25.5,43]])for(const z of [-20.75,20.75])pavement(detail,x,z,w,10.1,0x6d7f85);
  // Narrow continuous drains and white edge markings stop at the cross street.
  for(const [x,w] of [[-22,36],[25.5,43]])for(const z of [-3.26,3.26]){box(detail,x,.064,z,w,.015,.12,0x203a46);for(let xx=x-w/2;xx<x+w/2;xx+=.28)box(detail,xx,.075,z,.034,.011,.10,0x657f88);box(detail,x,.072,z-Math.sign(z)*.20,w,.009,.045,0x9eaaa6);}
  // Real junction: crossings, stop lines, signs; the shopping street has no centreline.
  for(const sign of [-1,1]){
    for(let i=0;i<8;i++)box(detail,sign*5.5,.078,-2.7+i*.77,2.05,.009,.42,0xbbc7c1);
    for(let i=0;i<8;i++)box(detail,-2.7+i*.77,.078,sign*4.6,.42,.009,1.90,0xbbc7c1);
    box(detail,sign*7.4,.078,sign*1.5,.12,.008,2.65,0xb8c4ba);
    for(let z=7;z<25;z+=3.3)box(detail,0,.076,sign*z,.075,.009,1.5,0xa3b4b1);
  }
  text(detail,'止まれ',-9.2,.086,1.5,2.3,1.0,{rx:-Math.PI/2,color:'#b4bcb0'});
  for(const [x,z,ry,go] of [[-4.5,-3.8,-Math.PI/2,true],[4.5,3.8,0,false]]){const signal=new THREE.Group();signal.position.set(x,0,z);signal.rotation.y=ry;detail.add(signal);cyl(signal,0,2.6,0,.065,5.2,0x7c9296);box(signal,0,4.9,0,.44,1.22,.30,0x304853,{edge:true});for(let i=0;i<3;i++)cyl(signal,0,4.50+i*.39,.17,.13,.06,(go?[0x5dbfa3,0x493f28,0x462c30]:[0x284a41,0x493f28,0xe26a61])[i],{rot:[Math.PI/2,0,0],basic:true,segments:16});}
  const poleXs=[-38,-24,-10,6,19,33,46];
  for(const z of [-3.7,3.7]){
    for(const x of poleXs)pole(detail,x,z);
    for(let i=1;i<poleXs.length;i++)for(const dz of [-.13,.13])curve(detail,[[poleXs[i-1],7.4,z+dz],[(poleXs[i-1]+poleXs[i])/2,6.85,z+dz],[poleXs[i],7.4,z+dz]],.013,0x142b38);
  }
  // Main street gate, light enough to keep the street vista open.
  for(const x of [-39,46]){for(const z of [-3.2,3.2])cyl(detail,x,2.9,z,.095,5.8,0x68888e);box(detail,x,5.85,0,.18,.38,6.65,0x537b82);text(detail,'雨町商店街',x+.11,5.88,0,3.3,.32,{ry:Math.PI/2,color:'#edddb8'});}
  for(const [x,z,s] of [[-7.5,-8.3,1.1],[-8,19,1.25],[7.5,22.4,1.0],[29,22,1.2],[44,-22,1.1],[-38,23,1],[-38,-23,1],[40,-15,1]])tree(detail,x,z,s);
  bench(detail,-8.5,21.2,Math.PI/2);bench(detail,28,20,Math.PI/2);shelter(detail,-8.0,-10.0);
  for(const [i,x] of [-31,-18,-11,10,23,33].entries()){bicycle(detail,x,-3.92,.1,0x6a918e);bicycle(detail,x+.6,3.91,Math.PI+.2,i%2?0xa17c68:0x7393a6);}
  vending(detail,-5.7,8.8,-Math.PI/2);vending(detail,37,-10,Math.PI/2);vending(detail,7.5,20.7,Math.PI/2);
  parking(detail);car(detail,-34,14,Math.PI/2,0xbdc3b4,true);car(detail,1.9,-20,0,0x69868e);
  const walkers=[[-29.3,-3.85,0,0x697e92],[-20.2,-3.85,1,0xaa6955],[-12,3.85,2,0xa9a07b],[8.1,-3.85,0,0x889e98],[18,-3.9,1,0x957795],[25.6,3.9,2,0x5e8c9d],[31,-3.8,3,0x748574],[38,-3.85,2,0xb08d6d],[-18,-15.4,1,0x7d999b],[15,-15.5,2,0x9b8a79],[21,16.1,1,0x5d8295],[2.7,11,2,0x7f8588]];
  walkers.forEach(a=>pedestrian(detail,...a));
  for(const [x,z] of [[-17,0],[21,0],[0,-11],[0,13],[-25,-13.7],[25,13.7]]){cyl(detail,x,.077,z,.4,.023,0x526d77,{segments:24});for(let i=-2;i<=2;i++)box(detail,x,.094,z+i*.10,.59,.009,.017,0x283f4d);}
  // Waste collection cages and service bins belong in back lanes.
  for(const [x,z] of [[-13,-10.8],[26,10.9],[-29,-16.3]]){box(detail,x,.58,z,1.4,.62,.61,0x6f8282,{edge:true});for(let i=0;i<12;i++)box(detail,x-.64+i*.12,.59,z+.31,.015,.50,.013,0xadb6aa);}
  const random=seeded(493);for(let i=0;i<48;i++){const x=-39+random()*85,z=(i%3===0?-13.4:i%3===1?13.5:0)+random()*2-1;const pts=[];for(let j=0;j<=36;j++){const a=j/36*Math.PI*2,r=1+.10*Math.sin(a*5);pts.push(new THREE.Vector3(x+Math.cos(a)*(.42+i%4*.1)*r,.089,z+Math.sin(a)*.16*r));}detail.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x7797a2,transparent:true,opacity:.18})));}
  const batching=batchStatic(detail);
  const shader={uniforms:THREE.UniformsUtils.clone(Reflector.ReflectorShader.uniforms),vertexShader:Reflector.ReflectorShader.vertexShader,fragmentShader:Reflector.ReflectorShader.fragmentShader};shader.uniforms.uTime={value:0};
  shader.vertexShader=shader.vertexShader.replace('varying vec4 vUv;','varying vec4 vUv; varying vec2 wetUv;').replace('vUv = textureMatrix','wetUv=uv; vUv = textureMatrix');
  shader.fragmentShader=shader.fragmentShader.replace('varying vec4 vUv;','varying vec4 vUv; varying vec2 wetUv; uniform float uTime;').replace('vec4 base = texture2DProj( tDiffuse, vUv );','vec4 u=vUv;u.x+=sin(wetUv.y*650.0+uTime)*.00014*vUv.w;u.y+=sin(wetUv.x*800.0+uTime*1.3)*.00012*vUv.w;vec4 base=texture2DProj(tDiffuse,u);').replace('gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );','float f=sin(wetUv.x*97.0+sin(wetUv.y*163.0))*sin(wetUv.y*140.0);gl_FragColor=vec4(blendOverlay(base.rgb,color),.13+smoothstep(-.5,.7,f)*.22);');
  const reflection=new Reflector(new THREE.PlaneGeometry(88.8,51.8),{color:0x708592,textureWidth:1536,textureHeight:1024,clipBias:.003,shader,multisample:0});reflection.rotation.x=-Math.PI/2;reflection.position.set(district.centerX,.080,0);reflection.material.transparent=true;reflection.material.depthWrite=false;root.add(reflection);
  return {root,reflection,batching,update(t){reflection.material.uniforms.uTime.value=t;}};
}

export function createWeather(){
  const random=seeded(338),count=3600,a=new Float32Array(count*6),seeds=Array.from({length:count},()=>({x:random(),z:random(),y:random(),speed:6+random()*4,length:.12+random()*.18}));
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(a,3));const rain=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0x9bc0d0,transparent:true,opacity:.20,depthWrite:false}));rain.frustumCulled=false;rain.name='街区の雨';
  const ripples=new THREE.Group(),rings=[];for(let i=0;i<85;i++){const m=new THREE.Mesh(new THREE.RingGeometry(.87,1,16),new THREE.MeshBasicMaterial({color:0x96b8c2,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(-39+random()*85,.1,(i%3-1)*13.6+random()*2.8-1.4);ripples.add(m);rings.push({m,offset:random(),speed:1.4+random()});}
  return {rain,ripples,count,update(t,roofs,solo){geometry.setDrawRange(0,(solo?700:count)*2);for(let i=0;i<count;i++){const s=seeds[i],x=solo?s.x*14-7:s.x*87-40,z=solo?s.z*15-10:s.z*50-25;let floor=.1;for(const b of roofs)if(x>b.min.x&&x<b.max.x&&z>b.min.z&&z<b.max.z)floor=b.max.y;const height=solo?15:18;const span=Math.max(1,height-floor);const y=floor+((s.y*span-t*s.speed)%span+span)%span,j=i*6;a[j]=x;a[j+1]=y;a[j+2]=z;a[j+3]=x-.014;a[j+4]=y+s.length;a[j+5]=z+.01;}geometry.attributes.position.needsUpdate=true;ripples.visible=!solo;for(const r of rings){const v=(t/r.speed+r.offset)%1;r.m.scale.setScalar(.02+v*.21);r.m.material.opacity=Math.sin(v*Math.PI)*(1-v)*.17;}}};
}
