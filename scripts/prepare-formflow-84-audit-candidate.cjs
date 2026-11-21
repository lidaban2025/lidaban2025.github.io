// Creates a local audit candidate from privately obtained immutable snapshots.
// Snapshots may contain sensitive values; this copies them without printing,
// publishing, or deploying them. Keep both input and output out of Git.
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.FORMFLOW_AUDIT_ROOT;
if (!base) throw Error('Set FORMFLOW_AUDIT_ROOT to the isolated audit directory');
const source = path.join(base, 'formflow-84');
const stable = path.join(base, 'formflow-83');
const candidateName=process.env.FORMFLOW_CANDIDATE_NAME||'formflow-84-local-candidate';
if(!/^[a-z0-9-]+$/.test(candidateName))throw Error('A simple private output directory name is required');
const destination = path.join(base, candidateName);
fs.mkdirSync(destination, {recursive:true});
const allowed = new Set(fs.readdirSync(source).filter(name => name !== '.clasp.json' && /\.(js|html|json)$/.test(name)));
allowed.add('OnlineLicenseStatus.js');
allowed.add('SubmissionSafety.js');
allowed.add('SheetWriteSafety.js');
allowed.add('DispatchSafety.js');
allowed.add('LegacyConfigPacking.js');
allowed.add('.clasp.json');
if (fs.readdirSync(destination).some(name => !allowed.has(name))) throw Error('Unexpected file in candidate directory');
for (const name of fs.readdirSync(source)) {
  if (name === '.clasp.json' || !/\.(js|html|json)$/.test(name)) continue;
  fs.copyFileSync(path.join(source,name),path.join(destination,name));
}
fs.copyFileSync(path.join(base,'choice-116','OnlineLicenseStatus.js'),path.join(destination,'OnlineLicenseStatus.js'));
fs.copyFileSync(path.join(__dirname,'formflow-candidate','SubmissionSafety.js'),path.join(destination,'SubmissionSafety.js'));
fs.copyFileSync(path.join(__dirname,'formflow-candidate','SheetWriteSafety.js'),path.join(destination,'SheetWriteSafety.js'));
fs.copyFileSync(path.join(__dirname,'formflow-candidate','DispatchSafety.js'),path.join(destination,'DispatchSafety.js'));
fs.copyFileSync(path.join(__dirname,'formflow-candidate','LegacyConfigPacking.js'),path.join(destination,'LegacyConfigPacking.js'));
const manifestPath=path.join(destination,'appsscript.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8').replace(/^\uFEFF/,''));
const scope='https://www.googleapis.com/auth/script.external_request';
if (!manifest.oauthScopes.includes(scope)) manifest.oauthScopes.push(scope);
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
const codePath=path.join(destination,'Code.js');
let code=fs.readFileSync(codePath,'utf8');
function restoreFunctionGroup(target, oldText, first, next) {
  const a=target.indexOf(first), b=target.indexOf(next,a), x=oldText.indexOf(first), y=oldText.indexOf(next,x);
  if(a<0 || b<0 || x<0 || y<0) throw Error('Expected function boundary not found; candidate not ready');
  return target.slice(0,a)+oldText.slice(x,y)+target.slice(b);
}
code=restoreFunctionGroup(code,fs.readFileSync(path.join(stable,'Code.js'),'utf8'),'function syncPendingApprovalDecisions() {','function include(filename) {');
const start=/function onFormSubmitHandler\(e\) \{\r?\n  try \{/;
const end=/    saveFormFlowReport_\(false, \[err\.message\]\);\r?\n  \}\r?\n\}/;
if (!start.test(code) || !end.test(code)) throw Error('Unexpected submit handler; candidate not ready');
code=code.replace(start,'function onFormSubmitHandler(e) {\n  LC_BACKGROUND_LICENSE_CONTEXT = true;\n  try {');
code=code.replace(end,'    saveFormFlowReport_(false, [err.message]);\n  } finally {\n    LC_BACKGROUND_LICENSE_CONTEXT = false;\n  }\n}');
code=code.replace("    .addItem('View Approval History', 'showHistorySidebar')","    .addItem('View Approval History', 'showHistorySidebar')\n    .addItem('Retry oldest unsent request', 'retryOldestUnsentSubmission')");
code=code.replace("    .addItem('Configure Approval Flow', 'showSidebar')","    .addItem('Configure Approval Flow', 'showSidebar')\n    .addItem('Select linked response spreadsheet', 'showResponseSheetPickerDialog')");
const oldDispatch="    processSubmission(formResponse, e);";
if (!code.includes(oldDispatch)) throw Error('Unexpected dispatch call');
code=code.replace(oldDispatch,"    var submission = processSubmission(formResponse, e);");
code=code.replace("saveFormFlowReport_(true, ['Approval request created for a new submission.']);","saveFormFlowReport_(!!(submission && submission.success), [submission && submission.success ? 'Approval request created for a new submission.' : 'Approval request was not sent. Check the workflow and quota, then use Retry oldest unsent request.']);");
fs.writeFileSync(codePath,code);
// A failed usage read is not evidence of zero usage. Fail closed before
// creating an approval; this does not delete the original Google response.
// Automatic retry requires separate response-to-row correlation and is NOT
// implemented by this candidate.
const usagePath=path.join(destination,'UsageManager.js');
let usage=fs.readFileSync(usagePath,'utf8');
const unsafe='try { usage = getMonthlyCount(getOrCreateResponseSheet()); } catch (e) {}';
if (!usage.includes(unsafe)) throw Error('Unexpected quota read; candidate not ready');
usage=usage.replace(unsafe,"try { usage = getMonthlyCount(getOrCreateResponseSheet()); } catch (e) { return {allowed:false,isPro:false,reason:'USAGE_UNAVAILABLE',usage:null,limit:FF_FREE_RUNS_PER_MONTH,message:'Usage could not be checked. Approval was not sent; check the Google Form responses and contact support.'}; }");
fs.writeFileSync(usagePath,usage);
const enginePath=path.join(destination,'ApprovalEngine.js');
let engine=fs.readFileSync(enginePath,'utf8');
engine=restoreFunctionGroup(engine,fs.readFileSync(path.join(stable,'ApprovalEngine.js'),'utf8'),'function processQueuedApprovalDecisions_() {','function canCurrentUserAccessApprovalSheet_(spreadsheetId) {');
const gate='  if (!availability.allowed) {';
if (!engine.includes(gate)) throw Error('Unexpected submission gate; candidate not ready');
engine=engine.replace(gate,"  if (!availability.allowed && availability.reason === 'USAGE_UNAVAILABLE') throw new Error('Approval was not sent because usage could not be checked. Check the Google Form responses and contact support.');\n"+gate);
const split=engine.indexOf('function processApproval(');
if(split<0) throw Error('Missing submission boundary');
let intake=engine.slice(0,split);
if((intake.match(/var lastRow = sheet.getLastRow\(\);/g)||[]).length!==2) throw Error('Unexpected last-row pattern');
intake=intake.replace('function processSubmission(formResponse, event) {','function processSubmissionUnlocked_(formResponse, event) {');
intake=intake.replace('  var availability = checkSubmissionAvailability();','  ffValidateReservedQuestionTitles_(event && event.source);\n  var verifiedSheet = getOrCreateResponseSheet();\n  var verifiedRow = ffLocateSubmissionRow_(verifiedSheet, formResponse, event);\n  var availability = checkSubmissionAvailability();');
intake=intake.replace(/var sheet = getOrCreateResponseSheet\(\);/g,'var sheet = verifiedSheet;');
intake=intake.replace(/var lastRow = sheet.getLastRow\(\);/g,'var lastRow = verifiedRow;');
intake=intake.replace('    return;',"    return {success:false,reason:'disabled'};");
intake=intake.replace('    return;',"    return {success:false,reason:'quota'};");
intake=intake.replace(/\r?\n\}\s*$/, '\n  return {success:true};\n}\n\n');
engine=intake+engine.slice(split);
engine=engine.replace(/\r\n/g,'\n');
const pendingStart=engine.indexOf('  var submittedAt = new Date().toISOString();');
const dispatchLine='  sendApprovalRequest(approvalId, levelConfig, formData, submitterEmail, formTitle, config);';
const pendingEnd=engine.indexOf(dispatchLine,pendingStart);
if(pendingStart<0||pendingEnd<0)throw Error('Unexpected first-dispatch boundary');
const pendingBlock=engine.slice(pendingStart,pendingEnd+dispatchLine.length);
const rowWriteStart=pendingBlock.indexOf('  writeApprovalRecord('),rowWriteEnd=pendingBlock.indexOf('  saveApprovalSheetLocator_(',rowWriteStart);
const levelStart=pendingBlock.indexOf('  var levelConfig = config.levels[0];');
if(rowWriteStart<0||rowWriteEnd<0||levelStart<0)throw Error('Unexpected context preparation boundary');
const safePending=pendingBlock.slice(0,rowWriteStart)+pendingBlock.slice(rowWriteEnd,levelStart)+
  '  var levelConfig = config.levels[0];\n'+
  '  var messages = ffPrepareApprovalRequests_(approvalId, levelConfig, formData, submitterEmail, formTitle, config);\n'+
  pendingBlock.slice(rowWriteStart,rowWriteEnd)+'  ffSendPreparedApprovalRequests_(messages);';
