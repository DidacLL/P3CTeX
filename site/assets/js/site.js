/* ==========================================================================
   P3CTeX Public Documentation & Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. One-Click Copy Buttons for Code Boxes & Image Prompts
  setupCopyButtons();

  // 2. Interactive Showcase Tabs
  setupShowcaseTabs();

  // 3. Highlight Current Navigation Item
  setupNavHighlight();
});

function setupCopyButtons() {
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetSelector = button.getAttribute('data-copy-target');
      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) return;

      const textToCopy = targetElement.innerText || targetElement.textContent;
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = button.innerText;
        button.innerText = 'COPIED!';
        button.classList.add('copied');
        setTimeout(() => {
          button.innerText = originalText;
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  });
}

function setupShowcaseTabs() {
  document.querySelectorAll('.showcase-tab-bar').forEach(tabBar => {
    const tabs = tabBar.querySelectorAll('.showcase-tab');
    const container = tabBar.closest('.showcase-container');
    if (!container) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab-target');
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        container.querySelectorAll('.showcase-panel').forEach(panel => {
          if (panel.id === targetId) {
            panel.classList.add('active');
            panel.hidden = false;
          } else {
            panel.classList.remove('active');
            panel.hidden = true;
          }
        });
      });
    });
  });
}

function setupNavHighlight() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });
}
