import { Link } from 'react-router-dom';
export function Footer() {
    return (<footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/feed" className="mb-5 inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white"><i className="fa-solid fa-users text-xl"/></span>
              <span className="text-2xl font-bold text-white">Social Hub<span className="text-indigo-400">.</span></span>
            </Link>
            <p className="max-w-md leading-7 text-slate-400">Share your moments, discover new stories, and stay connected with the people who make life meaningful.</p>
            <div className="mt-6 flex gap-3">
              {['facebook-f', 'instagram', 'github'].map((name) => <a key={name} href={`https://${name === 'facebook-f' ? 'facebook' : name}.com`} aria-label={name} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 transition duration-300 hover:bg-indigo-600 hover:text-white"><i className={`fa-brands fa-${name}`}/></a>)}
            </div>
          </div>
          <div><h3 className="mb-5 text-lg font-semibold text-white">Explore</h3><ul className="space-y-3"><li><Link to="/feed" className="transition-colors hover:text-indigo-400">Home</Link></li><li><Link to="/notifications" className="transition-colors hover:text-indigo-400">Notifications</Link></li><li><Link to="/profile" className="transition-colors hover:text-indigo-400">My Profile</Link></li></ul></div>
          <div><h3 className="mb-5 text-lg font-semibold text-white">Support</h3><ul className="space-y-3"><li><a href="#about" className="transition-colors hover:text-indigo-400">About Us</a></li><li><a href="#contact" className="transition-colors hover:text-indigo-400">Contact</a></li><li><a href="#privacy" className="transition-colors hover:text-indigo-400">Privacy Policy</a></li><li><a href="#terms" className="transition-colors hover:text-indigo-400">Terms &amp; Conditions</a></li></ul></div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Connectly. All rights reserved.</p><p>Made with <i className="fa-solid fa-heart mx-1 text-rose-500"/> By Youssef Mohmed.</p>
        </div>
      </div>
    </footer>);
}
