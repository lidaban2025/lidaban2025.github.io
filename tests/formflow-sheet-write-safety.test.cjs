const {test}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../scripts/formflow-candidate/SheetWriteSafety.js'),'utf8');
function fixture(){
  const state={headers:['Timestamp','Customer answer','Approval ID','Status'],writes:[]};
  const c=vm.createContext({Number,String,Object,APPROVAL_COLUMNS:['Approval ID','Status'],toA1Range_:(name,row,col)=>`${name}!${col}:${row}`,
    Sheets:{Spreadsheets:{Values:{batchUpdate:(body,id)=>state.writes.push({body,id})}}}});
  const sheet={spreadsheetId:'synthetic-sheet',sheetName:'Responses',getLastColumn:()=>state.headers.length,
    getRange:(row,col,height,width)=>{assert.deepEqual([row,col,height,width],[1,1,1,state.headers.length]);return {getValues:()=>[state.headers]};}};
  vm.runInContext(source,c);return {c,state,sheet};
}
test('writes only individual approval metadata cells, without reading or rewriting native answer rows',()=>{
  const {c,state,sheet}=fixture();c.ffWriteApprovalMetadata_(sheet,2,{'Approval ID':'synthetic','Status':'=literal text'});
  assert.deepEqual(JSON.parse(JSON.stringify(state.writes)),[{id:'synthetic-sheet',body:{valueInputOption:'RAW',data:[
    {range:'Responses!3:2',values:[['synthetic']]},{range:'Responses!4:2',values:[['=literal text']]}]}}]);
});
test('rejects header row, non-integral row, unknown answer field and empty update before any write',()=>{
  const {c,state,sheet}=fixture();for(const row of [0,1,2.5,NaN])assert.throws(()=>c.ffWriteApprovalMetadata_(sheet,row,{Status:'Pending'}),/verified approval row/);
  for(const data of [{Timestamp:'bad'},{'Customer answer':'bad'},{}])assert.throws(()=>c.ffWriteApprovalMetadata_(sheet,2,data),/Only approval metadata/);
  assert.equal(state.writes.length,0);
});
test('duplicate or missing metadata headers abort the entire batch',()=>{
  const {c,state,sheet}=fixture();state.headers.push('Status');assert.throws(()=>c.ffWriteApprovalMetadata_(sheet,2,{'Approval ID':'x',Status:'Pending'}),/missing or duplicated/);
  state.headers=['Timestamp','Customer answer'];assert.throws(()=>c.ffWriteApprovalMetadata_(sheet,2,{Status:'Pending'}),/missing or duplicated/);assert.equal(state.writes.length,0);
});
test('reserved question names fail closed regardless of case or surrounding whitespace',()=>{
  const {c}=fixture();for(const title of ['Status',' status ','APPROVAL ID'])assert.throws(()=>c.ffValidateReservedQuestionTitles_({getItems:()=>[{getType:()=> 'TEXT',getTitle:()=>title}]}),/reserved approval-column/);
  assert.throws(()=>c.ffValidateReservedQuestionTitles_({}),/Could not verify/);
});
test('non-answer section headings do not collide, while ordinary questions remain allowed',()=>{
  const {c}=fixture();assert.doesNotThrow(()=>c.ffValidateReservedQuestionTitles_({getItems:()=>[
    {getType:()=> 'SECTION_HEADER',getTitle:()=> 'Status'}, {getType:()=> 'TEXT',getTitle:()=> 'Customer name'}]}));
});
