import React, { useMemo, useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, Link, router } from '@inertiajs/react';
import { PlusIcon, TrashIcon, ClockIcon, Bars3Icon, UserIcon, FireIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { format, parseISO, isPast, isToday, isTomorrow } from 'date-fns';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove, // <-- 1. Import 'arrayMove' for easier sorting
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// --- SortableTaskCard (ID is a STRING) ---
const SortableTaskCard = ({ task, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id.toString(), // String ID
        data: { type: 'Task', task }
    });

    // --- THIS IS THE ANIMATION ---
    // The 'transition' prop from dnd-kit is what makes it smooth
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} onClick={onClick} />
        </div>
    );
};

// --- TaskCard (No changes) ---
const TaskCard = ({ task, onClick }) => {
    const handleDelete = (e) => e.stopPropagation();
    const getDeadlineInfo = () => {
        if (!task.deadline) return null;
        const deadLineDate = parseISO(task.deadline);
        if (isPast(deadLineDate) && !isToday(deadLineDate)) {
            return { label: format(deadLineDate, 'MMM d'), icon: <FireIcon className="h-4 w-4" />, color: 'text-red-500', title: `Overdue: ${format(deadLineDate, 'MMM d, yyyy')}` };
        }
        if (isToday(deadLineDate) || isTomorrow(deadLineDate)) {
            return { label: isToday(deadLineDate) ? 'Today' : 'Tomorrow', icon: <ClockIcon className="h-4 w-4" />, color: 'text-amber-600 dark:text-amber-500', title: `Due ${format(deadLineDate, 'MMM d, yyyy')}` };
        }
        return { label: format(deadLineDate, 'MMM d'), icon: <CheckCircleIcon className="h-4 w-4" />, color: 'text-gray-500 dark:text-gray-400', title: `Due ${format(deadLineDate, 'MMM d, yyyy')}` };
    };
    const deadlineInfo = getDeadlineInfo();
    return (
        <div onClick={onClick} className="p-4 bg-white dark:bg-zinc-700 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-600 cursor-pointer group transition-all duration-150 ease-in-out hover:shadow-md hover:ring-2 hover:ring-primary-500">
            <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                <Link href={route('tasks.destroy', task.id)} method="delete" as="button" className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 hover:text-red-500 transition-opacity" onBefore={() => confirm('Are you sure you want to delete this task?')} onClick={handleDelete}>
                    <TrashIcon className="h-4 w-4" />
                </Link>
            </div>
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-3">
                    {task.description && (<Bars3Icon className="h-4 w-4 text-gray-400" title="This task has a description" />)}
                    {deadlineInfo && (<div className={`flex items-center gap-1 text-xs font-medium ${deadlineInfo.color}`} title={deadlineInfo.title}>{deadlineInfo.icon}<span>{deadlineInfo.label}</span></div>)}
                </div>
                {task.assigned_by && (<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded-full" title={`Assigned by ${task.assigned_by}`}><UserIcon className="h-3 w-3" /><span className="truncate max-w-[100px]">{task.assigned_by}</span></div>)}
            </div>
        </div>
    );
};

// --- KanbanColumn (No changes) ---
const KanbanColumn = ({ status, title, color, onAddTaskClick, taskCount, children }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: status, data: { type: 'Column', status: status }
    });
    return (
        <div ref={setNodeRef} className={`flex flex-col flex-shrink-0 flex-1 min-w-[300px] max-w-sm bg-gray-200 dark:bg-zinc-800 rounded-xl transition-all duration-150 ${isOver ? 'ring-2 ring-primary-500' : ''}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${color}`}></span>
                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-zinc-700 rounded-full px-2 py-0.5">{taskCount}</span>
                </div>
                <button onClick={() => onAddTaskClick(status)} className="p-1 rounded-full text-gray-400 hover:text-primary-500 hover:bg-gray-300 dark:hover:bg-gray-700">
                    <PlusIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {children}
            </div>
        </div>
    );
};

