/** Frozen defaults + a field-presence mask keep each original JSON object recoverable.
 * Do not change this V1 dictionary when application defaults change.
 */
var FF_PACKED_CONFIG_FIELD = '__ffPackedDefaultsV1';
var FF_PACKED_DEFAULTS_V1 = [
  ['emailTemplate','subject','Approval Required: {{formTitle}} - {{submitterEmail}}'],
  ['emailTemplate','approveButtonText','Approve'],
  ['emailTemplate','rejectButtonText','Reject'],
  ['notifications','notifySubmitterOnApprove',true],
  ['notifications','notifySubmitterOnReject',true],
  ['notifications','notifySubmitterOnPending',true],
  ['options','requireComment',false],
  ['options','autoExpireDays',0],
  ['options','statusColumn','Approval Status'],
  ['options','commentsColumn','Approval Comments']
];
function ffCanonicalConfigJSON_(value) {
  if (Array.isArray(value)) return '['+value.map(ffCanonicalConfigJSON_).join(',')+']';
  if (value && typeof value==='object') return '{'+Object.keys(value).sort().map(function(k){return JSON.stringify(k)+':'+ffCanonicalConfigJSON_(value[k]);}).join(',')+'}';
  return JSON.stringify(value);
}
function ffUnpackRuntimeConfigJSON_(raw) {
  var value=JSON.parse(raw);
  if (!value || !Object.prototype.hasOwnProperty.call(value,FF_PACKED_CONFIG_FIELD)) return raw;
  var mask=value[FF_PACKED_CONFIG_FIELD];
  if (!Number.isInteger(mask) || mask<1 || mask>=Math.pow(2,FF_PACKED_DEFAULTS_V1.length)) throw new Error('Packed approval configuration is invalid. Contact support.');
  delete value[FF_PACKED_CONFIG_FIELD];
  FF_PACKED_DEFAULTS_V1.forEach(function(entry,index){
    if (!(mask & (1<<index))) return;
    if (Object.prototype.hasOwnProperty.call(value,entry[0]) && (!value[entry[0]] || typeof value[entry[0]]!=='object' || Array.isArray(value[entry[0]]))) throw new Error('Packed approval configuration has an invalid section.');
    var section=value[entry[0]]||(value[entry[0]]={});
    if (Object.prototype.hasOwnProperty.call(section,entry[1])) throw new Error('Packed approval configuration has a conflicting field.');
    section[entry[1]]=entry[2];
  });
  return JSON.stringify(value);
}
function ffPackRuntimeConfigJSON_(raw) {
  var value;
  try { value=JSON.parse(raw); } catch(ignored) { return raw; }
  if (!value || Array.isArray(value) || !Array.isArray(value.levels) || !value.levels.length || value.sharedConfig || Object.prototype.hasOwnProperty.call(value,FF_PACKED_CONFIG_FIELD)) return raw;
  var original=ffCanonicalConfigJSON_(value),mask=0,changedSections={};
  FF_PACKED_DEFAULTS_V1.forEach(function(entry,index){
    var section=value[entry[0]];
    if (section && typeof section==='object' && !Array.isArray(section) && Object.prototype.hasOwnProperty.call(section,entry[1]) && section[entry[1]]===entry[2]) {
      delete section[entry[1]];mask|=(1<<index);changedSections[entry[0]]=true;
    }
  });
  if (!mask) return raw;
  Object.keys(changedSections).forEach(function(name){if (!Object.keys(value[name]).length) delete value[name];});
  value[FF_PACKED_CONFIG_FIELD]=mask;
  var packed=JSON.stringify(value);
  if (Utilities.newBlob(packed).getBytes().length>=Utilities.newBlob(raw).getBytes().length) return raw;
  if (ffCanonicalConfigJSON_(JSON.parse(ffUnpackRuntimeConfigJSON_(packed)))!==original) throw new Error('Approval configuration packing failed its lossless check.');
  return packed;
}
function ffPlanRuntimeConfigPacking_() {
  var all=PropertiesService.getScriptProperties().getProperties(),changes=[],saved=0;
  Object.keys(all).forEach(function(key){
    if (key.indexOf(APPROVAL_CONFIG_PREFIX)!==0) return;
    var packed=ffPackRuntimeConfigJSON_(all[key]);if(packed===all[key])return;
    var reduction=Utilities.newBlob(all[key]).getBytes().length-Utilities.newBlob(packed).getBytes().length;
    changes.push({key:key,before:all[key],after:packed,savedBytes:reduction});saved+=reduction;
  });
  return {changes:changes,configurations:changes.length,savedBytes:saved};
}
function ffApplyRuntimeConfigPacking_() {
  var lock=LockService.getScriptLock();if(!lock.tryLock(10000))throw new Error('Another approval is running. Try maintenance again after it finishes.');
  try {
    var plan=ffPlanRuntimeConfigPacking_(),props=PropertiesService.getScriptProperties(),result={applied:0,skipped:0,savedBytes:0};
    plan.changes.forEach(function(change){
      if(props.getProperty(change.key)!==change.before){result.skipped++;return;}
      props.setProperty(change.key,change.after);result.applied++;result.savedBytes+=change.savedBytes;
    });
    return result;
  } finally {lock.releaseLock();}
}
