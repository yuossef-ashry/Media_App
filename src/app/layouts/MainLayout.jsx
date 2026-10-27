import { Outlet } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
export function MainLayout() {
    return (<div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      <main className="min-h-[55vh]"><Outlet /></main>
      <Footer />
    </div>);
}
