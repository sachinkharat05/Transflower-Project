import { useEffect, useState } from 'react';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    document.body.classList.add('page-contact');
    return () => document.body.classList.remove('page-contact');
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const formEl = event.currentTarget;
    if (!formEl.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(false);
    formEl.classList.remove('was-validated');
    setShowSuccess(true);
    formEl.reset();
    setName('');
    setEmail('');
    setMessage('');
    window.setTimeout(() => setShowSuccess(false), 3000);
  }

  return (
    <>
      <section className="py-5" style={{ minHeight: '80vh' }}>
        <div className="container">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8 text-center">
              <p className="section-label">We’re here for you</p>
              <h2 className="section-title">Contact Transflower</h2>
              <p className="text-muted">
                Have a custom bouquet request, event inquiry, or question about your order? Send us a message and we’ll
                respond as soon as possible.
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-6">
              <div className="glass-card">
                {showSuccess ? (
                  <div id="successAlert" className="alert alert-success text-center mb-3">
                    Thank you! Your message has been sent.
                  </div>
                ) : null}

                <form id="contactForm" noValidate onSubmit={handleSubmit} className={validated ? 'was-validated' : undefined}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Your name</label>
                    <input
                      type="text"
                      className="form-control form-control-rounded"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Please enter your name.</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email address</label>
                    <input
                      type="email"
                      className="form-control form-control-rounded"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Please enter a valid email.</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Message</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Tell us how we can help"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Please write a message.</div>
                  </div>

                  <button type="submit" className="btn btn-rose w-100 mb-3">
                    Send Message
                  </button>

                  <a
                    href="https://wa.me/919637661382?text=Hello%20I%20want%20to%20order%20flowers"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-success whatsapp-btn w-100"
                  >
                    <i className="bi bi-whatsapp"></i>
                    <span>Chat on WhatsApp</span>
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter
        brandLead={
          <p className="opacity-75 mb-0">
            From everyday moments to grand celebrations, we design flowers that speak for you.
          </p>
        }
        whatsappLabel="WhatsApp Support"
      />
    </>
  );
}
