const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=process.env.FORMFLOW_AUDIT_ROOT;if(!root)throw Error('Private audit root required');const base=path.join(root,'formflow-84'),out=path.join(root,'formflow-webapp-compat');
const read=(folder,n)=>fs.readFileSync(path.join(folder,n),'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').trimEnd();
test('public approval repair preserves the exact existing manifest and all unrelated source files',()=>{
 assert.deepEqual(JSON.parse(read(out,'appsscript.json')),JSON.parse(read(base,'appsscript.json')));
 assert.equal(JSON.parse(read(out,'appsscript.json')).oauthScopes.length,7);
 for(const n of fs.readdirSync(base).filter(n=>n!=='.clasp.json'&&/\.(js|html|json)$/.test(n)&&!['SheetManager.js','ConfigManager.js'].includes(n)))assert.equal(read(out,n),read(base,n),n);
 assert.deepEqual(fs.readdirSync(out).filter(n=>n!=='.clasp.json'&&!fs.existsSync(path.join(base,n))).sort(),['LegacyConfigPacking.js','SheetWriteSafety.js']);
});
test('the actual approval Web App writer updates only its status cell',()=>{
 const requests=[];const c=vm.createContext({Number,Object,String,Sheets:{Spreadsheets:{Values:{batchUpdate:(body,id)=>requests.push({body,id})}}}});
 for(const n of ['SheetManager.js','SheetWriteSafety.js'])vm.runInContext(read(out,n),c);
 const headers=['Timestamp','Owned QA answer',...c.APPROVAL_COLUMNS];
 const sheet={spreadsheetId:'synthetic',sheetName:'Form Responses 1',getLastColumn:()=>headers.length,getRange:(...args)=>{assert.deepEqual(args,[1,1,1,headers.length]);return {getValues:()=>[headers]};}};
 c.writeApprovalRecord(sheet,2,{'Approval Status':'Approved'});
 assert.deepEqual(JSON.parse(JSON.stringify(requests)),[{id:'synthetic',body:{valueInputOption:'RAW',data:[{range:"'Form Responses 1'!D2:D2",values:[['Approved']]}]}}]);
});
