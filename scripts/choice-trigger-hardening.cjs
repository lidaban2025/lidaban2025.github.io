const fs=require('node:fs'),path=require('node:path');
function apply(directory){
 function patch(file,from,to){const p=path.join(directory,file),t=fs.readFileSync(p,'utf8');if(!t.includes(from))throw Error('Unexpected trigger boundary: '+file);fs.writeFileSync(p,t.replace(from,to));}
 patch('AutomationContext.js','  var scoped=ScriptApp.getUserTriggers(form),project=ScriptApp.getProjectTriggers();','  // Clocks belong to the project; require our saved form ownership for every match.\n  var project=ScriptApp.getProjectTriggers();');
 patch('AutomationContext.js','  scoped.forEach(function(t){add(t,true);});project.forEach(function(t){add(t,false);});return out;','  project.forEach(function(t){add(t,false);});return out;');
 fs.appendFileSync(path.join(directory,'AutomationContext.js'),`\nfunction csMatchingOpenTriggers_(form) {\n  if (!form || !form.getId) throw new Error('Current form unavailable.');\n  return ScriptApp.getProjectTriggers().filter(function(trigger) {\n    if (getTriggerHandlerName_(trigger) !== 'onFormOpenAutoUpdate') return false;\n    return typeof trigger.getTriggerSourceId === 'function' && String(trigger.getTriggerSourceId() || '') === String(form.getId());\n  });\n}\n`);
 const codePath=path.join(directory,'Code.js');let code=fs.readFileSync(codePath,'utf8');
 // These are only the on-open operations and health inspection; clocks use the separate ownership map.
 if((code.match(/ScriptApp\.getUserTriggers\(form\)/g)||[]).length!==3)throw Error('Unexpected open-trigger enumerations');
 code=code.replaceAll('ScriptApp.getUserTriggers(form)','csMatchingOpenTriggers_(form)');fs.writeFileSync(codePath,code);
 patch('ConfigManager.js','    csCheckRequestedAutomation_(config);\n    if (config.enabled',`    csCheckRequestedAutomation_(config);\n    var oldTriggers = getEffectiveTriggerSettings_(previousConfig);\n    var nextTriggers = getEffectiveTriggerSettings_(config);\n    var stopFirst = (oldTriggers.onOpen || oldTriggers.timedHours > 0) && !nextTriggers.onOpen && nextTriggers.timedHours === 0;\n    if (config.enabled`);
 patch('ConfigManager.js',"    if (config.enabled) {\n      failureStage = 'sheet_metadata_read';","    if (config.enabled && !stopFirst) {\n      failureStage = 'sheet_metadata_read';");
 patch('ConfigManager.js',"    syncChangedTriggers_(previousConfig, config);",`    // Persist the stop before a Google cleanup call: a queued job must observe Off even during an outage.\n    if (stopFirst) csDocumentProperties_().setProperty(CONFIG_KEY, JSON.stringify(config));\n    var triggerWarning = '';\n    try { syncChangedTriggers_(previousConfig, config); } catch (cleanupError) {\n      if (!stopFirst) throw cleanupError;\n      triggerWarning = 'Automatic updates are off. Google could not confirm trigger cleanup. Use Repair configured triggers to retry; queued runs will respect the saved Off setting.';\n    }`);
 patch('ConfigManager.js','    return { success: true };','    return { success: true, warning: triggerWarning };');
 patch('Sidebar.html',"    renderAction('Saved. Check setup before updating the form.', true);","    renderAction(result && result.warning ? escapeHtml(result.warning) : 'Saved. Check setup before updating the form.', !(result && result.warning));");
}
module.exports={apply};
if(require.main===module){if(!process.argv[2])throw Error('Private candidate path required');apply(process.argv[2]);console.log('Applied scoped trigger enumeration and stop-before-cleanup protection.');}
