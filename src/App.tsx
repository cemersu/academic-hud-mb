import { useState } from 'react';
import type { Course } from './types';
import type { CourseSession } from './types';
import type { Task } from './types';
import { CalendarGrid } from './components/calendar/CalendarGrid';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { TodoList } from './components/todo/TodoList';
import { AddCourseModal } from './components/modals/AddCourseModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_COURSES, INITIAL_SESSIONS, INITIAL_TASKS } from './utils/initialData';
import { getCurrentWeekKey } from './utils/timeUtils';
import { Calendar, Plus, ArchiveRestore } from 'lucide-react';

export function App() {
  // Temiz veri anahtarları (_v1) sayesinde yeni kullanıcılar ve iPad boş ekranla başlar
  const [courses, setCourses] = useLocalStorage<Course[]>('academic_courses_v1', INITIAL_COURSES);
  const [sessions, setSessions] = useLocalStorage<CourseSession[]>('academic_sessions_v1', INITIAL_SESSIONS);
  const [tasks, setTasks] = useLocalStorage<Task[]>('academic_tasks_v1', INITIAL_TASKS);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialDay, setModalInitialDay] = useState(1);
  const [modalInitialTime, setModalInitialTime] = useState('08:40');

  // Devamsızlık Arşivi
  const currentWeekKey = getCurrentWeekKey();
  const [missedSessionsMap, setMissedSessionsMap] = useLocalStorage<Record<string, string[]>>(
    'academic_missed_sessions_v1',
    {}
  );

  const currentMissedList = missedSessionsMap[currentWeekKey] || [];
  const missedSet = new Set(currentMissedList);

  // Ders durum toggle (girildi <-> kaçırıldı)
  const handleToggleSession = (sessionId: string) => {
    const updated = missedSet.has(sessionId)
      ? currentMissedList.filter((id) => id !== sessionId)
      : [...currentMissedList, sessionId];

    setMissedSessionsMap({
      ...missedSessionsMap,
      [currentWeekKey]: updated,
    });
  };

  // Haftayı Arşivleme / Yeni Haftaya Sıfırlama
  const handleArchiveWeek = () => {
    const missedCount = currentMissedList.length;
    const confirmMessage =
      missedCount > 0
        ? `Bu haftaki ${missedCount} adet kaçırılan ders devamsızlık hanesine işlenecek ve takvim yeni haftaya sıfırlanacak. Onaylıyor musun?`
        : 'Bu hafta hiç kaçırılan ders yok. Takvim yeni haftaya sıfırlansın mı?';

    if (window.confirm(confirmMessage)) {
      const archiveTimestampKey = `${currentWeekKey}_archived_${Date.now()}`;
      setMissedSessionsMap({
        ...missedSessionsMap,
        [archiveTimestampKey]: currentMissedList,
        [currentWeekKey]: [],
      });
    }
  };

  // To-Do İşlemleri
  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)));
  };

  const handleAddTask = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  // Izgaraya tıklandığında modalı açma
  const handleSlotClick = (day: number, hour: number) => {
    setModalInitialDay(day);
    setModalInitialTime(`${String(hour).padStart(2, '0')}:40`);
    setIsModalOpen(true);
  };

  // Yeni ders/oturum kaydetme
  const handleSaveSession = (newSession: CourseSession, newCourse?: Course) => {
    if (newCourse) {
      setCourses([...courses, newCourse]);
    }
    setSessions([...sessions, newSession]);
  };

  return (
    <div className="flex h-screen w-screen bg-hud-bg text-hud-text p-4 gap-4 overflow-hidden">
      {/* Sol Panel: Devamsızlık + To-Do */}
      <div className="w-80 flex flex-col gap-4 flex-shrink-0 h-full">
        <div className="bg-hud-card border border-hud-border rounded-xl p-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-hud-primary animate-pulse" />
            <span className="font-mono text-sm tracking-wider font-semibold text-hud-text">
              ACADEMIC HUD
            </span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-hud-border text-hud-muted">
            {currentWeekKey}
          </span>
        </div>

        <AttendanceTracker
          courses={courses}
          sessions={sessions}
          missedSessionIdsMap={missedSessionsMap}
        />

        <TodoList
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {/* Sağ Panel: Takvim */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 h-full">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-hud-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-hud-text">
              Haftalık Ders Programı
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleArchiveWeek}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A26] hover:bg-[#202536] text-xs rounded-lg transition-colors border border-hud-border text-hud-text hover:border-hud-borderLight shadow-sm"
              title="Mevcut haftanın durumunu kaydeder ve takvimi yeni haftaya sıfırlar"
            >
              <ArchiveRestore className="w-3.5 h-3.5 text-hud-yellow" />
              <span>Haftayı Arşivle</span>
            </button>

            <button
              onClick={() => {
                setModalInitialDay(1);
                setModalInitialTime('08:40');
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-hud-primary hover:bg-blue-600 text-xs rounded-lg transition-colors text-white font-medium shadow-md shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ders Ekle</span>
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <CalendarGrid
            courses={courses}
            sessions={sessions}
            missedSessionIds={missedSet}
            onToggleSession={handleToggleSession}
            onSlotClick={handleSlotClick}
          />
        </div>
      </div>

      {/* Ders Ekleme Modalı */}
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courses={courses}
        initialDay={modalInitialDay}
        initialStartTime={modalInitialTime}
        onSave={handleSaveSession}
      />
    </div>
  );
}

export default App;