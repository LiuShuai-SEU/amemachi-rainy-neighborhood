import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const html=await readFile('dist/index.html','utf8');const script=html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)?.[1],style=html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)?.[1];if(!script||!style)throw Error('Bundled resources missing');
const js=await readFile('dist/'+script.replace(/^\//,''),'utf8'),css=await readFile('dist/'+style.replace(/^\//,''),'utf8');const portable=html.replace(/<script[^>]+src="[^"]+"[^>]*><\/script>/,()=>`<script type="module">${js.replaceAll('</script','<\\/script')}</script>`).replace(/<link[^>]+href="[^"]+\.css"[^>]*>/,()=>`<style>${css}</style>`);const license=await readFile(fileURLToPath(new URL('../LICENSE',import.meta.resolve('three'))),'utf8');
await writeFile('雨町完整街区.html','<!-- Three.js MIT\n'+license+'\n-->\n'+portable);await writeFile('THIRD_PARTY_LICENSES.txt','Three.js MIT\n'+license);console.log('Built portable 雨町完整街区.html');
