(function () {
  const root = document.querySelector('[data-app-quiz]');
  if (!root) return;

  const questions = [
    { key: 'q1_stop_earlier', text: 'How often do you end a day thinking “I should’ve stopped earlier”?', choices: ['Almost never', '1–2x per month', '1–2x per week', 'Most trading days'] },
    { key: 'q2_after_first_loss', text: 'What typically happens after your first loss of the day?', choices: ['I stop for the day', 'I become more selective', 'I take another trade quickly', 'I try to win it back'] },
    { key: 'q3_trades_per_day', text: 'How many trades do you usually place on a normal day?', choices: ['0–1', '2', '3–5', '6+'] },
    { key: 'q4_mistake_pattern', text: 'Which statement best matches your biggest mistake pattern?', choices: ['Entering too early', 'Chasing after missed moves', 'Moving stops / not respecting invalidation', 'Switching setups/instruments mid-day'] },
    { key: 'q5_when_up_day', text: 'When you’re up on the day, what’s most common?', choices: ['I stop and protect the day', 'I keep trading but stay calm', 'I give profits back sometimes', 'I often go green then red'] },
    { key: 'q6_risk_consistency', text: 'How consistent is your risk per trade?', choices: ['Fixed and unchanged', 'Mostly fixed, small deviations', 'Changes based on confidence', 'Increases after losses'] },
    { key: 'q7_switch_instruments', text: 'How often do you switch instruments within the same day?', choices: ['Never', 'Sometimes', 'Often', 'Almost every day'] },
    { key: 'q8_pre_trade_state', text: 'How do you feel right before taking a trade most days?', choices: ['Calm / neutral', 'Slightly excited', 'Pressured / rushed', 'Frustrated / emotional'] },
    { key: 'q9_process_structure', text: 'How structured is your trading process right now?', choices: ['Written rules + journal consistently', 'Written rules, journal sometimes', 'Rules in my head, journal rarely', 'No clear rules/journal'] },
    { key: 'q10_prop_status', text: 'Prop firm status (choose what describes your situation best):', choices: ['Not using prop firms', 'In evaluation/challenge', 'Funded (at least 1 account)', 'I often fail before payout'] }
  ];

  const scoring = {
    q1_stop_earlier: [
      {track: 'Process Building', leak: 'Session stop criteria drift', sev: 0},
      {track: 'Profit Protection', leak: 'Late-session discipline decay', sev: 1},
      {track: 'Overtrading Control', leak: 'Stopping threshold inconsistency', sev: 2},
      {track: 'Profit Protection', leak: 'Session stop failure', sev: 3}
    ],
    q2_after_first_loss: [
      {track: 'Risk Consistency', leak: 'Post-loss reset not defined', sev: 0},
      {track: 'Stop Rule Discipline', leak: 'Post-loss filter too loose', sev: 1},
      {track: 'Overtrading Control', leak: 'Immediate re-entry after loss', sev: 2},
      {track: 'Revenge Trading Prevention', leak: 'Loss-recovery impulse', sev: 3}
    ],
    q3_trades_per_day: [
      {track: 'Instrument Focus & Consistency', leak: 'Low sample routine consistency', sev: 0},
      {track: 'Risk Consistency', leak: 'Moderate trade frequency variance', sev: 1},
      {track: 'Overtrading Control', leak: 'High daily trade frequency', sev: 2},
      {track: 'Overtrading Control', leak: 'Very high daily trade frequency', sev: 3}
    ],
    q4_mistake_pattern: [
      {track: 'Stop Rule Discipline', leak: 'Entry timing discipline', sev: 2},
      {track: 'Revenge Trading Prevention', leak: 'FOMO chase behavior', sev: 3},
      {track: 'Stop Rule Discipline', leak: 'Invalidation rule breaks', sev: 3},
      {track: 'Instrument Focus & Consistency', leak: 'Mid-session setup switching', sev: 3}
    ],
    q5_when_up_day: [
      {track: 'Profit Protection', leak: 'Profit lock process missing', sev: 0},
      {track: 'Profit Protection', leak: 'Late-day overexposure risk', sev: 1},
      {track: 'Profit Protection', leak: 'Profit giveback tendency', sev: 2},
      {track: 'Profit Protection', leak: 'Green-to-red reversal pattern', sev: 3}
    ],
    q6_risk_consistency: [
      {track: 'Risk Consistency', leak: 'Risk consistency stable', sev: 0},
      {track: 'Risk Consistency', leak: 'Risk drift under pressure', sev: 1},
      {track: 'Risk Consistency', leak: 'Confidence-based size variance', sev: 2},
      {track: 'Revenge Trading Prevention', leak: 'Risk escalation after losses', sev: 3}
    ],
    q7_switch_instruments: [
      {track: 'Instrument Focus & Consistency', leak: 'Strong instrument focus', sev: 0},
      {track: 'Instrument Focus & Consistency', leak: 'Occasional instrument switching', sev: 1},
      {track: 'Instrument Focus & Consistency', leak: 'Frequent instrument switching', sev: 2},
      {track: 'Instrument Focus & Consistency', leak: 'Daily instrument hopping', sev: 3}
    ],
    q8_pre_trade_state: [
      {track: 'Process Building', leak: 'Pre-trade state controlled', sev: 0},
      {track: 'Stop Rule Discipline', leak: 'Activation-state drift', sev: 1},
      {track: 'Overtrading Control', leak: 'Rushed execution state', sev: 2},
      {track: 'Revenge Trading Prevention', leak: 'Emotion-driven execution state', sev: 3}
    ],
    q9_process_structure: [
      {track: 'Process Building', leak: 'Process already structured', sev: 0},
      {track: 'Process Building', leak: 'Journal consistency gap', sev: 1},
      {track: 'Process Building', leak: 'Unwritten rules dependency', sev: 2},
      {track: 'Process Building', leak: 'No stable operating process', sev: 3}
    ],
    q10_prop_status: [
      {track: 'Process Building', leak: 'General account process baseline', sev: 0},
      {track: 'Prop Survival Mode', leak: 'Evaluation phase rule stress', sev: 2},
      {track: 'Prop Survival Mode', leak: 'Funded account retention pressure', sev: 1},
      {track: 'Prop Survival Mode', leak: 'Pre-payout failure cycle', sev: 3}
    ]
  };

  const titleEl = root.querySelector('[data-title]');
  const progressEl = root.querySelector('[data-progress]');
  const choicesEl = root.querySelector('[data-choices]');
  const backBtn = root.querySelector('[data-back]');
  const nextBtn = root.querySelector('[data-next]');
  const navEl = root.querySelector('[data-nav]');
  const resultEl = root.querySelector('[data-result]');
  const resultHeadline = root.querySelector('[data-result-headline]');
  const resultTrack = root.querySelector('[data-result-track]');
  const resultList = root.querySelector('[data-result-list]');
  const applyRulesBtn = root.querySelector('[data-apply-rules]');
  const challengeLink = root.querySelector('[data-challenge-link]');

  let step = 0;
  const answers = {};

  function getUserId() {
    const key = 'ngu_user_id';
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const uid = 'ngu_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, uid);
    return uid;
  }

  function currentQ() {
    return questions[step];
  }

  function renderQuestion() {
    const q = currentQ();
    titleEl.textContent = q.text;
    progressEl.textContent = `${step + 1} / ${questions.length}`;

    choicesEl.innerHTML = '';
    q.choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quizChoice';
      btn.dataset.index = String(idx);
      btn.setAttribute('aria-pressed', answers[q.key] === idx ? 'true' : 'false');
      btn.textContent = choice;
      btn.addEventListener('click', () => {
        answers[q.key] = idx;
        Array.from(choicesEl.children).forEach((n) => n.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        nextBtn.disabled = false;
      });
      choicesEl.appendChild(btn);
    });

    nextBtn.textContent = step === questions.length - 1 ? 'See result' : 'Next';
    backBtn.disabled = step === 0;
    nextBtn.disabled = typeof answers[q.key] !== 'number';
  }

  function diagnose(payload) {
    const tracks = new Map();
    const leaks = new Map();

    Object.entries(payload).forEach(([key, index]) => {
      const row = scoring[key][index];
      tracks.set(row.track, (tracks.get(row.track) || 0) + row.sev + 1);
      leaks.set(row.leak, (leaks.get(row.leak) || 0) + row.sev + 1);
    });

    const focusTrack = [...tracks.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const leak = [...leaks.entries()].sort((a, b) => b[1] - a[1])[0][0];

    const rulesByTrack = {
      'Overtrading Control': {
        rule: 'Hard cap: maximum 2 trades per day for the next session.',
        target: 'For 7 days, keep at least 6/7 days at max 2 trades.',
        challenge: 'https://ngutrading.app/challenges/high-frequency-control'
      },
      'Stop Rule Discipline': {
        rule: 'Keep invalidation fixed: no stop movement after entry.',
        target: 'For 7 days, complete every trade with unchanged stop rules.',
        challenge: 'https://ngutrading.app/challenges/stop-discipline'
      },
      'Revenge Trading Prevention': {
        rule: 'After first loss, mandatory 20-minute cooldown before any next decision.',
        target: 'For 7 days, 100% compliance with post-loss cooldown.',
        challenge: 'https://ngutrading.app/challenges/revenge-prevention'
      },
      'Risk Consistency': {
        rule: 'Use one fixed risk unit per trade for the whole session.',
        target: 'For 7 days, no size increase after losses or confidence spikes.',
        challenge: 'https://ngutrading.app/challenges/risk-consistency'
      },
      'Instrument Focus & Consistency': {
        rule: 'Trade one instrument only per session.',
        target: 'For 7 days, zero mid-session instrument switches.',
        challenge: 'https://ngutrading.app/challenges/instrument-focus'
      },
      'Profit Protection': {
        rule: 'When daily target is hit, stop trading for the day.',
        target: 'For 7 days, zero green-to-red days.',
        challenge: 'https://ngutrading.app/challenges/profit-protection'
      },
      'Process Building': {
        rule: 'Write pre-market commitment and post-market journal before/after every session.',
        target: 'For 7 days, complete both checklists on all trading days.',
        challenge: 'https://ngutrading.app/challenges/process-builder'
      },
      'Prop Survival Mode': {
        rule: 'Trade challenge/funded account only after rule checklist is completed.',
        target: 'For 7 days, no rule-checklist skips before first trade.',
        challenge: 'https://ngutrading.app/challenges/prop-survival'
      }
    };

    const plan = rulesByTrack[focusTrack] || rulesByTrack['Process Building'];
    const resultSummaryItems = [
      `Primary diagnosis: ${leak}.`,
      `Session protection rule: ${plan.rule}`,
      `7-day measurable target: ${plan.target}`,
      'Next step in app: apply NGU preset rules, set pre-market commitment, then start the recommended challenge.'
    ];

    return { focusTrack, leak, resultSummaryItems, challenge: plan.challenge };
  }

  function persistResponse(answersMap, diag) {
    const userId = getUserId();
    const payload = {
      userId,
      createdAt: new Date().toISOString(),
      answers: answersMap,
      focusTrack: diag.focusTrack,
      leak: diag.leak,
      resultSummary: diag.resultSummaryItems.join(' ')
    };
    const key = 'ngu_quiz_responses';
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.push(payload);
    localStorage.setItem(key, JSON.stringify(arr));
    localStorage.setItem('ngu_quiz_last', JSON.stringify(payload));
    return payload;
  }

  function showResult() {
    const diag = diagnose(answers);
    persistResponse(answers, diag);

    titleEl.textContent = 'Result ready';
    progressEl.textContent = 'Complete';
    choicesEl.innerHTML = '';
    navEl.classList.add('hidden');
    resultEl.classList.remove('hidden');

    resultHeadline.textContent = `Your biggest leak is: ${diag.leak}`;
    resultTrack.textContent = `Focus Track: ${diag.focusTrack}`;
    resultList.innerHTML = '';
    diag.resultSummaryItems.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      resultList.appendChild(li);
    });

    challengeLink.href = diag.challenge;

    const rulesActive = localStorage.getItem('ngu_preset_rules_active') === '1';
    if (rulesActive) {
      applyRulesBtn.classList.add('hidden');
    }
  }

  applyRulesBtn?.addEventListener('click', () => {
    localStorage.setItem('ngu_preset_rules_active', '1');
    applyRulesBtn.textContent = 'NGU Preset Rules Applied';
    applyRulesBtn.disabled = true;
  });

  backBtn.addEventListener('click', () => {
    step = Math.max(0, step - 1);
    renderQuestion();
  });

  nextBtn.addEventListener('click', () => {
    const q = currentQ();
    if (typeof answers[q.key] !== 'number') return;

    if (step === questions.length - 1) {
      showResult();
      return;
    }
    step += 1;
    renderQuestion();
  });

  renderQuestion();
})();
