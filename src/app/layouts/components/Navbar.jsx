import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
const links = [
    { to: '/feed', label: 'Feed', icon: 'fa-solid fa-house' },
    { to: '/profile', label: 'Profile', icon: 'fa-regular fa-user' },
    { to: '/notifications', label: 'Notifications', icon: 'fa-regular fa-bell' },
];
export function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const logout = () => {
        setOpen(false);
        signOut();
        navigate('/login');
    };
    return (<header className="sticky inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:h-20 sm:gap-6 sm:px-5 lg:px-8">
        <nav className="flex w-full min-w-0 items-center justify-between gap-2 sm:gap-6" aria-label="Main navigation">
          <Link to="/feed" aria-label="Route Posts feed" className="flex shrink-0 items-center gap-2 sm:gap-3">
            <img src={`${import.meta.env.BASE_URL}route.png`} alt="" className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10"/>
            <span className="hidden whitespace-nowrap text-xl font-bold tracking-tight text-gray-900 md:inline lg:text-2xl">Route <span className="text-blue-600">Posts</span></span>
          </Link>
          <div className="flex min-w-0 items-center justify-center gap-0.5 sm:gap-2">
            {links.map((item) => (<NavLink key={item.to} to={item.to} aria-label={item.label} title={item.label} className={({ isActive }) => `inline-flex shrink-0 items-center justify-center gap-2 rounded-xl p-2.5 text-sm font-semibold transition-colors hover:bg-gray-50 hover:text-blue-600 sm:px-3 sm:py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}>
                <i className={`${item.icon} text-lg`}/><span className="hidden whitespace-nowrap lg:inline">{item.label}</span>
              </NavLink>))}
          </div>
          <div className="relative shrink-0">
            <button type="button" aria-label="Toggle user menu" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-gray-50 sm:gap-3 sm:p-1.5">
              <img src={user?.photo || `${import.meta.env.BASE_URL}route.png`} alt={user?.name || 'Your profile'} className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100 sm:h-10 sm:w-10"/>
              <span className="hidden max-w-32 truncate whitespace-nowrap text-sm font-semibold text-gray-800 lg:block">{user?.name || 'My account'}</span>
              <i className={`fa-solid fa-chevron-down hidden text-xs text-gray-500 transition-transform sm:block ${open ? 'rotate-180' : ''}`}/>
            </button>
            <div className={`absolute right-0 top-full z-50 mt-3 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl shadow-gray-200/50 transition-all duration-200 ${open ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'}`}>
              <Link to="/profile" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700">Profile</Link>
              <Link to="/settings" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700">Settings</Link>
              <div className="my-2 border-t border-gray-100"/>
              <button type="button" onClick={logout} className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50">Sign Out</button>
            </div>
          </div>
        </nav>
      </div>
    </header>);
}
