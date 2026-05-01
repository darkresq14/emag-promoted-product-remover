export default defineContentScript({
  matches: ['*://*.emag.ro/*', '*://*.emag.bg/*', '*://*.emag.hu/*'],
  runAt: 'document_idle',

  main() {
    let pageCount = 0;

    function removePromotedCards(): number {
      const cards = document.querySelectorAll('.card-item[data-url]');
      if (cards.length === 0) return 0;

      const promotedCards = Array.from(cards).filter((card) => {
        const url = card.getAttribute('data-url') || '';
        return url.includes('sponsored_products') || url.includes('recads');
      });

      if (promotedCards.length === 0) return 0;

      promotedCards.forEach((card) => card.remove());
      pageCount += promotedCards.length;

      browser.runtime.sendMessage({
        type: 'EPPR_PROMOTED_REMOVED',
        count: promotedCards.length,
      });

      return promotedCards.length;
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
