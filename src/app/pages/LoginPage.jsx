import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormError } from '../components/FormError';
import { authApi, ApiError } from '../../services/api';
import { useAuth } from '../state/AuthContext';
const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [touched, setTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { setSession } = useAuth();
    const navigate = useNavigate();
    const emailInvalid = !/^\S+@\S+\.\S+$/.test(email);
    const passwordInvalid = !passwordPattern.test(password);
    async function submit(event) {
        event.preventDefault();
        setTouched(true);
        setError('');
        if (emailInvalid || passwordInvalid)
            return;
        try {
            const response = await authApi.login({ email, password });
            if (response.success) {
                setSession(response.data.token, response.data.user);
                navigate('/feed');
            }
        }
        catch (reason) {
            setError(reason instanceof ApiError ? reason.message : 'Unable to sign in. Please try again.');
        }
    }
    return (<form onSubmit={submit} noValidate className="space-y-5">
      <div className="mb-7"><h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h2><p className="mt-2 text-sm leading-6 text-gray-500">Sign in to your account and keep the conversation going.</p></div>
      <div className="relative">
        <input value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)} type="email" id="email" placeholder=" " autoComplete="email" className="peer block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pb-3 pt-6 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"/>
        <label htmlFor="email" className="pointer-events-none absolute left-4 top-4 origin-left text-sm text-gray-500 transition-all duration-200 peer-focus:top-2 peer-focus:scale-90 peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-90">Email address</label>
        {touched && emailInvalid && <FormError>Email is invalid.</FormError>}
      </div>
      <div className="relative">
        <input value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => setTouched(true)} type={showPassword ? 'text' : 'password'} id="password" placeholder=" " autoComplete="current-password" className="peer block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pb-3 pt-6 pr-12 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"/>
        <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"><i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}/></button>
        <label htmlFor="password" className="pointer-events-none absolute left-4 top-4 origin-left text-sm text-gray-500 transition-all duration-200 peer-focus:top-2 peer-focus:scale-90 peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-90">Password</label>
        {touched && passwordInvalid && <FormError>Password must be at least 8 characters and include uppercase, lowercase, number, and special character.</FormError>}
      </div>
      {error && <FormError>{error}</FormError>}
      <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-0">Sign In <span className="transition-transform duration-200 group-hover:translate-x-1">→</span></button>
      <p className="pt-1 text-center text-sm text-gray-500">New to the community? <Link to="/registration" className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline">Create an account</Link></p>
    </form>);
}
