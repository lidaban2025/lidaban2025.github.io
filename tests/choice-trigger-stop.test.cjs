const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=process.env.FORMSUITE_AUDIT_ROOT;if(!base)throw Error('Private audit root required');
const root=path.join(base,process.env.FORMSUITE_CANDIDATE_NAME||'choice-release-clean');
function fixture(previous){
 const saved=new Map([['FORMRANGER_CONFIG',JSON.stringify(previous)]]),user=new Map();let writes=0;
 const props=store=>({getProperty:k=>store.get(k)||null,setProperty:(k,v)=>{store.set(k,String(v));writes++;},getProperties:()=>Object.fromEntries(store),deleteProperty:k=>store.delete(k)});
 const form={getId:()=> 'own-form'};
 const c=vm.createContext({Date,JSON,Object,Array,String,Number,Math,isFinite,FormApp:{getActiveForm:()=>form},PropertiesService:{getUserProperties:()=>props(user),getDocumentProperties:()=>props(saved)}});
 for(const file of ['AutomationContext.js','Code.js','ConfigManager.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c);
 c.csCheckRequestedAutomation_=()=>{};c.getLicenseStatus=()=>({isPro:true});c.logFormRangerEvent_=()=>{};c.runPreflightChecks=()=>({ok:true});c.classifyFormRangerErrorForStage_=()=> 'test_service_unavailable';c.bucketTelemetryCount_=()=> 'bounded';c.bucketTelemetryDuration_=()=> 'bounded';c.LC_BACKGROUND_LICENSE_CONTEXT=false;
 return {c,saved,user,form,writes:()=>writes};
}
test('Google cleanup failure persists Off first and returns a visible warning without discarding links',()=>{
 const f=fixture({enabled:true,mappings:[{questionId:'one'}],timedUpdateHours:6,autoUpdateOnOpen:false});
 f.c.syncChangedTriggers_=()=>{assert.equal(JSON.parse(f.saved.get('FORMRANGER_CONFIG')).timedUpdateHours,0);throw Error('Google enumeration failed');};
 const result=f.c.saveConfig({enabled:true,mappings:[{questionId:'one'}],timedUpdateHours:0,autoUpdateOnOpen:false});
 assert.equal(result.success,true);assert.match(result.warning,/Automatic updates are off/);assert.equal(JSON.parse(f.saved.get('FORMRANGER_CONFIG')).mappings.length,1);
});
test('failed enable does not persist a requested live schedule',()=>{
 const f=fixture({enabled:false,mappings:[],timedUpdateHours:0});f.c.csFeatureAuthorization_=()=>null;f.c.syncChangedTriggers_=()=>{throw Error('Google create failed');};
 assert.throws(()=>f.c.saveConfig({enabled:true,mappings:[{questionId:'one'}],timedUpdateHours:6}),/Google create failed/);assert.equal(JSON.parse(f.saved.get('FORMRANGER_CONFIG')).timedUpdateHours,0);
});
test('a queued clock observes the stored Off setting and cannot update the form',()=>{
 const f=fixture({enabled:true,mappings:[{questionId:'one'}],timedUpdateHours:0});let updates=0;f.c.updateAllMappings=()=>updates++;f.c.onTimedUpdate({});assert.equal(updates,0);
});
test('time matching uses project clocks plus saved ownership and never the broken form enumeration',()=>{
 const f=fixture({});f.user.set('CS_TIMED_CONTEXTS',JSON.stringify({one:{formId:'own-form'},two:{formId:'other-form'}}));
 const make=(id,handler='onTimedUpdate')=>({getUniqueId:()=>id,getHandlerFunction:()=>handler});const one=make('one');
 f.c.ScriptApp={getUserTriggers:()=>{throw Error('Broken form enumeration must not be called');},getProjectTriggers:()=>[one,make('two'),make('unknown'),make('one','other-handler')]};
 assert.equal(f.c.csMatchingTimedTriggers_(f.form).length,1);assert.equal(f.c.csMatchingTimedTriggers_(f.form)[0],one);
});
test('open matching cannot remove another form trigger or an unattributable trigger',()=>{
 const f=fixture({});const one={getHandlerFunction:()=> 'onFormOpenAutoUpdate',getTriggerSourceId:()=> 'own-form'};
 f.c.ScriptApp={getProjectTriggers:()=>[one,{getHandlerFunction:()=> 'onFormOpenAutoUpdate',getTriggerSourceId:()=> 'other-form'},{getHandlerFunction:()=> 'onFormOpenAutoUpdate'}]};
 assert.equal(f.c.csMatchingOpenTriggers_(f.form).length,1);assert.equal(f.c.csMatchingOpenTriggers_(f.form)[0],one);
});
