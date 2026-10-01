import { CheckSquare, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <CheckSquare className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900">
                        Task Manager
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden items-center gap-2 text-sm text-slate-600 sm:flex">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{user?.email}</span>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        </header>
    );
}