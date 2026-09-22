import React from 'react';
import { X, Activity, ArchiveRestore, CheckSquare, Plus, Trash2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12141C] border border-hud-borderLight w-full max-w-lg rounded-xl p-5 shadow-2xl flex flex-col gap-4 text-xs">
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-hud-border pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-hud-primary" />
            <span className="font-mono text-sm tracking-wider font-semibold text-hud-text">
              KULLANIM KILAVUZU
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-hud-muted hover:text-hud-text transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Maddeler Listesi */}
        <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[70vh] pr-1">
          {/* 1. Ders Ekleme */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-primary font-semibold">
              <Plus className="w-3.5 h-3.5" />
              <span>Ders Ekleme</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              İki şekilde ders ekleyebilirsin:
              <br />• Sağ üstteki <strong className="text-hud-text">"Ders Ekle"</strong> butonuna tıklayarak.
              <br />• Takvim ızgarasında dersin olduğu <strong className="text-hud-text">boş saat dilimine doğrudan tıklayarak</strong> (o gün ve saat otomatik seçilir).
              <br />Açılan pencerede var olan bir dersi seçebilir veya <em>"+ Yeni Ders Tanımla"</em> ile yeni ders kodu ve devamsızlık limiti belirleyebilirsin.
            </p>
          </div>

          {/* 2. Devamsızlık Takibi */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-red font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Devamsızlık Nasıl İşlenir?</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              Dersler varsayılan olarak <strong className="text-hud-green">"Girildi" (Koyu Mavi / Yeşil nokta)</strong> kabul edilir.
              <br />• Gitmediğin / kaçırdığın bir dersin <strong className="text-hud-text">üzerine bir kez tıkla</strong>; kutu <strong className="text-hud-red">Kırmızıya</strong> döner.
              <br />• Kırmızı yaptığın an, sol paneldeki ilgili dersin devamsızlık barı kaçırılan saat kadar otomatik olarak dolar.
              <br />• Yanlışlıkla tıkladıysan tekrar tıkla; eski haline döner ve saat geri düşer.
            </p>
          </div>

          {/* 3. Haftayı Arşivle */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-yellow font-semibold">
              <ArchiveRestore className="w-3.5 h-3.5" />
              <span>"Haftayı Arşivle" Ne İşe Yarar?</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              Hafta bittiğinde bu butona bas:
              <br />• O hafta kırmızı (kaçırıldı) işaretlediğin dersler <strong className="text-hud-text">kalıcı hafızaya kilitlenir</strong>; sol paneldeki devamsızlık toplamın korunur.
              <br />• Takvimdeki tüm kırmızı dersler yeni hafta için tekrar varsayılana döner ve takvim sıfırlanır.
            </p>
          </div>

          {/* 4. Ders Silme */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-text font-semibold">
              <Trash2 className="w-3.5 h-3.5 text-hud-muted" />
              <span>Ders Silme</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              • <strong className="text-hud-text">Tek bir saati silmek için:</strong> Takvimdeki ders kutucuğunun üzerine gel/dokun, sağ üstte çıkan <Trash2 className="w-3 h-3 inline text-hud-red" /> çöp kutusuna bas.
              <br />• <strong className="text-hud-text">Dersi komple kaldırmak için:</strong> Sol devamsızlık panelindeki ders isminin yanındaki çöp kutusuna bas; o ders ve programdaki tüm saatleri silinir.
            </p>
          </div>

          {/* 5. Yapılacaklar (Assignment/To-Do) */}
          <div className="p-3 rounded-lg bg-[#161822] border border-hud-border/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-hud-green font-semibold">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Yapılacaklar & Ödev Takibi</span>
            </div>
            <p className="text-hud-muted leading-relaxed">
              • Sol alttaki <strong className="text-hud-text">+</strong> butonuna basıp ödev/görev adı ve son teslim tarihini (Due Date) gir.
              <br />• Son teslim tarihi <strong className="text-hud-yellow">3 günden az kalanlar sarı</strong>, <strong className="text-hud-red">tarihi geçenler kırmızı</strong> görünür.
              <br />• Tamamladığında göreve tıkla; üzeri çizilir ve tamamlandı sayılır.
            </p>
          </div>
        </div>

        {/* Kapat Butonu */}
        <div className="flex justify-end pt-2 border-t border-hud-border">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-hud-border hover:bg-hud-borderLight text-hud-text rounded-lg transition-colors font-medium"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};