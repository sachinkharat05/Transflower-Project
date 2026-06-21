import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';

export function HomePage() {
  useEffect(() => {
    document.body.classList.add('page-home');
    return () => document.body.classList.remove('page-home');
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <div className="hero-badge hero-animate-badge">Fresh Blooms • Same Day Delivery</div>
              <h1 className="hero-title hero-animate-title">
                Where <span>Beauty</span> Blossoms
              </h1>
              <p className="hero-sub hero-animate-sub">
                Curated bouquets delivered fresh to your doorstep. Say it with flowers—elegantly.
              </p>
              <Link to="/products" className="btn btn-blossom hero-animate-cta">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <p className="section-label text-center">Handpicked for You</p>
          <h2 className="section-title text-center">Featured Blooms</h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card flower-card">
                <div className="img-wrap">
                  <img src="/image/red%20rose.jpg" alt="Red Roses" />
                </div>
                <div className="card-body text-center">
                  <h5>Red Roses</h5>
                  <p className="text-muted mb-3">Elegant bouquet for special moments.</p>
                  <Link to="/products" className="btn btn-buy">
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card flower-card">
                <div className="img-wrap">
                  <img src="/image/tublips.jpg" alt="Tulips" />
                </div>
                <div className="card-body text-center">
                  <h5>Tulip Delight</h5>
                  <p className="text-muted mb-3">Fresh tulips to brighten your day.</p>
                  <Link to="/products" className="btn btn-buy">
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card flower-card">
                <div className="img-wrap">
                  <img src="/image/sun.jpg" alt="Sunflower" />
                </div>
                <div className="card-body text-center">
                  <h5>Sunflower Joy</h5>
                  <p className="text-muted mb-3">Bring sunshine into your home.</p>
                  <Link to="/products" className="btn btn-buy">
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="container">
          <p className="section-label text-center">Kind Words</p>
          <h2 className="section-title text-center">What Our Customers Say</h2>

          <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="testimonial-card">
                  <div className="quote-icon mb-2">&quot;</div>
                  <p>
                    &quot;Transflower never disappoints! My anniversary bouquet was perfect—fresh, fragrant, and exactly
                    as promised.&quot;
                  </p>
                  <footer className="blockquote-footer mt-3 tf-quote-footer">Sneha K.</footer>
                </div>
              </div>

              <div className="carousel-item">
                <div className="testimonial-card">
                  <div className="quote-icon mb-2">&quot;</div>
                  <p>&quot;Fresh flowers and fast delivery—simply beautiful! Will definitely order again.&quot;</p>
                  <footer className="blockquote-footer mt-3 tf-quote-footer">Rahul M.</footer>
                </div>
              </div>
            </div>

            <button className="carousel-control-prev position-absolute" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next position-absolute" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </section>

      <SiteFooter
        brandLead={<p className="opacity-75">Delivering fresh flowers with love and care since day one.</p>}
        connectTitle="Get in Touch"
        whatsappVariant="link"
        whatsappLabel="Chat on WhatsApp"
      />
    </>
  );
}
