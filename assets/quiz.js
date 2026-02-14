(function () {
  const flows = document.querySelectorAll('[data-quiz-flow]');
  if (!flows.length) return;

  const scoreMap = {
    challenge: {
      discipline: { advanced: 2, coach: 1 },
      consistency: { coach: 2, free: 1 },
      strategy: { advanced: 2, coach: 1 },
      psychology: { coach: 2, free: 1 }
    },
    level: {
      beginner: { free: 2, coach: 1 },
      intermediate: { coach: 2, advanced: 1 },
      advanced: { advanced: 2, coach: 1 }
    },
    feature: {
      community: { free: 2, coach: 1 },
      ai: { coach: 3 },
      structure: { advanced: 2, coach: 1 },
      accountability: { coach: 2, free: 1 }
    },
    time: {
      t15: { free: 2, coach: 1 },
      t30: { coach: 2, free: 1 },
      t60: { advanced: 2, coach: 1 },
      t90: { advanced: 3 }
    }
  };

  const routes = {
    free: '/free-access/',
    coach: '/coach-bot/',
    advanced: '/advanced/'
  };

  function decideRoute(answers) {
    const score = { free: 0, coach: 0, advanced: 0 };
    Object.entries(answers).forEach(([key, value]) => {
      const deltas = scoreMap[key] && scoreMap[key][value];
      if (!deltas) return;
      Object.entries(deltas).forEach(([bucket, add]) => {
        score[bucket] += add;
      });
    });

    let winner = 'free';
    if (score.coach >= score.free && score.coach >= score.advanced) winner = 'coach';
    if (score.advanced > score.coach && score.advanced >= score.free) winner = 'advanced';
    return winner;
  }

  flows.forEach((flow) => {
    const steps = Array.from(flow.querySelectorAll('.quizStep'));
    const answers = {};
    let current = 0;

    const nextBtn = flow.querySelector('[data-next]');
    const backBtn = flow.querySelector('[data-back]');
    const submitBtn = flow.querySelector('[data-submit]');
    const progress = flow.querySelector('[data-progress]');
    const note = flow.querySelector('[data-quiz-note]');

    function render() {
      steps.forEach((step, index) => {
        step.hidden = index !== current;
      });

      const key = steps[current].dataset.question;
      const isAnswered = Boolean(answers[key]);
      const isLast = current === steps.length - 1;

      if (progress) {
        progress.textContent = `${current + 1} / ${steps.length}`;
      }

      if (backBtn) backBtn.disabled = current === 0;
      if (nextBtn) {
        nextBtn.hidden = isLast;
        nextBtn.disabled = !isAnswered;
      }
      if (submitBtn) {
        submitBtn.hidden = !isLast;
        submitBtn.disabled = !isAnswered;
      }
    }

    steps.forEach((step) => {
      const key = step.dataset.question;
      const choices = step.querySelectorAll('.quizChoice');
      choices.forEach((choice) => {
        choice.addEventListener('click', () => {
          answers[key] = choice.dataset.value;
          choices.forEach((x) => x.setAttribute('aria-pressed', 'false'));
          choice.setAttribute('aria-pressed', 'true');
          if (note) note.textContent = '';
          render();
        });
      });
    });

    nextBtn?.addEventListener('click', () => {
      current = Math.min(current + 1, steps.length - 1);
      render();
    });

    backBtn?.addEventListener('click', () => {
      current = Math.max(current - 1, 0);
      render();
    });

    submitBtn?.addEventListener('click', () => {
      const winner = decideRoute(answers);
      if (note) note.textContent = flow.dataset.redirectText || 'Redirecting…';
      setTimeout(() => {
        window.location.href = routes[winner];
      }, 300);
    });

    render();
  });
})();
