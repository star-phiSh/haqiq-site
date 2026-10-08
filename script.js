(() => {
  function initThemeToggle() {
    const buttons = [...document.querySelectorAll('.theme-toggle')];
    if (!buttons.length) return;

    const applyTheme = (theme, persist = true) => {
      document.documentElement.dataset.theme = theme;
      if (persist) localStorage.setItem('haqiq-theme', theme);
      const isDark = theme === 'dark';
      buttons.forEach((button) => {
        const icon = button.querySelector('.theme-icon');
        if (icon) icon.textContent = isDark ? '☀' : '☾';
        button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        button.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        button.setAttribute('aria-pressed', String(isDark));
      });
    };

    applyTheme(document.documentElement.dataset.theme || 'light', false);
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
      });
    });
  }

  initThemeToggle();

  const navButtons = [...document.querySelectorAll('[data-demo-tab]')];
  const panels = [...document.querySelectorAll('[data-demo-panel]')];
  const feedback = document.getElementById('demo-feedback');

  function showTab(name) {
    navButtons.forEach((button) => button.classList.toggle('active', button.dataset.demoTab === name));
    panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.demoPanel === name));
    if (feedback) feedback.innerHTML = '<span>Viewing</span> ' + name.charAt(0).toUpperCase() + name.slice(1) + ' in the Haqiq demo.';
  }

  navButtons.forEach((button) => button.addEventListener('click', () => showTab(button.dataset.demoTab)));

  document.querySelectorAll('[data-demo-message]').forEach((button) => {
    button.addEventListener('click', () => {
      if (feedback) feedback.innerHTML = '<span>Demo</span> ' + button.dataset.demoMessage;
    });
  });

  const reportViews = {
    compliance: ['91%', 'Overall completion', '226 of 248 assigned training records are complete.'],
    attempts: ['312', 'Assessment attempts', 'Learners have submitted 312 assessment attempts across active courses.'],
    audit: ['1,482', 'Recorded events', 'Administrative and learning activity is available for audit review.']
  };

  document.querySelectorAll('[data-report]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-report]').forEach((b) => b.classList.toggle('active', b === button));
      const data = reportViews[button.dataset.report];
      const number = document.getElementById('demo-report-number');
      const title = document.getElementById('demo-report-title');
      const copy = document.getElementById('demo-report-copy');
      if (number) number.textContent = data[0];
      if (title) title.textContent = data[1];
      if (copy) copy.textContent = data[2];
      if (feedback) feedback.innerHTML = '<span>Report</span> Switched to ' + button.textContent.trim() + ' view.';
    });
  });

  const roles = {
    admin: {
      eyebrow: 'For administrators',
      title: 'Run training without chasing spreadsheets.',
      copy: 'Create courses, assign employees, follow progress, review attempts, issue certificates, and keep operational records in one place.',
      points: ['Course & lesson management', 'Assignments & employee status', 'Assessment and certificate controls'],
      window: 'Admin workspace',
      visual: '<div class="role-mini-card"><small>Completion</small><strong>91%</strong><i style="width:91%"></i></div><div class="role-mini-row"><span>Information Security</span><b>88%</b></div><div class="role-mini-row"><span>Workplace Safety</span><b>94%</b></div><div class="role-mini-row"><span>Code of Conduct</span><b>98%</b></div>'
    },
    learner: {
      eyebrow: 'For learners',
      title: 'Know what to learn, what is left, and what you earned.',
      copy: 'A focused learning experience keeps assigned training, lesson progress, assessments, and certificates easy to understand.',
      points: ['Clear assigned-learning queue', 'Lesson progress and assessment status', 'Certificates after eligible completion'],
      window: 'Learner workspace',
      visual: '<div class="role-mini-card"><small>My learning</small><strong>3 / 4</strong><i style="width:75%"></i></div><div class="role-mini-row"><span>Workplace Safety</span><b>Complete</b></div><div class="role-mini-row"><span>Information Security</span><b>In progress</b></div><div class="role-mini-row"><span>Code of Conduct</span><b>Complete</b></div>'
    },
    management: {
      eyebrow: 'For management',
      title: 'See whether training is actually complete.',
      copy: 'Use compliance views to understand completion, overdue learning, certificate status, and where follow-up is needed.',
      points: ['Completion visibility by team', 'Certificate and attempt records', 'Audit-friendly reporting'],
      window: 'Management view',
      visual: '<div class="role-mini-card"><small>Organization compliance</small><strong>91%</strong><i style="width:91%"></i></div><div class="role-mini-row"><span>Operations</span><b>96%</b></div><div class="role-mini-row"><span>Finance</span><b>89%</b></div><div class="role-mini-row"><span>Human Resources</span><b>93%</b></div>'
    }
  };

  document.querySelectorAll('[data-role-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const role = roles[button.dataset.roleTab];
      document.querySelectorAll('[data-role-tab]').forEach((b) => {
        const active = b === button;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });
      document.getElementById('role-eyebrow').textContent = role.eyebrow;
      document.getElementById('role-title').textContent = role.title;
      document.getElementById('role-copy').textContent = role.copy;
      document.getElementById('role-points').innerHTML = role.points.map((item) => '<span>' + item + '</span>').join('');
      document.getElementById('role-window-label').textContent = role.window;
      document.getElementById('role-window-body').innerHTML = role.visual;
    });
  });

  const dialog = document.getElementById('trial-dialog');
  document.querySelectorAll('[data-trial-open]').forEach((button) => {
    button.addEventListener('click', () => {
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
  document.querySelectorAll('[data-trial-close]').forEach((button) => {
    button.addEventListener('click', () => dialog && dialog.close());
  });
  if (dialog) {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  const trialForm = document.getElementById('trial-form');
  if (trialForm) {
    trialForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(trialForm);
      const company = form.get('company');
      const name = form.get('name');
      const email = form.get('email');
      const country = form.get('country');
      const subject = encodeURIComponent('Haqiq 7-Day Trial Request — ' + company);
      const body = encodeURIComponent(
        'Company: ' + company + '\n' +
        'Admin name: ' + name + '\n' +
        'Work email: ' + email + '\n' +
        'Country: ' + country + '\n\n' +
        'I would like to request a 7-day Haqiq trial.'
      );
      window.location.href = 'mailto:hello@haqiq.app?subject=' + subject + '&body=' + body;
    });
  }
})();