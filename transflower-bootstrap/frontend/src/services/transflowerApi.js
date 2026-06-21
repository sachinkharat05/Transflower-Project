const GUEST_CART_KEY = 'tf_guest_cart';

function getStoredUserRaw() {
  return localStorage.getItem('tf_currentUser');
}

export function getCurrentUser() {
  const raw = getStoredUserRaw();
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) localStorage.setItem('tf_currentUser', JSON.stringify(user));
  else localStorage.removeItem('tf_currentUser');
}

export async function apiJson(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  let body = options.body;
  if (body != null && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(path, { ...options, headers, body });
  } catch {
    return {
      res: { ok: false, status: 0 },
      data: {
        success: false,
        message: 'Backend server is not running. Start it from backend/ with npm run dev, then try again.'
      }
    };
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON */
  }
  return { res, data };
}

const API_BASE = '/api';

function notifyCartChanged() {
  window.dispatchEvent(new Event('tf_cart_changed'));
}

function notifyUserChanged() {
  window.dispatchEvent(new Event('tf_user_changed'));
}

async function mergeGuestCartIntoServer(userId) {
  const raw = localStorage.getItem(GUEST_CART_KEY);
  if (!raw) return;
  let items;
  try {
    items = JSON.parse(raw);
  } catch {
    localStorage.removeItem(GUEST_CART_KEY);
    return;
  }
  if (!Array.isArray(items) || items.length === 0) {
    localStorage.removeItem(GUEST_CART_KEY);
    return;
  }
  for (const item of items) {
    const qty = Math.max(1, Number(item.quantity) || 1);
    await apiJson(`${API_BASE}/cart/${userId}/items`, {
      method: 'POST',
      body: { productId: item.id, quantity: qty }
    });
  }
  localStorage.removeItem(GUEST_CART_KEY);
  notifyCartChanged();
}

export async function loginUser(email, password) {
  const { res, data } = await apiJson(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: { email, password }
  });
  if (res.ok && data.success && data.user) {
    setCurrentUser(data.user);
    try {
      await mergeGuestCartIntoServer(data.user.id);
    } catch (e) {
      console.warn('Guest cart merge failed:', e?.message || e);
    }
    notifyCartChanged();
    notifyUserChanged();
    return {
      success: true,
      message: data.message || 'Login successful!',
      user: data.user
    };
  }
  return { success: false, message: data.message || 'Invalid email or password!' };
}

export async function registerUser(userData) {
  const { res, data } = await apiJson(`${API_BASE}/auth/register`, {
    method: 'POST',
    body: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '9000000000'
    }
  });
  if (res.ok && data.success) {
    return { success: true, message: data.message || 'Registration successful! Please login.' };
  }
  return { success: false, message: data.message || 'Registration failed.' };
}

export function logoutUser() {
  localStorage.removeItem('tf_currentUser');
  window.dispatchEvent(new Event('storage'));
  notifyUserChanged();
  notifyCartChanged();
  return { success: true, message: 'Logged out successfully!' };
}

export function readGuestCart() {
  const legacy = localStorage.getItem('tf_cart');
  if (legacy && !localStorage.getItem(GUEST_CART_KEY)) {
    localStorage.setItem(GUEST_CART_KEY, legacy);
    localStorage.removeItem('tf_cart');
  }
  const raw = localStorage.getItem(GUEST_CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeGuestCart(cart) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
}

export async function getCart() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const { res, data } = await apiJson(`${API_BASE}/cart/${currentUser.id}`);
    if (res.ok && data.success) return data.cart || [];
    return [];
  }
  return readGuestCart();
}

export async function addToCart(product) {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const { res, data } = await apiJson(`${API_BASE}/cart/${currentUser.id}/items`, {
      method: 'POST',
      body: { productId: product.id, quantity: 1 }
    });
    if (res.ok && data.success) {
      notifyCartChanged();
      return { success: true, message: data.message || `${product.name} added to cart!` };
    }
    return { success: false, message: data.message || 'Could not add to cart.' };
  }

  const cart = readGuestCart();
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || '',
      quantity: 1
    });
  }
  writeGuestCart(cart);
  notifyCartChanged();
  return { success: true, message: `${product.name} added to cart!` };
}

export async function removeFromCart(productId) {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const { res, data } = await apiJson(`${API_BASE}/cart/${currentUser.id}/items/${productId}`, {
      method: 'DELETE'
    });
    if (res.ok && data.success) {
      notifyCartChanged();
      return { success: true, message: data.message || 'Item removed from cart!' };
    }
    return { success: false, message: data.message || 'Remove failed.' };
  }

  const cart = readGuestCart().filter((item) => item.id !== productId);
  writeGuestCart(cart);
  notifyCartChanged();
  return { success: true, message: 'Item removed from cart!' };
}

export async function updateCartQuantity(productId, quantity) {
  const currentUser = getCurrentUser();
  if (currentUser) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    const { res, data } = await apiJson(`${API_BASE}/cart/${currentUser.id}/items/${productId}`, {
      method: 'PATCH',
      body: { quantity }
    });
    if (res.ok && data.success) {
      notifyCartChanged();
      return { success: true, message: data.message || 'Cart updated!' };
    }
    return { success: false, message: data.message || 'Update failed.' };
  }

  const cart = readGuestCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) {
    return { success: false, message: 'Item not found in cart!' };
  }
  if (quantity <= 0) {
    return removeFromCart(productId);
  }
  item.quantity = quantity;
  writeGuestCart(cart);
  notifyCartChanged();
  return { success: true, message: 'Cart updated!' };
}

export async function getCartTotal() {
  const cart = await getCart();
  return cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
}

export async function getCartCount() {
  const cart = await getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

export async function placeOrder(orderData) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'Please login to place an order!' };
  }

  const cart = await getCart();
  if (cart.length === 0) {
    return { success: false, message: 'Cart is empty!' };
  }

  const { res, data } = await apiJson(`${API_BASE}/orders/${currentUser.id}`, {
    method: 'POST',
    body: {
      address: orderData.address,
      phone: orderData.phone,
      paymentMethod: orderData.paymentMethod
    }
  });

  if (res.ok && data.success && data.order) {
    notifyCartChanged();
    return {
      success: true,
      message: data.message || 'Order placed successfully!',
      orderId: data.order.orderId
    };
  }
  return { success: false, message: data.message || 'Order could not be placed.' };
}

export async function getUserOrders() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  const { res, data } = await apiJson(`${API_BASE}/orders/${currentUser.id}`);
  if (res.ok && data.success) return data.orders || [];
  return [];
}

export async function fetchCatalogProducts() {
  const { res, data } = await apiJson(`${API_BASE}/products`);
  if (res.ok && data.success) return data.products || [];
  return [];
}
