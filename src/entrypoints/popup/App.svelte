<script lang="ts">
  import { totalRemoved } from '@/lib/storage';

  let pageCount = $state<number>(0);
  let totalCount = $state<number>(0);
  $effect(() => {
    totalRemoved.getValue().then((count) => {
      totalCount = count;
    });

    browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (!tab.id) return;
      browser.tabs
        .sendMessage(tab.id, { type: 'EPPR_GET_PAGE_COUNT' })
        .then((response) => {
          if (response) pageCount = response.count;
        })
        .catch(() => {});
    });

    const unwatch = totalRemoved.watch((newValue) => {
      totalCount = newValue;
    });

    return unwatch;
  });

  const streamChars = $derived(
    Array.from(
      { length: 60 },
      () =>
        '0123456789ABCDEF█▓▒░'[Math.floor(Math.random() * 19)],
    ).join(''),
  );
</script>

<div class="popup">
  <div class="header">
    <div class="corner-tr"></div>
    <div class="corner-bl"></div>
    <div class="corner-br"></div>

    <div class="header-top">
      <svg class="shield-icon" viewBox="0 0 40 48" fill="none">
        <path
          d="M20 2L4 10v14c0 11.1 6.8 21.5 16 24 9.2-2.5 16-12.9 16-24V10L20 2z"
          stroke="#00f0ff"
          stroke-width="2"
          fill="rgba(0,240,255,0.05)"
        />
        <path
          d="M14 24l4 4 8-8"
          stroke="#00f0ff"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M20 2L4 10v14c0 11.1 6.8 21.5 16 24"
          stroke="#00f0ff"
          stroke-width="0.5"
          fill="none"
          opacity="0.2"
        />
      </svg>

      <div class="header-text">
        <span class="header-title">eMAG Ad Remover</span>
        <span class="header-subtitle">Promoted threat neutralized</span>
      </div>
    </div>
  </div>

  <div class="status-bar">
    <div class="status-dot"></div>
    <span class="status-text">Protection active</span>
  </div>

  <div class="stats">
    <div class="stat-row page">
      <div class="stat-info">
        <span class="stat-label">Current Page</span>
      </div>
      <div class="stat-value-wrap">
        <span class="stat-value">{pageCount}</span>
        <span class="stat-unit">ads</span>
      </div>
    </div>

    <div class="stat-row total">
      <div class="stat-info">
        <span class="stat-label">Lifetime kills</span>
      </div>
      <div class="stat-value-wrap">
        <span class="stat-value">{totalCount}</span>
        <span class="stat-unit">ads</span>
      </div>
    </div>
  </div>

  <div class="data-stream">
    <span class="stream-text">{streamChars}</span>
  </div>

  <div class="footer">
    <span class="footer-label">Ad blocker protocol</span>
    <span class="footer-version">v0.1.0</span>
  </div>
</div>
