/** Write approval metadata without retyping native answers or date cells. */
function ffWriteApprovalMetadata_(sheet, rowIndex, data) {
  if (!sheet || !sheet.spreadsheetId || !sheet.sheetName || !Number.isSafeInteger(rowIndex) || rowIndex < 2) throw new Error('A verified approval row is required.');
  var keys = Object.keys(data || {});
  if (!keys.length || keys.some(function(key) { return APPROVAL_COLUMNS.indexOf(key) < 0; })) throw new Error('Only approval metadata fields may be written.');
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var updates = keys.map(function(key) {
    var column = headers.indexOf(key);
    if (column < 0 || headers.lastIndexOf(key) !== column) throw new Error('Approval metadata columns are missing or duplicated.');
    return {range:toA1Range_(sheet.sheetName,rowIndex,column+1,1,1),values:[[data[key]]]};
  });
  Sheets.Spreadsheets.Values.batchUpdate({valueInputOption:'RAW',data:updates},sheet.spreadsheetId);
}

function ffValidateReservedQuestionTitles_(form) {
  if (!form || typeof form.getItems !== 'function') throw new Error('Could not verify the form question headers. Approval was not sent.');
  var reserved = APPROVAL_COLUMNS.map(function(name) { return name.toLowerCase(); });
  form.getItems().forEach(function(item) {
    var type = String(item.getType());
    if (['IMAGE','VIDEO','PAGE_BREAK','SECTION_HEADER'].indexOf(type) >= 0) return;
    if (reserved.indexOf(String(item.getTitle() || '').trim().toLowerCase()) >= 0) throw new Error('A form question uses a reserved approval-column name. Rename that question before enabling FormFlow.');
  });
}
