import { Building2, LayoutDashboard, MapPin, Leaf, ShoppingBag } from 'lucide-react';
import UniversalNavbar from '../shared/UniversalNavbar';

const links = [
  { id: 'dashboard',          label: 'Dashboard',          icon: <LayoutDashboard size={16} /> },
  { id: 'land_verifications', label: 'Land Verifications', icon: <MapPin size={16} /> },
  { id: 'carbon_verifications',label:'Carbon Verifications',icon: <Leaf size={16} /> },
  { id: 'marketplace',        label: 'Marketplace',        icon: <ShoppingBag size={16} /> },
];

const NgoNavbar = ({ activeTab, setActiveTab, onSignOut }) => (
  <UniversalNavbar
    links={links}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    onSignOut={onSignOut}
    role="NGO"
    brandLabel="Verification"
    brandIcon={<Building2 size={20} />}
    userName="NatureVerifiers NGO"
    userInitials="NV"
    userSubtitle="Level 1 Verifier"
  />
);

export default NgoNavbar;
