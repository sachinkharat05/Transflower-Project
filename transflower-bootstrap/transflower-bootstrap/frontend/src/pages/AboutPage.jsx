import { useEffect } from 'react';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';

export function AboutPage() {
  useEffect(() => {
    document.body.classList.add('page-about');
    return () => document.body.classList.remove('page-about');
  }, []);

  return (
    <>
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <p className="section-label">Our Story</p>
              <h2 className="section-title">Where every stem tells a story</h2>
              <p className="text-muted mb-3">
                Transflower began with a simple idea: make it effortless to send beautifully curated flowers that feel
                personal, modern, and timeless.
              </p>
              <p className="text-muted mb-4">
                Since 2020, we have crafted thousands of bespoke arrangements for birthdays, anniversaries, weddings,
                and everyday &quot;just because&quot; moments all over India. Every bouquet is hand‑tied and checked stem
                by stem to ensure it arrives as beautiful as you imagined.
              </p>
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 rounded-4 bg-white shadow-sm h-100">
                    <h5 className="mb-1">10,000+</h5>
                    <p className="text-muted mb-0">Orders delivered with love.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-4 bg-white shadow-sm h-100">
                    <h5 className="mb-1">Same‑day</h5>
                    <p className="text-muted mb-0">Delivery available in major cities.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="glass-card">
                <img src="/image/tfl%20store.jpeg" className="img-fluid rounded-4 mb-3" alt="Transflower studio" />
                <p className="mb-0 text-muted">
                  Our floral studio blends classic techniques with a contemporary aesthetic. We obsess over color
                  palettes, textures, and seasonal stems so your arrangements feel fresh, intentional, and one‑of‑a‑kind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 pb-5">
        <div className="container">
          <div className="row text-center mb-4">
            <div className="col">
              <p className="section-label">What we believe</p>
              <h2 className="section-title">Petals with purpose</h2>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="glass-card h-100">
                <h5>Thoughtful Design</h5>
                <p className="text-muted mb-0">
                  Every arrangement is designed by our in‑house florists to balance color, texture, and shape.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card h-100">
                <h5>Freshness First</h5>
                <p className="text-muted mb-0">We source directly from trusted growers so your flowers last longer in every vase.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card h-100">
                <h5>Seamless Experience</h5>
                <p className="text-muted mb-0">
                  Simple ordering, timely delivery, and clear communication—so you can focus on the moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter
        brandLead={
          <p className="opacity-75 mb-0">
            Modern floral design studio crafting meaningful arrangements for every occasion.
          </p>
        }
      />
    </>
  );
}
