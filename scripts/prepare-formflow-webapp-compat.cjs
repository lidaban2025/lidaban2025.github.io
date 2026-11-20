// Prepare a narrow approval-Web-App repair without adding OAuth scopes.
const fs=require('node:fs'),path=require('node:path');
const root=process.env.FORMFLOW_AUDIT_ROOT;if(!root)throw Error('Private audit root required');
const base=path.join(root,'formflow-84'),candidate=path.join(root,'formflow-storage-candidate'),out=path.join(root,'formflow-webapp-compat');
if(fs.existsSync(out))throw Error('Compatibility output already exists; inspect before replacing');fs.mkdirSync(out);
for(const n of fs.readdirSync(base))if(/\.(js|html|json)$/.test(n))fs.copyFileSync(path.join(base,n),path.join(out,n));
for(const n of ['SheetWriteSafety.js','LegacyConfigPacking.js'])fs.copyFileSync(path.join(candidate,n),path.join(out,n));
const sheetPath=path.join(out,'SheetManager.js');let sheet=fs.readFileSync(sheetPath,'utf8');
const a=sheet.indexOf('function writeApprovalRecord(sheet, rowIndex, data) {'),b=sheet.indexOf('function findRowByApprovalId(',a);if(a<0||b<0)throw Error('Metadata writer boundary missing');
sheet=sheet.slice(0,a)+'function writeApprovalRecord(sheet, rowIndex, data) {\n  return ffWriteApprovalMetadata_(sheet,rowIndex,data);\n}\n\n'+sheet.slice(b);fs.writeFileSync(sheetPath,sheet);
const configPath=path.join(out,'ConfigManager.js');let config=fs.readFileSync(configPath,'utf8'),reader=fs.readFileSync(path.join(candidate,'ConfigManager.js'),'utf8');
const signature='function getApprovalRuntimeConfig_(approvalId) {',next='function getApprovalSheetLocator_';
const x=config.indexOf(signature),y=config.indexOf(next,x),i=reader.indexOf(signature),j=reader.indexOf(next,i);if([x,y,i,j].some(n=>n<0))throw Error('Reader boundary missing');
config=config.slice(0,x)+reader.slice(i,j)+config.slice(y);fs.writeFileSync(configPath,config);
const manifest=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
if(JSON.stringify(manifest(path.join(base,'appsscript.json')))!==JSON.stringify(manifest(path.join(out,'appsscript.json'))))throw Error('OAuth manifest changed');
console.log('Prepared private compatibility candidate; manifest unchanged, no upload or deployment.');
