import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login({ email: email.trim(), password });
            navigate('/', { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message || 'Invalid email or password';
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
                        <LogIn className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                    <p className="text-sm text-slate-500 mt-1">Sign in to manage your tasks</p>
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
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
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
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign in</span>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}