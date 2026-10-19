const stages = [
  { label: '01 / COLLECT', title: 'An endpoint event arrives.', description: 'A sample authentication log records repeated failed sign-in attempts. It is an observation that needs context.', note: 'A failed login alone is not proof of a compromise. Start with the source, timing, and account involved.', log: '[09:41:02] Receiving endpoint telemetry…\n[09:41:03] source: workstation-07\n[09:41:03] event: authentication_failed\n[09:41:03] user: demo.user\n[09:41:03] source_ip: 192.0.2.42\n\n→ Event collected. Waiting for correlation.' },
  { label: '02 / DETECT', title: 'A pattern becomes an alert.', description: 'The demo detection groups eight failed sign-ins within two minutes and raises an alert for review.', note: 'Detection creates a starting point. Check for routine user errors, approved testing, and related events.', log: '[09:43:01] Evaluating authentication rule…\n[09:43:01] failures: 8 / window: 120 seconds\n[09:43:02] threshold matched\n[09:43:02] alert: repeated authentication failures\n[09:43:02] priority: medium\n\n→ Alert queued for enrichment.' },
  { label: '03 / ENRICH', title: 'Context joins the investigation.', description: 'A simulated workflow gathers account history and indicator context, keeping the raw evidence attached.', note: 'Reputation is one signal. A clean or unknown IP should never automatically close an investigation.', log: '[09:43:04] Starting enrichment workflow…\n[09:43:05] indicator: 192.0.2.42\n[09:43:05] reputation: unknown (sample data)\n[09:43:06] asset: workstation-07\n[09:43:06] account history attached\n\n→ Context packaged for analyst review.' },
  { label: '04 / INVESTIGATE', title: 'An analyst follows the evidence.', description: 'A sample case links the failed attempts with a later successful login. The analyst requests verification of the activity.', note: 'Validate the successful login, review the affected account, and establish a timeline before deciding what to do.', log: '[09:44:10] Opening sample case SOC-DEMO-001…\n[09:44:11] evidence: 8 failed authentications\n[09:44:11] related event: subsequent login\n[09:44:12] verification: required\n[09:44:12] status: under investigation\n\n→ Analyst reviews timeline and scope.' },
  { label: '05 / RESPOND', title: 'A response, with a record.', description: 'For this fictional scenario, the activity is confirmed as unauthorized. The case records a session revocation and an account security review.', note: 'In a real environment, containment follows the organization’s approved process and the evidence available.', log: '[09:49:00] Sample verification: unauthorized\n[09:49:01] decision: contain affected session\n[09:49:02] simulated session revocation recorded\n[09:49:03] account review: assigned\n[09:49:04] detection improvement: documented\n\n✓ Demo complete. No real actions performed.' }
];
const steps = [...document.querySelectorAll('.step')];
let current = 0;
let timer;
const play = document.querySelector('#play');
function showStage(index) {
  current = index;
  const stage = stages[index];
  steps.forEach((button, i) => { button.classList.toggle('active', i === index); button.setAttribute('aria-pressed', String(i === index)); });
  document.querySelector('#event-log').textContent = stage.log;
  for (const [selector, value] of Object.entries({ '#event-label': stage.label, '#event-title': stage.title, '#event-description': stage.description, '#event-note': stage.note })) document.querySelector(selector).textContent = value;
}
function stopReplay() { clearInterval(timer); timer = undefined; play.textContent = '▶ Play replay'; }
steps.forEach((button, index) => button.addEventListener('click', () => { stopReplay(); showStage(index); }));
play.addEventListener('click', () => {
  if (timer) return stopReplay();
  if (current === stages.length - 1) showStage(0);
  play.textContent = 'Ⅱ Pause replay';
  timer = setInterval(() => { if (current < stages.length - 1) showStage(current + 1); if (current === stages.length - 1) stopReplay(); }, 3200);
});
const theme = document.querySelector('#theme');
function setTheme(dark) { document.body.classList.toggle('dark', dark); theme.querySelector('span').textContent = dark ? 'Light' : 'Dark'; theme.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme'); }
try { setTheme(localStorage.getItem('abeera-theme') !== 'light'); } catch { setTheme(true); }
theme.addEventListener('click', () => { const dark = !document.body.classList.contains('dark'); setTheme(dark); try { localStorage.setItem('abeera-theme', dark ? 'dark' : 'light'); } catch { /* Theme still works without persistence. */ } });
document.querySelector('#year').textContent = new Date().getFullYear();
showStage(0);
