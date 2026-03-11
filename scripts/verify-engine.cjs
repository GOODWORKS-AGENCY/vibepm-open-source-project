const fs = require('fs');

const prd = JSON.parse(fs.readFileSync('knowledge/PRD.json', 'utf8'));
const refs = new Set();
prd.tasks.forEach(t => (t.wat_references || []).forEach(r => refs.add(r)));
const missing = Array.from(refs).filter(r => !fs.existsSync(r));

console.log('=== WAT REFERENCES ===');
console.log('Unique refs:', refs.size, '| All exist:', missing.length === 0);
missing.forEach(m => console.log('  MISSING:', m));

console.log('\n=== ENGINE STATS ===');
console.log('Tasks:', prd.total_tasks, '| Phases:', prd.phases.length);

const withRefs = prd.tasks.filter(t => t.wat_references.length > 0).length;
console.log('Tasks with refs:', withRefs, '| Without:', prd.total_tasks - withRefs);

let total = 0;
function countDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(f => {
    if (f.isDirectory()) countDir(dir + '/' + f.name);
    else total++;
  });
}
countDir('.claude');
countDir('knowledge');
countDir('doc');
console.log('Total engine files:', total);
