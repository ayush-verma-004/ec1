import { Briefcase, LayoutDashboard, ShoppingBag, Layers, ArrowLeftRight } from 'lucide-react';
import UniversalNavbar from '../shared/UniversalNavbar';

const links = [
  { id: 'dashboard',    label: 'Dashboard',   icon: <LayoutDashboard size={16} /> },
  { id: 'marketplace',  label: 'Marketplace', icon: <ShoppingBag size={16} /> },
  { id: 'my_credits',   label: 'My Credits',  icon: <Layers size={16} /> },
  { id: 'transactions', label: 'Transactions',icon: <ArrowLeftRight size={16} /> },
];

const BizNavbar = ({ activeTab, setActiveTab, onSignOut }) => (
  <UniversalNavbar
    links={links}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    onSignOut={onSignOut}
    role="BUSINESSMAN"
    brandLabel="Business"
    brandIcon={<Briefcase size={20} />}
    userName="IndusTrade Corp"
    userInitials="BI"
    userSubtitle="Corporate Buyer"
  />
);

export default BizNavbar;
