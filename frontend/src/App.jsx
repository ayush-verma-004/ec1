import { useState, useEffect } from 'react';
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
import GovernmentPortal from './components/gov/GovernmentPortal';
import NgoPortal from './components/ngo/NgoPortal';
import BizPortal from './components/biz/BizPortal';
import FarmerPortal from './components/farmer/FarmerPortal';
import SharedMarketplace from './components/shared/SharedMarketplace';
import { clearSession, isTokenExpired } from './utils/auth';

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
    <>
      <Routes>
        {/* Landing Page Route */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-[#f0fdf4]">
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

              {/* Dev Demo Buttons */}
              <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {[
                  { label: 'Demo Gov Portal',    path: '/gov',     cls: 'bg-purple-700 hover:bg-purple-800' },
                  { label: 'Demo NGO Portal',    path: '/ngo',     cls: 'bg-[#22c55e] hover:bg-[#16a34a]'  },
                  { label: 'Demo Biz Portal',    path: '/biz',     cls: 'bg-blue-600 hover:bg-blue-700'    },
                  { label: 'Demo Farmer Portal', path: '/farmer',  cls: 'bg-amber-600 hover:bg-amber-700'  },
                ].map(({ label, path, cls }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className={`px-4 py-2 ${cls} text-white rounded-xl text-xs font-bold shadow-lg transition-colors w-full`}
                  >
                    {label}
                  </button>
                ))}
              </div>
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
                        Back to Home
                      </button>
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                        <span className="text-sm font-bold text-[#022c22]">
                          Econe<span className="text-[#22c55e]">.</span>
                          <span className="text-[#15803d] font-semibold"> Marketplace</span>
                        </span>
                      </div>
                      <div className="pr-1">
                        <button
                          onClick={() => setIsAuthOpen(true)}
                          className="btn-primary px-6 py-2.5 text-sm rounded-full shadow-lg shadow-emerald-500/20"
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
    </>
  );
}

export default App;
