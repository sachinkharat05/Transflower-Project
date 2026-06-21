import { Link } from 'react-router-dom';

const WHATSAPP_HREF =
  'https://wa.me/919637661382?text=Hello%20I%20want%20to%20order%20flowers';

export function SiteFooter({
  brandLead,
  connectTitle = 'Connect',
  whatsappVariant = 'button',
  whatsappLabel = 'Chat on WhatsApp'
}) {
  const lead =
    brandLead ?? <p className="opacity-75 mb-0">Curated bouquets and fresh blooms, delivered with care.</p>;

  const whatsapp =
    whatsappVariant === 'link' ? (
      <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer" className="whatsapp-link">
        <i className="bi bi-whatsapp"></i> {whatsappLabel}
      </a>
    ) : (
      <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer" className="btn btn-success whatsapp-btn w-auto px-3">
        <i className="bi bi-whatsapp"></i>
        <span>{whatsappLabel}</span>
      </a>
    );

  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Transflower</h5>
            {lead}
          </div>

          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5>{connectTitle}</h5>
            <p className="opacity-75 mb-2">Email: kharatsachin012.com</p>
            {whatsapp}
          </div>
        </div>

        <div className="footer-bottom text-center">
          © 2025 Transflower Store — Designed by <strong>Sachin Kharat</strong>
        </div>
      </div>
    </footer>
  );
}
