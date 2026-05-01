import { storage } from '#imports';

export const totalRemoved = storage.defineItem<number>('local:eppr_totalRemoved', {
  fallback: 0,
});
