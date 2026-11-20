// Reproducible local candidate. Private immutable snapshots and output stay out of Git.
const fs=require('node:fs'),path=require('node:path');
const base=process.env.FORMSUITE_AUDIT_ROOT;if(!base)throw Error('Set private FORMSUITE_AUDIT_ROOT');
const candidateName=process.env.FORMSUITE_CANDIDATE_NAME||'choice-116-closeout-candidate';
if(!/^[a-z0-9-]+$/.test(candidateName))throw Error('A simple private candidate directory name is required');
const source=path.join(base,'choice-116'),dest=path.join(base,candidateName);
fs.mkdirSync(dest,{recursive:true});
const allowed=new Set(fs.readdirSync(source).filter(file=>file!=='.clasp.json'&&/\.(js|html|json)$/.test(file)));
allowed.add('.clasp.json');
if(fs.readdirSync(dest).some(file=>!allowed.has(file)))throw Error('Unexpected files in candidate; use a fresh private output directory rather than shipping stale QA helpers');
for(const file of fs.readdirSync(source))if(file!=='.clasp.json'&&/\.(js|html|json)$/.test(file))fs.copyFileSync(path.join(source,file),path.join(dest,file));
function patch(file,from,to){const p=path.join(dest,file),text=fs.readFileSync(p,'utf8');if(!text.includes(from))throw Error('Unexpected immutable source boundary: '+file);fs.writeFileSync(p,text.replace(from,to));}
patch('LicenseManager.js','mappingLimit: -1,','mappingLimit: status.isPro ? -1 : FREE_QUESTION_LIMIT,');
patch('ConfigManager.js','    var previousConfig = getConfig();','    var previousConfig = getConfig();\n    csCheckMappingCount_(config, previousConfig);');
patch('ConfigManager.js','function addMapping(mapping) {','function addMapping(mapping) {\n  return csWithStateLock_(function() { return addMappingUnlocked_(mapping); });\n}\n\nfunction addMappingUnlocked_(mapping) {');
patch('ConfigManager.js','function removeMapping(index) {','function removeMapping(index) {\n  return csWithStateLock_(function() { return removeMappingUnlocked_(index); });\n}\n\nfunction removeMappingUnlocked_(index) {');
fs.appendFileSync(path.join(dest,'ConfigManager.js'),`\n// Preserve existing links without granting new Free links above the advertised cap.\nfunction csCheckMappingCount_(next, previous) {\n  if (!Array.isArray(next.mappings)) throw new Error('Invalid mappings list.');\n  var oldCount = previous && Array.isArray(previous.mappings) ? previous.mappings.length : 0;\n  if (next.mappings.length <= Math.max(FREE_QUESTION_LIMIT, oldCount)) return;\n  if (getLicenseStatus().isPro) return;\n  throw new Error('Free supports up to ' + FREE_QUESTION_LIMIT + ' linked questions. Existing links are retained; upgrade to add more.');\n}\n`);
patch('Sidebar.html',"(q.mappingLimit === -1 ? 'Unlimited' : q.mappingLimit) + syncInfo;","(q.mappingLimit === -1 ? 'Unlimited' : q.mappingLimit) + syncInfo + (q.mappingLimit > -1 && q.mappingCount > q.mappingLimit ? ' | Existing links retained; Free cannot add more.' : '');");
patch('Sidebar.html','onclick="openPicker()">Select spreadsheet</button>','onclick="openPicker()">Select spreadsheet</button>\n      <button class="btn btn-secondary btn-sm" type="button" onclick="checkSelectedSpreadsheet()">Check selected spreadsheet</button>');
patch('Sidebar.html','function startPickerPolling() {',`// A Picker choice can finish after the bounded poll ends. Recover the saved
// selection through the existing server API; never open another Picker or
// erase the saved selection just to check it.
function checkSelectedSpreadsheet() {
  renderAction('Checking your saved spreadsheet selection...', true);
  google.script.run.withSuccessHandler(function(selection) {
    if (!selection || !selection.fileId) {
      renderAction('No saved spreadsheet selection was returned. Choose a file in Select spreadsheet, then check again.', false);
      return;
    }
    stopPickerPolling();
    document.getElementById('sheetUrl').value = selection.fileId;
    selectedSpreadsheet = selection;
    updateFirstRunLocal('file_access', 'success', '');
    renderSelectedSpreadsheet();
    loadSheetDataWithMode(selection.fileId, selection.accessMode || 'picker_drive_file');
  }).withFailureHandler(function() {
    renderAction('Could not check the saved selection. Your choice was not cleared. Try Check selected spreadsheet again.', false);
  }).getLatestPickerSelection();
}

function startPickerPolling() {`);
patch('Sidebar.html','Picker did not return a spreadsheet. Close the picker dialog and click Select spreadsheet again so Google can grant access to the selected file.','Waiting for a spreadsheet selection timed out. Finish choosing the file, then click Check selected spreadsheet to recover it without choosing again.');
const sidebarPath=path.join(dest,'Sidebar.html');let sidebar=fs.readFileSync(sidebarPath,'utf8');
const failureAnchor="document.getElementById('toastError').textContent = 'Error: ' + e.message;\n    showToast('toastError');\n  }).saveConfig(config);";
if(!sidebar.includes(failureAnchor))throw Error('Save failure callback boundary changed');
sidebar=sidebar.replace(failureAnchor,"document.getElementById('toastError').textContent = 'Error: ' + e.message;\n    showToast('toastError');\n    renderAction('Settings were not saved. ' + escapeHtml(e.message || 'Please retry after checking your plan and permissions.'), false);\n  }).saveConfig(config);");fs.writeFileSync(sidebarPath,sidebar);
const manifest=JSON.parse(fs.readFileSync(path.join(dest,'appsscript.json'),'utf8').replace(/^\uFEFF/,''));
if(!manifest.oauthScopes.includes('https://www.googleapis.com/auth/forms')||!manifest.oauthScopes.includes('https://www.googleapis.com/auth/script.external_request'))throw Error('Required existing scopes missing');
console.log('Prepared a private candidate from116; no Google source or Marketplace changes.');
