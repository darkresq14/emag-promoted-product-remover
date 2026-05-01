export default defineContentScript({
  matches: ['*://*.emag.ro/*', '*://*.emag.bg/*', '*://*.emag.hu/*'],
  runAt: 'document_idle',

  main() {
    const PROMOTED_SELECTOR =
      '.card-item:has(.card-v2-badge-cmp:not([class*="cmp-badge-"]))';

    let pageCount = 0;

    function removePromotedCards(): number {
      const cards = document.querySelectorAll(PROMOTED_SELECTOR);
      if (cards.length === 0) return 0;

      cards.forEach((card) => card.remove());
      pageCount += cards.length;

      browser.runtime.sendMessage({
        type: 'EPPR_PROMOTED_REMOVED',
        count: cards.length,
      });

      return cards.length;
    }

    removePromotedCards();

    const observer = new MutationObserver(() => {
      removePromotedCards();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === 'EPPR_GET_PAGE_COUNT') {
        sendResponse({ count: pageCount });
      }
    });
  },
});
