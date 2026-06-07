import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Spinner } from './components/ui/index';

// Auth pages
import LoginPage from './pages/auth/LoginPage/index';
import RegisterPage from './pages/auth/RegisterPage/index';

// Clinic pages
import DashboardPage from './pages/clinic/Dashboard/index';
import PatientsPage from './pages/clinic/Patients/index';
import PatientProfilePage from './pages/clinic/PatientProfile/index';
import AddEditPatientPage from './pages/clinic/AddEditPatient/index';
import AddVisitPage from './pages/clinic/AddVisit/index';
import EditVisitPage from './pages/clinic/EditVisit/index';
import VisitDetailPage from './pages/clinic/VisitDetail/index';
import SettingsPage from './pages/clinic/Settings/index';

// Admin pages
import AdminClinicsPage from './pages/admin/AdminClinics/index';
import AdminClinicDetailPage from './pages/admin/AdminClinicDetail/index';
import GlobalConfigPage from './pages/admin/GlobalConfig/index';

// ── Nav config ─────────────────────────────────────────────
const CLINIC_NAV = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { id: 'patients', label: 'Patients', path: '/patients', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'visits', label: "Today's Visits", path: '/visits/today', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id: 'settings', label: 'Settings', path: '/settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];
const ADMIN_NAV = [
  { id: 'admin-clinics', label: 'All Clinics', path: '/admin/clinics', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg> },
  { id: 'admin-config', label: 'Global Config', path: '/admin/config', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg> },
];

// ── Logo ────────────────────────────────────────────────────
function LogoMark({ size = 32 }) {
  return (
    <div className="logo-mark" style={{ width: size, height: size, borderRadius: size * 0.27 }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </div>
  );
}

// ── App Shell ───────────────────────────────────────────────
function AppShell({ children, isAdmin }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = isAdmin ? ADMIN_NAV : CLINIC_NAV;

  const activeId = nav.find(n => location.pathname.startsWith(n.path))?.id || nav[0]?.id;

  return (
    <div className="app-shell">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <LogoMark size={34} />
          <div>
            <div className="navbar-clinic-name">
              {isAdmin ? <>Clinic<span style={{ color: 'var(--primary)' }}>Desk</span> <span style={{ fontSize: 11, background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>Admin</span></> : (user?.name || 'ClinicDesk')}
            </div>
            <div className="navbar-clinic-sub">{isAdmin ? 'Platform administration' : (user?.owner_name || '')}</div>
          </div>
        </div>
        <div className="navbar-right">
          {!isAdmin && <button className="btn btn-ghost btn-sm" onClick={() => navigate('/settings')}>Settings</button>}
          <button className="btn btn-secondary btn-sm" onClick={signOut}>Logout</button>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar */}
        <aside className={`sidebar ${isAdmin ? 'sidebar-admin' : ''}`}>
          {isAdmin && <div className="sidebar-label">Admin Console</div>}
          {nav.map(item => (
            <button key={item.id} className={`nav-item ${activeId === item.id ? 'active' : ''}`} onClick={() => navigate(item.path)}>
              {item.icon}{item.label}
            </button>
          ))}
          <div className="sidebar-spacer" />
          <button className="nav-item" onClick={signOut}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </aside>

        {/* Main */}
        <main className="main-content">{children}</main>

        {/* Bottom nav (mobile) */}
        <nav className="bottom-nav">
          {nav.slice(0, 4).map(item => (
            <button key={item.id} className={`bottom-tab ${activeId === item.id ? 'active' : ''}`} onClick={() => navigate(item.path)}>
              {item.icon}<span>{item.label.replace("Today's ", '')}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// ── Today's visits page (inline) ─────────────────────────────
function TodaysVisitsPage() {
  const navigate = useNavigate();
  const [visits, setVisits] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/visits/today', { credentials: 'include' })
      .then(r => r.json()).then(d => setVisits(d.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Today's Visits</h1>
          <p className="page-subtitle">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/patients')}>+ Record a Visit</button>
      </div>
      {loading ? <div style={{ padding: 40, textAlign: 'center' }}><Spinner size={32} /></div> :
        visits.length === 0 ? <div className="card"><div className="empty-state"><div className="empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><h3>No visits today</h3><p>Visits recorded today will appear here.</p></div></div> :
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visits.map(v => (
            <div key={v.id} className="card card-pad card-hover" style={{ cursor: 'pointer' }} onClick={() => navigate(`/visits/${v.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{v.patient_name}</div>
                  <div style={{ color: 'var(--slate-400)', fontSize: 13 }}>{v.unique_patient_id} · {v.phone}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/visits/${v.id}`); }}>View</button>
                  <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); window.open(`/api/visits/${v.id}/pdf`, '_blank'); }}>PDF</button>
                </div>
              </div>
              {v.diagnosis && <p style={{ marginTop: 8, color: 'var(--slate-600)', fontSize: 14, lineHeight: 1.5 }}>{v.diagnosis}</p>}
            </div>
          ))}
        </div>
      }
    </div>
  );
}

// ── Protected route ─────────────────────────────────────────
function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spinner size={40} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (!adminOnly && user.role === 'admin') return <Navigate to="/admin/clinics" replace />;
  return children;
}

// ── Main App ────────────────────────────────────────────────
function App() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spinner size={40} /></div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin/clinics' : '/dashboard'} replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/clinics' : '/dashboard') : '/login'} replace />} />

        {/* Clinic routes */}
        <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><AppShell><PatientsPage /></AppShell></ProtectedRoute>} />
        <Route path="/patients/new" element={<ProtectedRoute><AppShell><AddEditPatientPage /></AppShell></ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute><AppShell><PatientProfilePage /></AppShell></ProtectedRoute>} />
        <Route path="/patients/:id/edit" element={<ProtectedRoute><AppShell><AddEditPatientPage /></AppShell></ProtectedRoute>} />
        <Route path="/patients/:id/visit/new" element={<ProtectedRoute><AppShell><AddVisitPage /></AppShell></ProtectedRoute>} />
        <Route path="/visits/today" element={<ProtectedRoute><AppShell><TodaysVisitsPage /></AppShell></ProtectedRoute>} />
        <Route path="/visits/:id" element={<ProtectedRoute><AppShell><VisitDetailPage /></AppShell></ProtectedRoute>} />
        <Route path="/visits/:id/edit" element={<ProtectedRoute><AppShell><EditVisitPage /></AppShell></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppShell><SettingsPage /></AppShell></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin/clinics" element={<ProtectedRoute adminOnly><AppShell isAdmin><AdminClinicsPage /></AppShell></ProtectedRoute>} />
        <Route path="/admin/clinics/:id" element={<ProtectedRoute adminOnly><AppShell isAdmin><AdminClinicDetailPage /></AppShell></ProtectedRoute>} />
        <Route path="/admin/config" element={<ProtectedRoute adminOnly><AppShell isAdmin><GlobalConfigPage /></AppShell></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
