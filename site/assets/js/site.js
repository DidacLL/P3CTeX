/**
 * P3CTeX Public Documentation & Interactive Scripts
 * Lightweight, accessible, zero-dependency ES6
 */

(function () {
  'use strict';

  // --- 1. Toast Notification Utility ---
  function showToast(message) {
    let toast = document.getElementById('site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.className = 'toast-notice';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
  window.showToast = showToast;

  // --- 2. Universal Clipboard Copy Utility ---
  function copyTextToClipboard(text, onSuccess, onError) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        fallbackCopy(text, onSuccess, onError);
      });
    } else {
      fallbackCopy(text, onSuccess, onError);
    }
  }

  function fallbackCopy(text, onSuccess, onError) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        if (onSuccess) onSuccess();
      } else {
        if (onError) onError();
      }
    } catch (err) {
      if (onError) onError(err);
    }
  }
  window.copyTextToClipboard = copyTextToClipboard;

  // --- 3. DOM Content Loaded Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Drawer Navigation ---
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
          mobileDrawer.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        } else {
          mobileDrawer.classList.add('open');
          mobileToggle.setAttribute('aria-expanded', 'true');
        }
      });

      // Close on clicking links inside drawer
      mobileDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
          mobileDrawer.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.focus();
        }
      });
    }

    // --- Code Snippet Copy Buttons ---
    document.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy-target');
        let codeText = '';
        if (targetId) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) codeText = targetEl.textContent;
        } else {
          const codeBox = btn.closest('.code-box');
          if (codeBox) {
            const codeEl = codeBox.querySelector('pre code') || codeBox.querySelector('pre');
            if (codeEl) codeText = codeEl.textContent;
          }
        }

        if (codeText) {
          copyTextToClipboard(codeText, () => {
            const originalHTML = btn.innerHTML;
            btn.classList.add('copied');
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> Copied!`;
            showToast('LaTeX code copied to clipboard');
            setTimeout(() => {
              btn.classList.remove('copied');
              btn.innerHTML = originalHTML;
            }, 2500);
          }, () => {
            showToast('Failed to copy code. Please select manually.');
          });
        }
      });
    });

    // --- Image Prompt Copy Buttons ---
    document.querySelectorAll('.btn-copy-prompt').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy-target');
        let promptText = '';
        if (targetId) {
          const targetEl = document.getElementById(targetId);
          if (targetEl) promptText = targetEl.textContent.trim();
        } else {
          const card = btn.closest('.image-placeholder-card');
          if (card) {
            const promptEl = card.querySelector('.prompt-text');
            if (promptEl) promptText = promptEl.textContent.trim();
          }
        }

        if (promptText) {
          copyTextToClipboard(promptText, () => {
            const originalHTML = btn.innerHTML;
            btn.classList.add('copied');
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> Prompt Copied!`;
            showToast('Image prompt copied to clipboard');
            setTimeout(() => {
              btn.classList.remove('copied');
              btn.innerHTML = originalHTML;
            }, 2500);
          }, () => {
            showToast('Failed to copy prompt.');
          });
        }
      });
    });

    // --- URL Hash Listener for Details / Accordions ---
    function expandDetailsTarget() {
      const hash = window.location.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (target) {
        const parentDetails = target.closest('details');
        if (parentDetails) {
          parentDetails.open = true;
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    window.addEventListener('hashchange', expandDetailsTarget);
    expandDetailsTarget();

    // --- Global Accordion Expand/Collapse Toggle ---
    const accordionToggleBtn = document.getElementById('btn-toggle-all-chapters');
    if (accordionToggleBtn) {
      accordionToggleBtn.addEventListener('click', () => {
        const chapters = document.querySelectorAll('.guide-chapter');
        const anyClosed = Array.from(chapters).some(ch => !ch.open);
        chapters.forEach(ch => {
          ch.open = anyClosed;
        });
        accordionToggleBtn.textContent = anyClosed ? 'Collapse All Chapters' : 'Expand All Chapters';
      });
    }
  });
})();
