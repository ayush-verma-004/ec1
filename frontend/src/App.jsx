import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stakeholders from './components/Stakeholders';
import MarketplaceHighlights from './components/MarketplaceHighlights';
import TechnicalExcellence from './components/TechnicalExcellence';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import SharedMarketplace from './components/shared/SharedMarketplace';
import { clearSession, isTokenExpired } from './utils/auth';

// PWA & Mobile Components
import ReloadPrompt from './components/pwa/ReloadPrompt';

// Lazy Loaded Portals for PWA Performance
const GovernmentPortal = lazy(() => import('./components/gov/GovernmentPortal'));
const NgoPortal        = lazy(() => import('./components/ngo/NgoPortal'));
const BizPortal        = lazy(() => import('./components/biz/BizPortal'));
const FarmerPortal     = lazy(() => import('./components/farmer/FarmerPortal'));

/* ── Loading Skeleton (Suspense Fallback) ────────────────────────────── */
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#f0fdf4] flex flex-col items-center justify-center p-6">
    <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4" />
    <p className="text-emerald-800 font-bold animate-pulse">Loading EosCarbon Protocol...</p>
  </div>
);

/* ── Protected Route Wrapper ─────────────────────────────────────────── */
const ProtectedRoute = ({ children }) => {
  if (isTokenExpired()) {
    clearSession();
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* ── Scroll to top on every route change ────────────────────────────── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  /* ── JWT expiry watcher ──────────────────────────────────────────────── */
  useEffect(() => {
    const check = () => {
      const isPublic = location.pathname === '/' || location.pathname === '/marketplace';
      if (!isPublic && isTokenExpired()) {
        clearSession();
        navigate('/');
        toast.error('Session expired. Please log in again.', { duration: 4000 });
      }
    };
    const interval = setInterval(check, 60_000); // Check every minute
    return () => clearInterval(interval);
  }, [location.pathname, navigate]);

  /* ── Sign out ────────────────────────────────────────────────────────── */
  const handleSignOut = () => {
    clearSession();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen bg-[#f0fdf4]">
      {/* PWA Update / Offline Toast */}
      <ReloadPrompt />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Landing Page Route */}
          <Route
            path="/"
            element={
              <div className="min-h-screen">
                <Navbar
                  onOpenAuth={() => setIsAuthOpen(true)}
                  onOpenMarketplace={() => navigate('/marketplace')}
                />
                <main>
                  <Hero />
                  <Stakeholders />
                  <MarketplaceHighlights />
                  <TechnicalExcellence />
                  <CTASection />
                </main>
                <Footer />
                <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
              </div>
            }
          />

          {/* Guest Marketplace Route */}
          <Route
            path="/marketplace"
            element={
              <div className="min-h-screen flex flex-col bg-[#f0fdf4]">
                {/* Floating Capsule Back Bar */}
                <div className="sticky top-0 z-50 w-full">
                  <div className="px-4 pt-4 pb-4 pointer-events-none">
                    <div className="max-w-7xl mx-auto pointer-events-auto">
                      <div
                        className="flex items-center justify-between px-2 py-2 glass-card rounded-full"
                        style={{
                          background: 'rgba(255, 255, 255, 0.90)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          boxShadow: '0 4px 16px rgba(6, 78, 59, 0.08)',
                        }}
                      >
                        <button
                          onClick={() => navigate('/')}
                          className="flex items-center gap-2 pl-1 pr-4 py-1.5 rounded-full hover:bg-emerald-50 transition-all text-sm font-bold text-gray-500 hover:text-[#15803d] group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                            <span className="text-lg">←</span>
                          </div>
                          <span className="hidden xs:block">Back to Home</span>
                        </button>
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                          <span className="text-sm font-bold text-[#022c22]">
                            EosCarbon<span className="text-[#22c55e]">.</span>
                            <span className="text-[#15803d] font-semibold"> Marketplace</span>
                          </span>
                        </div>
                        <div className="pr-1">
                          <button
                            onClick={() => setIsAuthOpen(true)}
                            className="btn-primary px-6 py-2.5 text-xs sm:text-sm rounded-full shadow-lg shadow-emerald-500/20"
                          >
                            Sign In to Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <SharedMarketplace userRole="GUEST" />
                </div>
                <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
              </div>
            }
          />

          {/* Portal Routes (Protected) */}
          <Route path="/gov"    element={<ProtectedRoute><GovernmentPortal onSignOut={handleSignOut} /></ProtectedRoute>} />
          <Route path="/ngo"    element={<ProtectedRoute><NgoPortal onSignOut={handleSignOut} /></ProtectedRoute>} />
          <Route path="/biz"    element={<ProtectedRoute><BizPortal onSignOut={handleSignOut} /></ProtectedRoute>} />
          <Route path="/farmer" element={<ProtectedRoute><FarmerPortal onSignOut={handleSignOut} /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
