import { Sprout, LayoutDashboard, Map, Leaf, Wallet, ShoppingBag } from 'lucide-react';
import UniversalNavbar from '../shared/UniversalNavbar';

const links = [
  { id: 'dashboard',    label: 'Dashboard',          icon: <LayoutDashboard size={16} /> },
  { id: 'lands',        label: 'My Lands',            icon: <Map size={16} /> },
  { id: 'credits',      label: 'Carbon Credits',      icon: <Leaf size={16} /> },
  { id: 'transactions', label: 'Sales & Transactions', icon: <Wallet size={16} /> },
  { id: 'marketplace',  label: 'Marketplace',         icon: <ShoppingBag size={16} /> },
];

const FarmerNavbar = ({ activeTab, setActiveTab, onSignOut }) => (
  <UniversalNavbar
    links={links}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    onSignOut={onSignOut}
    role="FARMER"
    brandLabel="Farm"
    brandIcon={<Sprout size={20} />}
    userName="Rajendra Kumar"
    userInitials="RK"
    userSubtitle="Carbon Farmer · Verified"
  />
);

export default FarmerNavbar;
