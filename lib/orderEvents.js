// Custom event emitter for order count updates
export const ORDER_COUNT_CHANGED = 'orderCountChanged';

/**
 * Emit order count change event to trigger header update
 * Call this whenever an order is created, cancelled, or status changes
 */
export const emitOrderCountChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ORDER_COUNT_CHANGED));
  }
};
