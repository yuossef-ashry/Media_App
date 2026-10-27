import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, ApiError } from '../../services/api';
import { FormError } from '../components/FormError';
const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const initialFields = { name: '', username: '', email: '', dateOfBirth: '', gender: '', password: '', rePassword: '' };
export function RegistrationPage() {
    const [fields, setFields] = useState(initialFields);
    const [touched, setTouched] = useState(false);
    const [approved, setApproved] = useState(false);
    const [approvalError, setApprovalError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const set = (key, value) => setFields((current) => ({ ...current, [key]: value }));
    const invalid = {
        name: fields.name.trim().length < 3,
        username: Boolean(fields.username && !/^[a-z0-9_]{3,30}$/.test(fields.username)),
        email: !/^\S+@\S+\.\S+$/.test(fields.email),
        dateOfBirth: !fields.dateOfBirth,
        gender: !fields.gender,
        password: !passwordPattern.test(fields.password),
        rePassword: !fields.rePassword || fields.rePassword !== fields.password,
    };
    const invalidFields = Object.values(invalid).some(Boolean);
    async function submit(event) {
        event.preventDefault();
        setTouched(true);
        setErrors([]);
        setSuccess('');
        setApprovalError(!approved);
        if (invalidFields || !approved)
            return;
        try {
            const response = await authApi.register(fields);
            setSuccess(response.message || 'Your account was created successfully.');
            window.setTimeout(() => navigate('/login'), 3000);
        }
        catch (reason) {
            const message = reason instanceof ApiError ? reason.message : 'Unable to create your account.';
            setErrors(message.split(':')[0].split(',').map((item) => item.trim()).filter(Boolean));
        }
    }
    const floating = 'peer block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pb-3 pt-6 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100';
    const label = 'pointer-events-none absolute left-4 top-4 origin-left text-sm text-gray-500 transition-all duration-200 peer-focus:top-2 peer-focus:scale-90 peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-90';
    return (<form onSubmit={submit} noValidate className="space-y-5">
      <div className="mb-7"><h2 className="text-2xl font-bold tracking-tight text-gray-900">Create your account</h2><p className="mt-2 text-sm leading-6 text-gray-500">Join our community and start connecting with people.</p></div>
      <div className="relative"><input value={fields.name} onChange={(e) => set('name', e.target.value)} onBlur={() => setTouched(true)} id="name" placeholder=" " autoComplete="name" className={floating}/><label htmlFor="name" className={label}>Name</label>{touched && invalid.name && <FormError>Name must contain at least 3 characters.</FormError>}</div>
      <div className="relative"><input value={fields.username} onChange={(e) => set('username', e.target.value)} onBlur={() => setTouched(true)} id="username" placeholder=" " autoComplete="username" className={floating}/><label htmlFor="username" className={label}>Username (optional)</label>{touched && invalid.username && <FormError>Use 3–30 lowercase letters, numbers, or underscores.</FormError>}</div>
      <div className="relative"><input value={fields.email} onChange={(e) => set('email', e.target.value)} onBlur={() => setTouched(true)} type="email" id="register-email" placeholder=" " autoComplete="email" className={floating}/><label htmlFor="register-email" className={label}>Email address</label>{touched && invalid.email && <FormError>Enter a valid email address.</FormError>}</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">Gender</label><select value={fields.gender} onChange={(e) => set('gender', e.target.value)} id="gender" className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"><option value="">Choose gender</option><option value="male">Male</option><option value="female">Female</option></select>{touched && invalid.gender && <FormError>Gender is required.</FormError>}</div>
        <div><label htmlFor="birth" className="mb-2 block text-sm font-medium text-gray-700">Date of birth</label><input value={fields.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} id="birth" type="date" autoComplete="bday" className="block w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"/>{touched && invalid.dateOfBirth && <FormError>Date of birth is required.</FormError>}</div>
      </div>
      <div className="relative"><input value={fields.password} onChange={(e) => set('password', e.target.value)} onBlur={() => setTouched(true)} type={showPassword ? 'text' : 'password'} id="register-password" placeholder=" " autoComplete="new-password" className={`${floating} pr-12`}/><button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"><i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}/></button><label htmlFor="register-password" className={label}>Password</label>{touched && invalid.password && <FormError>Use at least 8 characters with uppercase, lowercase, a number, and a special character.</FormError>}</div>
      <div className="relative"><input value={fields.rePassword} onChange={(e) => set('rePassword', e.target.value)} onBlur={() => setTouched(true)} type={showConfirm ? 'text' : 'password'} id="confirm-password" placeholder=" " autoComplete="new-password" className={`${floating} pr-12`}/><button type="button" onClick={() => setShowConfirm((v) => !v)} aria-label="Toggle confirmation visibility" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"><i className={`fa-solid ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}/></button><label htmlFor="confirm-password" className={label}>Confirm password</label>{touched && invalid.rePassword && <FormError>{fields.rePassword ? 'Passwords do not match.' : 'Please confirm your password.'}</FormError>}</div>
      <div className="flex items-start gap-3 pt-1"><input checked={approved} onChange={(e) => setApproved(e.target.checked)} type="checkbox" id="terms" className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-200"/><label htmlFor="terms" className="cursor-pointer text-sm leading-6 text-gray-500">I agree to the <a href="#terms" className="font-medium text-blue-600 hover:underline">Terms of Service</a> and <a href="#privacy" className="font-medium text-blue-600 hover:underline">Privacy Policy</a>.</label></div>
      {approvalError && <FormError>You need to agree to our terms.</FormError>}
      {success && <div className="mt-2 rounded-2xl border border-green-400 bg-green-100 px-4 py-2 text-sm font-bold text-green-700">{success}</div>}
      {errors.length > 0 && <FormError><ul className="list-inside list-disc">{errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul></FormError>}
      <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-0">Create Account <span className="transition-transform duration-200 group-hover:translate-x-1">→</span></button>
      <p className="pt-1 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline">Log In</Link></p>
    </form>);
}
