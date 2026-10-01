import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Calendar, ChevronDown, Check, Target } from 'lucide-react';
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
    { label: string; badgeClass: string; optionColor: string }
> = {
    todo: {
        label: 'To Do',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        optionColor: 'text-slate-700 bg-slate-100 hover:bg-slate-200',
    },
    in_progress: {
        label: 'In Progress',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        optionColor: 'text-amber-700 bg-amber-50 hover:bg-amber-100',
    },
    done: {
        label: 'Done',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        optionColor: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100',
    },
};

const StatusDropdown = ({ value, onChange, disabled }: { value: TaskStatus, onChange: (status: TaskStatus) => void, disabled: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const options: TaskStatus[] = ['todo', 'in_progress', 'done'];
    const currentOption = statusConfig[value];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
            >
                {currentOption.label}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg z-10 p-1 origin-top animate-in fade-in zoom-in-95 duration-100">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${option === value
                                ? statusConfig[option].optionColor
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {statusConfig[option].label}
                            {option === value && <Check className="h-3.5 w-3.5" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
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

    let formattedDueDate = null;
    let isOverdue = false;

    if (task.dueDate) {
        const [year, month, day] = task.dueDate.split('T')[0].split('-').map(Number);
        const d = new Date(year, month - 1, day);

        formattedDueDate = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        isOverdue = d.getTime() < today.getTime() && task.status !== 'done';
    }

    return (
        <div
            className={`flex flex-col justify-between rounded-xl border p-5 shadow-sm transition hover:border-slate-300 ${task.status === 'done'
                ? 'border-slate-200 bg-slate-100'
                : 'border-slate-200 bg-white'
                }`}
        >
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
                    <p className={`mt-2 whitespace-pre-wrap text-sm ${task.status === 'done' ? 'text-slate-500' : 'text-slate-600'
                        }`}>
                        {task.description}
                    </p>
                )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formattedDate}</span>
                    </div>
                    {task.dueDate && (
                        <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                            <Target className="h-3.5 w-3.5" />
                            <span>{formattedDueDate}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <StatusDropdown
                        value={task.status}
                        onChange={(newStatus) => onStatusChange(task.id, newStatus)}
                        disabled={isUpdating || isDeleting}
                    />

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