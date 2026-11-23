const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=process.env.FORMSUITE_AUDIT_ROOT;if(!base)throw Error('Set private FORMSUITE_AUDIT_ROOT');
const html=fs.readFileSync(path.join(base,process.env.FORMSUITE_CANDIDATE_NAME||'choice-116-closeout-candidate','Sidebar.html'),'utf8');
const section=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert.ok(i>=0&&j>i);return html.slice(i,j);};
function setup(){let ok,fail;const nodes=new Map();const state={actions:[],loaded:[],stopped:0,calls:0};const runner={withSuccessHandler:fn=>(ok=fn,runner),withFailureHandler:fn=>(fail=fn,runner),getLatestPickerSelection:()=>{state.calls++;},saveConfig:()=>{state.calls++;}};
 const c=vm.createContext({google:{script:{run:runner}},document:{getElementById:id=>{if(!nodes.has(id))nodes.set(id,{value:'',checked:false,disabled:false,textContent:''});return nodes.get(id);}},Number,config:{mappings:[{}]},renderAction:(text,success)=>state.actions.push({text,success}),stopPickerPolling:()=>state.stopped++,updateFirstRunLocal:()=>{},renderSelectedSpreadsheet:()=>{},loadSheetDataWithMode:(...a)=>state.loaded.push(a),setWorkflowBusy:()=>{},showToast:()=>{},escapeHtml:s=>String(s).replaceAll('<','&lt;').replaceAll('>','&gt;')});
 return{c,state,nodes,success:v=>ok(v),failure:e=>fail(e)};
}
test('late saved Picker choice is recovered after the original poll has stopped',()=>{
 const f=setup();vm.runInContext(section('function checkSelectedSpreadsheet() {','function startPickerPolling() {'),f.c);f.c.checkSelectedSpreadsheet();assert.equal(f.state.calls,1);f.success({fileId:'own-synthetic-sheet',accessMode:'picker_drive_file'});assert.equal(f.nodes.get('sheetUrl').value,'own-synthetic-sheet');assert.deepEqual(f.state.loaded,[['own-synthetic-sheet','picker_drive_file']]);assert.equal(f.state.stopped,1);
});
test('empty or failed recovery cannot replace an existing source or clear saved selection',()=>{
 for(const mode of ['empty','error']){const f=setup();vm.runInContext(section('function checkSelectedSpreadsheet() {','function startPickerPolling() {'),f.c);f.c.selectedSpreadsheet={fileId:'keep-current'};f.c.checkSelectedSpreadsheet();mode==='empty'?f.success(null):f.failure(Error('synthetic outage'));assert.equal(f.c.selectedSpreadsheet.fileId,'keep-current');assert.equal(f.state.loaded.length,0);assert.equal(f.state.actions.at(-1).success,false);}
});
test('save failure persists an escaped actionable error beyond the temporary toast',()=>{
 const f=setup();vm.runInContext(section('function saveSettings() {','function setWorkflowBusy('),f.c);f.c.saveSettings();f.failure({message:'Pro required <test>'});assert.equal(f.state.actions.at(-1).success,false);assert.match(f.state.actions.at(-1).text,/Settings were not saved/);assert.match(f.state.actions.at(-1).text,/&lt;test&gt;/);assert.equal(f.nodes.get('saveBtn').textContent,'Save');
});
