import { useState } from 'react';
import { Plus, Loader2, ClipboardList, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import {
    useTasks,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
} from '../hooks/useTasks';
import type { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../types';

type FilterOption = 'all' | TaskStatus;

const filterTabs: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
];

export function DashboardPage() {
    const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const queryStatus = activeFilter === 'all' ? undefined : activeFilter;
    const { data: tasks, isLoading, isError, refetch } = useTasks(queryStatus);

    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();

    const handleOpenCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleFormSubmit = async (
        payload: CreateTaskPayload | UpdateTaskPayload
    ) => {
        if (editingTask) {
            await updateTaskMutation.mutateAsync({
                id: editingTask.id,
                payload: payload as UpdateTaskPayload,
            });
        } else {
            await createTaskMutation.mutateAsync(payload as CreateTaskPayload);
        }
    };

    const handleStatusChange = (id: string, status: TaskStatus) => {
        updateTaskMutation.mutate({ id, payload: { status } });
    };

    const handleDeleteTask = (id: string) => {
        if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            deleteTaskMutation.mutate(id);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            My Tasks
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Manage your daily workload and track progress across statuses.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800"
                    >
                        <Plus className="h-4 w-4" />
                        <span>New Task</span>
                    </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                    {filterTabs.map((tab) => {
                        const isActive = activeFilter === tab.value;
                        return (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => setActiveFilter(tab.value)}
                                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${isActive
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                            <p className="mt-3 text-sm text-slate-500">Loading tasks...</p>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                            <h3 className="mt-2 text-sm font-semibold text-red-900">
                                Failed to load tasks
                            </h3>
                            <p className="mt-1 text-xs text-red-700">
                                Could not fetch tasks from the server. Please try again.
                            </p>
                            <button
                                type="button"
                                onClick={() => void refetch()}
                                className="mt-4 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                            >
                                Retry
                            </button>
                        </div>
                    ) : tasks && tasks.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={handleOpenEditModal}
                                    onDelete={handleDeleteTask}
                                    onStatusChange={handleStatusChange}
                                    isUpdating={updateTaskMutation.isPending && updateTaskMutation.variables?.id === task.id}
                                    isDeleting={deleteTaskMutation.isPending && deleteTaskMutation.variables === task.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900">
                                No tasks found
                            </h3>
                            <p className="mt-1 max-w-sm text-sm text-slate-500">
                                {activeFilter === 'all'
                                    ? 'You have not created any tasks yet. Click "New Task" to get started.'
                                    : 'No tasks match the selected status filter.'}
                            </p>
                            {activeFilter === 'all' && (
                                <button
                                    type="button"
                                    onClick={handleOpenCreateModal}
                                    className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Create your first task</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <TaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                initialTask={editingTask}
                isSubmitting={
                    createTaskMutation.isPending || updateTaskMutation.isPending
                }
            />
        </div>
    );
}