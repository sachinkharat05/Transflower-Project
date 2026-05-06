import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { getCurrentUser, getUserOrders, logoutUser } from '../services/transflowerApi.js';
import { formatOrderDate } from '../utils/formatOrderDate.js';

export function DashboardPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('orders');
  const [currentUser, setCurrentUserState] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    document.body.classList.add('page-dashboard');
    return () => document.body.classList.remove('page-dashboard');
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      alert('Please login to access dashboard!');
      navigate('/login');
      return;
    }

    setCurrentUserState(user);
    getUserOrders()
      .then((o) => setOrders(o || []))
      .catch(() => setOrders([]));
  }, [navigate]);

  function handleSidebarLogout() {
    logoutUser();
    alert('Logged out successfully!');
    navigate('/');
  }

  function handleProfileSubmit(event) {
    event.preventDefault();
    alert('Profile updated successfully!');
  }

  async function viewOrderDetails(orderId) {
    const latestOrders = orders.length ? orders : await getUserOrders();
    const order = latestOrders.find((o) => o.orderId === orderId);
    if (!order) return;

    const itemsText = order.items
      .map((item) => `- ${item.name} x${item.quantity} (₹${item.price})`)
      .join('\n');

    alert(
      [
        `Order Details:`,
        ``,
        `Order ID: ${order.orderId}`,
        `Date: ${formatOrderDate(order.orderDate)}`,
        `Total: ₹${order.total.toFixed(2)}`,
        `Status: ${order.status}`,
        `Delivery Address: ${order.address}`,
        `Payment Method: ${order.paymentMethod}`,
        ``,
        `Items:`,
        itemsText
      ].join('\n')
    );
  }

  return (
    <>
      <section className="py-5">
        <div className="container">
          <h2 className="section-title mb-4">My Dashboard</h2>

          {!currentUser ? null : (
            <div className="row g-4">
              <div className="col-md-3">
                <div className="glass-card">
                  <div className="text-center mb-4">
                    <div
                      className="avatar mb-3 mx-auto text-white"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #b76e79, #e8d5d0)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}
                    >
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <h5 id="userName" className="fw-bold">
                      {currentUser.name}
                    </h5>
                    <p id="userEmail" className="text-muted small mb-0">
                      {currentUser.email}
                    </p>
                  </div>

                  <hr />

                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <button type="button" className="btn btn-link text-start w-100" onClick={() => setActiveSection('orders')}>
                        <i className="bi bi-receipt me-2"></i> My Orders
                      </button>
                    </li>
                    <li className="mb-2">
                      <button type="button" className="btn btn-link text-start w-100" onClick={() => setActiveSection('profile')}>
                        <i className="bi bi-person me-2"></i> Profile Settings
                      </button>
                    </li>
                    <li className="mb-2">
                      <button type="button" className="btn btn-link text-start w-100" onClick={handleSidebarLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-md-9">
                {activeSection === 'orders' ? (
                  <div id="ordersSection">
                    <div className="glass-card">
                      <h5 className="fw-bold mb-4">My Orders</h5>
                      <div id="ordersContainer">
                        {orders.length === 0 ? (
                          <div className="alert alert-info">
                            <p className="mb-0">
                              You haven&apos;t placed any orders yet.{' '}
                              <Link to="/products" className="alert-link">
                                Start shopping!
                              </Link>
                            </p>
                          </div>
                        ) : (
                          orders.map((order) => (
                            <div className="card mb-3" key={order.orderId}>
                              <div className="card-body">
                                <div className="row align-items-center">
                                  <div className="col-md-3">
                                    <strong>{order.orderId}</strong>
                                    <p className="text-muted small mb-0">{formatOrderDate(order.orderDate)}</p>
                                  </div>
                                  <div className="col-md-3">
                                    <p className="mb-1">
                                      <strong>{order.items.length}</strong> item(s)
                                    </p>
                                    <p className="text-muted small mb-0">Total: ₹{order.total.toFixed(2)}</p>
                                  </div>
                                  <div className="col-md-3">
                                    <span className="badge bg-warning">{order.status}</span>
                                  </div>
                                  <div className="col-md-3 text-end">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => viewOrderDetails(order.orderId)}
                                    >
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}

                {activeSection === 'profile' ? (
                  <div id="profileSection">
                    <div className="glass-card">
                      <h5 className="fw-bold mb-4">Profile Information</h5>

                      <form id="profileForm" onSubmit={handleProfileSubmit}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold" htmlFor="fullName">
                            Full Name
                          </label>
                          <input type="text" className="form-control" id="fullName" readOnly defaultValue={currentUser.name} />
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold" htmlFor="emailAddress">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="emailAddress"
                            readOnly
                            defaultValue={currentUser.email}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold" htmlFor="phoneNumber">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            placeholder="+91 XXXXX XXXXX"
                            required
                            defaultValue={currentUser.phone || ''}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold" htmlFor="memberSince">
                            Member Since
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="memberSince"
                            readOnly
                            defaultValue={
                              currentUser.registeredAt ? formatOrderDate(currentUser.registeredAt) : new Date().toLocaleDateString()
                            }
                          />
                        </div>

                        <button type="submit" className="btn btn-rose">
                          Update Profile
                        </button>
                      </form>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
