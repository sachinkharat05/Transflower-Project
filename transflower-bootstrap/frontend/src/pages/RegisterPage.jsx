import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { registerUser } from '../services/transflowerApi.js';

export function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

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

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      setValidated(true);
      return;
    }

    setValidated(true);

    const result = await registerUser({
      name: `${firstName} ${lastName}`,
      email,
      password,
      phone
    });

    if (result.success) {
      setShowSuccess(true);
      formEl.reset();
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setValidated(false);
      setTermsAccepted(false);
      window.setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setErrorMessage(result.message);
  }

  return (
    <>
      <section className="py-5" style={{ minHeight: '85vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="glass-card">
                <h3 className="text-center fw-bold mb-3">Create your account</h3>
                <p className="text-center text-muted mb-4">Join Transflower and never miss a chance to send joy.</p>

                {showSuccess ? (
                  <div id="successAlert" className="alert alert-success text-center mb-3">
                    Registration successful. Welcome to Transflower!
                  </div>
                ) : null}

                {errorMessage ? <div className="alert alert-danger text-center mb-3">{errorMessage}</div> : null}

                <form id="registerForm" noValidate onSubmit={handleSubmit} className={validated ? 'was-validated' : ''}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" htmlFor="firstName">
                        First name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        className="form-control form-control-rounded"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                      <div className="invalid-feedback">Please enter your first name.</div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" htmlFor="lastName">
                        Last name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        className="form-control form-control-rounded"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                      <div className="invalid-feedback">Please enter your last name.</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="registerEmail">
                      Email address
                    </label>
                    <input
                      id="registerEmail"
                      type="email"
                      className="form-control form-control-rounded"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Please enter a valid email.</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="registerPhone">
                      Phone number
                    </label>
                    <input
                      id="registerPhone"
                      type="tel"
                      className="form-control form-control-rounded"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Please enter your phone number.</div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" htmlFor="password">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        className="form-control form-control-rounded"
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="invalid-feedback">Minimum 6 characters.</div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" htmlFor="confirmPassword">
                        Confirm password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="form-control form-control-rounded"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <div className="invalid-feedback">Please confirm your password.</div>
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="termsCheck"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                    />
                    <label className="form-check-label" htmlFor="termsCheck">
                      I agree to the Terms &amp; Conditions
                    </label>
                    <div className="invalid-feedback">You must agree before continuing.</div>
                  </div>

                  <button type="submit" className="btn btn-rose w-100 mb-3">
                    Register Now
                  </button>

                  <p className="text-center mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="fw-semibold text-decoration-none">
                      Login instead
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter
        brandLead={<p className="opacity-75 mb-0">Thoughtfully crafted arrangements for every celebration.</p>}
      />
    </>
  );
}
