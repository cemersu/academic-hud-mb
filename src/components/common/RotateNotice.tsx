import React from 'react';
import { Smartphone } from 'lucide-react';

export const RotateNotice: React.FC = () => {
  return (
    // Sadece mobilde ve ekran dikeyken (portrait) tetiklenir
    <div className="fixed inset-0 z-50 bg-[#0B0D14] flex flex-col items-center justify-center p-6 text-center md:hidden landscape:hidden">
      <div className="w-16 h-16 rounded-2xl bg-[#161822] border border-hud-border flex items-center justify-center mb-4 shadow-xl">
        <Smartphone className="w-8 h-8 text-hud-primary animate-pulse rotate-90 transition-transform duration-700" />
      </div>
      
      <span className="font-mono text-sm tracking-wider font-semibold text-hud-text mb-2">
        CİHAZI YATAY ÇEVİRİN
      </span>
      
      <p className="text-xs text-hud-muted max-w-xs leading-relaxed">
        Academic HUD, haftalık ders tablosunu ve devamsızlık panelini tam sığdırmak için yatay ekran mimarisine göre tasarlanmıştır.
      </p>

      <div className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161822] border border-hud-border/60">
        <span className="w-1.5 h-1.5 rounded-full bg-hud-yellow animate-ping" />
        <span className="text-[10px] font-mono text-hud-muted">Ekran Yön Kilidini Açmayı Unutmayın</span>
      </div>
    </div>
  );
};