<script lang="ts" module>
  declare const __APP_VERSION__: string;
</script>

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
      <img class="shield-icon" src="/icon/shield.svg" alt="shield" />

      <div class="header-text">
        <span class="header-title">eMAG Promoted Remover</span>
      </div>
    </div>
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
    <span class="footer-version">v${__APP_VERSION__}</span>
  </div>
</div>
