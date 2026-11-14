const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'), path=require('node:path'), vm=require('node:vm'), crypto=require('node:crypto');
const base=process.env.FORMFLOW_AUDIT_ROOT; if (!base) throw Error('Set FORMFLOW_AUDIT_ROOT to the isolated immutable snapshots and candidate');
const secret='synthetic-local-key', email='buyer@example.invalid';
function fixture(name) {
  const root=path.join(base,name), user=new Map(), script=new Map([['LICENSE_SECRET',secret],['LICENSE_PREFIX','FF']]);
  const props=m=>({getProperty:k=>m.get(k)||null,setProperty:(k,v)=>m.set(k,String(v)),deleteProperty:k=>m.delete(k)});
  const state={status:'active',network:true,usage:0};
  const c=vm.createContext({Date,JSON,String,Number,Math,Array,isNaN,isFinite,
    PROPS:{LICENSE_KEY:'key',LICENSE_PLAN:'plan',LICENSE_VALID_UNTIL:'until',LICENSE_EMAIL:'email'},
    PropertiesService:{getScriptProperties:()=>props(script),getUserProperties:()=>props(user)},
    Session:{getActiveUser:()=>({getEmail:()=>email}),getEffectiveUser:()=>({getEmail:()=>email})},
    UrlFetchApp:{fetch:()=>{if(!state.network)throw Error('synthetic outage');return {getResponseCode:()=>state.status==='active'?200:403,getContentText:()=>JSON.stringify({ok:state.status==='active',status:state.status,prefix:'FF',plan:'pro',realm:'live',expiry:'2099-01-01T00:00:00Z'})}}},
    Utilities:{MacAlgorithm:{HMAC_SHA_256:'sha256'},computeHmacSignature:(_,m,k)=>[...crypto.createHmac('sha256',k).update(m).digest()],base64EncodeWebSafe:b=>Buffer.from(b).toString('base64url'),base64Decode:v=>[...Buffer.from(v,'base64')],newBlob:b=>({getDataAsString:()=>Buffer.from(b).toString('utf8')})},
    LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>{}})},
    getMonthlyCount:()=>state.usage,getOrCreateResponseSheet:()=>({})});
  for(const f of ['OnlineLicenseStatus.js','LicenseCore.js','LicenseManager.js','UsageManager.js']) if(fs.existsSync(path.join(root,f))) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
  if(fs.existsSync(path.join(root,'SubmissionSafety.js'))) vm.runInContext(fs.readFileSync(path.join(root,'SubmissionSafety.js'),'utf8'),c);
  const body=Buffer.from(JSON.stringify({p:'pro',e:'2099-01-01T00:00:00Z',u:email})).toString('base64url');
  const head='FF1.'+body, key=head+'.'+crypto.createHmac('sha256',secret).update(head).digest('base64url');
  return {c,state,user,key,root};
}
test('version 84 has missing license functions and cannot activate',()=>{
  const {c,key}=fixture('formflow-84');
  assert.equal(typeof c.lcCheckOnlineStatus_,'undefined');
  const result=c.activateLicense(key); assert.equal(result.success,false); assert.match(result.message,/LC_ONLINE_EXPECTED_REALM/);
});
test('candidate activates a synthetic purchase and grants the paid tier',()=>{
  const {c,key,state}=fixture('formflow-84-local-candidate');
  state.usage=50; assert.equal(c.checkSubmissionAvailability().allowed,false);
  assert.equal(c.activateLicense(key).success,true); assert.equal(c.getLicenseStatus().isPro,true);
  assert.equal(c.checkSubmissionAvailability().allowed,true);
});
test('candidate refuses initial activation while service is unavailable',()=>{
  const {c,key,state,user}=fixture('formflow-84-local-candidate'); state.network=false;
  assert.equal(c.activateLicense(key).success,false); assert.equal(user.has('key'),false);
});
test('candidate does not activate for a different Google account',()=>{
  const {c,key,user}=fixture('formflow-84-local-candidate');
  c.Session.getActiveUser=()=>({getEmail:()=> 'other@example.invalid'});
  assert.equal(c.activateLicense(key).success,false); assert.equal(user.has('key'),false);
});
test('candidate never treats a test-realm response as a live purchase',()=>{
  const {c,key,user}=fixture('formflow-84-local-candidate');
  c.UrlFetchApp.fetch=()=>({getResponseCode:()=>200,getContentText:()=>JSON.stringify({ok:true,status:'active',prefix:'FF',plan:'pro',realm:'test',expiry:'2099-01-01T00:00:00Z'})});
  assert.equal(c.activateLicense(key).success,false); assert.equal(user.has('key'),false);
});
test('candidate refreshes revoked entitlement for unattended submissions',()=>{
  const {c,key,state}=fixture('formflow-84-local-candidate'); state.usage=50;
  assert.equal(c.activateLicense(key).success,true); state.status='revoked';
  c.LC_BACKGROUND_LICENSE_CONTEXT=true;
  assert.equal(c.getLicenseStatus().isPro,false); assert.equal(c.checkSubmissionAvailability().allowed,false);
});
test('deactivation removes stored entitlement and returns to the free limit',()=>{
  const {c,key,state,user}=fixture('formflow-84-local-candidate'); state.usage=50;
  assert.equal(c.activateLicense(key).success,true); assert.equal(c.deactivateLicense().success,true);
  assert.equal(user.has('key'),false); assert.equal(c.checkSubmissionAvailability().allowed,false);
});
test('version 84 treats a failed usage read as zero usage',()=>{
  const {c}=fixture('formflow-84');
  c.getMonthlyCount=()=>{throw Error('synthetic read failure');};
  const result=c.checkSubmissionAvailability(); assert.equal(result.allowed,true); assert.equal(result.usage,0);
});
test('candidate refuses to send a new approval when usage cannot be checked',()=>{
  const {c,root}=fixture('formflow-84-local-candidate');
  c.getMonthlyCount=()=>{throw Error('synthetic read failure');};
  assert.equal(c.checkSubmissionAvailability().reason,'USAGE_UNAVAILABLE');
  c.syncContainerPropertiesToScriptProperties_=()=>{}; c.syncFormDestinationToScriptProperties_=()=>{};
  c.pruneTerminalApprovalState_=()=>{}; c.getConfig=()=>({enabled:true});
  c.ffLocateSubmissionRow_=()=>2;
  let writes=0; c.writeApprovalRecord=()=>{writes++}; c.sendApprovalRequest=()=>{writes++};
  vm.runInContext(fs.readFileSync(path.join(root,'ApprovalEngine.js'),'utf8'),c);
  assert.throws(()=>c.processSubmission({},{}),/usage could not be checked/); assert.equal(writes,0);
});
test('documents retry blocker: submission engine writes the last row rather than locating its response',()=>{
  const {c,root}=fixture('formflow-84');
  c.syncContainerPropertiesToScriptProperties_=()=>{}; c.syncFormDestinationToScriptProperties_=()=>{}; c.pruneTerminalApprovalState_=()=>{};
  c.getConfig=()=>({enabled:true}); c.checkSubmissionAvailability=()=>({allowed:true});
  c.getOrCreateResponseSheet=()=>({getLastRow:()=>3}); c.ensureApprovalColumns=()=>{};
  c.generateApprovalId=()=> 'synthetic-id'; c.getActiveFormTitleSafe_=()=> 'Synthetic';
  let row=0; c.writeApprovalRecord=(_sheet,n)=>{row=n}; c.saveApprovalSheetLocator_=()=>{throw Error('stop after write');};
  vm.runInContext(fs.readFileSync(path.join(root,'ApprovalEngine.js'),'utf8'),c);
  c.generateApprovalId=()=> 'synthetic-id'; c.getActiveFormTitleSafe_=()=> 'Synthetic';
  const older={getRespondentEmail:()=>'',getItemResponses:()=>[],getId:()=> 'older-response-at-row-2'};
  assert.throws(()=>c.processSubmission(older,{}),/stop after write/); assert.equal(row,3);
});
test('candidate manifest declares external request for online validation',()=>{
  const {root}=fixture('formflow-84-local-candidate'); const manifest=JSON.parse(fs.readFileSync(path.join(root,'appsscript.json'),'utf8').replace(/^\uFEFF/,''));
  assert.ok(manifest.oauthScopes.includes('https://www.googleapis.com/auth/script.external_request'));
});
test('submission uses the trigger owner and clears background mode even when processing fails',()=>{
  const {c,root}=fixture('formflow-84-local-candidate');
  c.Session.getActiveUser=()=>({getEmail:()=>''});
  c.getConfig=()=>({enabled:true}); c.recordFormFlowEvent_=()=>{}; c.classifyFormFlowError_=()=> 'unknown_error';
  c.saveFormFlowReport_=()=>{}; c.Logger={log:()=>{}};
  c.processSubmission=()=>{assert.equal(c.lcBuyerEmail_(),email); throw Error('synthetic failure');};
  vm.runInContext(fs.readFileSync(path.join(root,'Code.js'),'utf8'),c,{filename:'Code.js'});
  c.onFormSubmitHandler({response:{}}); assert.equal(c.LC_BACKGROUND_LICENSE_CONTEXT,false);
});
test('manual sync uses the current form selection and forbids global fallback',()=>{
  const {c,root}=fixture('formflow-84-local-candidate');
  vm.runInContext(fs.readFileSync(path.join(root,'Code.js'),'utf8'),c);
  c.getActiveFormSafe_=()=>({}); let scope;
  c.getResponseSheetSelection=o=>{assert.equal(o.includeScriptFallback,false);return {spreadsheetId:'synthetic-own',sheetName:'responses'}};
  c.processQueuedApprovalDecisions_=s=>{scope=s;return {processed:1,pending:1,inaccessible:0}};
  assert.equal(c.syncPendingApprovalDecisions().processed,1);
  assert.deepEqual(JSON.parse(JSON.stringify(scope)),{spreadsheetId:'synthetic-own',sheetName:'responses'});
  c.getResponseSheetSelection=()=>null;assert.throws(()=>c.syncPendingApprovalDecisions(),/select its linked response Sheet/);
});
test('scoped queue sync leaves other forms and malformed entries untouched',()=>{
  const {c,root}=fixture('formflow-84-local-candidate'); const prefix='TEST_QUEUE_';
  const values={TEST_QUEUE_own:JSON.stringify({approvalId:'own'}),TEST_QUEUE_other:JSON.stringify({approvalId:'other'}),TEST_QUEUE_bad:'{bad'};
  c.APPROVAL_DECISION_QUEUE_PREFIX=prefix;
  c.PropertiesService.getScriptProperties=()=>({getProperties:()=>({...values}),deleteProperty:k=>delete values[k]});
  c.getApprovalSheetLocator_=id=>({spreadsheetId:id==='own'?'own-sheet':'other-sheet',sheetName:'responses'});
  c.Sheets={Spreadsheets:{get:()=>({})}};
  vm.runInContext(fs.readFileSync(path.join(root,'ApprovalEngine.js'),'utf8'),c);
  const processed=[];c.processApproval=id=>{processed.push(id);return {success:true}};c.refreshApprovalSnapshotFromSheet_=()=>{};
  const result=c.processQueuedApprovalDecisions_({spreadsheetId:'own-sheet',sheetName:'responses'});
  assert.equal(result.processed,1);assert.deepEqual(processed,['own']);
  assert.equal(values.TEST_QUEUE_own,undefined);assert.ok(values.TEST_QUEUE_other);assert.equal(values.TEST_QUEUE_bad,'{bad');
});

