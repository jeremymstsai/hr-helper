import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Settings2, Trash } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Person, DrawSettings } from '../types';

interface LuckyDrawProps {
  names: Person[];
}

export const LuckyDraw: React.FC<LuckyDrawProps> = ({ names }) => {
  const [winner, setWinner] = useState<Person | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<Person[]>([]);
  const [settings, setSettings] = useState<DrawSettings>({
    allowRepeats: false,
    confetti: true,
  });
  
  // Ref for the animation loop
  const intervalRef = useRef<number | null>(null);
  const [displayId, setDisplayId] = useState<string>('???');
  const [displayName, setDisplayName] = useState<string>('???');

  // Filter available candidates
  const candidates = settings.allowRepeats 
    ? names 
    : names.filter(n => !history.some(h => h.id === n.id));

  const startDraw = () => {
    if (candidates.length === 0) {
      alert('沒有候選人了！請重置紀錄或允許重複抽取。');
      return;
    }

    setIsAnimating(true);
    setWinner(null);

    let counter = 0;
    // Fast cycle animation
    intervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const randomPerson = candidates[randomIndex];
      setDisplayName(randomPerson.name);
      setDisplayId(randomPerson.id); // Internal ID, not shown but used for key
      counter++;
    }, 50);

    // Stop after random time (2-3 seconds)
    const duration = 2000 + Math.random() * 1000;
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      const finalIndex = Math.floor(Math.random() * candidates.length);
      const selectedPerson = candidates[finalIndex];
      
      setWinner(selectedPerson);
      setDisplayName(selectedPerson.name);
      setHistory(prev => [selectedPerson, ...prev]);
      setIsAnimating(false);
      
      if (settings.confetti) {
        triggerConfetti();
      }
    }, duration);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const resetHistory = () => {
    if (window.confirm('確定要清空抽獎歷史紀錄嗎？')) {
      setHistory([]);
      setWinner(null);
      setDisplayName('???');
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">幸運抽籤</h2>
        <p className="mt-2 text-gray-600">目前名單：{names.length} 人 | 剩餘候選：{candidates.length} 人</p>
      </div>

      {/* Main Draw Area */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
           {/* Winner Display */}
           <div className={`transition-all duration-300 transform ${isAnimating ? 'scale-110' : 'scale-100'}`}>
              <div className="text-xl text-gray-400 font-medium mb-4 uppercase tracking-widest">The Winner Is</div>
              <div className={`text-6xl md:text-8xl font-black tracking-tight ${winner ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600' : 'text-gray-800'}`}>
                {displayName}
              </div>
           </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
             <label className="flex items-center cursor-pointer hover:text-gray-900 transition-colors">
                <input 
                  type="checkbox" 
                  checked={settings.allowRepeats}
                  onChange={(e) => setSettings({...settings, allowRepeats: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 mr-2"
                />
                <Settings2 className="w-4 h-4 mr-1" />
                允許重複中獎
             </label>
          </div>

          <button
            onClick={startDraw}
            disabled={isAnimating || candidates.length === 0}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center"
          >
            {isAnimating ? (
                <span className="flex items-center">
                    <RotateCcw className="animate-spin w-5 h-5 mr-2" /> 抽籤中...
                </span>
            ) : (
                <span className="flex items-center">
                    <Play className="w-5 h-5 mr-2 fill-current" /> 開始抽獎
                </span>
            )}
          </button>
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Award className="w-5 h-5 mr-2 text-amber-500" />
              中獎名單 ({history.length})
            </h3>
            <button
                onClick={resetHistory}
                className="text-sm text-gray-400 hover:text-red-500 flex items-center transition-colors"
            >
                <Trash className="w-4 h-4 mr-1" /> 清除紀錄
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {history.map((person, idx) => (
              <div key={`${person.id}-${idx}`} className="flex items-center bg-amber-50 text-amber-900 px-4 py-2 rounded-full border border-amber-100 animate-in zoom-in duration-300">
                 <span className="font-bold text-amber-500/50 mr-2">#{history.length - idx}</span>
                 <span className="font-medium">{person.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
