import { useState } from 'react';
import type { Course } from './types';
import { CalendarGrid } from './components/calendar/CalendarGrid';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { TodoList } from './components/todo/TodoList';
import { AddCourseModal } from './components/modals/AddCourseModal';
import { HelpModal } from './components/modals/HelpModal';
import { DataManagementModal } from './components/modals/DataManagementModal';
import { EditCourseModal } from './components/modals/EditCourseModal';
import { useAcademicData } from './hooks/useAcademicData';
import { Calendar, Plus, ArchiveRestore, HelpCircle, ArrowLeftRight } from 'lucide-react';

export function App() {
  // Tüm veri ve iş mantığını tek bir kancadan (hook) çekiyoruz
  const data = useAcademicData();

  // Yalnızca Arayüz (UI) Durumları burada kalıyor
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [modalInitialDay, setModalInitialDay] = useState(1);
  const [modalInitialTime, setModalInitialTime] = useState('08:40');

  const handleSlotClick = (day: number, hour: number) => {
    setModalInitialDay(day);
    setModalInitialTime(`${String(hour).padStart(2, '0')}:40`);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row h-[100dvh] w-screen bg-hud-bg text-hud-text p-3 lg:p-4 gap-4 overflow-y-auto lg:overflow-hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] custom-scrollbar">
        
        {/* SOL PANEL */}
        <div className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0 lg:h-full">
          <div className="bg-hud-card border border-hud-border rounded-xl p-3.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-hud-primary animate-pulse" />
              <span className="font-mono text-sm tracking-wider font-semibold text-hud-text">
                ACADEMIC HUD
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-hud-border text-hud-muted">
              {data.currentWeekKey}
            </span>
          </div>

          <div className="flex flex-col gap-4 lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-0.5 custom-scrollbar">
            <AttendanceTracker
              courses={data.courses}
              sessions={data.sessions}
              missedSessionIdsMap={data.missedSessionsMap}
              onDeleteCourse={data.handleDeleteCourse}
              onEditCourse={setEditingCourse} // Düzenleme butonunu bağladık
            />

            <TodoList
              tasks={data.tasks}
              onToggleTask={data.handleToggleTask}
              onAddTask={data.handleAddTask}
              onDeleteTask={data.handleDeleteTask}
            />
          </div>
        </div>

        {/* SAĞ PANEL (Takvim) */}
        <div className="w-full lg:flex-1 flex flex-col gap-3 min-h-[650px] lg:min-h-0 lg:h-full pb-8 lg:pb-0">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-hud-primary" />
              <span className="font-mono text-xs uppercase tracking-widest text-hud-text">
                Haftalık Ders Programı
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setIsDataModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A26] hover:bg-[#202536] text-xs rounded-lg transition-colors border border-hud-border text-hud-text hover:border-hud-borderLight shadow-sm">
                <ArrowLeftRight className="w-3.5 h-3.5 text-hud-green" />
                <span>Aktar</span>
              </button>
              <button onClick={() => setIsHelpOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A26] hover:bg-[#202536] text-xs rounded-lg transition-colors border border-hud-border text-hud-text hover:border-hud-borderLight shadow-sm">
                <HelpCircle className="w-3.5 h-3.5 text-hud-primary" />
                <span className="hidden xs:inline">Kılavuz</span>
                <span className="xs:hidden">Nasıl Kullanılır</span>
              </button>
              <button onClick={data.handleArchiveWeek} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A26] hover:bg-[#202536] text-xs rounded-lg transition-colors border border-hud-border text-hud-text hover:border-hud-borderLight shadow-sm">
                <ArchiveRestore className="w-3.5 h-3.5 text-hud-yellow" />
                <span>Arşivle</span>
              </button>
              <button onClick={() => { setModalInitialDay(1); setModalInitialTime('08:40'); setIsModalOpen(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-hud-primary hover:bg-blue-600 text-xs rounded-lg transition-colors text-white font-medium shadow-md shadow-blue-500/20">
                <Plus className="w-3.5 h-3.5" />
                <span>Ders Ekle</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[700px] lg:min-w-0 h-full">
              <CalendarGrid
                courses={data.courses}
                sessions={data.sessions}
                missedSessionIds={data.missedSet}
                onToggleSession={data.handleToggleSession}
                onDeleteSession={data.handleDeleteSession}
                onSlotClick={handleSlotClick}
              />
            </div>
          </div>
        </div>

        {/* MODALLAR */}
        <AddCourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courses={data.courses}
          initialDay={modalInitialDay}
          initialStartTime={modalInitialTime}
          onSave={data.handleSaveSession}
        />
        
        <EditCourseModal
          course={editingCourse}
          isOpen={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={(updatedCourse) => {
            data.handleEditCourse(updatedCourse);
            setEditingCourse(null);
          }}
        />

        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        
        <DataManagementModal
          isOpen={isDataModalOpen}
          onClose={() => setIsDataModalOpen(false)}
          courses={data.courses}
          sessions={data.sessions}
          tasks={data.tasks}
          missedSessionsMap={data.missedSessionsMap}
          onImportData={data.handleImportData}
        />
      </div>
    </>
  );
}

export default App;