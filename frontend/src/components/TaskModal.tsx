import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import type { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateTaskPayload | UpdateTaskPayload) => Promise<void>;
    initialTask?: Task | null;
    isSubmitting: boolean;
}

export function TaskModal({
    isOpen,
    onClose,
    onSubmit,
    initialTask,
    isSubmitting,
}: TaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('todo');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialTask) {
            setTitle(initialTask.title);
            setDescription(initialTask.description ?? '');
            setStatus(initialTask.status);
        } else {
            setTitle('');
            setDescription('');
            setStatus('todo');
        }
        setError(null);
    }, [initialTask, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            setError('Title is required');
            return;
        }

        const trimmedDescription = description.trim();

        try {
            if (initialTask) {
                await onSubmit({
                    title: trimmedTitle,
                    description: trimmedDescription || undefined,
                    status,
                });
            } else {
                await onSubmit({
                    title: trimmedTitle,
                    ...(trimmedDescription ? { description: trimmedDescription } : {}),
                    status,
                });
            }
            onClose();
        } catch {
            setError('Failed to save task. Please check your input and try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {initialTask ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="task-title"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Title
                            </label>
                            <input
                                id="task-title"
                                type="text"
                                required
                                maxLength={255}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What needs to be done?"
                                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="task-description"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Description <span className="text-slate-400">(optional)</span>
                            </label>
                            <textarea
                                id="task-description"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add context or details..."
                                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="task-status"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Status
                            </label>
                            <select
                                id="task-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                            >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {initialTask ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}