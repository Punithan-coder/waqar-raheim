import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ServiceDetail from './pages/ServiceDetail';
import AboutCompany from './AboutCompany';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetail from './pages/PropertyDetail';
import InvestorsPage from './pages/InvestorsPage';
import InsightsPage from './pages/InsightsPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutCompany onClose={() => window.history.back()} onOpenConsultation={() => {}} />} />
      <Route path="/service/:serviceId" element={<ServiceDetail />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:slug" element={<PropertyDetail />} />
      <Route path="/investors" element={<InvestorsPage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}

export default App;

