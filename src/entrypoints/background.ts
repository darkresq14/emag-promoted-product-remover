import { totalRemoved } from '@/lib/storage';

export default defineBackground(() => {
  let pendingWrite: Promise<void> | null = null;

  function addRemoved(count: number) {
    const chain = pendingWrite ?? totalRemoved.getValue().then(() => {});
    pendingWrite = chain.then(async () => {
      const current = await totalRemoved.getValue();
      await totalRemoved.setValue(current + count);
    });
  }

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'EPPR_PROMOTED_REMOVED') {
      addRemoved(message.count);
    }

    if (message.type === 'EPPR_GET_TOTAL_COUNT') {
      totalRemoved.getValue().then((count) => {
        sendResponse({ count });
      });
      return true;
    }
  });
});
