import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { useAppState } from '../contexts/AppStateContext.jsx';
import { loginUser } from '../services/transflowerApi.js';

export function LoginPage() {
  const navigate = useNavigate();
  const { refreshCartCount } = useAppState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    document.body.classList.add('page-auth');
    return () => document.body.classList.remove('page-auth');
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    const formEl = event.currentTarget;
    if (!formEl.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    const result = await loginUser(email, password);

    if (result.success) {
      setShowSuccess(true);
      setValidated(false);
      formEl.reset();
      setEmail('');
      setPassword('');
      await refreshCartCount();
      window.setTimeout(() => navigate('/'), 1500);
      return;
    }

    setErrorMessage(result.message);
  }

  return (
    <>
      <section className="py-5 d-flex align-items-center" style={{ minHeight: '85vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="glass-card">
                <h3 className="text-center fw-bold mb-3">Welcome back</h3>
                <p className="text-center text-muted mb-4">Sign in to continue blooming with Transflower.</p>

                {showSuccess ? (
                  <div className="alert alert-success text-center mb-3">Login successful. Welcome back!</div>
                ) : null}

                {errorMessage ? (
                  <div className="alert alert-danger text-center mb-3" role="alert">
                    {errorMessage}
                  </div>
                ) : null}

                <form id="loginForm" noValidate onSubmit={handleSubmit} className={validated ? 'was-validated' : ''}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="loginEmail">
                      Email address
                    </label>
                    <input
                      id="loginEmail"
                      type="email"
                      className="form-control form-control-rounded"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Please enter a valid email.</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="loginPassword">
                      Password
                    </label>
                    <input
                      id="loginPassword"
                      type="password"
                      className="form-control form-control-rounded"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Please enter your password.</div>
                  </div>

                  <button type="submit" className="btn btn-rose w-100 mb-3">
                    Login
                  </button>

                  <p className="text-center mb-0">
                    New to Transflower?{' '}
                    <Link to="/register" className="fw-semibold text-decoration-none">
                      Create an account
                    </Link>
                  </p>
                </form>

                <div className="alert alert-info text-center small mt-3 mb-0">
                  <strong>Demo Login:</strong> john@example.com / pass123 or jane@example.com / pass123
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter brandLead={<p className="opacity-75 mb-0">Curated bouquets and fresh blooms, delivered with care.</p>} />
    </>
  );
}
