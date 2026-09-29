import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
export { THREE };
const materials = new Map();
// The first half covers N dot L < 0. Keep it dark to prevent interior lights
// from painting circular halos on the back faces of opaque roofs.
const gradient = new THREE.DataTexture(new Uint8Array([0,0,218,255]),4,1,THREE.RedFormat);
gradient.minFilter=gradient.magFilter=THREE.NearestFilter; gradient.needsUpdate=true;
export function mat(color,opts={}) {
  const key=JSON.stringify([color,opts]); if(materials.has(key))return materials.get(key);
  let m;
  if(opts.basic)m=new THREE.MeshBasicMaterial({color,transparent:opts.opacity!==undefined,opacity:opts.opacity??1,side:opts.double?THREE.DoubleSide:THREE.FrontSide,depthWrite:opts.depthWrite??true});
  else m=new THREE.MeshToonMaterial({color,gradientMap:gradient,emissive:opts.emissive??0,emissiveIntensity:opts.intensity??1,transparent:opts.opacity!==undefined,opacity:opts.opacity??1,side:opts.double?THREE.DoubleSide:THREE.FrontSide,depthWrite:opts.depthWrite??true});
  materials.set(key,m);return m;
}
const edgeMat=new THREE.LineBasicMaterial({color:0x293e49});
export function mesh(parent,g,x,y,z,color,opts={}){
 const m=new THREE.Mesh(g,opts.material??mat(color,opts));m.position.set(x,y,z);m.castShadow=opts.shadow!==false;m.receiveShadow=true;if(opts.rot)m.rotation.set(...opts.rot);parent.add(m);
 if(opts.edge){const e=new THREE.LineSegments(new THREE.EdgesGeometry(g,25),edgeMat);m.add(e);}return m;
}
export function box(p,x,y,z,w,h,d,c,o={}){return mesh(p,new THREE.BoxGeometry(w,h,d),x,y,z,c,o)}
export function cyl(p,x,y,z,r,h,c,o={}){return mesh(p,new THREE.CylinderGeometry(o.top??r,r,h,o.segments??12),x,y,z,c,o)}
export function sphere(p,x,y,z,r,c,o={}){return mesh(p,new THREE.SphereGeometry(r,12,8),x,y,z,c,o)}
export function torus(p,x,y,z,r,t,c,o={}){return mesh(p,new THREE.TorusGeometry(r,t,6,32),x,y,z,c,o)}
export function rod(p,a,b,r,c,o={}){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b);const m=cyl(p,...va.clone().add(vb).multiplyScalar(.5).toArray(),r,va.distanceTo(vb),c,o);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vb.sub(va).normalize());return m;}
export function curve(p,points,r,c,o={}){const path=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));return mesh(p,new THREE.TubeGeometry(path,32,r,6,false),0,0,0,c,o)}
export function text(p,str,x,y,z,w,h,opts={}){
 const canvas=document.createElement('canvas');canvas.width=opts.width??1024;canvas.height=Math.round(canvas.width*h/w);const ctx=canvas.getContext('2d');
 if(opts.bg){ctx.fillStyle=opts.bg;ctx.fillRect(0,0,canvas.width,canvas.height);}ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=opts.color??'#f7efd0';ctx.font=`${opts.weight??700} ${canvas.height*(opts.scale??.64)}px "Yu Gothic", "Meiryo", sans-serif`;ctx.fillText(str,canvas.width/2,canvas.height*.51,canvas.width*.94);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide,depthWrite:false,toneMapped:false});const m=mesh(p,new THREE.PlaneGeometry(w,h),x,y,z,0,{material,shadow:false});if(opts.ry)m.rotation.y=opts.ry; if(opts.rx)m.rotation.x=opts.rx;return m;
}
export function panel(p,x,y,z,w,h,color,opts={}){return mesh(p,new THREE.PlaneGeometry(w,h),x,y,z,color,{...opts,basic:true,double:true,shadow:false})}
export function point(p,color,intensity,x,y,z,distance=9){const l=new THREE.PointLight(color,intensity,distance,2);l.position.set(x,y,z);p.add(l);return l;}
export function seeded(seed=123){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}}
export function batchStatic(root){
 root.updateMatrixWorld(true);const groups=new Map();const remove=[];
 root.traverse(o=>{if(!(o.isMesh||o.isLineSegments)||Array.isArray(o.material)||o.material.transparent)return;let q=o;while(q){if(q.userData.dynamic)return;q=q.parent;}if(o.isMesh&&o.geometry.attributes.position.count>10000)return;const key=o.type+o.material.uuid;let list=groups.get(key);if(!list)groups.set(key,list={objects:[],material:o.material,line:o.isLineSegments});list.objects.push(o);});
 for(const list of groups.values()){if(list.objects.length<3)continue;const gs=list.objects.map(o=>{const g=o.geometry.clone();g.applyMatrix4(o.matrixWorld);return g;});const g=mergeGeometries(gs,false);gs.forEach(x=>x.dispose());if(!g)continue;const m=list.line?new THREE.LineSegments(g,list.material):new THREE.Mesh(g,list.material);m.castShadow=!list.line;m.receiveShadow=true;m.name='batched_'+list.objects.length;root.add(m);remove.push(...list.objects);}
 // Detach children first, so a batched parent cannot take an unbatched outline with it.
 for(const o of remove){for(const c of [...o.children]){root.attach(c);}o.removeFromParent();}
 return {batches:groups.size,objects:remove.length};
}
