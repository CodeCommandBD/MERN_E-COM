/**
 * Guest Order Tracking Utility
 * Manages guest user ID for tracking orders before login
 */

const GUEST_ID_KEY = 'wearpoint_guest_id';

/**
 * Get or create a unique guest ID
 * @returns {string} Unique guest ID
 */
export const getOrCreateGuestId = () => {
  if (typeof window === 'undefined') return null;
  
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  
  if (!guestId) {
    // Generate a unique guest ID using timestamp + random string
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  
  return guestId;
};

/**
 * Get the current guest ID without creating one
 * @returns {string|null} Current guest ID or null
 */
export const getGuestId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(GUEST_ID_KEY);
};

/**
 * Migrate guest orders after user login
 * @param {string} guestId - The guest ID to migrate
 * @returns {Promise<Object>} Migration result
 */
export const migrateGuestOrders = async (guestId) => {
  if (!guestId) return { success: false, message: 'No guest ID provided' };

  try {
    const response = await fetch('/api/order/migrate-guest-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ guestId }),
    });

    const data = await response.json();
    
    if (data.success) {
      // Clear the guest ID after successful migration
      localStorage.removeItem(GUEST_ID_KEY);
    }
    
    return data;
  } catch (error) {
    console.error('Error migrating guest orders:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Clear guest ID (after successful migration)
 */
export const clearGuestId = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_ID_KEY);
};
