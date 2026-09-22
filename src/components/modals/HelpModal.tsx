import React from 'react';
import { X, Activity, ArchiveRestore, CheckSquare, Plus, Trash2, Share } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      {/* Modal Kutusu: Maksimum yükseklik %85 ile sınırlandı */}
      <div className="bg-[#12141C] border border-hud-borderLight w-full max-w-lg max-h-[85vh] rounded-xl shadow-2xl flex flex-col text-xs overflow-hidden">
        
        {/* Sabit Başlık */}
        <div className="flex items-center justify-between p-4 border-b border-hud-border bg-[#12141C] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-hud-primary animate-pulse" />
            <span className="font-mono text-sm tracking-wider font-semibold text-hud-text">
              KULLANIM KILAVUZU
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-hud-muted hover:text-hud-text transition-colors p-1 rounded-md hover:bg-hud-border/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Kaydırılabilir İçerik Alanı */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3 min-h-0 overscroll-contain">
          {/* 1. Ders Ekleme */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-primary font-semibold">
              <Plus className="w-3.5 h-3.5" />
              <span>Ders Ekleme</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              • Sağ üstteki <strong className="text-hud-text">"Ders Ekle"</strong> butonuna basabilir veya
              <br />• Takvimde dersin olacağı <strong className="text-hud-text">boş saat dilimine doğrudan tıklayarak</strong> ekleyebilirsin.
            </p>
          </div>

          {/* 2. Devamsızlık Takibi */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-red font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Devamsızlık Nasıl İşlenir?</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              • Kaçırdığın dersin <strong className="text-hud-text">üzerine bir kez tıkla</strong>; kutu kırmızıya döner ve sol paneldeki sayaç otomatik artar.
              <br />• Yanlışlıkla yaptıysan tekrar tıkla; eski haline döner.
            </p>
          </div>

          {/* 3. Haftayı Arşivle */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-yellow font-semibold">
              <ArchiveRestore className="w-3.5 h-3.5" />
              <span>"Haftayı Arşivle" Ne İşe Yarar?</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              • Hafta bittiğinde bu butona basarak kaçırdığın dersleri kalıcı hafızaya kilitlersin.
              <br />• Sol paneldeki devamsızlık toplamı korunur, takvim ise yeni hafta için sıfırlanır.
            </p>
          </div>

          {/* 4. Ders Silme */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-text font-semibold">
              <Trash2 className="w-3.5 h-3.5 text-hud-muted" />
              <span>Ders Silme</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              • <strong className="text-hud-text">Tek oturum:</strong> Ders kutusuna dokun/üzerine gel, sağ üstteki kırmızı çöp kutusuna bas.
              <br />• <strong className="text-hud-text">Tüm ders:</strong> Sol devamsızlık listesinde ders adının yanındaki çöp kutusuna bas.
            </p>
          </div>

          {/* 5. Yapılacaklar */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-green font-semibold">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Yapılacaklar & Ödev Takibi</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              • Sol alttan ödev ve teslim tarihi ekle. Süresi yaklaşanlar sarı, geçenler kırmızı görünür. Tamamladığında üzerine tıkla.
            </p>
          </div>

          {/* 6. iPad Ana Ekrana Ekleme */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-hud-primary font-semibold">
              <Share className="w-3.5 h-3.5" />
              <span>iPad Ana Ekrana Ekleme (Tam Ekran Modu)</span>
            </div>
            <p className="text-hud-muted leading-relaxed text-[11px]">
              Tarayıcı çubukları olmadan tam ekran çalıştırmak için:
            </p>
            <div className="flex flex-col gap-1.5 text-hud-muted font-mono text-[11px]">
              <div><span className="text-hud-primary font-bold mr-1.5">1.</span>Safari'nin sağ üstündeki <strong className="text-hud-text font-sans">Paylaş</strong> butonuna tıkla.</div>
              <div><span className="text-hud-primary font-bold mr-1.5">2.</span>Menüde aşağı inip <strong className="text-hud-text font-sans">Daha Fazla (View More)</strong> seçeneğine tıkla.</div>
              <div><span className="text-hud-primary font-bold mr-1.5">3.</span>Listeden <strong className="text-hud-text font-sans">Ana Ekrana Ekle (Add to Home Screen)</strong> seçeneğini seç.</div>
              <div><span className="text-hud-primary font-bold mr-1.5">4.</span><strong className="text-hud-text font-sans">Open as WebApp</strong> açık kalsın ve <strong className="text-hud-text font-sans">Ekle</strong>'ye bas.</div>
            </div>
          </div>
        </div>

        {/* Sabit Alt Bar: Her zaman ekranın içinde görünür */}
        <div className="p-3 border-t border-hud-border bg-[#12141C] flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-hud-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-xs shadow-md shadow-blue-500/20"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};