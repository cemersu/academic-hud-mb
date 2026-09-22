import React, { useState } from 'react';
import type { Course } from '../../types';
import type { CourseSession } from '../../types';
import { X } from 'lucide-react';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  initialDay?: number;
  initialStartTime?: string;
  onSave: (session: CourseSession, newCourse?: Course) => void;
}

// Form mantığını izole ettiğimiz iç bileşen
const CourseForm: React.FC<{
  courses: Course[];
  initialDay: number;
  initialStartTime: string;
  onClose: () => void;
  onSave: (session: CourseSession, newCourse?: Course) => void;
}> = ({ courses, initialDay, initialStartTime, onClose, onSave }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses.length > 0 ? courses[0].id : 'NEW'
  );
  const [newCourseName, setNewCourseName] = useState('');
  const [maxAbsence, setMaxAbsence] = useState('8');
  
  const validDay = (initialDay >= 1 && initialDay <= 5 ? initialDay : 1) as 1 | 2 | 3 | 4 | 5;
  const [dayOfWeek, setDayOfWeek] = useState<1 | 2 | 3 | 4 | 5>(validDay);
  const [startTime, setStartTime] = useState(initialStartTime);
  
  // Bitiş saatini başlangıçtan 50 dk sonrasına kur
  const getInitialEndTime = (start: string) => {
    const [h, m] = start.split(':').map(Number);
    const endH = String(h + 1).padStart(2, '0');
    return `${endH}:${String(m).padStart(2, '0')}`;
  };

  const [endTime, setEndTime] = useState(() => getInitialEndTime(initialStartTime));
  const [room, setRoom] = useState('Lecture');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetCourseId = selectedCourseId;
    let createdCourse: Course | undefined;

    if (selectedCourseId === 'NEW') {
      if (!newCourseName.trim()) return;
      targetCourseId = `c_${Date.now()}`;
      createdCourse = {
        id: targetCourseId,
        name: newCourseName.trim().toUpperCase(),
        maxAbsenceHours: Number(maxAbsence) || 8,
      };
    }

    const newSession: CourseSession = {
      id: `s_${Date.now()}`,
      courseId: targetCourseId,
      dayOfWeek: dayOfWeek,
      startTime,
      endTime,
      room: room.trim() || 'Lecture',
    };

    onSave(newSession, createdCourse);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
      {/* Ders Seçimi veya Yeni Tanımlama */}
      <div className="flex flex-col gap-1.5">
        <label className="text-hud-muted font-mono">DERS SEÇİMİ</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} (Devamsızlık Limiti: {c.maxAbsenceHours}h)
            </option>
          ))}
          <option value="NEW">+ Yeni Ders Tanımla...</option>
        </select>
      </div>

      {/* Yeni Ders Detayları */}
      {selectedCourseId === 'NEW' && (
        <div className="grid grid-cols-2 gap-2 bg-[#161822] p-3 rounded-lg border border-hud-border/70">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-hud-muted">DERS KODU</label>
            <input
              type="text"
              placeholder="örn: MATH-123"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="bg-[#10121A] border border-hud-border rounded px-2.5 py-1.5 text-hud-text focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-hud-muted">DEVAMSIZLIK HAKKI (SAAT)</label>
            <input
              type="number"
              value={maxAbsence}
              onChange={(e) => setMaxAbsence(e.target.value)}
              className="bg-[#10121A] border border-hud-border rounded px-2.5 py-1.5 text-hud-text focus:outline-none"
              min="1"
              required
            />
          </div>
        </div>
      )}

      {/* Gün Seçimi */}
      <div className="flex flex-col gap-1.5">
        <label className="text-hud-muted font-mono">GÜN</label>
        <select
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
          className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
        >
          <option value={1}>Pazartesi</option>
          <option value={2}>Salı</option>
          <option value={3}>Çarşamba</option>
          <option value={4}>Perşembe</option>
          <option value={5}>Cuma</option>
        </select>
      </div>

      {/* Saat Aralıkları */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-hud-muted font-mono">BAŞLANGIÇ</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-hud-muted font-mono">BİTİŞ</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Derslik */}
      <div className="flex flex-col gap-1.5">
        <label className="text-hud-muted font-mono">DERSLİK / ODA</label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Lecture / Amfi-1"
          className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-2 pt-2 border-t border-hud-border">
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-lg border border-hud-border text-hud-muted hover:text-hud-text transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 bg-hud-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Kaydet
        </button>
      </div>
    </form>
  );
};

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  courses,
  initialDay = 1,
  initialStartTime = '08:40',
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12141C] border border-hud-borderLight w-full max-w-md rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-hud-border pb-3">
          <span className="font-mono text-sm tracking-wider font-semibold text-hud-text">
            DERS PROGRAMINA EKLE
          </span>
          <button
            onClick={onClose}
            className="text-hud-muted hover:text-hud-text transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <CourseForm
          key={`${initialDay}-${initialStartTime}`}
          courses={courses}
          initialDay={initialDay}
          initialStartTime={initialStartTime}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
};