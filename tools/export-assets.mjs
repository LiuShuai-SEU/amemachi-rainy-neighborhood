import {chromium} from 'playwright-core';
import {access,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();let executablePath;for(const p of ['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'])try{await access(p);executablePath=p;break;}catch{}
const browser=await chromium.launch({executablePath,headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});const errors=[];
try{
 const page=await browser.newPage({viewport:{width:1800,height:1200},deviceScaleFactor:1});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(process.env.SCENE_URL||'http://127.0.0.1:4196/',{waitUntil:'networkidle',timeout:120000});await page.waitForFunction(()=>window.__district?.ready,{timeout:120000});await page.evaluate(()=>document.body.classList.add('clean'));await mkdir('assets',{recursive:true});await mkdir('previews',{recursive:true});
 for(const [v,n] of [['overview','00_完整街区全景'],['shopping','01_商店街视角'],['junction','02_十字路口'],['lane','03_住宅后巷'],['reverse','04_街区背面']]){await page.evaluate(v=>window.__district.setView(v),v);await page.waitForTimeout(1100);await page.screenshot({path:`previews/${n}.png`});console.log('Preview '+v);}
 if(process.argv.includes('--previews-only')){if(errors.length)throw Error(errors.join('\n'));process.exitCode=0;}else{
  const catalog=await page.evaluate(()=>window.__district.assets.map(({id,name,subtitle,width,depth,height})=>({id,name,subtitle,width,depth,height})));
  const manifest={version:'2.0.0',units:'metres',upAxis:'+Y',frontAxis:'+Z',origin:'front-centre-ground',displayElevation:.27,assets:[],lots:await page.evaluate(()=>window.__district.lots)};
  for(const [i,a] of catalog.entries()){
   await page.evaluate(id=>window.__district.setView('asset:'+id),a.id);await page.waitForTimeout(300);
   await page.screenshot({path:`previews/asset_${a.id}.png`});
   const encoded=await page.evaluate(async id=>{const b=new Uint8Array(await window.__district.exportAsset(id));let s='';for(let i=0;i<b.length;i+=16384)s+=String.fromCharCode(...b.subarray(i,i+16384));return btoa(s);},a.id);
   const buffer=Buffer.from(encoded,'base64');if(buffer.readUInt32LE(0)!==0x46546c67||buffer.readUInt32LE(8)!==buffer.length)throw Error('Bad GLB '+a.id);const json=JSON.parse(buffer.subarray(20,20+buffer.readUInt32LE(12)).toString().trim());if(json.images?.some(im=>im.uri))throw Error('External texture '+a.id);
   const file=`assets/${a.id}.glb`;await writeFile(file,buffer);manifest.assets.push({...a,file,preview:`previews/asset_${a.id}.png`,bytes:buffer.length,meshes:json.meshes.length,textures:json.textures?.length||0});console.log(`${a.id}: ${buffer.length} bytes`);
  }
  await page.evaluate(()=>window.__district.setView('overview'));const encoded=await page.evaluate(async()=>{const b=new Uint8Array(await window.__district.exportDistrict());let s='';for(let i=0;i<b.length;i+=16384)s+=String.fromCharCode(...b.subarray(i,i+16384));return btoa(s);});const district=Buffer.from(encoded,'base64');await writeFile('雨町完整街区.glb',district);manifest.combined={file:'雨町完整街区.glb',bytes:district.length};await writeFile('asset-manifest.json',JSON.stringify(manifest,null,2));console.log(`Combined district: ${district.length} bytes`);
  if(errors.length)throw Error(errors.join('\n'));
 }
}finally{await browser.close();}
