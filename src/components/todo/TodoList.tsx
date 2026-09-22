import React, { useState } from 'react';
import type { Task } from '../../types';
import { CheckSquare, Calendar, Plus, Trash2 } from 'lucide-react';

interface TodoListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Tarih durumunu belirleme (Kırmızı: Gecikmiş, Sarı: Yaklaşan < 3 gün, Muted: Normal)
  const getDateStatus = (dueDate: string, isCompleted: boolean) => {
    if (isCompleted) return 'text-hud-muted line-through';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-hud-red'; // Geçti
    if (diffDays <= 3) return 'text-hud-yellow'; // 3 günden az kaldı
    return 'text-hud-muted';
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    onAddTask({
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      dueDate: newDate,
      isCompleted: false,
    });

    setNewTitle('');
    setNewDate('');
    setIsAdding(false);
  };

  return (
    <div className="bg-hud-card border border-hud-border rounded-xl p-4 flex flex-col gap-3 flex-1 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between border-b border-hud-border/60 pb-2">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-hud-green" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-hud-text">
            Yapılacaklar
          </span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-hud-muted hover:text-hud-text transition-colors p-1 rounded hover:bg-hud-border/50"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hızlı Ekleme Formu */}
      {isAdding && (
        <form onSubmit={handleCreate} className="flex flex-col gap-2 p-2 bg-[#161822] rounded-lg border border-hud-border">
          <input
            type="text"
            placeholder="Görev adı..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="bg-transparent text-xs text-hud-text placeholder-hud-muted focus:outline-none"
            autoFocus
          />
          <div className="flex items-center justify-between gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="bg-hud-card text-[11px] text-hud-muted px-2 py-0.5 rounded border border-hud-border/60 focus:outline-none"
            />
            <button
              type="submit"
              className="px-2.5 py-0.5 bg-hud-primary hover:bg-blue-600 text-white text-[11px] rounded font-medium transition-colors"
            >
              Ekle
            </button>
          </div>
        </form>
      )}

      {/* Görev Listesi */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
        {tasks.map((task) => {
          const dateStyle = getDateStatus(task.dueDate, task.isCompleted);

          return (
            <div
              key={task.id}
              className="group flex items-start justify-between p-2 rounded-lg bg-[#141620] border border-hud-border/50 hover:border-hud-border transition-all"
            >
              <div
                onClick={() => onToggleTask(task.id)}
                className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0"
              >
                <div
                  className={`w-3.5 h-3.5 mt-0.5 rounded border flex items-center justify-center transition-colors ${
                    task.isCompleted
                      ? 'bg-hud-green/20 border-hud-green text-hud-green'
                      : 'border-hud-borderLight hover:border-hud-muted'
                  }`}
                >
                  {task.isCompleted && <div className="w-1.5 h-1.5 bg-hud-green rounded-sm" />}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className={`text-xs truncate ${
                      task.isCompleted ? 'text-hud-muted line-through' : 'text-hud-text'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className={`flex items-center gap-1 text-[10px] font-mono mt-0.5 ${dateStyle}`}>
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-hud-muted hover:text-hud-red transition-all p-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};