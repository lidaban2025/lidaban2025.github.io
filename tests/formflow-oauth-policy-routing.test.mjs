import test from'node:test';import assert from'node:assert/strict';import worker from'../worker.js';
test('old OAuth privacy and terms links redirect to the actual policies rather than the homepage fallback',async()=>{
 for(const [from,to]of [['/formflow-site/privacy.html','/formflow/privacy-policy.html'],['/formflow-site/privacy-policy.html','/formflow/privacy-policy.html'],['/formflow-site/terms.html','/formflow/terms-of-service.html'],['/formflow-site/terms-of-service.html','/formflow/terms-of-service.html'],['/formflow-site','/formflow/'],['/formflow-site/','/formflow/'],['/formflow-site/index.html','/formflow/']]){
  const response=await worker.fetch(new Request('https://formsuite.dev'+from+'?utm_source=oauth'),{ASSETS:{fetch:()=>{throw Error('Legacy route reached the asset fallback');}}},{});
  assert.equal(response.status,301);assert.equal(response.headers.get('location'),'https://formsuite.dev'+to+'?utm_source=oauth');
 }
});
test('existing product routes and similarly named unrelated paths keep their original asset handling',async()=>{
 for(const route of ['/formflow/privacy-policy.html','/formflow/terms-of-service.html','/formguard/','/formflow-site-other/privacy.html']){
  let calls=0;const response=await worker.fetch(new Request('https://formsuite.dev'+route),{ASSETS:{fetch:()=>{calls++;return new Response('existing assets',{status:200});}}},{});assert.equal(await response.text(),'existing assets');assert.equal(calls,1);
 }
});
test('the existing retired FormCopy redirect still happens before assets are served',async()=>{
 const response=await worker.fetch(new Request('https://formsuite.dev/formcopy/'),{ASSETS:{fetch:()=>{throw Error('Retired route served');}}},{});assert.equal(response.status,301);assert.equal(response.headers.get('location'),'https://formsuite.dev/');
});
