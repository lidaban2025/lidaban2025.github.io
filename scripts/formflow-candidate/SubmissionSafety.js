/** Experimental candidate only: strict matching, no approximate row fallback. */
function ffResolveSubmissionRow_(rows, expectedSerial, uniqueResponseConfirmed) {
  if (!uniqueResponseConfirmed || typeof expectedSerial !== 'number' || !isFinite(expectedSerial)) throw new Error('Cannot uniquely identify the submitted response. No approval was sent.');
  if (!rows || rows.length < 2 || rows.length > 10001) throw new Error('Response sheet is unavailable or too large for safe matching.');
  var headers = rows[0], column = headers.indexOf('Timestamp');
  if (column < 0 || headers.lastIndexOf('Timestamp') !== column) throw new Error('A unique Timestamp column is required for safe matching.');
  var matches = [];
  for (var i = 1; i < rows.length; i++) {
    var value = rows[i][column];
    if (typeof value === 'number' && Math.abs(value - expectedSerial) * 86400000 < 0.1) matches.push(i + 1);
  }
  if (matches.length !== 1) throw new Error('The submitted response has no unique matching row yet. No approval was sent.');
  var approvalColumn = headers.indexOf('Approval ID');
  if (approvalColumn >= 0 && headers.lastIndexOf('Approval ID') !== approvalColumn) throw new Error('Duplicate approval columns prevent safe matching.');
  if (approvalColumn >= 0 && rows[matches[0] - 1][approvalColumn]) throw new Error('This response already has an approval record. Check its status before retrying.');
  return matches[0];
}

function ffLocateSubmissionRow_(sheet, response, event) {
  var form = event && event.source;
  if (!form || !response || !sheet.spreadsheetId || !sheet.sheetName || form.getDestinationId() !== sheet.spreadsheetId) {
    throw new Error('The event form and selected response spreadsheet do not match.');
  }
  var id = response.getId(), stamp = response.getTimestamp(), millis = stamp && stamp.getTime();
  if (!id || !stamp || !isFinite(millis)) throw new Error('A submitted response ID and timestamp are required.');
  // Refuse same-second collisions even if the spreadsheet has not received
  // every response yet. Do not use a display-formatted date or the last row.
  var second = Math.floor(millis / 1000), peers = form.getResponses(new Date(second * 1000 - 1));
  if (peers.length > 1000) throw new Error('Too many responses to verify safe row matching.');
  var count = 0, matchingId = '';
  for (var i = 0; i < peers.length; i++) {
    var peerStamp = peers[i].getTimestamp();
    if (peerStamp && Math.floor(peerStamp.getTime() / 1000) === second) { count++; matchingId = peers[i].getId(); }
  }
  var metadata = Sheets.Spreadsheets.get(sheet.spreadsheetId, {fields:'properties(timeZone)'});
  var zone = metadata && metadata.properties && metadata.properties.timeZone;
  if (!zone) throw new Error('Spreadsheet time zone could not be verified.');
  if (Utilities.formatDate(new Date(millis - 7200000), zone, 'Z') !== Utilities.formatDate(new Date(millis + 7200000), zone, 'Z')) {
    throw new Error('A time-zone clock change prevents safe timestamp matching.');
  }
  var local = Utilities.formatDate(stamp, zone, "yyyy-MM-dd'T'HH:mm:ss.SSS");
  var serial = Date.parse(local + 'Z') / 86400000 + 25569;
  var result = Sheets.Spreadsheets.Values.get(sheet.spreadsheetId, quoteSheetNameForA1_(sheet.sheetName), {
    majorDimension:'ROWS',valueRenderOption:'UNFORMATTED_VALUE',dateTimeRenderOption:'SERIAL_NUMBER'
  });
  return ffResolveSubmissionRow_(result.values || [], serial, count === 1 && matchingId === id);
}

function processSubmission(response, event) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    ffRememberSubmission_(response, event, false);
    throw new Error('Another approval is being processed. Use Retry oldest unsent request from this form after it finishes.');
  }
  try {
    var result = processSubmissionUnlocked_(response, event);
    if (result && result.success) ffRememberSubmission_(response, event, true);
    else ffRememberSubmission_(response, event, false);
    return result;
  } catch (error) {
    // A recovery record contains only a response reference, never answers.
    // A reserved approval row still blocks resend after an uncertain email result.
    try { ffRememberSubmission_(response, event, false); } catch (recordError) {
      throw new Error('Approval failed and recovery could not be saved. Check Google Forms responses and contact support.');
    }
    throw error;
  }
  finally { lock.releaseLock(); }
}

function ffRecoveryKey_(form) { return 'FF_UNSENT_' + form.getId(); }
function ffRememberSubmission_(response, event, completed) {
  var form = event && event.source;
  if (!form || !response || !form.getId || !response.getId) return;
  var id = response.getId();
  if (!id) return;
  var props = PropertiesService.getUserProperties(), key = ffRecoveryKey_(form);
  var records = JSON.parse(props.getProperty(key) || '[]');
  var found = false, next = [];
  for (var i = 0; i < records.length; i++) {
    if (records[i].id === id) { found = true; if (!completed) next.push(records[i]); }
    else next.push(records[i]);
  }
  if (!completed && !found) {
    if (next.length >= 20) throw new Error('Recovery list is full.');
    next.push({id:id,firstSeen:new Date().toISOString()});
  }
  if (next.length) props.setProperty(key, JSON.stringify(next));
  else props.deleteProperty(key);
}

function retryOldestUnsentSubmission() {
  var form = FormApp.getActiveForm();
  if (!form) throw new Error('Open FormFlow from the form that owns the unsent response.');
  var props = PropertiesService.getUserProperties();
  var records = JSON.parse(props.getProperty(ffRecoveryKey_(form)) || '[]');
  if (!records.length) { FormApp.getUi().alert('No saved unsent requests for this form and account.'); return; }
  try {
    var result = processSubmission(form.getResponse(records[0].id), {source:form});
    FormApp.getUi().alert(result && result.success ? 'The request was sent. Check the approval record.' : 'The request remains unsent. Check the workflow settings and available quota.');
  } catch (error) {
    FormApp.getUi().alert('The request was not resent. ' + String(error.message || 'Check the approval record.'));
  }
}
