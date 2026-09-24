import React from 'react';
import { X, Activity, ArchiveRestore, CheckSquare, Plus, Edit2, Share } from 'lucide-react';

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
              <span>Ders Ekleme ve Otomatik Hesaplama</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              • Sağ üstteki <strong className="text-hud-text">"Ders Ekle"</strong> butonuna basabilir veya takvimdeki <strong className="text-hud-text">boş bir saate doğrudan tıklayarak</strong> ders ekleyebilirsin.
              <br />• Ders eklerken <strong>Zorunluluk (%)</strong> değerini girdiğinde (örn: %70), sistem takvime eklediğin ders saatlerine bakarak toplam devamsızlık hakkını otomatik hesaplar. Devam zorunluluğu yoksa <strong>0</strong> girmelisin.
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
              <br />• Sol paneldeki devamsızlık toplamı korunur, takvim ise yeni hafta için tamamen sıfırlanır.
            </p>
          </div>

          {/* 4. Ders Düzenleme ve Silme */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-text font-semibold">
              <Edit2 className="w-3.5 h-3.5 text-hud-muted" />
              <span>Ders Düzenleme ve Silme</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              • <strong className="text-hud-text">Tek oturum silme:</strong> Takvimdeki ders kutusunun sağ üstündeki kırmızı çöp kutusuna bas.
              <br />• <strong className="text-hud-text">Dersi düzenleme / tamamen silme:</strong> Sol devamsızlık listesinde dersin adına dokun/üzerine gel. Çıkan <strong>Kalem</strong> ikonuna basarak ders ismini veya yüzdesini değiştirebilir, <strong>Çöp Kutusu</strong> ile dersi tüm takvimden silebilirsin.
            </p>
          </div>

          {/* 5. Yapılacaklar */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-green font-semibold">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Yapılacaklar & Ödev Takibi</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              • Sol alttan görev ve teslim tarihi ekle. Süresi yaklaşanlar sarı, geçenler kırmızı görünür. Tamamladığında üzerine tıkla.
            </p>
          </div>

          {/* 6. Ana Ekrana Ekleme (Evrensel) */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-hud-primary font-semibold">
              <Share className="w-3.5 h-3.5" />
              <span>Mobil & Tablet Ana Ekrana Ekleme</span>
            </div>
            <p className="text-hud-muted leading-relaxed text-[11px]">
              Tarayıcı çubukları olmadan, tıpkı yerel bir mobil uygulama gibi kullanmak için:
            </p>
            <div className="flex flex-col gap-2.5 text-hud-muted font-mono text-[11px] mt-1">
              <div>
                <span className="text-hud-text font-sans font-bold block mb-0.5">🍎 iOS (Safari) için:</span>
                Alt menüdeki <strong className="text-hud-text font-sans">Paylaş</strong> (kare içinden çıkan ok) butonuna bas, aşağı inip <strong className="text-hud-text font-sans">"Ana Ekrana Ekle"</strong> seçeneğini seç.
              </div>
              <div>
                <span className="text-hud-text font-sans font-bold block mb-0.5">🤖 Android (Chrome) için:</span>
                Sağ üstteki <strong className="text-hud-text font-sans">Üç Nokta (⋮)</strong> menüsüne bas, listeden <strong className="text-hud-text font-sans">"Ana Ekrana Ekle"</strong> veya <strong className="text-hud-text font-sans">"Uygulamayı Yükle"</strong> seçeneğini seç.
              </div>
            </div>
          </div>

        </div>

        {/* Sabit Alt Bar */}
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