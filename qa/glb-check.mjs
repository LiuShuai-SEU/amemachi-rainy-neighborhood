import {chromium} from 'playwright-core';
import {existsSync} from 'node:fs';
import {writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const output=path.dirname(fileURLToPath(import.meta.url)),project=path.dirname(output),target='http://127.0.0.1:4196/qa/glb-check.html';
const report={target,started:new Date().toISOString(),pageErrors:[],consoleErrors:[],requestFailures:[],externalRequests:[],httpErrors:[],checks:[]};
const check=(name,pass,details)=>report.checks.push({name,pass:Boolean(pass),details});
let browser;
try{
 const manifest=JSON.parse(await readFile(path.join(project,'asset-manifest.json'),'utf8'));
 const candidates=[process.env.BROWSER_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Microsoft/Edge/Application/msedge.exe'];
 const executablePath=candidates.find(p=>p&&existsSync(p));if(!executablePath)throw Error('Local Chrome or Edge executable required');report.browser=executablePath;
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});const page=await browser.newPage({viewport:{width:1840,height:1100},deviceScaleFactor:1});
 page.on('pageerror',e=>report.pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});page.on('requestfailed',r=>report.requestFailures.push({url:r.url(),error:r.failure()?.errorText}));page.on('response',r=>{if(r.status()>=400)report.httpErrors.push({url:r.url(),status:r.status()});});page.on('request',r=>{if(/^https?:/i.test(r.url())&&new URL(r.url()).origin!==new URL(target).origin)report.externalRequests.push(r.url());});
 await page.goto(target,{waitUntil:'load',timeout:120000});
 for(let i=0;i<30;i++){
  const p=await page.evaluate(()=>window.__glbQA?{ready:window.__glbQA.ready,progress:window.__glbQA.progress,loaded:window.__glbQA.assets.length}:null);console.log(JSON.stringify({progress:p}));if(p?.ready)break;
  await page.waitForFunction(()=>window.__glbQA?.ready,null,{timeout:20000}).catch(e=>{if(!e.message.includes('Timeout'))throw e;});
 }
 report.readback=await page.evaluate(()=>window.__glbQA);const r=report.readback;if(!r?.ready)throw Error('Readback did not finish within ten minutes');
 check('All 26 unique GLB assets and combined district loaded through GLTFLoader',r.assets.length===26&&manifest.assets.every(a=>r.assets.some(x=>x.id===a.id))&&r.combined?.id==='district',{assets:r.assets.map(a=>a.id),combined:r.combined?.file});
 check('All per-asset geometry, metre scale, coordinates, metadata and texture checks pass',r.assets.every(a=>a.passed),r.assets.map(a=>({id:a.id,failed:Object.entries(a.checks).filter(([,p])=>!p).map(([n])=>n)})));
 check('Complete district preserves 33 instances and full 89 by 52 metre footprint',r.combined?.passed,{failed:Object.entries(r.combined?.checks??{}).filter(([,p])=>!p).map(([n])=>n),bounds:r.combined?.bounds,instances:r.combined?.instances.length});
 check('Manifest uses metre scale, Y up and Z front',r.manifest.units==='metres'&&r.manifest.upAxis==='+Y'&&r.manifest.frontAxis==='+Z'&&r.manifest.expectedAssets===26&&r.manifest.expectedInstances===33,r.manifest);
 check('No GLTFLoader or decoded texture resource errors',r.errors.length===0&&r.resourceErrors.length===0,{errors:r.errors,resourceErrors:r.resourceErrors});
 check('No browser errors or failed HTTP requests',report.pageErrors.length===0&&report.consoleErrors.length===0&&report.requestFailures.length===0&&report.httpErrors.length===0,{pageErrors:report.pageErrors,consoleErrors:report.consoleErrors,requestFailures:report.requestFailures,httpErrors:report.httpErrors});
 check('No external network requests or GLB image/buffer references',report.externalRequests.length===0&&[...r.assets,r.combined].filter(Boolean).every(a=>a.externalImageURIs.length===0&&a.externalBufferURIs.length===0),report.externalRequests);
 await page.locator('#district').screenshot({path:path.join(output,'glb-district-readback.png')});await page.screenshot({path:path.join(output,'glb-contact-sheet.png'),fullPage:true});report.screenshots=['qa/glb-district-readback.png','qa/glb-contact-sheet.png'];
}catch(e){report.fatal={message:e.message,stack:e.stack};}
finally{if(browser)await browser.close();report.finished=new Date().toISOString();report.passed=!report.fatal&&report.checks.length===7&&report.checks.every(c=>c.pass);await writeFile(path.join(output,'glb-report.json'),JSON.stringify(report,null,2)+'\n','utf8');console.log(JSON.stringify({passed:report.passed,assets:report.readback?.assets.length??0,failed:report.checks.filter(c=>!c.pass),fatal:report.fatal,report:path.join(output,'glb-report.json')},null,2));process.exitCode=report.passed?0:1;}
