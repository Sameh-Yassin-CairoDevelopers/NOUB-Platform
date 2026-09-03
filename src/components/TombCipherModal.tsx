import React, { useState } from 'react';
import { Tomb } from '../types';
import { TOMBS_CATALOG } from '../data/tombsData';
import { X, Unlock, Lock, Sparkles, HelpCircle, Coins, Star, Trophy, ArrowLeft } from 'lucide-react';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TombCipherModalProps {
  tomb: (typeof TOMBS_CATALOG)[0];
  isUnlocked: boolean;
  onClose: () => void;
  onUnlockTomb: (kvNumber: number, rewardGold: number, rewardStars: number) => void;
}

export const TombCipherModal: React.FC<TombCipherModalProps> = ({
  tomb,
  isUnlocked: initialUnlocked,
  onClose,
  onUnlockTomb
}) => {
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [errorAnimation, setErrorAnimation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPriestHint, setShowPriestHint] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  const isAlreadyUnlocked = initialUnlocked || justUnlocked;

  const handleDigitClick = (digit: number) => {
    if (enteredCode.length >= tomb.code_length || isAlreadyUnlocked) return;
    playSound('click');
    setEnteredCode(prev => prev + digit.toString());
    setErrorMessage(null);
  };

  const handleDelete = () => {
    playSound('click');
    setEnteredCode(prev => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    playSound('click');
    setEnteredCode('');
    setErrorMessage(null);
  };

  const handleTryUnlock = () => {
    const codeNum = parseInt(enteredCode, 10);
    if (codeNum === tomb.secret_code) {
      playSound('levelUp');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback if canvas-confetti fails
      }
      setJustUnlocked(true);
      onUnlockTomb(tomb.kv_number, tomb.rewardGold, tomb.rewardStars);
    } else {
      playSound('error');
      setErrorAnimation(true);
      setErrorMessage('❌ الشفرة غير صحيحة! تعويذة الخرطوش تمنع الدخول.');
      setTimeout(() => setErrorAnimation(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/40 shadow-2xl shadow-amber-950/60 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/20 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-black text-sm">
              KV #{tomb.kv_number}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-100 flex items-center gap-2">
                {tomb.name_ar}
              </h2>
              <p className="text-xs text-slate-400">{tomb.dynasty}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 scrollbar-none text-slate-200">
          
          {/* Historical Fact Banner */}
          <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 text-xs sm:text-sm text-amber-200/90 leading-relaxed flex items-start gap-2.5">
            <span className="text-xl">📜</span>
            <div>
              <span className="font-bold text-amber-400 block mb-0.5">التوثيق التاريخي للمقبرة:</span>
              <span>{tomb.historicalFact}</span>
            </div>
          </div>

          {/* Success State */}
          {isAlreadyUnlocked ? (
            <div className="bg-gradient-to-tr from-amber-500/20 via-yellow-500/15 to-amber-600/20 border-2 border-amber-400 rounded-2xl p-5 text-center space-y-4 shadow-xl shadow-amber-950/40">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/30 border border-amber-400/50 flex items-center justify-center text-3xl shadow-lg">
                👑
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-100 mb-1">
                  تم فك الشفرة واستكشاف المقبرة بنجاح!
                </h3>
                <p className="text-xs text-amber-300 font-mono">
                  الرمز الملكي السري: {tomb.secret_code}
                </p>
              </div>

              {/* Treasure Card */}
              <div className="bg-slate-950/80 rounded-xl p-3.5 border border-amber-500/30 text-right space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                  <Trophy className="w-4 h-4" />
                  <span>الكنز الأثري المكتشف:</span>
                </div>
                <div className="text-sm sm:text-base font-black text-amber-100 pr-2">
                  ✨ {tomb.treasureName}
                </div>
                <div className="flex items-center gap-4 text-xs pt-1 border-t border-slate-800">
                  <span className="flex items-center gap-1 font-mono font-bold text-amber-300">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    +{tomb.rewardGold.toLocaleString()} ذهب
                  </span>
                  <span className="flex items-center gap-1 font-mono font-bold text-yellow-300">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    +{tomb.rewardStars} نجمة
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/30 transition-all"
              >
                العودة لوادي الملوك
              </button>
            </div>
          ) : (
            /* Unlocked Cipher Interaction */
            <div className="space-y-4">
              {/* Hint Box */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    لغز الشفرة الملكية:
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    مطلوب {tomb.code_length} أرقام
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                  {tomb.hint}
                </p>

                {/* High Priest Assistance Clue */}
                {showPriestHint ? (
                  <div className="text-xs bg-purple-950/40 border border-purple-500/30 rounded-lg p-2.5 text-purple-200 animate-in fade-in">
                    <span className="font-bold text-purple-300 block mb-0.5">🔮 همسة الكاهن الأكبر:</span>
                    <span>الرقم السري الكامل هو <strong className="font-mono text-amber-300 underline">{tomb.secret_code}</strong>. اكتبه وافتح الخرطوش فوراً!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      playSound('click');
                      setShowPriestHint(true);
                    }}
                    className="text-[11px] text-amber-400/80 hover:text-amber-300 underline flex items-center gap-1 mt-1 transition-colors"
                  >
                    <span>طلب استشارة الكاهن الأكبر للمساعدة</span>
                  </button>
                )}
              </div>

              {/* Code Display Inputs */}
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <div className={`flex items-center justify-center gap-3 transition-transform ${errorAnimation ? 'animate-shake' : ''}`}>
                  {Array.from({ length: tomb.code_length }).map((_, idx) => {
                    const char = enteredCode[idx] || '';
                    return (
                      <div
                        key={idx}
                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center font-mono text-2xl font-black border-2 transition-all ${
                          char
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20'
                            : 'bg-slate-950 border-slate-700 text-slate-500'
                        }`}
                      >
                        {char || '•'}
                      </div>
                    );
                  })}
                </div>
                {errorMessage && (
                  <p className="text-xs text-rose-400 font-bold animate-pulse mt-1">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Interactive Keypad */}
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => handleDigitClick(num)}
                    className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-100 font-mono text-lg font-bold border border-slate-700 hover:border-amber-500/40 active:scale-95 transition-all"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handleClear}
                  className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 text-xs font-bold border border-slate-800 active:scale-95 transition-all"
                >
                  مسح
                </button>
                <button
                  onClick={() => handleDigitClick(0)}
                  className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-100 font-mono text-lg font-bold border border-slate-700 hover:border-amber-500/40 active:scale-95 transition-all"
                >
                  0
                </button>
                <button
                  onClick={handleDelete}
                  className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold border border-slate-800 active:scale-95 transition-all flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Action Unlock Button */}
              <button
                disabled={enteredCode.length !== tomb.code_length}
                onClick={handleTryUnlock}
                className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                  enteredCode.length === tomb.code_length
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-amber-500/30 cursor-pointer scale-100'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                <Unlock className="w-4 h-4" />
                <span>كسر الختم الملكي واقتحام المقبرة</span>
              </button>

              {/* Potential Rewards Preview */}
              <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-800/80 text-slate-400">
                <span>مكافأة الاستكشاف:</span>
                <div className="flex items-center gap-3 font-mono font-bold">
                  <span className="text-amber-300 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    +{tomb.rewardGold.toLocaleString()} ذهب
                  </span>
                  <span className="text-yellow-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    +{tomb.rewardStars}⭐
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
