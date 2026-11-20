const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=process.env.FORMSUITE_AUDIT_ROOT;if(!base)throw Error('Set private FORMSUITE_AUDIT_ROOT');
function fixture(name,{count=0,pro=false,locked=false}={}){
 const dir=path.join(base,name==='choice-116-closeout-candidate'?(process.env.FORMSUITE_CANDIDATE_NAME||name):name),state={writes:0,triggers:0,locks:0,released:0};
 const config={enabled:false,mappings:Array.from({length:count},(_,i)=>({questionId:String(i)})),timedUpdateHours:0};
 const data=new Map([['FORMRANGER_CONFIG',JSON.stringify(config)]]);
 const props={getProperty:k=>data.get(k)||null,setProperty:(k,v)=>{data.set(k,String(v));state.writes++;}};
 const c=vm.createContext({Date,JSON,Math,Array,String,Number,isFinite,CONFIG_KEY:'FORMRANGER_CONFIG',FREE_QUESTION_LIMIT:3,
 csDocumentProperties_:()=>props,csCheckRequestedAutomation_:()=>{},csWithStateLock_:fn=>{state.locks++;if(locked)throw Error('Busy');try{return fn();}finally{state.released++;}},
 logFormRangerEvent_:()=>{},recordFirstRunMilestone_:()=>{},classifyFormRangerError_:()=>'',classifyFormRangerErrorForStage_:()=>'',bucketTelemetryCount_:()=>'',bucketTelemetryDuration_:()=>''});
 vm.runInContext(fs.readFileSync(path.join(dir,'LicenseManager.js'),'utf8'),c);
 vm.runInContext(fs.readFileSync(path.join(dir,'ConfigManager.js'),'utf8'),c);
 c.getLicenseStatus=()=>({isPro:pro,message:''});c.checkQuota=()=>({used:0,limit:pro?-1:100,remaining:pro?-1:100});c.syncChangedTriggers_=()=>{state.triggers++;};
 return{c,state,data,config,next:n=>({enabled:false,mappings:Array.from({length:n},(_,i)=>({questionId:String(i)})),timedUpdateHours:0})};
}
test('immutable116 reproduces the Free Unlimited display; corrected candidate reports3',()=>{
 assert.equal(fixture('choice-116').c.getQuotaInfo().mappingLimit,-1);
 const f=fixture('choice-116-closeout-candidate');assert.equal(f.c.getQuotaInfo().mappingLimit,3);assert.equal(f.c.getQuotaInfo().plan,'Free');assert.equal(f.c.getQuotaInfo().syncsLimit,100);
});
test('direct bulk-save cannot create fourth Free link or touch triggers/storage',()=>{
 const f=fixture('choice-116-closeout-candidate',{count:3});assert.throws(()=>f.c.saveConfig(f.next(4)),/Free supports up to 3/);assert.equal(f.state.writes,0);assert.equal(f.state.triggers,0);assert.equal(f.state.released,1);
});
test('Free can keep three mappings and remove one',()=>{
 const f=fixture('choice-116-closeout-candidate',{count:3});assert.equal(f.c.saveConfig(f.next(3)).success,true);assert.equal(f.c.saveConfig(f.next(2)).success,true);assert.equal(JSON.parse(f.data.get('FORMRANGER_CONFIG')).mappings.length,2);
});
test('old four-link configuration is retained and can be disabled but cannot grow',()=>{
 const f=fixture('choice-116-closeout-candidate',{count:4});assert.equal(f.c.saveConfig(f.next(4)).success,true);assert.throws(()=>f.c.saveConfig(f.next(5)),/Free supports up to 3/);assert.equal(JSON.parse(f.data.get('FORMRANGER_CONFIG')).mappings.length,4);
});
test('verified Pro can bulk-save additional links and shows unlimited',()=>{
 const f=fixture('choice-116-closeout-candidate',{pro:true});assert.equal(f.c.getQuotaInfo().mappingLimit,-1);assert.equal(f.c.saveConfig(f.next(5)).success,true);
});
test('single-link add is rejected at three before metadata work and retains existing config',()=>{
 const f=fixture('choice-116-closeout-candidate',{count:3});const mapping={questionId:'fourth',questionTitle:'Fourth',spreadsheetId:'synthetic',sheetName:'Source',columnName:'Choice'};assert.throws(()=>f.c.addMapping(mapping),/up to 3 linked/);assert.equal(f.state.writes,0);assert.equal(f.state.released,1);
});
test('lock contention prevents add/remove/bulk mutation',()=>{
 const f=fixture('choice-116-closeout-candidate',{count:3,locked:true});for(const fn of [()=>f.c.addMapping({}),()=>f.c.removeMapping(0),()=>f.c.saveConfig(f.next(0))])assert.throws(fn,/Busy/);assert.equal(f.state.writes,0);
});
test('malformed bulk mappings cannot erase or bypass the stored list',()=>{
 const f=fixture('choice-116-closeout-candidate',{count:3});assert.throws(()=>f.c.saveConfig({enabled:false,mappings:{length:0}}),/Invalid mappings/);assert.equal(f.state.writes,0);
});
