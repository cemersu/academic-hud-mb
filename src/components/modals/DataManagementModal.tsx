import React, { useRef } from 'react';
import { X, Download, Upload, Calendar, Database } from 'lucide-react';
import type { Course, CourseSession, Task } from '../../types';

export interface ImportPayload {
  type?: string;
  version?: string;
  courses: Course[];
  sessions: CourseSession[];
  tasks?: Task[];
  missedSessionsMap?: Record<string, string[]>;
}

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  sessions: CourseSession[];
  tasks: Task[];
  missedSessionsMap: Record<string, string[]>;
  onImportData: (data: ImportPayload) => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  courses,
  sessions,
  tasks,
  missedSessionsMap,
  onImportData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const getTimestamp = () => new Date().toISOString().slice(0, 10);

  const downloadJSON = (data: object, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportSchedule = () => {
    const payload: ImportPayload = {
      type: 'schedule_only',
      version: '1.0',
      courses,
      sessions,
    };
    downloadJSON(payload, `academic_hud_program_${getTimestamp()}.json`);
  };

  const handleExportFull = () => {
    const payload: ImportPayload = {
      type: 'full_backup',
      version: '1.0',
      courses,
      sessions,
      tasks,
      missedSessionsMap,
    };
    downloadJSON(payload, `academic_hud_tam_yedek_${getTimestamp()}.json`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content) as ImportPayload;

        if (!parsed.courses || !parsed.sessions || !Array.isArray(parsed.courses) || !Array.isArray(parsed.sessions)) {
          alert('Hata: Seçilen dosya geçerli bir Academic HUD verisi içermiyor.');
          return;
        }

        const isFull = parsed.type === 'full_backup';
        const confirmMsg = isFull
          ? 'Bu tam yedek yüklendiğinde mevcut dersleriniz, devamsızlıklarınız ve görevleriniz dosyadakilerle değiştirilecek. Onaylıyor musunuz?'
          : 'Bu ders programı yüklendiğinde mevcut ders programınız yenilenecek (ödev ve devamsızlıklarınıza dokunulmaz). Onaylıyor musunuz?';

        if (window.confirm(confirmMsg)) {
          onImportData(parsed);
          onClose();
        }
      } catch {
        alert('Hata: JSON dosyası okunurken bir hata oluştu.');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#12141C] border border-hud-borderLight w-full max-w-md rounded-xl shadow-2xl flex flex-col text-xs overflow-hidden">
        
        <div className="flex items-center justify-between p-4 border-b border-hud-border bg-[#12141C]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-hud-primary" />
            <span className="font-mono text-sm tracking-wider font-semibold text-hud-text">
              VERİ AKTARIMI (IMPORT / EXPORT)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-hud-muted hover:text-hud-text transition-colors p-1 rounded-md hover:bg-hud-border/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] font-semibold text-hud-text flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-hud-primary" />
              1. İÇE AKTAR (IMPORT)
            </span>
            <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-2">
              <p className="text-hud-muted leading-relaxed text-[11px]">
                Daha önce aldığın bir yedeği veya arkadaşının gönderdiği ders programını yükle:
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
                id="hud-import-input"
              />
              
              <label
                htmlFor="hud-import-input"
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-[#1C2237] hover:bg-[#252D4A] border border-hud-primary/40 text-hud-text font-medium cursor-pointer transition-colors text-center"
              >
                <Upload className="w-3.5 h-3.5 text-hud-primary" />
                <span>Yedekleme Dosyası Seç (.json)</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] font-semibold text-hud-text flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-hud-green" />
              2. DIŞA AKTAR (EXPORT)
            </span>
            <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-2.5">
              
              <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-hud-border/50">
                <div className="flex flex-col">
                  <span className="text-hud-text font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-hud-primary" />
                    Sadece Ders Programı
                  </span>
                  <span className="text-hud-muted text-[10px]">
                    Ödevler ve devamsızlıklar hariçtir; arkadaşınla paylaşmak için idealdir.
                  </span>
                </div>
                <button
                  onClick={handleExportSchedule}
                  className="flex-shrink-0 px-3 py-1.5 bg-[#1A2234] hover:bg-blue-600 text-hud-text hover:text-white rounded-lg transition-colors border border-hud-border text-[11px] font-medium"
                >
                  İndir
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 pt-0.5">
                <div className="flex flex-col">
                  <span className="text-hud-text font-medium flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-hud-yellow" />
                    Bütün Veriler (Tam Yedek)
                  </span>
                  <span className="text-hud-muted text-[10px]">
                    Dersler, haftalık devamsızlık arşivleri ve yapılacaklar dahil her şey.
                  </span>
                </div>
                <button
                  onClick={handleExportFull}
                  className="flex-shrink-0 px-3 py-1.5 bg-[#1F2327] hover:bg-amber-600 text-hud-text hover:text-white rounded-lg transition-colors border border-hud-border text-[11px] font-medium"
                >
                  İndir
                </button>
              </div>

            </div>
          </div>
        </div>

        <div className="p-3 border-t border-hud-border bg-[#12141C] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-hud-border hover:bg-hud-borderLight text-hud-text rounded-lg transition-colors font-medium text-xs"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};