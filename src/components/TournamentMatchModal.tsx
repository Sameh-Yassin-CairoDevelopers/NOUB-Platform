import React, { useState, useEffect } from 'react';
import { Creature, Tournament } from '../types';
import { calculateOverallGeneticScore } from '../utils/genetics';
import { X, Trophy, Swords, Sparkles, Award, Shield, Flame, Activity } from 'lucide-react';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TournamentMatchModalProps {
  tournament: Tournament;
  creature: Creature;
  onClose: () => void;
  onMatchFinished: (isWinner: boolean, prizeGold: number, prizeStars: number, titleAward: string) => void;
}

interface RoundLog {
  roundNumber: number;
  roundName: string;
  playerScore: number;
  rivalScore: number;
  commentary: string;
}

export const TournamentMatchModal: React.FC<TournamentMatchModalProps> = ({
  tournament,
  creature,
  onClose,
  onMatchFinished
}) => {
  const [currentRound, setCurrentRound] = useState(0); // 0: intro, 1: round 1, 2: round 2, 3: round 3, 4: result
  const [roundLogs, setRoundLogs] = useState<RoundLog[]>([]);
  const [playerTotalScore, setPlayerTotalScore] = useState(0);
  const [rivalTotalScore, setRivalTotalScore] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [matchResult, setMatchResult] = useState<'victory' | 'defeat' | null>(null);

  const rivalNames: Record<Tournament['category'], { name: string; icon: string; breed: string; baseScore: number }> = {
    'sieger_igp': { name: 'فيلو فون دير شتاين', icon: '🐕‍🦺', breed: 'بطل أندية بافاريا IGP', baseScore: 88 },
    'arabian_cup': { name: 'شهريار الجاسمية', icon: '🐎', breed: 'خيل صقلاوي ملكي', baseScore: 92 },
    'bonsai_expo': { name: 'عفص السرو المعمر 400 عام', icon: '🌲', breed: 'تحفة متحف أوميا الوطني', baseScore: 86 },
    'pigeon_derby': { name: 'سهم البرق الهولندي', icon: '🕊️', breed: 'بطل مسافات 800 كم', baseScore: 84 }
  };

  const rival = rivalNames[tournament.category];
  const playerBaseScore = calculateOverallGeneticScore(creature.dna);

  const roundNamesMap: Record<Tournament['category'], string[]> = {
    'sieger_igp': ['الجولة 1: فحص التشريح والخطو الميداني', 'الجولة 2: اختبار الشجاعة والهجوم المضاد', 'الجولة 3: الطاعة والثبات العصبي (IGP 3)'],
    'arabian_cup': ['الجولة 1: عروض الرأس والرقبة وتقعر الوجه', 'الجولة 2: الحركة والخطوة الملكية المتطايرة', 'الجولة 3: التحكيم الشامل للهيئة والرشاقة'],
    'bonsai_expo': ['الجولة 1: تناغم الجذع وقوة الجذور (Nebari)', 'الجولة 2: أثر الزمن والخشب الميت (Jin/Shari)', 'الجولة 3: التوازن والمهابة الإمبراطورية'],
    'pigeon_derby': ['الجولة 1: انطلاق السرب واختراق الرياح المعاكسة', 'الجولة 2: دقة الملاحة البوصلية والمغناطيسية', 'الجولة 3: السرعة النهائية وعبور خط النهاية']
  };

  const executeRound = (roundIdx: number) => {
    setIsSimulating(true);
    playSound('click');

    setTimeout(() => {
      const pRoll = Math.round(playerBaseScore + (Math.random() * 16 - 6));
      const rRoll = Math.round(rival.baseScore + (Math.random() * 16 - 6));

      const roundName = roundNamesMap[tournament.category][roundIdx - 1];
      let comment = '';
      if (pRoll > rRoll) {
        comment = `أداء استثنائي من ${creature.name}! انبهر الحكام بالدقة والثبات وتفوق على الخصم.`;
      } else {
        comment = `منافسة شرسة للغاية! الخصم ${rival.name} قدّم عرضاً قوياً وحصد نقاطاً إضافية.`;
      }

      const newLog: RoundLog = {
        roundNumber: roundIdx,
        roundName,
        playerScore: pRoll,
        rivalScore: rRoll,
        commentary: comment
      };

      setRoundLogs(prev => [...prev, newLog]);
      setPlayerTotalScore(prev => prev + pRoll);
      setRivalTotalScore(prev => prev + rRoll);
      setIsSimulating(false);

      if (roundIdx === 3) {
        // Final evaluation
        const finalP = playerTotalScore + pRoll;
        const finalR = rivalTotalScore + rRoll;
        const won = finalP >= finalR;

        setTimeout(() => {
          setMatchResult(won ? 'victory' : 'defeat');
          if (won) {
            playSound('win');
            try {
              confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
            } catch {
              // Ignore
            }
          } else {
            playSound('error');
          }
          onMatchFinished(won, tournament.prizeGold, tournament.prizeStars, tournament.championshipTitleAward);
        }, 800);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl shadow-amber-950/70 overflow-hidden text-slate-100">
        
        {/* Tournament Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-4 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{tournament.icon}</span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-amber-100">
                {tournament.title}
              </h2>
              <p className="text-[11px] text-slate-400">{tournament.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Competitors Versus Bar */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-b border-slate-800">
          <div className="grid grid-cols-3 items-center gap-3 text-center">
            
            {/* Player Creature */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/30">
              <div className="text-4xl mb-1">{creature.imageIcon}</div>
              <h4 className="text-xs sm:text-sm font-black text-amber-200 truncate">{creature.name}</h4>
              <span className="text-[10px] text-slate-400 font-mono block">التقييم: {playerBaseScore}</span>
              <span className="text-base font-black text-emerald-400 font-mono mt-1 block">
                {playerTotalScore} نقطة
              </span>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center font-black text-xs text-slate-950 shadow-lg shadow-amber-500/30">
                VS
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1">3 جولات تحكيمية</span>
            </div>

            {/* Rival Competitor */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-red-500/30">
              <div className="text-4xl mb-1">{rival.icon}</div>
              <h4 className="text-xs sm:text-sm font-black text-red-200 truncate">{rival.name}</h4>
              <span className="text-[10px] text-slate-400 font-mono block">التقييم: {rival.baseScore}</span>
              <span className="text-base font-black text-red-400 font-mono mt-1 block">
                {rivalTotalScore} نقطة
              </span>
            </div>

          </div>
        </div>

        {/* Rounds Progression & Commentary */}
        <div className="p-4 sm:p-6 space-y-4 max-h-60 overflow-y-auto">
          {roundLogs.length === 0 ? (
            <div className="text-center py-6 text-slate-400 space-y-2">
              <Trophy className="w-10 h-10 text-amber-400/50 mx-auto animate-bounce" />
              <p className="text-xs">المتنافسون في ساحة العرض الآن تحت أنظار لجنة التحكيم الدولية.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {roundLogs.map((log) => (
                <div key={log.roundNumber} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-300">{log.roundName}</span>
                    <span className="font-mono font-bold text-slate-200">
                      بطلنا: <strong className="text-emerald-400">{log.playerScore}</strong> | المنافس: <strong className="text-red-400">{log.rivalScore}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{log.commentary}</p>
                </div>
              ))}
            </div>
          )}

          {/* Victory / Defeat Overlay */}
          {matchResult && (
            <div className={`p-4 rounded-xl border text-center space-y-2 ${
              matchResult === 'victory'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-xl shadow-emerald-950/50'
                : 'bg-rose-950/80 border-rose-500 text-rose-100'
            }`}>
              <div className="text-2xl">
                {matchResult === 'victory' ? '🏆 فوز وتتويج تاريخي بالبطولة!' : '🥈 وصيف البطولة (مجهود رائع)'}
              </div>
              <p className="text-xs text-slate-300">
                {matchResult === 'victory'
                  ? `حصدت الجائزة المالية +${tournament.prizeGold} ذهب و +${tournament.prizeStars} نجمة، بالإضافة إلى لقب "${tournament.championshipTitleAward}"!`
                  : 'حصلت على مكافأة مشاركة وملاحظات هامة لتحسين السلالة في التزاوج القادم.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            {matchResult ? 'إغلاق والعودة' : 'انسحاب'}
          </button>

          {!matchResult && (
            <button
              onClick={() => {
                const nextRound = currentRound + 1;
                setCurrentRound(nextRound);
                executeRound(nextRound);
              }}
              disabled={isSimulating}
              className={`px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all ${
                isSimulating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20 hover:scale-105'
              }`}
            >
              <Swords className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'جاري التحكيم والتقييم...' : `بدء الجولة ${currentRound + 1} من 3 ⚔️`}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
