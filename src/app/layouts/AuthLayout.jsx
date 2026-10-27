import { NavLink, Outlet } from 'react-router-dom';
export function AuthLayout() {
    return (<div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <section className="mx-auto w-full max-w-xl text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-500"/>Connect. Share. Belong.
            </div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Welcome to our <span className="text-blue-600">Social Media</span>
            </h1>
            <p className="mx-auto max-w-lg text-base leading-8 text-gray-600 sm:text-lg lg:mx-0">
              The Social App is a modern social networking platform designed to bring people together. Create your profile, share your thoughts, discover new content, and build meaningful connections in a simple and engaging environment.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
              {[
            ['👥', 'Connect', 'Meet people and grow your community.', 'bg-blue-100'],
            ['💬', 'Interact', 'Share ideas and join conversations.', 'bg-indigo-100'],
            ['✨', 'Discover', 'Explore content that inspires you.', 'bg-purple-100'],
        ].map(([emoji, title, description, color]) => (<div key={title} className="rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-xl ${color}`}>{emoji}</div>
                  <h3 className="mb-1 font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm leading-6 text-gray-500">{description}</p>
                </div>))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-blue-100/50">
              <div className="px-6 pb-5 pt-8 text-center sm:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Join our community</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">Sign in or create an account to get started.</p>
              </div>
              <div className="px-6 sm:px-8">
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
                  <NavLink to="/registration" className={({ isActive }) => `rounded-lg px-4 py-3 text-center text-sm font-semibold transition duration-200 ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-blue-600'}`}>Create Account</NavLink>
                  <NavLink to="/login" className={({ isActive }) => `rounded-lg px-4 py-3 text-center text-sm font-semibold transition duration-200 ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-blue-600'}`}>Sign In</NavLink>
                </div>
              </div>
              <div className="px-6 pb-8 pt-6 sm:px-8"><Outlet /></div>
            </div>
            <p className="mt-6 text-center text-xs leading-5 text-gray-400">Your community starts here. Connect with the world.</p>
          </section>
        </div>
      </div>
    </div>);
}
