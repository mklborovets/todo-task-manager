import { useState } from 'react';
import { Plus, Loader2, ClipboardList, AlertCircle, Search } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const queryStatus = activeFilter === 'all' ? undefined : activeFilter;
    const { data: tasks, isLoading, isError, refetch } = useTasks(queryStatus);

    const sortedTasks = tasks
        ? [...tasks]
            .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter((task) => {
                if (!selectedDate) return true;
                if (!task.dueDate) return false;
                return task.dueDate.split('T')[0] === selectedDate;
            })
            .sort((a, b) => {
                const statusOrder = { in_progress: 1, todo: 2, done: 3 };
                return statusOrder[a.status] - statusOrder[b.status];
            })
        : undefined;

    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getLocalDateString = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const dateBlocks = Array.from({ length: 21 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - 3 + i);
        return {
            dateString: getLocalDateString(d),
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: d.getDate(),
        };
    });

    const datesWithTasks = new Set(
        tasks?.filter(t => t.dueDate).map(t => t.dueDate!.split('T')[0]) || []
    );

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

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
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

                    <div className="relative w-full sm:w-64 shrink-0">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block border w-full rounded-lg border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                    <div className="flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 h-[56px]">
                        <input
                            type="date"
                            title="Select a specific date"
                            value={selectedDate || ''}
                            onChange={(e) => setSelectedDate(e.target.value || null)}
                            className="border-none bg-transparent text-sm font-medium text-slate-700 outline-none w-auto"
                        />
                    </div>

                    <div className="h-8 w-px bg-slate-200 shrink-0 mx-1"></div>

                    <button
                        onClick={() => setSelectedDate(null)}
                        className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition border h-[56px] flex items-center justify-center ${!selectedDate ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                        Any Date
                    </button>

                    {dateBlocks.map(block => (
                        <button
                            key={block.dateString}
                            onClick={() => setSelectedDate(block.dateString)}
                            className={`relative flex shrink-0 flex-col items-center justify-center rounded-xl border px-3 py-1.5 transition min-w-[56px] min-h-[56px] ${selectedDate === block.dateString
                                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                } ${block.dateString === getLocalDateString(today) && selectedDate !== block.dateString ? 'border-blue-400 bg-blue-50/30' : ''}`}
                        >
                            <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">{block.dayName}</span>
                            <span className="text-lg font-bold mt-0.5" style={{ lineHeight: 1 }}>{block.dayNum}</span>

                            {datesWithTasks.has(block.dateString) && (
                                <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${selectedDate === block.dateString ? 'bg-white' : 'bg-blue-500'}`}></span>
                            )}
                        </button>
                    ))}
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
                    ) : sortedTasks && sortedTasks.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {sortedTasks.map((task) => (
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