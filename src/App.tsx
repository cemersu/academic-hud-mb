import { useState } from 'react';
import type { Course, CourseSession, Task } from './types';
import { CalendarGrid } from './components/calendar/CalendarGrid';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { TodoList } from './components/todo/TodoList';
import { AddCourseModal } from './components/modals/AddCourseModal';
import { HelpModal } from './components/modals/HelpModal';
import { DataManagementModal, type ImportPayload } from './components/modals/DataManagementModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_COURSES, INITIAL_SESSIONS, INITIAL_TASKS } from './utils/initialData';
import { getCurrentWeekKey } from './utils/timeUtils';
import { Calendar, Plus, ArchiveRestore, HelpCircle, ArrowLeftRight } from 'lucide-react';

export function App() {
  const [courses, setCourses] = useLocalStorage<Course[]>('academic_courses_v1', INITIAL_COURSES);
  const [sessions, setSessions] = useLocalStorage<CourseSession[]>('academic_sessions_v1', INITIAL_SESSIONS);
  const [tasks, setTasks] = useLocalStorage<Task[]>('academic_tasks_v1', INITIAL_TASKS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [modalInitialDay, setModalInitialDay] = useState(1);
  const [modalInitialTime, setModalInitialTime] = useState('08:40');

  const currentWeekKey = getCurrentWeekKey();
  const [missedSessionsMap, setMissedSessionsMap] = useLocalStorage<Record<string, string[]>>(
    'academic_missed_sessions_v1',
    {}
  );

  const currentMissedList = missedSessionsMap[currentWeekKey] || [];
  const missedSet = new Set(currentMissedList);

  const handleToggleSession = (sessionId: string) => {
    const updated = missedSet.has(sessionId)
      ? currentMissedList.filter((id) => id !== sessionId)
      : [...currentMissedList, sessionId];

    setMissedSessionsMap({
      ...missedSessionsMap,
      [currentWeekKey]: updated,
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (missedSet.has(sessionId)) {
      setMissedSessionsMap({
        ...missedSessionsMap,
        [currentWeekKey]: currentMissedList.filter((id) => id !== sessionId),
      });
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    const sessionIdsToDelete = new Set(sessions.filter((s) => s.courseId === courseId).map((s) => s.id));

    setCourses(courses.filter((c) => c.id !== courseId));
    setSessions(sessions.filter((s) => s.courseId !== courseId));

    setMissedSessionsMap({
      ...missedSessionsMap,
      [currentWeekKey]: currentMissedList.filter((id) => !sessionIdsToDelete.has(id)),
    });
  };

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

  const handleImportData = (data: ImportPayload) => {
    if (data.courses && data.sessions) {
      setCourses(data.courses);
      setSessions(data.sessions);

      if (data.type === 'full_backup') {
        if (data.tasks) setTasks(data.tasks);
        if (data.missedSessionsMap) setMissedSessionsMap(data.missedSessionsMap);
      }
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)));
  };

  const handleAddTask = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleSlotClick = (day: number, hour: number) => {
    setModalInitialDay(day);
    setModalInitialTime(`${String(hour).padStart(2, '0')}:40`);
    setIsModalOpen(true);
  };

  const handleSaveSession = (newSession: CourseSession, newCourse?: Course) => {
    if (newCourse) {
      setCourses([...courses, newCourse]);
    }
    setSessions([...sessions, newSession]);
  };

  return (
    <>
      {/* 
        Artık mobil cihazlar için dikey kaydırma (scroll) tasarımına geçtiğimizden, 
        kullanıcıyı yatay çevirmeye zorlayan <RotateNotice /> bileşenini kaldırdık. 
      */}

      {/* ANA KAPSAYICI: Mobilde flex-col (alt alta) ve kaydırılabilir, Tablet/Desktopta flex-row (yan yana) ve sabit */}
      <div className="flex flex-col md:flex-row h-screen w-screen bg-hud-bg text-hud-text p-3 md:p-4 gap-4 overflow-y-auto md:overflow-hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] custom-scrollbar">
        
        {/* SOL PANEL (Mobilde En Üstteki Blok) */}
        <div className="w-full md:w-80 flex flex-col gap-4 flex-shrink-0 md:h-full">
          {/* Logo ve Hafta Etiketi */}
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

          {/* Mobilde alt alta sıralı, Desktop'ta ise kendi içinde kaydırılabilir alan */}
          <div className="flex flex-col gap-4 md:flex-1 md:min-h-0 md:overflow-y-auto md:pr-0.5 custom-scrollbar">
            <AttendanceTracker
              courses={courses}
              sessions={sessions}
              missedSessionIdsMap={missedSessionsMap}
              onDeleteCourse={handleDeleteCourse}
            />

            <TodoList
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>

        {/* SAĞ PANEL (Mobilde En Alttaki Takvim Bloğu) */}
        <div className="w-full md:flex-1 flex flex-col gap-3 min-h-[650px] md:min-h-0 md:h-full pb-8 md:pb-0">
          
          {/* Üst Butonlar Barı */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-hud-primary" />
              <span className="font-mono text-xs uppercase tracking-widest text-hud-text">
                Haftalık Ders Programı
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsDataModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A26] hover:bg-[#202536] text-xs rounded-lg transition-colors border border-hud-border text-hud-text hover:border-hud-borderLight shadow-sm"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-hud-green" />
                <span>Aktar</span>
              </button>

              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A26] hover:bg-[#202536] text-xs rounded-lg transition-colors border border-hud-border text-hud-text hover:border-hud-borderLight shadow-sm"
              >
                <HelpCircle className="w-3.5 h-3.5 text-hud-primary" />
                <span className="hidden xs:inline">Kılavuz</span>
                <span className="xs:hidden">Yardım</span>
              </button>

              <button
                onClick={handleArchiveWeek}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A26] hover:bg-[#202536] text-xs rounded-lg transition-colors border border-hud-border text-hud-text hover:border-hud-borderLight shadow-sm"
              >
                <ArchiveRestore className="w-3.5 h-3.5 text-hud-yellow" />
                <span>Arşivle</span>
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

          {/* Takvim Izgarası */}
          <div className="flex-1 min-h-0 w-full overflow-x-auto custom-scrollbar">
            {/* Mobilde takvim sıkışmasın diye min-w-[700px] eklendi; parmakla sağa-sola kaydırılabilir */}
            <div className="min-w-[700px] md:min-w-0 h-full">
              <CalendarGrid
                courses={courses}
                sessions={sessions}
                missedSessionIds={missedSet}
                onToggleSession={handleToggleSession}
                onDeleteSession={handleDeleteSession}
                onSlotClick={handleSlotClick}
              />
            </div>
          </div>
        </div>

        <AddCourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courses={courses}
          initialDay={modalInitialDay}
          initialStartTime={modalInitialTime}
          onSave={handleSaveSession}
        />

        <HelpModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />

        <DataManagementModal
          isOpen={isDataModalOpen}
          onClose={() => setIsDataModalOpen(false)}
          courses={courses}
          sessions={sessions}
          tasks={tasks}
          missedSessionsMap={missedSessionsMap}
          onImportData={handleImportData}
        />
      </div>
    </>
  );
}

export default App;