import fs from'node:fs';import path from'node:path';
// Readonly, deliberately bounded static gate for direct named service references.
// This is not an Apps Script runtime, consent, Marketplace or complete code audit.
const directory=path.resolve(process.argv[2]||'');if(!process.argv[2]||!fs.existsSync(path.join(directory,'appsscript.json')))throw Error('Provide an isolated snapshot folder containing appsscript.json');
const manifest=JSON.parse(fs.readFileSync(path.join(directory,'appsscript.json'),'utf8').replace(/^\uFEFF/,'')),scopes=manifest.oauthScopes;
const files=fs.readdirSync(directory).filter(n=>/\.(js|gs)$/.test(n));const needed=new Map();
for(const name of files){const text=fs.readFileSync(path.join(directory,name),'utf8');for(const[pattern,scope]of [[/\bUrlFetchApp\s*\.\s*(?:fetch|fetchAll|getRequest)\s*\(/,'https://www.googleapis.com/auth/script.external_request'],[/\bFormApp\s*\.\s*(?:openById|openByUrl|create)\s*\(/,'https://www.googleapis.com/auth/forms']]){if(pattern.test(text)){if(!needed.has(scope))needed.set(scope,[]);needed.get(scope).push(name);}}}
const explicit=Array.isArray(scopes),missing=explicit?[...needed].filter(([scope])=>!scopes.includes(scope)).map(([scope,files])=>({scope,files})):[];
console.log(JSON.stringify({scope:'Static named-service references vs explicit manifest only; no source contents, credentials or execution.',jsFiles:files.length,explicitScopes:explicit,missingDirectServiceScopes:missing,staticPermissionGatePassed:missing.length===0,runtimeAndPublicReleaseVerified:false}));if(missing.length)process.exitCode=1;
