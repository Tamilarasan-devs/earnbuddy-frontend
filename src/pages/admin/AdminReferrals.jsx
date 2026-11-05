import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { useModal } from '../../context/ModalContext';
import { 
  Users, 
  Gift, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Search, 
  Coins, 
  ArrowRight, 
  UserCheck, 
  X, 
  Wallet,
  Sparkles,
  ShieldCheck,
  Check,
  Settings,
  Save,
  CheckCircle
} from 'lucide-react';

const AdminReferrals = () => {
  const { showAlert, showConfirm } = useModal();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Referral Settings State
  const [referralSettings, setReferralSettings] = useState({
    referrerBonusRupees: 100,
    refereeBonusRupees: 100,
    description: '',
    isActive: true
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  
  // Action Modal State
  const [actionModal, setActionModal] = useState({
    show: false,
    type: '', // 'referrer' | 'referredUser' | 'reject'
    item: null,
    amount: '',
    note: '',
    error: '',
    submitting: false
  });

  useEffect(() => {
    fetchRewards();
    fetchReferralSettings();
  }, []);

  const fetchReferralSettings = async () => {
    try {
      const res = await api.get('/admin/referral-settings');
      if (res.data?.success && res.data.data) {
        setReferralSettings({
          referrerBonusRupees: res.data.data.referrerBonusRupees ?? 100,
          refereeBonusRupees: res.data.data.refereeBonusRupees ?? 100,
          description: res.data.data.description || '',
          isActive: res.data.data.isActive ?? true
        });
      }
    } catch (err) {
      console.error('Failed to load referral settings:', err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    setSettingsError('');
    try {
      const res = await api.put('/admin/referral-settings', referralSettings);
      if (res.data?.success) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err) {
      setSettingsError(err.response?.data?.message || err.response?.data?.error || 'Failed to update referral amounts');
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/referrals');
      setRewards(res.data.data || []);
    } catch (err) {
      console.error('Failed to load referral rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const openRewardModal = (item, type) => {
    const depositRupees = (item.depositAmount || 0) / 100;
    // Uses the configured admin referral reward as standard default
    const configuredReferrerBonus = Number(referralSettings.referrerBonusRupees) || 100;
    const configuredRefereeBonus = Number(referralSettings.refereeBonusRupees) || 100;

    const defaultReward = type === 'referrer' 
      ? configuredReferrerBonus 
      : configuredRefereeBonus;

    setActionModal({
      show: true,
      type,
      item,
      amount: String(defaultReward),
      note: type === 'referrer' 
        ? `Manual referral bonus for referral ${item.referredUser?.name}'s deposit of ₹${depositRupees}`
        : `Welcome deposit reward via referral from ${item.referrer?.name}`,
      error: '',
      submitting: false
    });
  };

  const handleApproveBoth = async (item) => {
    const defaultReferrerRupees = Number(referralSettings.referrerBonusRupees) || 100;
    const defaultRefereeRupees = Number(referralSettings.refereeBonusRupees) || 100;

    const confirmed = await showConfirm(
      `Approve and credit referral bonuses now?\n\n• Referrer (${item.referrer?.name}): ₹${defaultReferrerRupees}\n• Friend (${item.referredUser?.name}): ₹${defaultRefereeRupees}`,
      { title: 'Approve Referral Rewards', confirmText: 'Approve & Credit' }
    );
    if (!confirmed) return;

    try {
      const res = await api.post(`/admin/referrals/${item._id}/approve-both`, {
        referrerAmount: defaultReferrerRupees,
        refereeAmount: defaultRefereeRupees
      });
      if (res.data?.success) {
        await showAlert(res.data.message || 'Both referral rewards credited successfully!', 'success');
        await fetchRewards();
      }
    } catch (err) {
      await showAlert(err.response?.data?.message || err.response?.data?.error || 'Failed to approve referral rewards', 'error');
    }
  };
  const openRejectModal = (item) => {
    setActionModal({
      show: true,
      type: 'reject',
      item,
      amount: '',
      note: '',
      error: '',
      submitting: false
    });
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!actionModal.item) return;

    setActionModal(prev => ({ ...prev, submitting: true, error: '' }));

    try {
      const endpoint = actionModal.type === 'referrer'
        ? `/admin/referrals/${actionModal.item._id}/send-referrer`
        : actionModal.type === 'referredUser'
          ? `/admin/referrals/${actionModal.item._id}/send-referred-user`
          : `/admin/referrals/${actionModal.item._id}/reject`;

      const payload = actionModal.type === 'reject'
        ? { reason: actionModal.note }
        : { amount: actionModal.amount, note: actionModal.note };

      await api.post(endpoint, payload);

      // Refresh list
      await fetchRewards();

      // Close modal
      setActionModal({
        show: false,
        type: '',
        item: null,
        amount: '',
        note: '',
        error: '',
        submitting: false
      });

    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to process request';
      setActionModal(prev => ({ ...prev, submitting: false, error: msg }));
    }
  };

  // Filter rewards
  const filteredRewards = rewards.filter(r => {
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'pending' ? r.status === 'pending_admin' :
      filterStatus === 'partial' ? r.status === 'referrer_paid' :
      filterStatus === 'both_paid' ? r.status === 'both_paid' :
      filterStatus === 'rejected' ? r.status === 'rejected' : true;

    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const referrerName = r.referrer?.name?.toLowerCase() || '';
    const referrerEmail = r.referrer?.email?.toLowerCase() || '';
    const referrerCode = r.referrer?.referralCode?.toLowerCase() || '';
    const referredUserName = r.referredUser?.name?.toLowerCase() || '';
    const referredUserEmail = r.referredUser?.email?.toLowerCase() || '';
    const utr = r.topUp?.utr?.toLowerCase() || '';

    return (
      referrerName.includes(q) ||
      referrerEmail.includes(q) ||
      referrerCode.includes(q) ||
      referredUserName.includes(q) ||
      referredUserEmail.includes(q) ||
      utr.includes(q)
    );
  });

  const pendingCount = rewards.filter(r => r.status === 'pending_admin').length;
  const partialCount = rewards.filter(r => r.status === 'referrer_paid').length;
  const completedCount = rewards.filter(r => r.status === 'both_paid').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
            <Gift className="text-[#4A3AFF]" size={28} />
            <span>Referral Rewards & Bonus Control</span>
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-xs sm:text-sm">
            Set default referral rewards for users and review first-deposit referral bonus payouts.
          </p>
        </div>
        <button
          onClick={() => { fetchRewards(); fetchReferralSettings(); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 text-xs font-bold shadow-xs hover:bg-gray-50 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-[#4A3AFF]' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* REFERRAL AMOUNT CONTROL CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Coins size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Set Referral & Welcome Bonus Amounts</h2>
              <p className="text-xs text-gray-400">Configure how much bonus is awarded for each referral in EarnBuddy.</p>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${referralSettings.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {referralSettings.isActive ? '● Referral System Active' : '● Referral System Paused'}
          </span>
        </div>

        {settingsSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle size={16} />
            <span>Referral bonus amounts updated successfully!</span>
          </div>
        )}

        {settingsError && (
          <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{settingsError}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* Referrer Reward */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
              Referrer Bonus (₹ per friend)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-gray-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={referralSettings.referrerBonusRupees}
                onChange={(e) => setReferralSettings({ ...referralSettings, referrerBonusRupees: e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 rounded-2xl border-2 border-gray-200 text-sm font-black text-[#0F172A] focus:border-[#4A3AFF] focus:ring-4 focus:ring-[#4A3AFF]/10 focus:outline-none transition"
                required
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Cash paid to the user who shared their link.</p>
          </div>

          {/* Referee Welcome Bonus */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
              Friend Welcome Bonus (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-gray-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={referralSettings.refereeBonusRupees}
                onChange={(e) => setReferralSettings({ ...referralSettings, refereeBonusRupees: e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 rounded-2xl border-2 border-gray-200 text-sm font-black text-[#0F172A] focus:border-[#4A3AFF] focus:ring-4 focus:ring-[#4A3AFF]/10 focus:outline-none transition"
                required
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Bonus given to the new user who joined.</p>
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              disabled={savingSettings}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#4A3AFF] hover:bg-[#3D2EE0] text-white text-xs font-extrabold shadow-sm hover:shadow transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {savingSettings ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{savingSettings ? 'Saving...' : 'Update Referral Amounts'}</span>
            </button>
            <p className="text-[11px] text-gray-400 mt-1 text-center">Applies to all new referrals & defaults.</p>
          </div>
        </form>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-amber-600 uppercase tracking-wider">
            <span>Pending First-Deposit Review</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-black text-[#0F172A]">{pendingCount}</div>
          <p className="text-[11px] text-gray-400">Referred users who deposited and await bonus credit</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
            <span>Referrer Paid (Awaiting User)</span>
            <UserCheck size={16} />
          </div>
          <div className="text-2xl font-black text-[#0F172A]">{partialCount}</div>
          <p className="text-[11px] text-gray-400">Referrer paid, referee reward pending</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
            <span>Both Parties Rewarded</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-2xl font-black text-[#0F172A]">{completedCount}</div>
          <p className="text-[11px] text-gray-400">Full referral reward cycle completed</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by referrer, referred user, referral code, or UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#4A3AFF] focus:outline-none transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Deposits' },
            { id: 'pending', label: `Pending Review (${pendingCount})` },
            { id: 'partial', label: `Step 2: Pay User (${partialCount})` },
            { id: 'both_paid', label: `Completed (${completedCount})` },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rewards Table / List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#4A3AFF]" />
            <span className="text-xs font-bold">Loading referral review requests...</span>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Gift size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-extrabold text-[#0F172A]">No Referral Reward Requests Found</p>
            <p className="text-xs text-gray-400 mt-1">
              When referred users complete their wallet deposit, review entries appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Referrer (Inviter)</th>
                  <th className="py-4 px-6">Referred User (Friend)</th>
                  <th className="py-4 px-6">Deposit Details</th>
                  <th className="py-4 px-6">Referrer Bonus</th>
                  <th className="py-4 px-6">Referred User Bonus</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredRewards.map((r) => {
                  const depositRupees = (r.depositAmount || 0) / 100;
                  const isReferrerPaid = Boolean(r.referrerRewardAmount && r.referrerRewardAmount > 0);
                  const isReferredUserPaid = Boolean(r.referredUserRewardAmount && r.referredUserRewardAmount > 0);
                  const isRejected = r.status === 'rejected';

                  return (
                    <tr key={r._id} className="hover:bg-gray-50/50 transition">
                      
                      {/* Referrer */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-50 text-[#4A3AFF] font-black flex items-center justify-center shrink-0">
                            {r.referrer?.name?.charAt(0).toUpperCase() || 'R'}
                          </div>
                          <div>
                            <div className="font-extrabold text-[#0F172A]">{r.referrer?.name || 'Unknown'}</div>
                            <div className="text-[11px] text-gray-400">{r.referrer?.email}</div>
                            <div className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                              Code: {r.referrer?.referralCode || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Referred User */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 font-black flex items-center justify-center shrink-0">
                            {r.referredUser?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-extrabold text-[#0F172A]">{r.referredUser?.name || 'Unknown'}</div>
                            <div className="text-[11px] text-gray-400">{r.referredUser?.email}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              Joined: {new Date(r.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Deposit Details */}
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-[#0F172A] text-sm">
                          ₹{depositRupees.toFixed(2)}
                        </div>
                        {r.topUp?.utr && (
                          <div className="text-[10px] font-mono text-gray-500 truncate max-w-[150px]" title={r.topUp.utr}>
                            UTR: {r.topUp.utr}
                          </div>
                        )}
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700">
                          Verified Deposit
                        </span>
                      </td>

                      {/* Referrer Reward Status */}
                      <td className="py-4 px-6">
                        {isReferrerPaid ? (
                          <div>
                            <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                              <CheckCircle2 size={12} />
                              ₹{(r.referrerRewardAmount / 100).toFixed(2)} Credited
                            </span>
                            {r.referrerPaidAt && (
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {new Date(r.referrerPaidAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : isRejected ? (
                          <span className="text-gray-400 font-bold">Rejected</span>
                        ) : !r.referrerEligible ? (
                          <div className="flex flex-col items-start gap-1">
                            <span className="inline-flex items-center gap-1 font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg text-[10px]" title="User hasn't made any deposit yet">
                              <AlertCircle size={11} />
                              Ineligible (No Deposit)
                            </span>
                            <span className="text-[9.5px] text-gray-400">Must deposit to qualify</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openRewardModal(r, 'referrer')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3D2EE0] text-white text-[11px] font-extrabold shadow-xs transition cursor-pointer"
                          >
                            <Coins size={12} />
                            <span>Credit Referrer</span>
                          </button>
                        )}
                      </td>

                      {/* Referred User Reward Status */}
                      <td className="py-4 px-6">
                        {isReferredUserPaid ? (
                          <div>
                            <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                              <CheckCircle2 size={12} />
                              ₹{(r.referredUserRewardAmount / 100).toFixed(2)} Credited
                            </span>
                            {r.referredUserPaidAt && (
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {new Date(r.referredUserPaidAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : isRejected ? (
                          <span className="text-gray-400 font-bold">Rejected</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openRewardModal(r, 'referredUser')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold shadow-xs transition cursor-pointer"
                          >
                            <Gift size={12} />
                            <span>Credit User Bonus</span>
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        {!isRejected && (!isReferrerPaid || !isReferredUserPaid) ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {!isReferrerPaid && !isReferredUserPaid && r.referrerEligible && (
                              <button
                                type="button"
                                onClick={() => handleApproveBoth(r)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-extrabold shadow-xs transition cursor-pointer flex items-center gap-1"
                                title="Approve and credit both bonuses in one click"
                              >
                                <CheckCircle2 size={12} />
                                <span>Approve All</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openRejectModal(r)}
                              className="px-2.5 py-1 text-gray-400 hover:text-rose-600 text-[11px] font-bold hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : isRejected ? (
                          <span className="text-[11px] text-rose-500 font-extrabold" title={r.rejectedReason}>
                            Rejected
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-black inline-flex items-center gap-1">
                            <ShieldCheck size={14} /> Completed
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: SEND REWARD / REJECT */}
      {actionModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  actionModal.type === 'reject' 
                    ? 'bg-red-50 text-red-600' 
                    : actionModal.type === 'referrer'
                      ? 'bg-purple-50 text-[#4A3AFF]'
                      : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {actionModal.type === 'reject' ? <AlertCircle size={16} /> : <Gift size={16} />}
                </div>
                <h3 className="font-extrabold text-[#0F172A] text-base">
                  {actionModal.type === 'referrer' 
                    ? 'Credit Referrer Bonus' 
                    : actionModal.type === 'referredUser'
                      ? 'Credit Friend Welcome Bonus'
                      : 'Reject Referral Reward'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActionModal({ show: false, type: '', item: null, amount: '', note: '', error: '', submitting: false })}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Recipient Overview Box */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Recipient</span>
                <span className="font-extrabold text-[#0F172A]">
                  {actionModal.type === 'referrer' 
                    ? actionModal.item?.referrer?.name 
                    : actionModal.item?.referredUser?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Email</span>
                <span className="text-gray-600 font-medium">
                  {actionModal.type === 'referrer' 
                    ? actionModal.item?.referrer?.email 
                    : actionModal.item?.referredUser?.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Original Deposit</span>
                <span className="font-mono font-black text-emerald-600">
                  ₹{((actionModal.item?.depositAmount || 0) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {actionModal.error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{actionModal.error}</span>
              </div>
            )}

            <form onSubmit={handleActionSubmit} className="space-y-4">
              {actionModal.type !== 'reject' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Reward Amount (₹) to Credit Wallet
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-black text-gray-400 text-lg">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={actionModal.amount}
                      onChange={(e) => setActionModal({ ...actionModal, amount: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl border-2 border-gray-200 text-lg font-black text-[#0F172A] focus:border-[#4A3AFF] focus:ring-4 focus:ring-[#4A3AFF]/10 focus:outline-none transition"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Will be credited directly to {actionModal.type === 'referrer' ? actionModal.item?.referrer?.name : actionModal.item?.referredUser?.name}'s EarnBuddy Wallet with a ledger credit entry.
                  </p>
                </div>
              ) : null}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {actionModal.type === 'reject' ? 'Rejection Reason' : 'Transaction Note'}
                </label>
                <textarea
                  rows="3"
                  value={actionModal.note}
                  onChange={(e) => setActionModal({ ...actionModal, note: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-gray-200 text-xs font-medium focus:border-[#4A3AFF] focus:ring-4 focus:ring-[#4A3AFF]/10 focus:outline-none transition resize-none"
                  required={actionModal.type === 'reject'}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModal({ show: false, type: '', item: null, amount: '', note: '', error: '', submitting: false })}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionModal.submitting}
                  className={`flex-1 py-3 px-4 rounded-xl text-white text-xs font-extrabold shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                    actionModal.type === 'reject'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-[#4A3AFF] hover:bg-[#3D2EE0]'
                  }`}
                >
                  {actionModal.submitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>{actionModal.type === 'reject' ? 'Confirm Reject' : 'Confirm & Credit'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReferrals;
