import {chromium} from 'playwright-core';
import {existsSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const output=path.dirname(fileURLToPath(import.meta.url));
const target=process.env.SCENE_URL||'http://127.0.0.1:4196/';
const offline=target.startsWith('file:');
const report={target,offline,started:new Date().toISOString(),checks:[],pageErrors:[],consoleErrors:[],externalRequests:[],requestFailures:[],screenshots:[]};
const check=(name,pass,details)=>report.checks.push({name,pass:Boolean(pass),details});
const candidates=[process.env.BROWSER_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Microsoft/Edge/Application/msedge.exe',process.env.LOCALAPPDATA&&path.join(process.env.LOCALAPPDATA,'Google/Chrome/Application/chrome.exe')];
let browser;
try{
  await mkdir(output,{recursive:true});
  const executablePath=candidates.find(p=>p&&existsSync(p));
  if(!executablePath)throw Error('No local Chrome or Edge found; set BROWSER_PATH.');
  report.browser=executablePath;
  browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--allow-file-access-from-files','--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:1600,height:1100},deviceScaleFactor:1});
  if(offline)await context.setOffline(true);
  const page=await context.newPage();page.setDefaultTimeout(30000);
  page.on('pageerror',e=>report.pageErrors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
  page.on('requestfailed',r=>report.requestFailures.push({url:r.url(),error:r.failure()?.errorText}));
  const request=url=>{if(!/^(https?|wss?):/i.test(url))return;const host=new URL(url).hostname;if(offline||!['localhost','127.0.0.1','[::1]'].includes(host))report.externalRequests.push(url);};
  page.on('request',r=>request(r.url()));page.on('websocket',s=>request(s.url()));
  await page.goto(target,{waitUntil:'load',timeout:120000});
  await page.waitForFunction(()=>window.__district?.ready,null,{timeout:120000});
  const frames=async(n=2)=>{const start=await page.evaluate(()=>__district.state.frames);await page.waitForFunction(({start,n})=>__district.state.frames>=start+n,{start,n},{timeout:60000});};
  const camera=()=>page.evaluate(()=>({position:__district.camera.position.toArray(),target:__district.controls.target.toArray(),distance:__district.camera.position.distanceTo(__district.controls.target)}));
  const changed=(a,b)=>Math.hypot(...a.position.map((v,i)=>v-b.position[i]))>.05;
  const catalog=await page.evaluate(()=>({buildings:__district.state.buildings,assets:__district.assets.map(a=>a.id),instances:__district.instances.map(i=>({id:i.instance,asset:i.asset,bounds:{min:i.bounds.min.toArray(),max:i.bounds.max.toArray()},footprint:{min:i.footprint.min.toArray(),max:i.footprint.max.toArray()}}))}));
  check('33 placed buildings and 26 unique assets',catalog.buildings===33&&catalog.instances.length===33&&catalog.assets.length===26&&new Set(catalog.assets).size===26,{buildings:catalog.buildings,assets:catalog.assets});
  const finite=b=>[...b.min,...b.max].every(Number.isFinite)&&b.max.every((v,i)=>v-b.min[i]>.01);
  check('all source bounds and footprints are finite and nondegenerate',catalog.instances.every(i=>finite(i.bounds)&&finite(i.footprint)),catalog.instances);
  const overlap=(a,b,axis)=>Math.min(a.max[axis],b.max[axis])-Math.max(a.min[axis],b.min[axis])>1e-5;
  const overlaps=[];for(let i=0;i<catalog.instances.length;i++)for(let j=i+1;j<catalog.instances.length;j++){const a=catalog.instances[i],b=catalog.instances[j];if(overlap(a.footprint,b.footprint,0)&&overlap(a.footprint,b.footprint,2))overlaps.push([a.id,b.id]);}
  check('architectural footprints do not overlap in XZ',overlaps.length===0,overlaps);
  const intrusions=catalog.instances.filter(i=>(i.footprint.min[2]<3.4-1e-5&&i.footprint.max[2]>-3.4+1e-5)||(i.footprint.min[0]<4-1e-5&&i.footprint.max[0]>-4+1e-5)).map(i=>i.id);
  check('main street z +/-3.4 and cross street x +/-4 remain clear',intrusions.length===0,intrusions);

  await page.evaluate(()=>__district.setView('asset:'+__district.assets[0].id));await frames();
  for(const view of ['overview','shopping','junction','lane','reverse']){
    const before=await camera();await page.locator(`[data-view="${view}"]`).click();await frames();
    const after=await camera(),state=await page.evaluate(view=>({current:__district.state.current,active:document.querySelector(`[data-view="${view}"]`).getAttribute('aria-current'),city:__district.city.visible,street:__district.street.root.visible,solo:__district.solo.visible}),view);
    check(`view button ${view} switches state and camera`,state.current===view&&state.active==='true'&&state.city&&state.street&&!state.solo&&changed(before,after),{state,camera:after});
  }
  for(const id of catalog.assets){
    await page.locator('#asset').selectOption(id);await frames();
    const state=await page.evaluate(()=>{
      const d=__district,model=d.solo.children.filter(o=>o.isGroup).at(-1);d.scene.updateMatrixWorld(true);
      const b=model?d.instances[0].bounds.clone().setFromObject(model):null;
      return{current:d.state.current,selected:document.querySelector('#asset').value,city:d.city.visible,street:d.street.root.visible,solo:d.solo.visible,model:model?.name,bounds:b?{min:b.min.toArray(),max:b.max.toArray()}:null};
    });
    check(`asset selector ${id} builds an independent finite model`,state.current===`asset:${id}`&&state.selected===id&&!state.city&&!state.street&&state.solo&&state.bounds&&finite(state.bounds),state);
  }
  await page.locator('[data-view="overview"]').click();await frames();
  const beforeDrag=await camera();await page.mouse.move(1000,550);await page.mouse.down();await page.mouse.move(1140,520,{steps:8});await page.mouse.up();await frames(5);const afterDrag=await camera();
  check('pointer drag rotates the scene camera',changed(beforeDrag,afterDrag),{before:beforeDrag,after:afterDrag});
  await page.mouse.wheel(0,-380);await frames(5);const afterWheel=await camera();
  check('mouse wheel changes camera distance',Math.abs(afterWheel.distance-afterDrag.distance)>.1,{before:afterDrag.distance,after:afterWheel.distance});
  const rain=()=>page.evaluate(()=>({wet:__district.state.wet,visible:__district.weather.rain.visible,pressed:document.querySelector('#rain').getAttribute('aria-pressed'),time:__district.state.time,sample:__district.state.rainSample}));
  const initial=await rain();check('rain begins enabled with actual visible geometry',initial.wet&&initial.visible&&initial.pressed==='true',initial);
  await page.locator('#rain').click();await frames();const stopped=await rain();check('rain button hides geometry',!stopped.wet&&!stopped.visible&&stopped.pressed==='false',stopped);
  await page.locator('#rain').click();await frames();const resumed=await rain();await frames(4);const animated=await rain();
  check('rain resumes and positions animate',resumed.wet&&resumed.visible&&resumed.pressed==='true'&&animated.time>resumed.time&&animated.sample.some((v,i)=>Math.abs(v-resumed.sample[i])>1e-5),{resumed,animated});

  // Preserve the application's counting policy while observing real frames.
  const originalAutoReset=await page.evaluate(()=>{const info=__district.renderer.info,previous=info.autoReset;info.autoReset=false;info.reset();return previous;});await frames(2);
  const render=await page.evaluate(previous=>{const info=__district.renderer.info,r={...info.render,memory:{...info.memory}};info.autoReset=previous;return r;},originalAutoReset);
  check('WebGL draws substantial triangle geometry',render.triangles>1000&&render.calls>20,render);

  for(const [label,width,height] of [['desktop',1600,1100],['mobile',430,932]]){
    await page.setViewportSize({width,height});await page.evaluate(()=>__district.setView('overview'));await frames(3);
    const projected=await page.evaluate(()=>{
      const d=__district;d.scene.updateMatrixWorld(true);d.camera.updateMatrixWorld();
      const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];let pointCount=0,objects=0,invalid=0;
      // Only architecture and street entities; weather is a separate root.
      for(const root of [d.city,d.street.root])root.traverseVisible(o=>{
        if(!o.isMesh||!o.geometry?.attributes.position)return;
        const positions=o.geometry.attributes.position,vertex=d.camera.position.clone();objects++;
        // Batching can give one material a district-wide AABB whose empty
        // corners are not part of any building. Project every real vertex.
        for(let i=0;i<positions.count;i++){
          const a=vertex.fromBufferAttribute(positions,i).applyMatrix4(o.matrixWorld).project(d.camera).toArray();pointCount++;
          if(!a.every(Number.isFinite))invalid++;for(let j=0;j<3;j++){min[j]=Math.min(min[j],a[j]);max[j]=Math.max(max[j],a[j]);}
        }
      });return{objects,pointCount,invalid,min,max};
    });
    check(`${label} full district solid geometry fits screen`,projected.objects>100&&projected.pointCount>0&&projected.invalid===0&&projected.min.every(v=>v>=-1.001)&&projected.max.every(v=>v<=1.001),projected);
    const filename=`${offline?'offline-':''}${label}.png`;await page.screenshot({path:path.join(output,filename),fullPage:false});report.screenshots.push(filename);
  }
  report.finalState=await page.evaluate(()=>__district.state);
}catch(error){report.fatal={message:error.message,stack:error.stack};check('QA runner completes',false,error.message);}
finally{
  if(browser)await browser.close();
  report.externalRequests=[...new Set(report.externalRequests)];
  check('no uncaught page errors',report.pageErrors.length===0,report.pageErrors);
  check('no browser console errors',report.consoleErrors.length===0,report.consoleErrors);
  check('no failed requests',report.requestFailures.length===0,report.requestFailures);
  check(offline?'offline file requests no network resources':'scene requests no remote resources',report.externalRequests.length===0,report.externalRequests);
  report.passed=report.checks.every(c=>c.pass);report.finished=new Date().toISOString();
  await mkdir(output,{recursive:true});const filename=offline?'offline-report.json':'report.json';await writeFile(path.join(output,filename),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failed:report.checks.filter(c=>!c.pass).map(c=>c.name),report:path.join(output,filename)}));
  if(!report.passed)process.exitCode=1;
}
