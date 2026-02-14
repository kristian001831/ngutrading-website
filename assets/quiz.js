(function () {
  const forms = document.querySelectorAll('[data-onboarding-quiz]');

  // Weighted routing map; highest score wins.
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
    return { winner, score };
  }

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const answers = {
        challenge: data.get('challenge'),
        level: data.get('level'),
        feature: data.get('feature'),
        time: data.get('time')
      };

      if (Object.values(answers).some((v) => !v)) {
        const msg = form.querySelector('[data-quiz-message]');
        if (msg) msg.textContent = form.dataset.msgRequired || 'Please answer all questions.';
        return;
      }

      const result = decideRoute(answers);
      const msg = form.querySelector('[data-quiz-message]');
      if (msg) msg.textContent = form.dataset.msgRedirect || 'Redirecting to your best fit...';

      // Short delay for UX clarity.
      setTimeout(() => {
        window.location.href = routes[result.winner];
      }, 350);
    });
  });
})();
