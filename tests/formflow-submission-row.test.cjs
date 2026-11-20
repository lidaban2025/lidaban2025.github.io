const {test}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../scripts/formflow-candidate/SubmissionSafety.js'),'utf8');
const stamp=new Date('2026-11-15T12:00:00.123Z'), serial=stamp.getTime()/86400000+25569;
function fixture(){
  const response={getId:()=> 'r1',getTimestamp:()=>stamp,getItemResponses:()=>[],getRespondentEmail:()=>''};
  const data={rows:[['Timestamp','Approval ID'],[serial,''],[serial+1,'']],peers:[response],released:0,properties:new Map(),alerts:[]};
  const form={getId:()=> 'form',getDestinationId:()=> 'sheet',getResponses:()=>data.peers,getTitle:()=> 'Synthetic',getResponse:()=>response};
  const c=vm.createContext({Date,Math,String,isFinite,
    Sheets:{Spreadsheets:{get:()=>({properties:{timeZone:'UTC'}}),Values:{get:()=>({values:data.rows})}}},
    Utilities:{formatDate:(d,_z,f)=>f==='Z'?'+0000':d.toISOString().slice(0,-1),getUuid:()=> 'synthetic-uuid'},
    PropertiesService:{getUserProperties:()=>({getProperty:k=>data.properties.get(k)||null,setProperty:(k,v)=>data.properties.set(k,v),deleteProperty:k=>data.properties.delete(k)})},
    FormApp:{getActiveForm:()=>form,getUi:()=>({alert:m=>data.alerts.push(m)})},
    quoteSheetNameForA1_:n=>"'"+n+"'",LockService:{getUserLock:()=>({tryLock:()=>true,releaseLock:()=>{}}),getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>data.released++})}});
  vm.runInContext(source,c);return {c,data,response,event:{source:form},sheet:{spreadsheetId:'sheet',sheetName:'responses'}};
}
test('delayed response resolves its own row, not the newer last row',()=>{
  const f=fixture();assert.equal(f.c.ffLocateSubmissionRow_(f.sheet,f.response,f.event),2);
});
test('ambiguous matching timestamps stop before a row can be selected',()=>{
  const f=fixture();f.data.rows[2][0]=serial;assert.throws(()=>f.c.ffLocateSubmissionRow_(f.sheet,f.response,f.event),/no unique matching row/);
});
test('another form response in the same second prevents matching even if its sheet row is delayed',()=>{
  const f=fixture();f.data.peers.push({getId:()=> 'r2',getTimestamp:()=>new Date(stamp.getTime()+1)});
  assert.throws(()=>f.c.ffLocateSubmissionRow_(f.sheet,f.response,f.event),/Cannot uniquely identify/);
});
test('missing sheet row never falls back to the last row',()=>{
  const f=fixture();f.data.rows[1][0]=serial-1;assert.throws(()=>f.c.ffLocateSubmissionRow_(f.sheet,f.response,f.event),/no unique matching row/);
});
test('formatted date strings cannot silently depend on locale parsing',()=>{
  const f=fixture();f.data.rows[1][0]='15/11/2026 12:00';assert.throws(()=>f.c.ffLocateSubmissionRow_(f.sheet,f.response,f.event),/no unique matching row/);
});
test('an existing approval record prevents repeat dispatch',()=>{
  const f=fixture();f.data.rows[1][1]='already-reserved';assert.throws(()=>f.c.ffLocateSubmissionRow_(f.sheet,f.response,f.event),/already has an approval/);
});
test('wrong destination is rejected before reading a response sheet',()=>{
  const f=fixture();f.sheet.spreadsheetId='other';assert.throws(()=>f.c.ffLocateSubmissionRow_(f.sheet,f.response,f.event),/do not match/);
});
test('ambiguous local clock transitions stop matching',()=>{
  const f=fixture();f.c.Utilities.formatDate=(d,_z,format)=>format==='Z'?(d<stamp?'+0100':'+0000'):d.toISOString().slice(0,-1);
  assert.throws(()=>f.c.ffLocateSubmissionRow_(f.sheet,f.response,f.event),/clock change/);
});
test('matching uses spreadsheet local time rather than the script time zone',()=>{
  const f=fixture();f.c.Sheets.Spreadsheets.get=()=>({properties:{timeZone:'America/New_York'}});
  f.c.Utilities.formatDate=(d,_zone,format)=>format==='Z'?'-0500':new Date(d.getTime()-18000000).toISOString().slice(0,-1);
  f.data.rows[1][0]=(stamp.getTime()-18000000)/86400000+25569;
  assert.equal(f.c.ffLocateSubmissionRow_(f.sheet,f.response,f.event),2);
});
test('lost spreadsheet millisecond precision causes refusal rather than a guessed match',()=>{
  const f=fixture();f.data.rows[1][0]=Math.floor(stamp.getTime()/1000)*1000/86400000+25569;
  assert.throws(()=>f.c.ffLocateSubmissionRow_(f.sheet,f.response,f.event),/no unique matching row/);
});
test('submission lock releases after an error and never runs when contended',()=>{
  const f=fixture();let calls=0;f.c.processSubmissionUnlocked_=()=>{calls++;throw Error('synthetic')};
  assert.throws(()=>f.c.processSubmission({},{}),/synthetic/);assert.equal(f.data.released,1);
  f.c.LockService.getScriptLock=()=>({tryLock:()=>false,releaseLock:()=>assert.fail()});
  assert.throws(()=>f.c.processSubmission({},{}),/Another approval/);assert.equal(calls,1);
});
test('integrated candidate writes the located row once and refuses a replay',()=>{
  const root=process.env.FORMFLOW_AUDIT_ROOT;if(!root)throw Error('Set FORMFLOW_AUDIT_ROOT');
  const f=fixture(),c=f.c;let emails=0;
  vm.runInContext(fs.readFileSync(path.join(root,process.env.FORMFLOW_CANDIDATE_NAME||'formflow-84-local-candidate','ApprovalEngine.js'),'utf8'),c);
  c.ffValidateReservedQuestionTitles_=()=>{};
  for(const n of ['syncContainerPropertiesToScriptProperties_','syncFormDestinationToScriptProperties_','pruneTerminalApprovalState_','ensureApprovalColumns','saveApprovalSheetLocator_','saveApprovalRuntimeConfig_','saveApprovalSnapshot_','recordFormFlowEvent_'])c[n]=()=>{};
  c.getConfig=()=>({enabled:true,levels:[{}],notifications:{notifySubmitterOnPending:false}});
  c.checkSubmissionAvailability=()=>({allowed:true});c.getOrCreateResponseSheet=()=>f.sheet;
  c.writeApprovalRecord=(_s,row,record)=>{assert.equal(row,2);f.data.rows[row-1][1]=record['Approval ID']};
  c.sendApprovalRequest=()=>{emails++};
  c.processSubmission(f.response,f.event);assert.equal(emails,1);assert.equal(f.data.rows[2][1],'');
  assert.throws(()=>c.processSubmission(f.response,f.event),/already has an approval/);assert.equal(emails,1);assert.equal(f.data.released,2);
});
test('failure saves only a form-scoped reference and a successful retry removes it',()=>{
  const f=fixture();f.c.processSubmissionUnlocked_=()=>{throw Error('temporary failure')};
  assert.throws(()=>f.c.processSubmission(f.response,f.event),/temporary failure/);
  const records=JSON.parse(f.data.properties.get('FF_UNSENT_form'));
  assert.equal(records.length,1);assert.deepEqual(Object.keys(records[0]).sort(),['firstSeen','id']);
  f.c.processSubmissionUnlocked_=()=>({success:true});f.c.retryOldestUnsentSubmission();
  assert.equal(f.data.properties.has('FF_UNSENT_form'),false);assert.equal(f.data.alerts.length,1);
});
test('manual retry preserves a failed record and never clears another form',()=>{
  const f=fixture();f.c.ffRememberSubmission_(f.response,f.event,false);
  f.data.properties.set('FF_UNSENT_other','other-record');f.c.processSubmissionUnlocked_=()=>{throw Error('ambiguous match')};
  f.c.retryOldestUnsentSubmission();assert.ok(f.data.properties.has('FF_UNSENT_form'));
  assert.equal(f.data.properties.get('FF_UNSENT_other'),'other-record');assert.match(f.data.alerts[0],/not resent/);
});
test('recovery list stays bounded without evicting earlier failed requests',()=>{
  const f=fixture();const records=Array.from({length:20},(_,i)=>({id:'old-'+i,firstSeen:stamp.toISOString()}));
  const before=JSON.stringify(records);f.data.properties.set('FF_UNSENT_form',before);
  assert.throws(()=>f.c.ffRememberSubmission_(f.response,f.event,false),/full/);assert.equal(f.data.properties.get('FF_UNSENT_form'),before);
});
test('busy recovery storage never performs an unlocked write',()=>{
  const f=fixture();f.c.LockService.getUserLock=()=>({tryLock:()=>false,releaseLock:()=>assert.fail('unheld lock')});
  assert.throws(()=>f.c.ffRememberSubmission_(f.response,f.event,false),/storage is busy/);
  assert.equal(f.data.properties.size,0);
});
test('recovery storage lock releases after a failed property write',()=>{
  const f=fixture();let released=0;
  f.c.LockService.getUserLock=()=>({tryLock:()=>true,releaseLock:()=>released++});
  f.c.PropertiesService.getUserProperties=()=>({getProperty:()=>null,setProperty:()=>{throw Error('synthetic storage failure')}});
  assert.throws(()=>f.c.ffRememberSubmission_(f.response,f.event,false),/synthetic storage failure/);assert.equal(released,1);
});
