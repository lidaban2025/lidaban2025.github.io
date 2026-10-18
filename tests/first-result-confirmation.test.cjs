const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
test('result confirmation requires every check and sends only the result label and product',()=>{
 const checks=[{checked:false},{checked:false},{checked:false}],handlers={},sent=[];
 const button={disabled:true,addEventListener:(n,fn)=>handlers[n]=fn},status={};
 const section={querySelector:s=>s==='button'?button:status,querySelectorAll:()=>checks,addEventListener:(n,fn)=>handlers[n]=fn,getAttribute:k=>k==='data-product'?'FormFlow':'formflow_sheet_approved_confirmed'};
 const c=vm.createContext({document:{querySelectorAll:()=>[section]},window:{FormSuiteTrack:{event:(...v)=>sent.push(v)}}});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../first-result-confirmation.js'),'utf8'),c);
 handlers.click();assert.equal(sent.length,0);checks[0].checked=true;handlers.change();assert.equal(button.disabled,true);
 checks.forEach(c=>c.checked=true);handlers.change();assert.equal(button.disabled,false);handlers.click();
 assert.deepEqual(JSON.parse(JSON.stringify(sent)),[['formflow_sheet_approved_confirmed',{product:'FormFlow',source:'self_reported_copied_form_test'}]]);
 assert.equal(button.hidden,true);assert.match(status.textContent,/not an independent/);
});
