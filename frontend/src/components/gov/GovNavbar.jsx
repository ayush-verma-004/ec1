import { ShieldCheck, LayoutDashboard, CheckSquare, BarChart2, ShoppingBag, Building } from 'lucide-react';
import UniversalNavbar from '../shared/UniversalNavbar';

const links = [
  { id: 'dashboard',    label: 'Dashboard',           icon: <LayoutDashboard size={16} /> },
  { id: 'ngos',         label: 'NGO Management',      icon: <Building size={16} /> },
  { id: 'verifications',label: 'Pending Verifications',icon: <CheckSquare size={16} /> },
  { id: 'transactions', label: 'Transaction Monitor', icon: <BarChart2 size={16} /> },
  { id: 'marketplace',  label: 'Marketplace',         icon: <ShoppingBag size={16} /> },
];

const GovNavbar = ({ activeTab, setActiveTab, onSignOut }) => (
  <UniversalNavbar
    links={links}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    onSignOut={onSignOut}
    role="GOVERNMENT"
    brandLabel="Regulation"
    brandIcon={<ShieldCheck size={20} />}
    userName="Regulatory Officer"
    userInitials="RO"
    userSubtitle="MoEF · Gov. Official"
  />
);

export default GovNavbar;
