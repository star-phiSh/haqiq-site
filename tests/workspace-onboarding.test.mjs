import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('both signup pages ask for a proposed tenant address alongside company name',()=>{
 for(const p of ['index.html','ar/index.html']){
  const html=read(p);
  assert.match(html,/name="company"/);
  assert.match(html,/name="requested_slug"/);
  assert.match(html,/workspace-address-status/);
  assert.match(html,/src="(?:\.\.\/)?trial\.js\?v=20261025-workspace-onboarding"/);
  assert.match(html,/name="email"/);
 }
});
test('public registration includes preflight validation and proposed slug in request',()=>{
 const js=read('trial.js');
 assert.match(js,/check_workspace_slug/);
 assert.match(js,/requested_slug:String\(data\.get\('requested_slug'\)/);
 assert.match(js,/if\(!await checkAddress\(\)\)/);
 assert.match(js,/workspaceCustomized/);
 assert.match(js,/reserved=new Set/);
});
test('addresses are not presented as assigned before email verification',()=>{
 const html=read('index.html');
 assert.match(html,/reserved after email verification and approval/);
 assert.match(read('trial.js'),/reserved after email verification/);
});
