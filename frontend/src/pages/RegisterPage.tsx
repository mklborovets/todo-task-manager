import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            await register({ email: email.trim(), password });
            navigate('/', { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message || 'Registration failed. Please check your inputs.';
                setError(message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
                    <p className="text-sm text-slate-500 mt-1">Start organizing your tasks today</p>
                </div>

                {error && (
                    <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-700 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat your password"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Creating account...</span>
                            </>
                        ) : (
                            <span>Create account</span>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}