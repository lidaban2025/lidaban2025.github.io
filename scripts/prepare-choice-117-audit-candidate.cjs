// Local comparison candidate only. Snapshot files can contain sensitive data:
// keep both snapshots and output out of Git; this script does not deploy.
const fs=require('node:fs'),path=require('node:path');
const base=process.env.FORMSUITE_AUDIT_ROOT;
if(!base) throw Error('Set FORMSUITE_AUDIT_ROOT to the private audit directory');
const old=path.join(base,'choice-116'),source=path.join(base,'choice-117'),dest=path.join(base,'choice-117-local-candidate');
fs.mkdirSync(dest,{recursive:true});
const names=fs.readdirSync(source).filter(n=>n!=='.clasp.json' && /\.(js|html|json)$/.test(n));
const allowed=new Set(names);
if(fs.readdirSync(dest).some(n=>!allowed.has(n))) throw Error('Unexpected file in candidate directory');
for(const n of names) fs.copyFileSync(path.join(source,n),path.join(dest,n));
const manifestPath=path.join(dest,'appsscript.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8').replace(/^\uFEFF/,''));
manifest.oauthScopes=manifest.oauthScopes.filter(s=>s!=='https://www.googleapis.com/auth/forms.currentonly');
for(const scope of ['https://www.googleapis.com/auth/forms','https://www.googleapis.com/auth/script.external_request']) if(!manifest.oauthScopes.includes(scope)) manifest.oauthScopes.push(scope);
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
const file=path.join(dest,'Code.js'), older=fs.readFileSync(path.join(old,'Code.js'),'utf8'), newer=fs.readFileSync(file,'utf8');
const matchOld=older.match(/function onTimedUpdate\(e\) \{[\s\S]*$/);
const matchNew=newer.match(/function onTimedUpdate\(\) \{[\s\S]*$/);
if(!matchOld || !matchNew) throw Error('Unexpected timer function; no candidate ready');
fs.writeFileSync(file,newer.slice(0,matchNew.index)+matchOld[0]);
console.log('Local audit candidate prepared; no deployment performed.');
