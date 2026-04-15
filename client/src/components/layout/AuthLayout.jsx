import { Outlet } from 'react-router-dom';
import { Footprints } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="lg:flex lg:items-center lg:gap-12">
          {/* Left: Football Player Illustration */}
          <div className="hidden lg:flex lg:w-1/2 lg:flex-col items-center justify-center min-h-[500px] p-8">
            <div className="relative w-96 h-96">
              <svg viewBox="0 0 300 300" className="w-full h-full text-emerald-400/30">
                <defs>
                  <pattern id="grass" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="#10b98120"/>
                    <path d="M 0 10 Q 5 5 10 10 T 20 10" stroke="#05966940" strokeWidth="2" fill="none"/>
                  </pattern>
                </defs>
                <rect width="300" height="300" fill="url(#grass)" opacity="0.3"/>
                {/* Goal */}
                <rect x="200" y="80" width="20" rx="10" height="140" fill="#f8fafc40" stroke="#f1f5f9" strokeWidth="8"/>
                <circle cx="210" cy="160" r="12" fill="#e2e8f0"/>
                {/* Player */}
                <circle cx="120" cy="90" r="18" fill="#4ade80" stroke="#22c55e" strokeWidth="3"/>
                <rect x="105" y="108" width="30" height="60" rx="15" fill="#10b981" stroke="#059669" strokeWidth="2"/>
                {/* Arm */}
                <path d="M 135 120 Q 150 130 160 110" stroke="#059669" strokeWidth="8" strokeLinecap="round" fill="none"/>
                {/* Leg kicking */}
                <path d="M 120 168 Q 140 188 160 168 L 170 158" stroke="#059669" strokeWidth="10" strokeLinecap="round" fill="none"/>
                {/* Ball */}
                <circle cx="165" cy="162" r="12" fill="#f59e0b" stroke="#d97706" strokeWidth="2">
                  <animateTransform attributeName="transform" type="rotate" from="0 165 162" to="360 165 162" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="160" cy="157" r="2" fill="white"/>
                <circle cx="170" cy="167" r="2" fill="white"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mt-8 text-center">Football Manager</h2>
            <p className="text-slate-400 mt-4 text-lg text-center max-w-md">Plateforme de gestion complète pour le football</p>
          </div>

          {/* Right: Form Card */}
          <div className="lg:w-1/2 lg:flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30 lg:max-w-md mx-auto lg:mx-0">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}