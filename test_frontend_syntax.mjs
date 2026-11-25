import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const dir=new URL('./frontend/',import.meta.url);
for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.js'))){new vm.Script(fs.readFileSync(new URL(name,dir),'utf8'),{filename:name});}
const revision=fs.readFileSync(new URL('revision.js',dir),'utf8');
const match=revision.match(/raw\.match\(\/(.+?)\/\)/);assert.ok(match,'manual invitation parser exists');
const pattern=new RegExp(match[1]);const token='a'.repeat(24)+'.'+'b'.repeat(64);
assert.ok(pattern.test('https://example.org/?invite='+token));
assert.ok(pattern.test('https://example.org/#invite='+token));
assert.ok(pattern.test('https://example.org/?invite='+token+'&other=1'));
assert.equal(pattern.test('https://example.org/?invite='+token.slice(0,-1)),false);
assert.equal(pattern.test('not an invitation'),false);
console.log('PASS: every frontend script parses; complete query/hash invitations accepted and truncated links rejected');
