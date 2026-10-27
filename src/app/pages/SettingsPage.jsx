import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, ApiError } from '../../services/api';
import { FormError } from '../components/FormError';
import { useAuth } from '../state/AuthContext';
export function SettingsPage() {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { signOut } = useAuth();
    async function submit(event) {
        event.preventDefault();
        setError('');
        setSuccess(false);
        if (!password || !newPassword) {
            setError('Fill in your current and new password.');
            return;
        }
        if (newPassword !== confirm) {
            setError('Confirmation does not match the new password.');
            return;
        }
        try {
            await userApi.changePassword({ password, newPassword });
            setSuccess(true);
            signOut();
            window.setTimeout(() => navigate('/login'), 800);
        }
        catch (reason) {
            setError(reason instanceof ApiError ? reason.message : 'Password could not be changed.');
        }
    }
    const field = (label, value, setValue, visible, toggle, id) => <label className="relative block" key={id}><span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span><input id={id} value={value} onChange={(e) => setValue(e.target.value)} type={visible ? 'text' : 'password'} placeholder={`Enter ${label.toLowerCase()}`} autoComplete="new-password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-11 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"/><button type="button" onClick={toggle} aria-label={`Toggle ${label.toLowerCase()} visibility`} className="absolute right-4 top-[2.55rem] text-slate-500"><i className={`fa-solid ${visible ? 'fa-eye-slash' : 'fa-eye'}`}/></button></label>;
    return <div className="mx-auto max-w-7xl px-3 py-3.5"><main className="mx-auto min-w-0 max-w-2xl"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-2xl sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]"><i className="fa-solid fa-key"/></span><div><h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Change Password</h1><p className="text-sm text-slate-500">Keep your account secure by using a strong password.</p></div></div><form onSubmit={submit} className="space-y-4">
    {field('Current password', password, setPassword, showPassword, () => setShowPassword((v) => !v), 'current-password')}
    {field('New password', newPassword, setNewPassword, showNewPassword, () => setShowNewPassword((v) => !v), 'new-password')}
    <p className="-mt-3 text-xs text-slate-500">At least 8 characters with uppercase, lowercase, number, and special character.</p>
    {field('Confirm new password', confirm, setConfirm, showConfirm, () => setShowConfirm((v) => !v), 'confirm-password')}
    {error && <FormError>{error}</FormError>}{success && <p className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">Password updated. Please sign in again.</p>}
    <button className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5]">Update password</button>
  </form></section></main></div>;
}
