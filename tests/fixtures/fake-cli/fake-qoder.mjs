// Stands in for `qodercli` in tests: answers --version, and for `-p` logs its arguments and prompt to
// $FAKE_LOG, then prints the stream-json events a real run would. Qoder has no schema flag, so the answer
// comes back as JSON in the result text. A prompt containing "SIGNED-OUT" fails the way Qoder does when
// nobody is signed in: an error result, whose message is in errors rather than in result.
import fs from 'node:fs';

const args = process.argv.slice(2);
if (args[0] === '--version') { console.log('1.0.0 (Qoder CLI, test)'); process.exit(0); }
let input = '';
process.stdin.on('data', (d) => { input += d; });
process.stdin.on('end', () => {
  fs.appendFileSync(process.env.FAKE_LOG, JSON.stringify({ args, input }) + '\n');
  const out = (ev) => console.log(JSON.stringify(ev));
  out({ type: 'system', subtype: 'init', session_id: 'test-session', qodercli_version: '1.0.0-test' });
  if (input.includes('SIGNED-OUT')) {
    out({ type: 'result', subtype: 'error_during_execution', is_error: true, session_id: 'test-session', errors: ['You are not logged in. Run /login to sign in.'] });
    return;
  }
  out({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Bash', input: { command: 'node floorplan/query.mjs overview' } }] } });
  out({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Read', input: { file_path: 'shop-api/routes/orders.js' } }] } });
  out({ type: 'result', subtype: 'success', is_error: false, session_id: 'test-session', result: JSON.stringify({
    title: 'Refunds', answer: 'Refunds go through [[f:shop-api/routes/orders.js]].',
    items: [{ id: 'f:shop-api/routes/orders.js', note: 'Holds the refund endpoint.' }], steps: [], followups: ['Who can ask for one?'],
  }) });
});