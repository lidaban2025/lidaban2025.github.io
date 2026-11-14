// Creates a local audit candidate from privately obtained immutable snapshots.
// Snapshots may contain sensitive values; this copies them without printing,
// publishing, or deploying them. Keep both input and output out of Git.
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.FORMFLOW_AUDIT_ROOT;
if (!base) throw Error('Set FORMFLOW_AUDIT_ROOT to the isolated audit directory');
const source = path.join(base, 'formflow-84');
const destination = path.join(base, 'formflow-84-local-candidate');
fs.mkdirSync(destination, {recursive:true});
const allowed = new Set(fs.readdirSync(source).filter(name => name !== '.clasp.json' && /\.(js|html|json)$/.test(name)));
allowed.add('OnlineLicenseStatus.js');
if (fs.readdirSync(destination).some(name => !allowed.has(name))) throw Error('Unexpected file in candidate directory');
for (const name of fs.readdirSync(source)) {
  if (name === '.clasp.json' || !/\.(js|html|json)$/.test(name)) continue;
  fs.copyFileSync(path.join(source,name),path.join(destination,name));
}
fs.copyFileSync(path.join(base,'choice-116','OnlineLicenseStatus.js'),path.join(destination,'OnlineLicenseStatus.js'));
const manifestPath=path.join(destination,'appsscript.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8').replace(/^\uFEFF/,''));
const scope='https://www.googleapis.com/auth/script.external_request';
if (!manifest.oauthScopes.includes(scope)) manifest.oauthScopes.push(scope);
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
const codePath=path.join(destination,'Code.js');
let code=fs.readFileSync(codePath,'utf8');
const start=/function onFormSubmitHandler\(e\) \{\r?\n  try \{/;
const end=/    saveFormFlowReport_\(false, \[err\.message\]\);\r?\n  \}\r?\n\}/;
if (!start.test(code) || !end.test(code)) throw Error('Unexpected submit handler; candidate not ready');
code=code.replace(start,'function onFormSubmitHandler(e) {\n  LC_BACKGROUND_LICENSE_CONTEXT = true;\n  try {');
code=code.replace(end,'    saveFormFlowReport_(false, [err.message]);\n  } finally {\n    LC_BACKGROUND_LICENSE_CONTEXT = false;\n  }\n}');
fs.writeFileSync(codePath,code);
// A failed usage read is not evidence of zero usage. Fail closed before
// creating an approval; this does not delete the original Google response.
// Automatic retry requires separate response-to-row correlation and is NOT
// implemented by this candidate.
const usagePath=path.join(destination,'UsageManager.js');
let usage=fs.readFileSync(usagePath,'utf8');
const unsafe='try { usage = getMonthlyCount(getOrCreateResponseSheet()); } catch (e) {}';
if (!usage.includes(unsafe)) throw Error('Unexpected quota read; candidate not ready');
usage=usage.replace(unsafe,"try { usage = getMonthlyCount(getOrCreateResponseSheet()); } catch (e) { return {allowed:false,isPro:false,reason:'USAGE_UNAVAILABLE',usage:null,limit:FF_FREE_RUNS_PER_MONTH,message:'Usage could not be checked. Approval was not sent; check the Google Form responses and contact support.'}; }");
fs.writeFileSync(usagePath,usage);
const enginePath=path.join(destination,'ApprovalEngine.js');
let engine=fs.readFileSync(enginePath,'utf8');
const gate='  if (!availability.allowed) {';
if (!engine.includes(gate)) throw Error('Unexpected submission gate; candidate not ready');
engine=engine.replace(gate,"  if (!availability.allowed && availability.reason === 'USAGE_UNAVAILABLE') throw new Error('Approval was not sent because usage could not be checked. Check the Google Form responses and contact support.');\n"+gate);
fs.writeFileSync(enginePath,engine);
console.log('Local audit candidate prepared; no deployment performed.');
