import React, { useMemo, useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, Link, router } from '@inertiajs/react';
import { PlusIcon, TrashIcon, ClockIcon, Bars3Icon, UserIcon, FireIcon, CheckCircleIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { format, parseISO, isPast, isToday, isTomorrow } from 'date-fns';
import {
    DndContext,
    closestCorners, // Better for columns
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// --- 1. Sortable Wrapper ---
const SortableTaskCard = ({ task, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: `task-${task.id}`, // PREFIX ADDED
        data: { type: 'Task', task }
    });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} onClick={onClick} />
        </div>
    );
};

// --- 2. Task Card (Visual) ---
const TaskCard = ({ task, onClick }) => {
    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('tasks.destroy', task.id), { preserveScroll: true });
        }
    };
    const getDeadlineInfo = () => {
        if (!task.deadline) return null;
        const date = parseISO(task.deadline);
        if (isPast(date) && !isToday(date)) return { label: format(date, 'MMM d'), icon: <FireIcon className="h-4 w-4" />, color: 'text-red-500' };
        return { label: format(date, 'MMM d'), icon: <ClockIcon className="h-4 w-4" />, color: 'text-gray-500 dark:text-gray-400' };
    };
    const deadlineInfo = getDeadlineInfo();

    return (
        <div onClick={onClick} className="p-4 bg-white dark:bg-zinc-700 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-600 cursor-pointer group hover:ring-2 hover:ring-primary-500 transition-all">
            <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1 mr-2">{task.title}</p>
                <button onClick={handleDelete} className="p-1 rounded-full opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-600 transition-all">
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-3">
                    {task.description && <Bars3Icon className="h-4 w-4 text-gray-400" title="Has description" />}
                    {deadlineInfo && <div className={`flex items-center gap-1 text-xs font-medium ${deadlineInfo.color}`}>{deadlineInfo.icon}<span>{deadlineInfo.label}</span></div>}
                </div>
                <div className="flex items-center gap-2">
                    {task.assigned_to && (
                        <div className="flex items-center gap-1 text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full" title={`Assigned to ${task.assigned_to.name}`}>
                            <UserIcon className="h-3 w-3" /> {task.assigned_to.name.split(' ')[0]}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 3. Kanban Column ---
const KanbanColumn = ({ column, onAddTask, children }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `col-${column.id}`, // PREFIX ADDED
        data: { type: 'Column', id: column.id }
    });
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, put } = useForm({ name: column.name });

    const handleRename = (e) => {
        e.preventDefault();
        put(route('columns.update', column.id), { onSuccess: () => setIsEditing(false) });
    };

    return (
        <div ref={setNodeRef} className={`flex flex-col flex-shrink-0 flex-1 min-w-[300px] max-w-sm bg-gray-200 dark:bg-zinc-800 rounded-xl transition-all ${isOver ? 'ring-2 ring-primary-500' : ''}`}>
            <div className="p-4 border-b border-gray-300 dark:border-zinc-700 flex justify-between items-center">
                {isEditing ? (
                    <form onSubmit={handleRename} className="flex items-center gap-2 w-full">
                        <TextInput autoFocus value={data.name} onChange={e => setData('name', e.target.value)} className="h-8 text-sm w-full" />
                        <button type="submit" className="text-green-500 hover:text-green-600"><CheckCircleIcon className="h-5 w-5" /></button>
                        <button type="button" onClick={() => setIsEditing(false)} className="text-red-500 hover:text-red-600"><XMarkIcon className="h-5 w-5" /></button>
                    </form>
                ) : (
                    <div className="flex items-center gap-2 group w-full">
                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">{column.name}</h3>
                        <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary-500 transition-opacity"><PencilIcon className="h-4 w-4" /></button>
                        <div className="flex-1"></div>
                        <button onClick={() => confirm('Delete column?') && router.delete(route('columns.destroy', column.id))} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"><TrashIcon className="h-4 w-4" /></button>
                    </div>
                )}
                {!isEditing && (
                    <button onClick={() => onAddTask(column.id)} className="ml-2 p-1 rounded-full text-gray-400 hover:text-primary-500 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                        <PlusIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[150px]">{children}</div>
        </div>
    );
};

// --- 4. Main Page ---
export default function Index() {
    const { auth, board, columns: initialColumns, members } = usePage().props;
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const allTasks = initialColumns.flatMap(col => col.tasks.map(t => ({...t, column_id: col.id})));
        setTasks(allTasks);
    }, [initialColumns]);

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isColModalOpen, setIsColModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeTask, setActiveTask] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: null, title: '', description: '', deadline: '', column_id: '', assigned_to_id: '',
    });
    const { data: colData, setData: setColData, post: postCol, reset: resetCol } = useForm({ name: '' });

    const tasksByColumn = useMemo(() => {
        const grouped = {};
        initialColumns.forEach(col => grouped[col.id] = []);
        tasks.forEach(task => {
            if (grouped[task.column_id]) grouped[task.column_id].push(task);
        });
        Object.keys(grouped).forEach(key => grouped[key].sort((a, b) => a.order - b.order));
        return grouped;
    }, [tasks, initialColumns]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const handleDragStart = (e) => {
        const taskId = parseInt(e.active.id.replace('task-', ''));
        setActiveTask(tasks.find(t => t.id === taskId));
    };

    const handleDragCancel = () => setActiveTask(null);

    // --- FIX: handleDragOver (Visual feedback for moving between columns) ---
    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id; // "task-1"
        const overId = over.id;     // "task-5" or "col-2"

        if (activeId === overId) return;

        // Find dragged task
        const activeTask = tasks.find(t => `task-${t.id}` === activeId);
        if (!activeTask) return;

        // Is over a column or a task?
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        if (!isOverTask && !isOverColumn) return;

        // New Column ID
        const overColumnId = isOverColumn
            ? parseInt(over.id.replace('col-', ''))
            : over.data.current.task.column_id;

        // Only react if moving to a different column here
        if (activeTask.column_id !== overColumnId) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex(t => t.id === activeTask.id);
                const newTasks = [...prev];
                newTasks[activeIndex] = { ...newTasks[activeIndex], column_id: overColumnId };
                return arrayMove(newTasks, activeIndex, activeIndex); // Just trigger re-render
            });
        }
    };

    const handleDragEnd = (event) => {
        const cleanup = () => setActiveTask(null);
        const { active, over } = event;

        if (!over) return cleanup();

        const activeTaskId = parseInt(active.id.replace('task-', ''));
        const activeTask = tasks.find(t => t.id === activeTaskId);

        if (!activeTask) return cleanup();

        const overIsColumn = over.data.current?.type === 'Column';
        const overIsTask = over.data.current?.type === 'Task';

        let newColumnId, newOrder;

        if (overIsColumn) {
            newColumnId = parseInt(over.id.replace('col-', ''));
            newOrder = 9999; // End of list
        } else if (overIsTask) {
            const overTask = over.data.current.task;
            newColumnId = overTask.column_id;
            const columnTasks = tasksByColumn[newColumnId];
            const overIndex = columnTasks.findIndex(t => t.id === overTask.id);

            // If dropping below, +1. If above, index stays.
            // Simplified: use the index directly
            newOrder = overIndex;
        } else {
            return cleanup();
        }

        // Only send request if something changed (roughly)
        router.patch(route('tasks.move', activeTask.id), {
            column_id: newColumnId,
            order: newOrder
        }, { preserveScroll: true, onFinish: cleanup, onCancel: cleanup });
    };

    // Modals
    const openTaskModal = (colId, task = null) => {
        if (task) {
            setIsEditMode(true);
            setData({
                id: task.id, title: task.title, description: task.description || '',
                deadline: task.deadline ? format(parseISO(task.deadline), 'yyyy-MM-dd') : '',
                column_id: task.column_id, assigned_to_id: task.assigned_to_id || '',
            });
        } else {
            setIsEditMode(false);
            setData({ id: null, title: '', description: '', deadline: '', column_id: colId, assigned_to_id: '' });
        }
        setIsTaskModalOpen(true);
    };
    const submitTask = (e) => {
        e.preventDefault(); e.stopPropagation();
        if(isEditMode) put(route('tasks.update', data.id), { onSuccess: () => setIsTaskModalOpen(false) });
        else post(route('tasks.store', { board: board.id }), { onSuccess: () => setIsTaskModalOpen(false) });
    };
    const submitColumn = (e) => {
        e.preventDefault(); e.stopPropagation();
        postCol(route('columns.store', { board: board.id }), { onSuccess: () => { setIsColModalOpen(false); resetCol(); }});
    };

    return (
        <AuthenticatedLayout user={auth.user} header={
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link href={route('boards.index')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">&larr;</Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">{board.name}</h2>
                </div>
                <PrimaryButton onClick={() => setIsColModalOpen(true)}>Add Column</PrimaryButton>
            </div>
        }>
            <Head title={board.name} />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver} // <-- Added visual help
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div className="flex-1 flex gap-6 overflow-x-auto p-4 justify-center h-[calc(100vh-80px)]">
                    {initialColumns.map(col => (
                        <SortableContext
                            key={col.id}
                            items={(tasksByColumn[col.id] || []).map(t => `task-${t.id}`)} // PREFIXED IDs
                            strategy={verticalListSortingStrategy}
                        >
                            <KanbanColumn column={col} onAddTask={() => openTaskModal(col.id)} onDeleteColumn={() => {}} taskCount={(tasksByColumn[col.id] || []).length}>
                                {(tasksByColumn[col.id] || []).map(task => (
                                    <SortableTaskCard key={task.id} task={task} onClick={() => openTaskModal(null, task)} />
                                ))}
                            </KanbanColumn>
                        </SortableContext>
                    ))}
                </div>
                <DragOverlay className="pointer-events-none">
                    {activeTask ? <TaskCard task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>

            {/* Modals remain unchanged */}
            <Modal show={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
                <form onSubmit={submitTask} className="p-6 space-y-4">
                    <h2 className="text-lg font-medium dark:text-white">{isEditMode ? 'Edit' : 'New'} Task</h2>
                    <div><InputLabel value="Title" /><TextInput value={data.title} onChange={e => setData('title', e.target.value)} className="w-full" autoFocus /><InputError message={errors.title} /></div>
                    <div><InputLabel value="Description" /><textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full border-gray-300 dark:bg-zinc-900 dark:border-zinc-700 rounded-md dark:text-gray-300" rows={3} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><InputLabel value="Deadline" /><TextInput type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} className="w-full" /></div>
                        <div><InputLabel value="Assign To" /><select value={data.assigned_to_id} onChange={e => setData('assigned_to_id', e.target.value)} className="w-full border-gray-300 dark:bg-zinc-900 dark:border-zinc-700 rounded-md dark:text-gray-300"><option value="">Unassigned</option>{members.map(m => <option key={m.id} value={m.id}>{m.name} (@{m.username})</option>)}</select></div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 border rounded dark:text-white dark:border-gray-600">Cancel</button>
                        <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={isColModalOpen} onClose={() => setIsColModalOpen(false)}>
                <form onSubmit={submitColumn} className="p-6 space-y-4">
                    <h2 className="text-lg font-medium dark:text-white">Add New Column</h2>
                    <TextInput value={colData.name} onChange={e => setColData('name', e.target.value)} placeholder="Column Name (e.g. Review)" className="w-full" autoFocus />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsColModalOpen(false)} className="px-4 py-2 border rounded dark:text-white dark:border-gray-600">Cancel</button>
                        <PrimaryButton>Create</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
