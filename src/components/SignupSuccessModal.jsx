import React, { useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Gift, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Coins, 
  Zap, 
  Share2, 
  X,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignupSuccessModal = ({ isOpen, onClose, userName = 'Friend', welcomeBonus = 100 }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartEarning = () => {
    onClose();
    navigate('/');
  };

  const handleAddCash = () => {
    onClose();
    navigate('/add-cash');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      {/* Background Dim Dismiss */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-sm rounded-[32px] overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#140D36] to-[#0A061E] border border-amber-400/40 shadow-[0_25px_70px_rgba(245,158,11,0.35)] text-white p-6 sm:p-7 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        
        {/* Glow Effects */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#EC4899]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#F59E0B]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EC4899] via-[#F59E0B] to-[#4A3AFF]" />

        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* 3D Trophy / Celebration Icon with pulsing ring */}
        <div className="relative mb-3 mt-1">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] flex items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.5)] border-2 border-amber-200/50">
            <Trophy size={40} className="text-white drop-shadow-md animate-bounce" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#10B981] border-2 border-[#0F172A] flex items-center justify-center text-white">
            <Sparkles size={14} className="fill-white" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] font-black tracking-wider uppercase mb-2">
          <Flame size={13} className="text-amber-400 fill-amber-400" />
          <span>Account Activated</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-[26px] font-black tracking-tight leading-tight">
          Congratulations,{' '}
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
            {userName || 'Buddy'}!
          </span>
        </h2>

        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
          Welcome to <strong className="text-white font-bold">EarnBuddy</strong> — your smart destination to grow your daily income & win big!
        </p>

        {/* Reward Highlights Card */}
        <div className="w-full mt-4 p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 space-y-2.5 text-left">
          
          {/* Item 1: Welcome Bonus */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#BE185D] flex items-center justify-center shrink-0 shadow-md">
              <Gift size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-black text-white flex items-center justify-between">
                <span>Welcome Bonus Pool</span>
                <span className="text-emerald-400 font-extrabold text-[12px]">+₹{welcomeBonus}</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Get up to 100% bonus on your first wallet deposit
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Item 2: High Daily Returns */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4A3AFF] to-[#1E40AF] flex items-center justify-center shrink-0 shadow-md">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-black text-white flex items-center justify-between">
                <span>Daily Automatic Earnings</span>
                <span className="text-amber-300 font-extrabold text-[11px]">Instant Daily</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Activate plans & collect earnings directly to wallet
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Item 3: Refer & Earn */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981] to-[#047857] flex items-center justify-center shrink-0 shadow-md">
              <Share2 size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-black text-white flex items-center justify-between">
                <span>Unlimited Referral Rewards</span>
                <span className="text-emerald-300 font-extrabold text-[11px]">High Payout</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Invite friends and earn instant cash per deposit
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleAddCash}
          className="w-full mt-5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#E11D48] to-[#9333EA] hover:from-[#D97706] hover:to-[#7E22CE] text-white font-black text-[13px] uppercase tracking-wider shadow-[0_10px_30px_rgba(244,63,94,0.45)] flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer group"
        >
          <Coins size={16} />
          <span>Add Cash & Double Your Money</span>
          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Secondary Action */}
        <button
          type="button"
          onClick={handleStartEarning}
          className="mt-2 text-xs font-bold text-slate-400 hover:text-white transition py-1 cursor-pointer"
        >
          Explore Dashboard First →
        </button>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-400/90 mt-2">
          <ShieldCheck size={12} />
          <span>100% Safe & Instant UPI Deposits</span>
        </div>

      </div>
    </div>
  );
};

export default SignupSuccessModal;

