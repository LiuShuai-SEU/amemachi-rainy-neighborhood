import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const result=spawnSync(process.execPath,['qa/check.mjs'],{cwd:process.cwd(),env:{...process.env,SCENE_URL:pathToFileURL(path.resolve('雨町完整街区.html')).href},stdio:'inherit'});process.exitCode=result.status??1;
