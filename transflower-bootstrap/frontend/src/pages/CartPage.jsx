import { Modal } from 'bootstrap';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { useAppState } from '../contexts/AppStateContext.jsx';
import {
  getCart,
  getCurrentUser,
  placeOrder,
  removeFromCart,
  updateCartQuantity
} from '../services/transflowerApi.js';
import { publicImageSrc } from '../utils/publicImageSrc.js';

export function CartPage() {
  const navigate = useNavigate();
  const { refreshCartCount } = useAppState();

  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    document.body.classList.add('page-cart');
    return () => document.body.classList.remove('page-cart');
  }, []);

  async function refreshCart() {
    setCart(await getCart());
  }

  useEffect(() => {
    refreshCart().catch(() => {});
    refreshCartCount().catch(() => {});
  }, [refreshCartCount]);

  const summary = cart.length
    ? {
        subtotal: cart.reduce((t, item) => t + Number(item.price) * item.quantity, 0),
        shipping: 50,
        total:
          cart.reduce((t, item) => t + Number(item.price) * item.quantity, 0) + 50
      }
    : { subtotal: 0, shipping: 0, total: 0 };

  async function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateCartQuantity(productId, newQuantity);
    }
    await refreshCart();
    await refreshCartCount();
  }

  async function removeItem(productId) {
    await removeFromCart(productId);
    await refreshCart();
    await refreshCartCount();
  }

  async function proceedToCheckout() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Please login to checkout!');
      navigate('/login');
      return;
    }

    const latestCart = await getCart();
    if (latestCart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const el = document.getElementById('checkoutModal');
    if (!el) return;
    Modal.getOrCreateInstance(el).show();
  }

  async function handleCheckoutSubmit(event) {
    event.preventDefault();

    const result = await placeOrder({
      address: deliveryAddress,
      phone: phoneNumber,
      paymentMethod
    });

    if (result.success) {
      alert(`Order placed successfully!\nOrder ID: ${result.orderId}\n\nThank you for your purchase!`);

      const el = document.getElementById('checkoutModal');
      if (el) Modal.getOrCreateInstance(el).hide();

      setDeliveryAddress('');
      setPhoneNumber('');
      setPaymentMethod('');
      await refreshCart();
      await refreshCartCount();
      return;
    }

    alert(result.message);
  }

  return (
    <>
      <section className="py-5">
        <div className="container">
          <h2 className="section-title mb-4">Shopping Cart</h2>

          <div className="row g-4">
            <div className="col-lg-8">
              {cart.length === 0 ? (
                <div id="emptyCart" className="alert alert-info text-center">
                  <h5>Your cart is empty</h5>
                  <p className="mb-2">Add some beautiful flowers to get started!</p>
                  <Link to="/products" className="btn btn-rose">
                    Continue Shopping
                  </Link>
                </div>
              ) : null}

              <div id="cartItems">
                {cart.map((item) => (
                  <div className="card mb-3" key={item.id}>
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <img
                            src={publicImageSrc(item.image)}
                            className="img-fluid rounded"
                            alt={item.name}
                            style={{ maxHeight: '100px', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="col-md-4">
                          <h6 className="fw-bold">{item.name}</h6>
                          <p className="text-muted mb-0">₹{item.price}</p>
                        </div>
                        <div className="col-md-3">
                          <div className="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              className="form-control form-control-sm text-center"
                              style={{ width: '50px' }}
                              readOnly
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                        <div className="col-md-2 text-end">
                          <strong>₹{(Number(item.price) * item.quantity).toFixed(2)}</strong>
                        </div>
                        <div className="col-md-1 text-end">
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => removeItem(item.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="glass-card">
                <h5 className="fw-bold mb-3">Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span id="subtotal">₹{summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span id="shipping">₹{summary.shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 border-top pt-2">
                  <strong>Total</strong>
                  <strong id="total">₹{summary.total.toFixed(2)}</strong>
                </div>

                <button
                  type="button"
                  className="btn btn-rose w-100 mb-2"
                  id="checkoutBtn"
                  disabled={cart.length === 0}
                  onClick={() => proceedToCheckout().catch(() => {})}
                >
                  Proceed to Checkout
                </button>

                <Link to="/products" className="btn btn-outline-secondary w-100">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="modal fade" id="checkoutModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Complete Your Order</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="checkoutForm" onSubmit={handleCheckoutSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label" htmlFor="deliveryAddress">
                    Delivery Address
                  </label>
                  <textarea
                    id="deliveryAddress"
                    className="form-control"
                    placeholder="Enter your full address"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="checkoutPhoneNumber">
                    Phone Number
                  </label>
                  <input
                    id="checkoutPhoneNumber"
                    type="tel"
                    className="form-control"
                    placeholder="Your phone number"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="paymentMethod">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    className="form-control"
                    required
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="">Select payment method</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="upi">UPI</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-rose">
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
