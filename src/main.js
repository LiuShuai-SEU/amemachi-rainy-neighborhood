import './style.css';
import {THREE,box,text,mat,batchStatic} from './kit.js';
import {assets,byId,lots,district} from './catalog.js';
import {createStreet,createWeather} from './urban/street.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';

const canvas=document.querySelector('#scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.35));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
renderer.info.autoReset=false;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x09151f);scene.fog=new THREE.FogExp2(0x173044,.0027);
const camera=new THREE.PerspectiveCamera(37,innerWidth/innerHeight,.15,600);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=3;controls.maxDistance=400;controls.maxPolarAngle=Math.PI*.494;controls.minPolarAngle=.16;
scene.add(new THREE.HemisphereLight(0xa4cfe7,0x344957,1.34));const moon=new THREE.DirectionalLight(0x9bc5df,1.8);moon.position.set(-27,48,23);moon.castShadow=true;moon.shadow.mapSize.set(2048,2048);moon.shadow.normalBias=.055;moon.shadow.bias=-.00025;Object.assign(moon.shadow.camera,{left:-59,right:59,top:48,bottom:-48,near:.1,far:140});moon.shadow.camera.updateProjectionMatrix();scene.add(moon,moon.target);const rim=new THREE.DirectionalLight(0x8ac4ba,.60);rim.position.set(12,17,-25);scene.add(rim);
const street=createStreet();scene.add(street.root);
const city=new THREE.Group();city.name='雨町33棟';scene.add(city);const instances=[];
for(const lot of lots){
  const def=byId.get(lot.asset),root=def.build();root.name=lot.instance;root.userData={...lot,name:def.name};
  if(lot.asset==='apartment'){
    const variant=Number(lot.instance.split('_').at(-1))-1;const colors=[0xa7aaa0,0xb4a697,0x8eaaa6,0xb0ad9a],clones=new Map();
    root.traverse(o=>{if(o.isMesh&&o.material.color?.getHex()===0xa7aaa0){if(!clones.has(o.material)){const m=o.material.clone();m.color.setHex(colors[variant%4]);clones.set(o.material,m);}o.material=clones.get(o.material);}});
  }
  root.traverse(o=>{if(o.isMesh&&o.material.transparent)o.castShadow=false;});
  root.position.set(lot.x,district.ground,lot.z);root.rotation.y=lot.rotation;city.add(root);root.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(root),footprint=new THREE.Box3(new THREE.Vector3(-def.width/2,0,-def.depth),new THREE.Vector3(def.width/2,Math.min(def.height,lot.asset==='sento'?5.5:def.height),0)).applyMatrix4(root.matrixWorld);
  instances.push({...lot,def,root,bounds,footprint});
}
const cityBatch=batchStatic(city);
const solo=new THREE.Group();solo.name='素材展示';scene.add(solo);let soloModel=null,soloDef=null;
const soloBase=new THREE.Group();box(soloBase,0,-.28,-2,15,.55,15,0x2b4351,{edge:true});box(soloBase,0,.15,-2.8,12,.24,11,0x78888d);box(soloBase,0,.285,-2.8,11.96,.03,10.96,0x8a9795);for(let x=-5.7;x<6;x+=.7)box(soloBase,x,.304,-2.8,.014,.007,10.96,0x657981);for(let z=-8;z<2.5;z+=.7)box(soloBase,0,.304,z,11.97,.007,.014,0x6f8286);for(let x=-2;x<2;x+=.55)box(soloBase,x,.009,4,.33,.01,2.1,0xaec0bd);solo.add(soloBase);
const soloReflection=new Reflector(new THREE.PlaneGeometry(14.9,14.9),{color:0x3c5662,textureWidth:768,textureHeight:768,clipBias:.003,multisample:0});soloReflection.position.set(0,.018,-2);soloReflection.rotation.x=-Math.PI/2;soloReflection.material.transparent=true;soloReflection.material.opacity=.35;solo.add(soloReflection);
const weather=createWeather();scene.add(weather.rain,weather.ripples);
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.14,.45,1.12));composer.addPass(new OutputPass());
let current='overview',wet=true,time=0,frames=0,roofs=instances.map(i=>i.footprint),last=performance.now(),lights=[];
const select=document.querySelector('#asset');for(const a of assets){const option=document.createElement('option');option.value=a.id;option.textContent=a.name;select.append(option);}select.addEventListener('change',()=>{if(select.value)setView('asset:'+select.value);});
const presets={shopping:{pos:[-28,5.4,1.7],target:[24,2.8,-.4],title:'灯火相邻的商店街',subtitle:'双侧店铺、窄街与雨中的行人。'},junction:{pos:[22,15,20],target:[2,2,-2],title:'十字路口，向生活转弯。',subtitle:'商店街与住宅支路在这里交汇。'},lane:{pos:[-27,5.4,-13.4],target:[24,3.1,-14.1],title:'转过街角，是回家的路。',subtitle:'外廊、阳台、后门与安静的住家。'}};
function collectLights(){lights=[];(solo.visible?solo:city).traverse(o=>{if(o.isPointLight)lights.push(o);});}
function lightBudget(){
  // Limit the shader's live point lights; luminous signs remain visible across the whole district.
  for(const l of lights)l.visible=true;const scored=lights.map(l=>{const p=l.getWorldPosition(new THREE.Vector3());return{l,d:Math.min(p.distanceToSquared(controls.target),p.distanceToSquared(camera.position))};}).sort((a,b)=>a.d-b.d);scored.forEach(({l},i)=>l.visible=i<8);
}
function fit(bounds,reverse=false,points=null){
  const center=bounds.getCenter(new THREE.Vector3());center.y-=.75;const direction=new THREE.Vector3(reverse?-1.1:1.10,1.12,reverse?-1.35:1.40).normalize();const corners=[];
  for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(new THREE.Vector3(x,y,z));
  let distance=bounds.getSize(new THREE.Vector3()).length()*.8;const mobile=innerWidth<750,yMin=mobile?-.50:-.64,yMax=mobile?.58:.73,desiredY=(yMin+yMax)/2,spanY=yMax-yMin;
  for(let i=0;i<24;i++){
    camera.position.copy(center).addScaledVector(direction,distance);camera.lookAt(center);camera.updateMatrixWorld();
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    for(const p of points||corners){const v=p.clone().project(camera);minX=Math.min(minX,v.x);maxX=Math.max(maxX,v.x);minY=Math.min(minY,v.y);maxY=Math.max(maxY,v.y);}
    const sx=(minX+maxX)/2,sy=(minY+maxY)/2-desiredY,halfHeight=distance*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    center.addScaledVector(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0),sx*halfHeight*camera.aspect).addScaledVector(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1),sy*halfHeight);
    const ratio=Math.max((maxX-minX)/1.78,(maxY-minY)/spanY);
    if(Math.abs(sx)<.008&&Math.abs(sy)<.008&&ratio>.92&&ratio<.99)break;
    distance*=Math.max(.78,Math.min(1.6,ratio*1.035));
  }
  camera.position.copy(center).addScaledVector(direction,distance);camera.lookAt(center);camera.updateMatrixWorld();
  controls.target.copy(center);controls.update();
}
let overviewPoints=null;
function frame(){
  if(current.startsWith('asset:'))fit(new THREE.Box3().setFromObject(solo));
  else if(current==='overview'||current==='reverse'){
    if(!overviewPoints){overviewPoints=[];scene.updateMatrixWorld(true);for(const r of [city,street.root])r.traverse(o=>{if(!o.isMesh||o.isReflector)return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i+=Math.max(1,Math.floor(a.count/180)))overviewPoints.push(new THREE.Vector3().fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld));});}
    fit(new THREE.Box3(new THREE.Vector3(-41,-.85,-26),new THREE.Vector3(48,11.4,26)),current==='reverse',overviewPoints);
  }
  else {const v=presets[current];camera.position.fromArray(v.pos);controls.target.fromArray(v.target);controls.update();}
}
function setView(view){
  if(!['overview','shopping','junction','lane','reverse'].includes(view)&&!byId.has(view.replace('asset:','')))return;
  current=view;const isAsset=view.startsWith('asset:');city.visible=street.root.visible=!isAsset;solo.visible=isAsset;
  if(isAsset){
    const id=view.slice(6);if(soloDef?.id!==id){if(soloModel){solo.remove(soloModel);soloModel.traverse(o=>o.geometry?.dispose());}soloDef=byId.get(id);soloModel=soloDef.build();batchStatic(soloModel);soloModel.position.y=.31;solo.add(soloModel);}
    select.value=id;scene.updateMatrixWorld(true);roofs=[new THREE.Box3().setFromObject(soloModel)];document.querySelector('#title').textContent=soloDef.name;document.querySelector('#subtitle').textContent=soloDef.subtitle;document.querySelector('#label').textContent=`ASSET ${assets.indexOf(soloDef)+1} / ${assets.length}`;document.querySelector('#description').textContent=`${soloDef.width} m 门面 · ${soloDef.depth} m 进深 · ${soloDef.height} m 高`;
  }else{
    select.value='';roofs=instances.map(i=>i.footprint);document.querySelector('#title').textContent=presets[view]?.title||'雨町，夜未眠。';document.querySelector('#subtitle').textContent=presets[view]?.subtitle||'商店街的灯，与后巷的生活。';document.querySelector('#label').textContent=`${lots.length} BUILDINGS / ${assets.length} ASSETS`;document.querySelector('#description').textContent='双侧商店街 · 住宅后巷 · 街角生活';
  }
  const e=isAsset?11:59;Object.assign(moon.shadow.camera,{left:-e,right:e,top:isAsset?12:48,bottom:isAsset?-12:-48});moon.shadow.camera.updateProjectionMatrix();moon.position.set(isAsset?-8:-27,isAsset?22:48,isAsset?13:23);renderer.shadowMap.needsUpdate=true;
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.view===view)));collectLights();frame();lightBudget();
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
document.querySelector('#rain').addEventListener('click',()=>{wet=!wet;weather.rain.visible=weather.ripples.visible=wet;document.querySelector('#rain').textContent=wet?'雨 · 开':'雨 · 停';document.querySelector('#rain').setAttribute('aria-pressed',String(wet));});
document.querySelector('#hide').addEventListener('click',()=>document.body.classList.toggle('clean'));document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h')document.body.classList.toggle('clean');if(e.key==='Home')setView('overview');});canvas.addEventListener('dblclick',frame);canvas.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);frame();});
function exportMaterials(root){const map=new Map();let n=0;root.traverse(o=>{if(o.isLight)o.visible=false;if(!o.name)o.name=`${o.type}_${n++}`;if(o.isMesh){const old=o.material;if(old.isMeshToonMaterial){if(!map.has(old))map.set(old,new THREE.MeshStandardMaterial({color:old.color,emissive:old.emissive,emissiveIntensity:old.emissiveIntensity,roughness:.85,metalness:0,map:old.map,side:old.side,transparent:old.transparent,opacity:old.opacity,depthWrite:old.depthWrite}));o.material=map.get(old);}}});}
async function exportAsset(id){const def=byId.get(id);const root=def.build();root.name=def.name;root.userData={id,name:def.name,units:'metres',upAxis:'+Y',frontAxis:'+Z',origin:'front-centre-ground',nominalSize:[def.width,def.height,def.depth]};exportMaterials(root);const data=await new GLTFExporter().parseAsync(root,{binary:true,onlyVisible:true,maxTextureSize:1024});return data;}
async function exportDistrict(){
  const root=new THREE.Group();root.name='雨町完整街区';root.userData={units:'metres',upAxis:'+Y',instances:lots.length,uniqueAssets:assets.length,layout:lots};
  const architecture=city.clone(true);architecture.visible=true;root.add(architecture);
  street.reflection.removeFromParent();const roads=street.root.clone(true);street.root.add(street.reflection);roads.visible=true;root.add(roads);exportMaterials(root);
  return new GLTFExporter().parseAsync(root,{binary:true,onlyVisible:true,maxTextureSize:1024});
}
window.__district={ready:false,scene,camera,renderer,controls,assets,lots,instances,city,street,solo,weather,cityBatch,setView,resetCamera:frame,exportAsset,exportDistrict,get state(){return{current,wet,time,frames,buildings:lots.length,assets:assets.length,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,rainSample:Array.from(weather.rain.geometry.attributes.position.array.slice(0,12))};}};
const query=new URLSearchParams(location.search);if(query.has('clean'))document.body.classList.add('clean');setView(query.get('asset')?'asset:'+query.get('asset'):(query.get('view')||'overview'));
function tick(now){requestAnimationFrame(tick);time+=Math.min(.1,(now-last)/1000);last=now;controls.update();if(frames%45===0)lightBudget();weather.update(time,roofs,solo.visible);weather.rain.visible=wet;weather.ripples.visible=wet&&!solo.visible;street.update(time);renderer.info.reset();composer.render();frames++;if(frames===2){window.__district.ready=true;document.querySelector('#loading')?.remove();}}
requestAnimationFrame(tick);
