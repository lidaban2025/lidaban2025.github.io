const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=process.env.FORMFLOW_AUDIT_ROOT;if(!base)throw Error('Private candidate root required');
const candidate=path.join(base,process.env.FORMFLOW_CANDIDATE_NAME||'formflow-dispatch-candidate');
function fixture(){
 const calls=[];const c=vm.createContext({Array,String,MailApp:{sendEmail:(...args)=>calls.push(args)}});
 for(const file of ['EmailService.js','DispatchSafety.js'])vm.runInContext(fs.readFileSync(path.join(candidate,file),'utf8'),c);
 c.buildApprovalUrl=(_id,action)=>'https://example.invalid/'+action;
 const config={emailTemplate:{subject:'QA {{formTitle}}',approveButtonText:'Approve',rejectButtonText:'Reject'}};
 return {c,calls,config};
}
test('all tokens and message content are prepared without invoking MailApp',()=>{
 const {c,calls,config}=fixture();const messages=c.ffPrepareApprovalRequests_('synthetic',{name:'Owned approver',approvers:['owned@example.invalid']},{Question:'<answer>'},'','<Synthetic>',config);
 assert.equal(calls.length,0);assert.equal(messages.length,1);assert.match(messages[0].htmlBody,/&lt;answer&gt;/);assert.match(messages[0].htmlBody,/&lt;Synthetic&gt;/);
 assert.equal(c.ffSendPreparedApprovalRequests_(messages).accepted,1);assert.equal(calls.length,1);
});
test('a token or storage error during preparation sends no partial emails',()=>{
 const {c,calls,config}=fixture();let n=0;c.buildApprovalUrl=()=>{if(++n===3)throw Error('synthetic storage full');return 'https://example.invalid/action'};
 assert.throws(()=>c.sendApprovalRequest('synthetic',{name:'QA',approvers:['a@example.invalid','b@example.invalid']},{},'','Synthetic',config),/storage full/);assert.equal(calls.length,0);
});
test('MailApp failures cannot be reported as success or leak submitted addresses in the error',()=>{
 const {c}=fixture();let attempts=0;c.MailApp.sendEmail=()=>{if(++attempts===2)throw Error('private provider error containing recipient');};
 const messages=[{to:'a@example.invalid'},{to:'b@example.invalid'}];
 assert.throws(()=>c.ffSendPreparedApprovalRequests_(messages),error=>/1 of 2/.test(error.message)&&/may already/.test(error.message)&&!/@|private provider/.test(error.message));assert.equal(attempts,2);
});
test('empty or invalid dispatch cannot produce a successful zero-recipient request',()=>{
 const {c,calls}=fixture();for(const input of [null,{},[]])assert.throws(()=>c.ffSendPreparedApprovalRequests_(input),/No approval messages/);assert.equal(calls.length,0);
});
