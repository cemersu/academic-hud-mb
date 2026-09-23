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

// Başlangıç saatinden 1 saat sonrasını hesaplar (18:00'i aşamaz)
const addOneHour = (timeStr: string): string => {
  const [h, m] = timeStr.split(':').map(Number);
  const targetH = h + 1;
  const minuteStr = String(m).padStart(2, '0');

  if (targetH > 18 || (targetH === 18 && m > 0)) {
    return '18:00';
  }
  return `${String(targetH).padStart(2, '0')}:${minuteStr}`;
};

// Saatin 08:00 - 18:00 aralığında olup olmadığını doğrular
const clampTime = (timeStr: string, fallback: string): string => {
  if (!timeStr) return fallback;
  if (timeStr < '08:00') return '08:00';
  if (timeStr > '18:00') return '18:00';
  return timeStr;
};

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

  const initialStart = clampTime(initialStartTime, '08:40');
  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(() => addOneHour(initialStart));
  const [room, setRoom] = useState('Lecture');

  // Başlangıç değiştiğinde bitişi otomatik 1 saat sonrasına ayarlar
  const handleStartTimeChange = (newStart: string) => {
    setStartTime(newStart);
    if (newStart) {
      setEndTime(addOneHour(newStart));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 08:00 - 18:00 aralık ve mantık kontrolleri
    if (startTime < '08:00' || startTime > '18:00') {
      alert('Başlangıç saati 08:00 ile 18:00 arasında olmalıdır.');
      return;
    }

    if (endTime < '08:00' || endTime > '18:00') {
      alert('Bitiş saati 08:00 ile 18:00 arasında olmalıdır.');
      return;
    }

    if (endTime <= startTime) {
      alert('Bitiş saati başlangıç saatinden sonra olmalıdır.');
      return;
    }

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
      dayOfWeek,
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

      {/* Saat Girişleri (08:00 - 18:00 aralığında serbest dakika) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-hud-muted font-mono">BAŞLANGIÇ</label>
          <input
            type="time"
            min="08:00"
            max="18:00"
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-hud-muted font-mono">BİTİŞ</label>
          <input
            type="time"
            min={startTime || '08:00'}
            max="18:00"
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