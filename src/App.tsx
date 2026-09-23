import { useState } from 'react';
import type { Course } from './types';
import type { CourseSession } from './types';
import type { Task } from './types';
import { CalendarGrid } from './components/calendar/CalendarGrid';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { TodoList } from './components/todo/TodoList';
import { AddCourseModal } from './components/modals/AddCourseModal';
import { HelpModal } from './components/modals/HelpModal';
import { DataManagementModal, type ImportPayload } from './components/modals/DataManagementModal';
import { RotateNotice } from './components/common/RotateNotice';
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
      <RotateNotice />

      <div className="flex h-screen w-screen bg-hud-bg text-hud-text p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
        
        <div className="w-56 sm:w-80 flex flex-col gap-2 sm:gap-4 flex-shrink-0 h-full">
          <div className="bg-hud-card border border-hud-border rounded-xl p-2.5 sm:p-3.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-hud-primary animate-pulse" />
              <span className="font-mono text-xs sm:text-sm tracking-wider font-semibold text-hud-text">
                ACADEMIC HUD
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-hud-border text-hud-muted">
              {currentWeekKey}
            </span>
          </div>

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

        <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-w-0 h-full">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-hud-primary" />
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-hud-text truncate">
                Haftalık Ders Programı
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setIsDataModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#171A26] hover:bg-[#202536] text-[11px] sm:text-xs rounded-lg transition-colors border border-hud-border text-hud-text hover:border-hud-borderLight shadow-sm"
                title="Ders programını veya verilerini içe/dışa aktar"
              >
                <ArrowLeftRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-hud-green" />
                <span className="hidden xs:inline">Aktar</span>
                <span className="xs:hidden">Yedek</span>
              </button>

              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#171A26] hover:bg-[#202536] text-[11px] sm:text-xs rounded-lg transition-colors border border-hud-border text-hud-text hover:border-hud-borderLight shadow-sm"
                title="Kullanım Kılavuzu"
              >
                <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-hud-primary" />
                <span className="hidden xs:inline">Nasıl Kullanılır</span>
                <span className="xs:hidden">Yardım</span>
              </button>

              <button
                onClick={handleArchiveWeek}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#171A26] hover:bg-[#202536] text-[11px] sm:text-xs rounded-lg transition-colors border border-hud-border text-hud-text hover:border-hud-borderLight shadow-sm"
                title="Mevcut haftanın durumunu kaydeder ve takvimi yeni haftaya sıfırlar"
              >
                <ArchiveRestore className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-hud-yellow" />
                <span className="hidden xs:inline">Haftayı Arşivle</span>
                <span className="xs:hidden">Arşivle</span>
              </button>

              <button
                onClick={() => {
                  setModalInitialDay(1);
                  setModalInitialTime('08:40');
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-hud-primary hover:bg-blue-600 text-[11px] sm:text-xs rounded-lg transition-colors text-white font-medium shadow-md shadow-blue-500/20"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
              onDeleteSession={handleDeleteSession}
              onSlotClick={handleSlotClick}
            />
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