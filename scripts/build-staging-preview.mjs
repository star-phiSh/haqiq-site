import fs from 'node:fs';
import path from 'node:path';
const ref = process.env.HAQIQ_STAGING_PROJECT_REF;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (ref !== 'kiptwhbdzddyhjpedooe' || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key ?? '')) throw Error('Explicit isolated staging credentials required');
const origin = 'https://saas-onboarding-wild-boat-a57c.ncal-hamadah.workers.dev';
const login = 'https://saas-login-haqiq-web-app.ncal-hamadah.workers.dev';
const output = path.resolve('.staging-preview/dist');
fs.mkdirSync(output, { recursive: true });
function copy(source) {
  if (fs.statSync(source).isDirectory()) { for (const name of fs.readdirSync(source)) copy(path.join(source,name)); return; }
  const destination = path.join(output,source);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (!/\.(html|js|css|svg)$/.test(source)) { fs.copyFileSync(source,destination); return; }
  let text = fs.readFileSync(source,'utf8').replaceAll('bdnjsszeprhztgjlfrdh',ref)
    .replace(/sb_publishable_[A-Za-z0-9_-]+/g,key)
    .replaceAll('https://app.haqiq.app',login).replaceAll('https://haqiq.app',origin);
  if (source.endsWith('.html')) text = text.replace(/<body([^>]*)>/,`<body$1><aside role="note" style="padding:12px;background:#fff2bf;color:#242424;text-align:center">Development Preview - synthetic registrations only. Workspace names receive isolated test hosts.</aside>`);
  text = text.replaceAll('class="workspace-address-suffix">.haqiq.app','class="workspace-address-suffix"> (staging)');
  if (text.includes('bdnjsszeprhztgjlfrdh')) throw Error('Production API reference in Preview');
  fs.writeFileSync(destination,text);
}
for (const name of ['index.html','script.js','trial.js','styles.css','activate','verify-trial','ar','assets','privacy','support']) copy(name);
fs.writeFileSync('.staging-preview/wrangler.json',JSON.stringify({name:'wild-boat-a57c',main:'../scripts/staging-worker.mjs',compatibility_date:'2026-10-07',assets:{directory:'dist',binding:'ASSETS',run_worker_first:true},previews:{vars:{HAQIQ_ENVIRONMENT:'preview'}}},null,2));
console.log('Built isolated website Preview; production publishing is not part of this command.');

