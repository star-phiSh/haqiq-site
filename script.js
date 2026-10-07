(() => {
  const navButtons = [...document.querySelectorAll('[data-demo-tab]')];
  const panels = [...document.querySelectorAll('[data-demo-panel]')];
  const feedback = document.getElementById('demo-feedback');

  function showTab(name) {
    navButtons.forEach((button) => button.classList.toggle('active', button.dataset.demoTab === name));
    panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.demoPanel === name));
    if (feedback) feedback.innerHTML = '<span>Viewing</span> ' + name.charAt(0).toUpperCase() + name.slice(1) + ' in the Haqiq demo.';
  }

  navButtons.forEach((button) => {
    button.addEventListener('click', () => showTab(button.dataset.demoTab));
  });

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
      document.getElementById('demo-report-number').textContent = data[0];
      document.getElementById('demo-report-title').textContent = data[1];
      document.getElementById('demo-report-copy').textContent = data[2];
      if (feedback) feedback.innerHTML = '<span>Report</span> Switched to ' + button.textContent.trim() + ' view.';
    });
  });
})();