engine=engine.slice(0,pendingStart)+safePending+engine.slice(pendingEnd+dispatchLine.length);
fs.writeFileSync(enginePath,engine);
const mailPath=path.join(destination,'EmailService.js');let mail=fs.readFileSync(mailPath,'utf8').replace(/\r\n/g,'\n');
const sendEnd=mail.indexOf('function sendResultNotification(');if(sendEnd<0)throw Error('Expected request email boundary');
let prepare=mail.slice(0,sendEnd).replace('function sendApprovalRequest(','function ffPrepareApprovalRequests_(').replace('  var config = runtimeConfig || getApprovalRuntimeConfig_(approvalId);','  var config = runtimeConfig || getApprovalRuntimeConfig_(approvalId);\n  var messages = [];');
const oldSend=`    try {
      MailApp.sendEmail(approverEmail, subject, "Please open this email in an HTML-capable client.", {
        htmlBody: htmlBody,
        name: "FormFlow"
      });
    } catch (e) {
      Logger.log("Failed to send email to " + approverEmail + ": " + e.message);
    }`;
if(!prepare.includes(oldSend))throw Error('Unexpected request email send block');
prepare=prepare.replace(oldSend,'    messages.push({to:approverEmail,subject:subject,body:"Please open this email in an HTML-capable client.",htmlBody:htmlBody});');
prepare=prepare.replace(/\n\}\s*$/,'\n  return messages;\n}\n\n');
mail=prepare+'function sendApprovalRequest(approvalId, levelConfig, formData, submitterEmail, formTitle, runtimeConfig) {\n  return ffSendPreparedApprovalRequests_(ffPrepareApprovalRequests_(approvalId, levelConfig, formData, submitterEmail, formTitle, runtimeConfig));\n}\n\n'+mail.slice(sendEnd);fs.writeFileSync(mailPath,mail);
const sheetPath=path.join(destination,'SheetManager.js');let sheet=fs.readFileSync(sheetPath,'utf8');
const writeStart=sheet.indexOf('function writeApprovalRecord(sheet, rowIndex, data) {'),writeEnd=sheet.indexOf('function findRowByApprovalId(',writeStart);
if(writeStart<0||writeEnd<0)throw Error('Unexpected metadata writer boundary');
sheet=sheet.slice(0,writeStart)+"function writeApprovalRecord(sheet, rowIndex, data) {\n  return ffWriteApprovalMetadata_(sheet,rowIndex,data);\n}\n\n"+sheet.slice(writeEnd);fs.writeFileSync(sheetPath,sheet);
const uiPath=path.join(destination,'Sidebar.html');let ui=fs.readFileSync(uiPath,'utf8');
ui=ui.replace('Set approvers, save, then run Preflight.</p>','Set approvers, save, then run Preflight. · v2026.11.20</p><p id="setupAccount" style="font-size:12px;color:#5f6368"></p>');
ui=ui.replace('function init() {',"function init() {\n  google.script.run.withSuccessHandler(function(account){document.getElementById('setupAccount').textContent=account && account.email ? 'Google account: '+account.email : 'Google identity unavailable. Do not purchase until it can be checked.';}).withFailureHandler(function(){document.getElementById('setupAccount').textContent='Google identity check unavailable.';}).ffGetSetupAccount();");
ui=ui.replace('Picker opened. Select the linked response spreadsheet, then refresh this sidebar status.','File-selection window requested. If it does not appear, use Add-ons → FormFlow → Select linked response spreadsheet, then Refresh here.');fs.writeFileSync(uiPath,ui);
fs.appendFileSync(path.join(destination,'LicenseManager.js'),"\nfunction ffGetSetupAccount(){return {email:lcBuyerEmail_()};}\n");
const configPath=path.join(destination,'ConfigManager.js');let cfg=fs.readFileSync(configPath,'utf8');
const configStore='    JSON.stringify(config)';if(!cfg.includes(configStore))throw Error('Runtime config store boundary missing');
cfg=cfg.replace(configStore,'    ffPackRuntimeConfigJSON_(JSON.stringify(config))');
const configRead='    return mergeConfigWithDefaults_(JSON.parse(raw));';
const readStart=cfg.indexOf('function getApprovalRuntimeConfig_(approvalId) {');
const readEnd=cfg.indexOf('function getApprovalSheetLocator_',readStart);
if(readStart<0||readEnd<0||!cfg.slice(readStart,readEnd).includes(configRead))throw Error('Runtime config reader boundary missing');
const reader=`function getApprovalRuntimeConfig_(approvalId) {
  if (!approvalId) return getConfig();
  var raw = PropertiesService.getScriptProperties().getProperty(APPROVAL_CONFIG_PREFIX + approvalId);
  if (!raw) return getConfig();
  var parsed;
  try { parsed = JSON.parse(raw); } catch (error) { return getConfig(); }
  if (parsed && Object.prototype.hasOwnProperty.call(parsed,FF_PACKED_CONFIG_FIELD)) parsed=JSON.parse(ffUnpackRuntimeConfigJSON_(raw));
  return mergeConfigWithDefaults_(parsed);
}

`;
cfg=cfg.slice(0,readStart)+reader+cfg.slice(readEnd);fs.writeFileSync(configPath,cfg);
console.log('Local audit candidate prepared; no deployment performed.');
