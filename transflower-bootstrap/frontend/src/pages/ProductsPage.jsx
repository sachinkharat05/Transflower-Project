import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { useAppState } from '../contexts/AppStateContext.jsx';
import {
  addToCart,
  fetchCatalogProducts,
  getCurrentUser
} from '../services/transflowerApi.js';
import { publicImageSrc } from '../utils/publicImageSrc.js';

export function ProductsPage() {
  const navigate = useNavigate();
  const { refreshCartCount } = useAppState();

  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  useEffect(() => {
    document.body.classList.add('page-products');
    return () => document.body.classList.remove('page-products');
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const products = await fetchCatalogProducts();
      if (cancelled) return;

      setLoading(false);
      if (!products.length) {
        setLoadError('Could not load products. Is the server running and MySQL configured?');
        setCatalogProducts([]);
        return;
      }

      setLoadError('');
      setCatalogProducts(products);
    }
    load();
    refreshCartCount().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [refreshCartCount]);

  const visibleProducts = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    if (!q) return catalogProducts.map((p) => ({ ...p, hidden: false }));
    return catalogProducts.map((p) => {
      const name = String(p.name || '').toLowerCase();
      const category = String(p.category || '').toLowerCase();
      return { ...p, hidden: !name.includes(q) && !category.includes(q) };
    });
  }, [catalogProducts, appliedSearch]);

  function applySearch() {
    setAppliedSearch(searchInput);
  }

  async function handleAddToCart(product) {
    const result = await addToCart(product);
    await refreshCartCount();
    alert(result.message);
  }

  async function handleBuyNow(productId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Please login to proceed with purchase!');
      navigate('/login');
      return;
    }

    const product = catalogProducts.find((x) => x.id === productId);
    if (!product) return;
    await handleAddToCart(product);
    navigate('/cart');
  }

  return (
    <>
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <p className="section-label">Curated Collections</p>
              <h2 className="section-title">Find the perfect bouquet</h2>
              <p className="text-muted mb-4">
                From romantic roses to sunny tulips and elegant orchids, our collections are designed to match every
                moment—big or small. Browse our bestsellers or explore by flower type.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="d-flex gap-2">
                <input
                  className="form-control search-input"
                  type="search"
                  placeholder="Search by flower or occasion"
                  id="productSearch"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applySearch();
                    }
                  }}
                />
                <button className="btn btn-blossom" type="button" id="productSearchBtn" onClick={applySearch}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 pb-5">
        <div className="container">
          {loadError ? <p className="alert alert-danger">{loadError}</p> : null}
          {loading ? <div className="text-center text-muted py-5">Loading catalog…</div> : null}

          {!loading && !loadError ? (
            <div id="tf-products-catalog" className="row g-4">
              <div className="col-12">
                <h3 className="mb-4">Shop bouquets</h3>
              </div>

              {visibleProducts.map((p) => (
                <div key={p.id} className={`col-12 col-sm-6 col-md-4${p.hidden ? ' d-none' : ''}`}>
                  <div className="card product-card h-100">
                    <img src={publicImageSrc(p.image)} className="product-img w-100" alt={p.name} />
                    <div className="card-body text-center">
                      <h5 className="mb-1">{p.name}</h5>
                      <p className="text-muted mb-1 small">{p.category || ''}</p>
                      <p className="fw-semibold mb-3">₹{Number(p.price)}</p>
                      <div className="d-grid gap-2">
                        <button type="button" className="btn btn-outline-primary" onClick={() => handleBuyNow(p.id)}>
                          Buy Now
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => handleAddToCart(p)}>
                          <i className="bi bi-cart-plus me-1"></i>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <SiteFooter
        brandLead={
          <p className="opacity-75 mb-0">
            Discover thoughtfully designed bouquets for love, gratitude, and every emotion in between.
          </p>
        }
      />
    </>
  );
}
