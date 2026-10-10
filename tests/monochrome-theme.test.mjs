import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const css = read('styles.css');
const pages = [
  'index.html', 'ar/index.html', 'support/index.html', 'ar/support/index.html',
  'privacy/index.html', 'ar/privacy/index.html',
  'activate/index.html', 'verify-trial/index.html',
];
const token = (name, theme = 'light') => {
  const block = theme === 'dark'
    ? css.split(':root[data-theme="dark"] {')[1]?.split('}')[0]
    : css.split(':root {')[1]?.split('}')[0];
  assert.ok(block, `${theme} root exists`);
  const m = block.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  assert.ok(m, `missing ${theme} token ${name}`);
  return m[1];
};
const lum = hex => [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255)
  .map(c => c <= .04045 ? c / 12.92 : ((c+.055)/1.055)**2.4)
  .reduce((v,c,i)=>v+c*[.2126,.7152,.0722][i],0);
const contrast = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);

test('public site precisely matches Haqiq monochrome premium app tokens',()=>{
 const p = {
  ink:'#1D2024',muted:'#555B63','muted-2':'#676D74',line:'#E5E7EB',
  'line-strong':'#B9BEC5',canvas:'#F7F8FA',panel:'#FFFFFF',
  brand:'#25272B','brand-hover':'#111316','brand-subtle':'#F0F1F3',
 };
 for (const [name,value] of Object.entries(p)) assert.equal(token(name),value,name);
 assert.ok(contrast(token('ink'),token('panel'))>=7);
 assert.ok(contrast(token('muted'),token('canvas'))>=4.5);
 assert.ok(contrast(token('muted-2'),token('panel'))>=4.5);
 assert.ok(contrast(token('panel'),token('brand'))>=7);
 assert.ok(contrast(token('brand'),token('brand-subtle'))>=4.5);
});

test('light and dark themes remain neutral and dark text is legible',()=>{
 assert.equal(token('canvas','dark'),'#202328');
 assert.equal(token('panel','dark'),'#181B1F');
 assert.equal(token('brand','dark'),'#DDE0E4');
 assert.ok(contrast(token('ink','dark'),token('panel','dark'))>=7);
 assert.ok(contrast(token('muted','dark'),token('panel','dark'))>=4.5);
 assert.ok(css.includes(':root[data-theme="dark"] .primary:hover'));
 assert.ok(!/#176B5B|#4FB49F|#182F27|#EDF4F0/i.test(css),'legacy green accent does not return');
 assert.match(css,/\.trial-status\.success\{color:var\(--success\)\}/,'success feedback retains its semantic hue');
 assert.match(css,/\.trial-status\.error\{color:var\(--danger\)\}/,'error feedback retains its semantic hue');
});

test('every live page loads versioned CSS and keeps routing/trial assets',()=>{
 for(const page of pages){
  const html=read(page);
  assert.match(html,/styles\.css\?v=20261010-monochrome/,`asset cache update: ${page}`);
  assert.match(html,/<meta name="viewport"/,`mobile support: ${page}`);
 }
 for (const page of ['index.html','ar/index.html']){
  const html=read(page);
  assert.match(html,/data-trial-open/,`trial trigger: ${page}`);
  assert.match(html,/id="trial-form"/,`trial form: ${page}`);
  assert.match(html,/data-lang="en"/,`English toggle: ${page}`);
  assert.match(html,/data-lang="ar"/,`Arabic toggle: ${page}`);
  assert.match(html,/src="(?:\.\.\/)?script\.js/,`website interactions: ${page}`);
 }
 const english=read('index.html'),arabic=read('ar/index.html');
 assert.match(english,/src="trial\.js/, 'English homepage keeps automated trial verification flow');
 assert.match(english,/<html lang="en">/);
 assert.match(arabic,/<html lang="ar" dir="rtl">/);
 assert.match(css,/html\[dir="rtl"\]/,'RTL styles retained');
});

test('premium white is the default but user-selected dark mode still works',()=>{
 for(const page of ['index.html','ar/index.html','support/index.html','ar/support/index.html','privacy/index.html','ar/privacy/index.html']){
  const html=read(page);
  assert.match(html,/const preferred = 'light'/,`site default: ${page}`);
  assert.match(html,/const saved = localStorage\.getItem\('haqiq-theme'\)/,`stored preference: ${page}`);
  assert.match(html,/dataset\.theme = saved \|\| preferred/,`saved preference honored: ${page}`);
 }
 const script=read('script.js');
 assert.match(script,/applyTheme\(/,'working theme toggle preserved');
 assert.match(script,/localStorage\.setItem\('haqiq-theme'/,'theme changes remain user-controlled');
});