// --- Main Page Component ---
export default function Index() {
    const { auth, tasks: initialTasks, board } = usePage().props;
    const [tasks, setTasks] = useState(initialTasks);
    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('todo');
    const [activeTask, setActiveTask] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: null, title: '', description: '', deadline: '', status: 'todo', assigned_by: '',
    });

    const columns = useMemo(() => ({
        todo: tasks.filter(task => task.status === 'todo').sort((a, b) => a.order - b.order),
        doing: tasks.filter(task => task.status === 'doing').sort((a, b) => a.order - b.order),
        done: tasks.filter(task => task.status === 'done').sort((a, b) => a.order - b.order),
    }), [tasks]);

    const tasksById = useMemo(() => tasks.reduce((acc, task) => {
        acc[task.id.toString()] = task; // Key by string
        return acc;
    }, {}), [tasks]);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
    }));

    // --- DRAG START ---
    const handleDragStart = (event) => {
        setActiveTask(tasksById[event.active.id]);
    };

    // --- DRAG CANCEL ---
    const handleDragCancel = () => {
        setActiveTask(null);
    };

    // --- 2. THE NEW OPTIMISTIC `handleDragEnd` ---
    const handleDragEnd = (event) => {
        const { active, over } = event;

        // Clean up and hide overlay
        const cleanup = () => setActiveTask(null);

        if (!over) return cleanup();

        const activeId = active.id.toString();
        const overId = over.id.toString();
        const activeTask = tasksById[activeId];

        if (activeId === overId || !activeTask) {
            return cleanup();
        }

        const overIsColumn = over.data.current?.type === 'Column';
        const overIsTask = over.data.current?.type === 'Task';

        if (!overIsColumn && !overIsTask) return cleanup();

        const newStatus = overIsColumn ? over.id : over.data.current.task.status;

        // --- OPTIMISTIC UPDATE ---
        // This is the new, simple logic that runs immediately
        setTasks((prevTasks) => {
            const activeTaskIndex = prevTasks.findIndex(t => t.id.toString() === activeId);
            const overTaskIndex = overIsTask ? prevTasks.findIndex(t => t.id.toString() === overId) : -1;

            let newTasks;

            if (activeTask.status === newStatus) {
                // 1. Moving within the same column
                const oldIndex = columns[activeTask.status].findIndex(t => t.id.toString() === activeId);
                const newIndex = overIsTask ? columns[newStatus].findIndex(t => t.id.toString() === overId) : columns[newStatus].length;
                newTasks = arrayMove(prevTasks, activeTaskIndex, overTaskIndex);

            } else {
                // 2. Moving to a different column
                // Update the task's status
                const movedTask = { ...activeTask, status: newStatus };

                // Remove from old position
                newTasks = prevTasks.filter(t => t.id.toString() !== activeId);

                // Find insert index in new column
                const overColumnTasks = columns[newStatus];
                let insertIndex = overIsTask ? newTasks.findIndex(t => t.id.toString() === overId) : newTasks.length;

                // Insert into new position
                newTasks.splice(insertIndex, 0, movedTask);
            }

            // 3. Re-calculate order for *all* tasks
            return ['todo', 'doing', 'done'].flatMap(status => {
                return newTasks
                    .filter(t => t.status === status)
                    .map((task, index) => ({
                        ...task,
                        order: index,
                    }));
            });
        });

        // --- BACKEND UPDATE ---
        // We still need to calculate the final new order
        const overColumnTasks = columns[newStatus];
        let newIndex = overColumnTasks.length; // Default to end of list
        if(overIsTask) {
            newIndex = overColumnTasks.findIndex(t => t.id.toString() === overId);
        }

        router.patch(route('tasks.move', activeTask.id), {
            status: newStatus,
            order: newIndex,
        }, {
            preserveScroll: true,
            preserveState: true, // <-- Tell Inertia not to replace our state
            onFinish: cleanup, // Hide overlay on finish
            onCancel: cleanup, // Hide overlay on cancel
        });
    };

    // --- (Rest of the component: Modals, Tabs, etc. - No changes) ---
    const openCreateModal = (status) => {
        reset(); setData('status', status); setIsEditMode(false); setIsModalOpen(true);
    };
    const openEditModal = (task) => {
        setIsEditMode(true);
        setData({
            id: task.id, title: task.title, description: task.description || '',
            deadline: task.deadline ? format(parseISO(task.deadline), 'yyyy-MM-dd') : '',
            status: task.status, assigned_by: task.assigned_by || '',
        });
        setIsModalOpen(true);
    };
    const closeModal = () => { setIsModalOpen(false); reset(); };
    const submit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('tasks.update', data.id), { onSuccess: () => closeModal() });
        } else {
            post(route('tasks.store', { board: board.id }), { onSuccess: () => closeModal() });
        }
    };
    const TabButton = ({ tab, label, count }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-3 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'}`}
        >
            {label} <span className="text-xs ml-1 px-1.5 py-0.5 bg-gray-200 dark:bg-zinc-700 rounded-full">{count}</span>
        </button>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('boards.index')} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        &larr; All Boards
                    </Link>
                    <span className="text-gray-300 dark:text-gray-700">/</span>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {board.name}
                    </h2>
                </div>
            }
        >
            <Head title={board.name} />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                {/* --- DESKTOP LAYOUT --- */}
                <div className="hidden md:flex flex-1 gap-6 overflow-x-auto p-4 sm:p-6 lg:p-8 justify-center">

                    <SortableContext items={columns.todo.map(t => t.id.toString())} strategy={verticalListSortingStrategy}>
                        <KanbanColumn
                            status="todo" title="To-Do" color="bg-gray-500"
                            onAddTaskClick={openCreateModal} taskCount={columns.todo.length}
                        >
                            {columns.todo.map(task => (
                                <SortableTaskCard key={task.id} task={task} onClick={() => openEditModal(task)} />
                            ))}
                        </KanbanColumn>
                    </SortableContext>

                    <SortableContext items={columns.doing.map(t => t.id.toString())} strategy={verticalListSortingStrategy}>
                        <KanbanColumn
                            status="doing" title="Doing" color="bg-amber-500"
                            onAddTaskClick={openCreateModal} taskCount={columns.doing.length}
                        >
                            {columns.doing.map(task => (
                                <SortableTaskCard key={task.id} task={task} onClick={() => openEditModal(task)} />
                            ))}
                        </KanbanColumn>
                    </SortableContext>

                    <SortableContext items={columns.done.map(t => t.id.toString())} strategy={verticalListSortingStrategy}>
                        <KanbanColumn
                            status="done" title="Done" color="bg-primary-500"
                            onAddTaskClick={openCreateModal} taskCount={columns.done.length}
                        >
                            {columns.done.map(task => (
                                <SortableTaskCard key={task.id} task={task} onClick={() => openEditModal(task)} />
                            ))}
                        </KanbanColumn>
                    </SortableContext>

                </div>

                {/* --- DragOverlay --- */}
                <DragOverlay>
                    {activeTask ? (
                        <TaskCard task={activeTask} />
                    ) : null}
                </DragOverlay>

            </DndContext>

            {/* --- MOBILE (TABBED) LAYOUT --- */}
            <div className="md:hidden flex-1 flex flex-col">
                <div className="flex-shrink-0 flex border-b border-gray-200 dark:border-zinc-700">
                    <TabButton tab="todo" label="To-Do" count={columns.todo.length} />
                    <TabButton tab="doing" label="Doing" count={columns.doing.length} />
                    <TabButton tab="done" label="Done" count={columns.done.length} />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100 dark:bg-zinc-900">
                    {activeTab === 'todo' && columns.todo.map(task => (
                        <TaskCard key={task.id} task={task} onClick={() => openEditModal(task)} />
                    ))}
                    {activeTab === 'doing' && columns.doing.map(task => (
                        <TaskCard key={task.id} task={task} onClick={() => openEditModal(task)} />
                    ))}
                    {activeTab === 'done' && columns.done.map(task => (
                        <TaskCard key={task.id} task={task} onClick={() => openEditModal(task)} />
                    ))}
                    <button
                        onClick={() => openCreateModal(activeTab)}
                        className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Task
                    </button>
                </div>
            </div>

            {/* --- Modal (All typos fixed) --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {isEditMode ? 'Edit Task' : 'Create New Task'}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="title" value="Task Title" />
                            <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1 block w-full" isFocused />
                            <InputError message={errors.title} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Description (Optional)" />
                            <textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="deadline" value="Deadline (Optional)" />
                                <TextInput id="deadline" type="date" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)} className="mt-1 block w-full" />
                                <InputError message={errors.deadline} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="assigned_by" value="Assigned By (Optional)" />
                                <TextInput id="assigned_by" type="text" value={data.assigned_by} onChange={(e) => setData('assigned_by', e.target.value)} className="mt-1 block w-full" placeholder="e.g. Team Lead" />
                                <InputError message={errors.assigned_by} className="mt-2" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            Cancel
                        </button>
                        <PrimaryButton disabled={processing}>
                            {isEditMode ? 'Save Changes' : 'Create Task'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
