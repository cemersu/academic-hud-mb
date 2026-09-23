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

// 08:00 - 18:00 aralığındaki 10'ar dakikalık adımlarla saat listesi
const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += 10) {
      if (h === endHour && m > 0) break;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
};

const START_TIME_OPTIONS = generateTimeSlots(8, 17); // Başlangıç en geç 17:50 olabilir
const END_TIME_OPTIONS = generateTimeSlots(8, 18);   // Bitiş en geç 18:00 olabilir

// Başlangıçtan 1 saat sonrasını hesapla (maksimum 18:00 ile sınırla)
const addOneHour = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  const targetH = Math.min(h + 1, 18);
  if (targetH === 18 && m > 0) {
    return '18:00';
  }
  return `${String(targetH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
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

  // Başlangıç saati 08:00 - 17:50 aralığında değilse 08:40'a çek
  const validStartTime = START_TIME_OPTIONS.includes(initialStartTime) ? initialStartTime : '08:40';
  const [startTime, setStartTime] = useState(validStartTime);
  const [endTime, setEndTime] = useState(() => addOneHour(validStartTime));
  const [room, setRoom] = useState('Lecture');

  // Başlangıç saati değiştiğinde bitiş saatini otomatik 1 saat sonrasına atar
  const handleStartTimeChange = (newStart: string) => {
    setStartTime(newStart);
    setEndTime(addOneHour(newStart));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      dayOfWeek: dayOfWeek,
      startTime,
      endTime,
      room: room.trim() || 'Lecture',
    };

    onSave(newSession, createdCourse);
    onClose();
  };

  // Bitiş saatleri seçeneği: Başlangıç saatinden sonraki saatleri filtreler
  const availableEndTimes = END_TIME_OPTIONS.filter((t) => t > startTime);

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

      {/* Saat Aralıkları (08:00 - 18:00 Arası) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-hud-muted font-mono">BAŞLANGIÇ</label>
          <select
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
          >
            {START_TIME_OPTIONS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-hud-muted font-mono">BİTİŞ</label>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
          >
            {availableEndTimes.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
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