const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=process.env.FORMFLOW_AUDIT_ROOT;if(!root)throw Error('Private immutable snapshots required');
const helper=fs.readFileSync(path.join(__dirname,'../scripts/formflow-candidate/LegacyConfigPacking.js'),'utf8');
const plain=v=>JSON.parse(JSON.stringify(v));
function fixture(initial={}){
 const values={...initial},state={releases:0,writes:[]};
 const props={getProperty:k=>values[k]||null,getProperties:()=>({...values}),setProperty:(k,v)=>{state.writes.push(k);values[k]=v;}};
 const c=vm.createContext({Object,JSON,Number,Math,Array,PropertiesService:{getScriptProperties:()=>props},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>state.releases++})},Utilities:{newBlob:s=>({getBytes:()=>Buffer.from(s,'utf8')})},APPROVAL_CONFIG_PREFIX:'FORMFLOW_APPROVAL_CONFIG_'});
 vm.runInContext(helper,c);return {c,values,state,props};
}
function full(){return {enabled:true,levels:[{level:1,name:'Owned reviewer',approvers:['reviewer@example.invalid'],requireAll:true}],emailTemplate:{subject:'Approval Required: {{formTitle}} - {{submitterEmail}}',approveButtonText:'Approve',rejectButtonText:'Reject'},notifications:{notifySubmitterOnApprove:true,notifySubmitterOnReject:true,notifySubmitterOnPending:true},options:{requireComment:false,autoExpireDays:0,statusColumn:'Approval Status',commentsColumn:'Approval Comments'},unknown:{retained:'exactly'}};}
test('packing keeps every original JSON field recoverable with a frozen dictionary',()=>{
 const {c}=fixture(),original=full(),raw=JSON.stringify(original),packed=c.ffPackRuntimeConfigJSON_(raw);
 assert.ok(Buffer.byteLength(packed)<Buffer.byteLength(raw));assert.deepEqual(JSON.parse(c.ffUnpackRuntimeConfigJSON_(packed)),original);
 original.emailTemplate.subject='Custom';original.options.requireComment=true;original.options.autoExpireDays=14;original.notifications.notifySubmitterOnPending=false;original.options.extension='preserved';
 assert.deepEqual(JSON.parse(c.ffUnpackRuntimeConfigJSON_(c.ffPackRuntimeConfigJSON_(JSON.stringify(original)))),original);
});
test('absent, null, numeric-string and unknown fields are preserved exactly',()=>{
 const {c}=fixture();for(const extra of [{emailTemplate:{},notifications:null,options:{autoExpireDays:'0'}},{emailTemplate:{subject:null,approveButtonText:'Go'},options:{unknown:[false,0,null]}}]){
  const object={...full(),...extra};assert.deepEqual(JSON.parse(c.ffUnpackRuntimeConfigJSON_(c.ffPackRuntimeConfigJSON_(JSON.stringify(object)))),object);
 }
});
test('all immutable deployed readers retain their existing interpretation',()=>{
 const {c}=fixture();for(const version of [14,16,18,20,22,24,26,28,30,32,34,38,40,56,70,83,84]){
  const source=fs.readFileSync(path.join(root,'formflow-'+version,'ConfigManager.js'),'utf8');let stored;
  const old=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:()=>stored}),getDocumentProperties:()=>({getProperty:()=>null})},Logger:{log:()=>{}}});vm.runInContext(source,old);
  for(const value of [full(),{...full(),notifications:{notifySubmitterOnPending:false},emailTemplate:{subject:'Custom review',approveButtonText:'Approve',rejectButtonText:'Reject'}}]){
   const raw=JSON.stringify(value),packed=c.ffPackRuntimeConfigJSON_(raw);
   assert.deepEqual(plain(old.mergeConfigWithDefaults_(JSON.parse(packed))),plain(old.mergeConfigWithDefaults_(JSON.parse(raw))),'reader '+version);
   if(typeof old.getApprovalRuntimeConfig_==='function'){stored=raw;const before=plain(old.getApprovalRuntimeConfig_('synthetic'));stored=packed;assert.deepEqual(plain(old.getApprovalRuntimeConfig_('synthetic')),before,'runtime reader '+version);}
  }
 }
});
test('dry planning writes nothing; applying touches only eligible config values',()=>{
 const configKey='FORMFLOW_APPROVAL_CONFIG_synthetic';const initial={[configKey]:JSON.stringify(full()),FORMFLOW_APPROVAL_TOKEN_opaque:'unchanged-token',FORMFLOW_APPROVAL_DECISION_pending:'unchanged-decision',FORMFLOW_APPROVAL_SNAPSHOT_pending:'unchanged-history',LICENSE_SECRET:'synthetic-secret'};
 const {c,values,state}=fixture(initial);const plan=c.ffPlanRuntimeConfigPacking_();assert.equal(plan.configurations,1);assert.equal(state.writes.length,0);assert.deepEqual(values,initial);
 const result=c.ffApplyRuntimeConfigPacking_();assert.equal(result.applied,1);assert.ok(result.savedBytes>0);assert.deepEqual(state.writes,[configKey]);assert.equal(state.releases,1);
 for(const key of Object.keys(initial).filter(k=>k!==configKey))assert.equal(values[key],initial[key]);
 assert.deepEqual(JSON.parse(c.ffUnpackRuntimeConfigJSON_(values[configKey])),full());assert.equal(c.ffApplyRuntimeConfigPacking_().applied,0);
});
test('busy storage never writes and a failed update releases the lock without changing originals',()=>{
 const {c,values,state,props}=fixture({FORMFLOW_APPROVAL_CONFIG_synthetic:JSON.stringify(full())});const original={...values};
 c.LockService.getScriptLock=()=>({tryLock:()=>false,releaseLock:()=>assert.fail()});assert.throws(()=>c.ffApplyRuntimeConfigPacking_(),/Another approval/);assert.equal(state.writes.length,0);
 c.LockService.getScriptLock=()=>({tryLock:()=>true,releaseLock:()=>state.releases++});props.setProperty=()=>{throw Error('synthetic quota')};assert.throws(()=>c.ffApplyRuntimeConfigPacking_(),/quota/);assert.deepEqual(values,original);assert.equal(state.releases,1);
});
test('unsupported or already packed records are left alone; malformed masks fail closed',()=>{
 const {c}=fixture();for(const raw of ['bad','null','[]','{}',JSON.stringify({levels:[{}],sharedConfig:'legacy-ref'}),JSON.stringify({levels:[{}],__ffPackedDefaultsV1:3})])assert.equal(c.ffPackRuntimeConfigJSON_(raw),raw);
 for(const mask of [0,-1,1024,'1',1.5])assert.throws(()=>c.ffUnpackRuntimeConfigJSON_(JSON.stringify({levels:[{}],__ffPackedDefaultsV1:mask})),/invalid/);
 assert.throws(()=>c.ffUnpackRuntimeConfigJSON_(JSON.stringify({emailTemplate:{subject:'conflict'},__ffPackedDefaultsV1:1})),/conflicting/);
});
test('new readers restore frozen values even after application defaults change',()=>{
 const f=fixture(),c=f.c;const p=path.join(root,process.env.FORMFLOW_CANDIDATE_NAME||'formflow-storage-candidate','ConfigManager.js');vm.runInContext(fs.readFileSync(p,'utf8'),c);
 f.values.FORMFLOW_APPROVAL_CONFIG_synthetic=c.ffPackRuntimeConfigJSON_(JSON.stringify(full()));
 const defaults=c.getDefaultConfig();c.getDefaultConfig=()=>({...defaults,emailTemplate:{subject:'Changed',approveButtonText:'Continue',rejectButtonText:'Decline'},options:{statusColumn:'Changed status',commentsColumn:'Changed notes'}});
 const decoded=c.getApprovalRuntimeConfig_('synthetic');assert.equal(decoded.emailTemplate.approveButtonText,'Approve');assert.equal(decoded.emailTemplate.subject,full().emailTemplate.subject);assert.equal(decoded.options.statusColumn,'Approval Status');
 c.getConfig=()=>assert.fail('Do not borrow another form configuration');f.values.FORMFLOW_APPROVAL_CONFIG_synthetic=JSON.stringify({__ffPackedDefaultsV1:0});assert.throws(()=>c.getApprovalRuntimeConfig_('synthetic'),/invalid/);
});
test('a concurrently changed record is skipped instead of overwritten',()=>{
 const f=fixture({FORMFLOW_APPROVAL_CONFIG_synthetic:JSON.stringify(full())});f.props.getProperty=()=>JSON.stringify({...full(),enabled:false});
 const result=f.c.ffApplyRuntimeConfigPacking_();assert.equal(result.skipped,1);assert.equal(result.applied,0);assert.equal(f.state.writes.length,0);
});
