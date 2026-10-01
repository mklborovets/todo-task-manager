import { Pencil, Trash2, Calendar } from 'lucide-react';
import type { Task, TaskStatus } from '../types';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: TaskStatus) => void;
    isUpdating: boolean;
    isDeleting: boolean;
}

const statusConfig: Record<
    TaskStatus,
    { label: string; badgeClass: string }
> = {
    todo: {
        label: 'To Do',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    in_progress: {
        label: 'In Progress',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    done: {
        label: 'Done',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
};

export function TaskCard({
    task,
    onEdit,
    onDelete,
    onStatusChange,
    isUpdating,
    isDeleting,
}: TaskCardProps) {
    const currentStatus = statusConfig[task.status];
    const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
            <div>
                <div className="flex items-start justify-between gap-3">
                    <h3
                        className={`text-base font-semibold text-slate-900 ${task.status === 'done' ? 'line-through text-slate-400' : ''
                            }`}
                    >
                        {task.title}
                    </h3>
                    <span
                        className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${currentStatus.badgeClass}`}
                    >
                        {currentStatus.label}
                    </span>
                </div>

                {task.description && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                        {task.description}
                    </p>
                )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        aria-label="Task status"
                        value={task.status}
                        disabled={isUpdating || isDeleting}
                        onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-slate-900 focus:bg-white focus:outline-none disabled:opacity-50"
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        disabled={isDeleting}
                        title="Edit task"
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(task.id)}
                        disabled={isDeleting}
                        title="Delete task"
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}