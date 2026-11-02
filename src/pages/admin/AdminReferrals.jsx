import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
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
  Check
} from 'lucide-react';

const AdminReferrals = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
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
  }, []);

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
    // Default recommended amount (e.g. ₹100 or 10% of deposit)
    const depositRupees = (item.depositAmount || 0) / 100;
    const defaultReward = type === 'referrer' 
      ? Math.max(100, Math.round(depositRupees * 0.1)) 
      : 100;

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

  const openRejectModal = (item) => {
    setActionModal({
      show: true,
      type: 'reject',
      item,
      amount: '',
      note: 'Deposit did not qualify for referral reward (e.g. refunded or invalid deposit)',
      error: '',
      submitting: false
    });
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    const { type, item, amount, note } = actionModal;

    setActionModal(prev => ({ ...prev, submitting: true, error: '' }));

    try {
      if (type === 'referrer') {
        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) {
          throw new Error('Please enter a valid reward amount in rupees');
        }
        await api.post(`/admin/referrals/${item._id}/send-referrer`, {
          amount: numAmount,
          note
        });
      } else if (type === 'referredUser') {
        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) {
          throw new Error('Please enter a valid reward amount in rupees');
        }
        await api.post(`/admin/referrals/${item._id}/send-referred-user`, {
          amount: numAmount,
          note
        });
      } else if (type === 'reject') {
        await api.post(`/admin/referrals/${item._id}/reject`, {
          reason: note
        });
      }

      setActionModal({ show: false, type: '', item: null, amount: '', note: '', error: '', submitting: false });
      fetchRewards();
    } catch (err) {
      setActionModal(prev => ({
        ...prev,
        submitting: false,
        error: err.response?.data?.error || err.message || 'Action failed'
      }));
    }
  };

  const filteredRewards = rewards.filter((item) => {
    if (filterStatus === 'pending') {
      if (item.status !== 'pending_admin') return false;
    } else if (filterStatus === 'partial') {
      if (item.status !== 'referrer_paid') return false;
    } else if (filterStatus === 'both_paid') {
      if (item.status !== 'both_paid') return false;
    } else if (filterStatus === 'rejected') {
      if (item.status !== 'rejected') return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.referrer?.name?.toLowerCase().includes(q) ||
      item.referrer?.email?.toLowerCase().includes(q) ||
      item.referredUser?.name?.toLowerCase().includes(q) ||
      item.referredUser?.email?.toLowerCase().includes(q) ||
      item.referrer?.referralCode?.toLowerCase().includes(q) ||
      item.topUp?.utr?.toLowerCase().includes(q)
    );
  });

  const pendingCount = rewards.filter(r => r.status === 'pending_admin').length;
  const partialCount = rewards.filter(r => r.status === 'referrer_paid').length;
  const completedCount = rewards.filter(r => r.status === 'both_paid').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2.5">
            <Gift className="text-[#4A3AFF]" size={26} />
            <span>Referral Deposit Audit & Rewards</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            When a referred user makes a deposit, review the transaction and manually issue referral bonus to both the Referrer and Referred user.
          </p>
        </div>

        <button
          onClick={fetchRewards}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:text-[#4A3AFF] hover:border-[#4A3AFF] text-xs font-bold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-[#4A3AFF]' : ''} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-amber-600 uppercase tracking-wider">
            <span>Pending Admin Review</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-black text-[#0F172A]">{pendingCount}</div>
          <p className="text-[11px] text-gray-400">Referred users who completed a deposit</p>
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
          <div className="p-16 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw size={24} className="animate-spin text-[#4A3AFF]" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading referral events...</span>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="p-16 text-center text-gray-400 flex flex-col items-center justify-center">
            <Gift size={36} className="text-gray-300 mb-2 stroke-1" />
            <p className="text-sm font-bold text-gray-600">No referral deposits match the current criteria</p>
            <p className="text-xs text-gray-400 mt-0.5">When users deposit after signing up with a referral code, they appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-black uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4">Referred User (Depositor)</th>
                  <th className="px-6 py-4">Deposit Amount & UTR</th>
                  <th className="px-6 py-4">Referrer (Invited By)</th>
                  <th className="px-6 py-4">Workflow Status</th>
                  <th className="px-6 py-4">Rewards Sent</th>
                  <th className="px-6 py-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredRewards.map((item) => {
                  const isReferrerPaid = item.referrerRewardAmount > 0;
                  const isReferredUserPaid = item.referredUserRewardAmount > 0;
                  const isRejected = item.status === 'rejected';

                  return (
                    <tr key={item._id} className="hover:bg-gray-50/70 transition">
                      {/* Referred User */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-[#0F172A]">{item.referredUser?.name}</div>
                        <div className="text-[11px] text-gray-400">{item.referredUser?.email}</div>
                        <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          Bal: ₹{((item.referredUser?.walletBalance || 0) / 100).toFixed(2)}
                        </span>
                      </td>

                      {/* Deposit Amount & UTR */}
                      <td className="px-6 py-4">
                        <div className="text-base font-black text-[#0F172A]">
                          ₹{((item.depositAmount || 0) / 100).toFixed(2)}
                        </div>
                        <div className="text-[11px] font-mono text-indigo-600 font-bold truncate max-w-[140px]">
                          UTR: {item.topUp?.utr || 'Auto Gateway'}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Referrer */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-[#0F172A]">{item.referrer?.name}</div>
                        <div className="text-[11px] text-gray-400">{item.referrer?.email}</div>
                        <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
                          Code: {item.referrer?.referralCode || 'N/A'}
                        </span>
                      </td>

                      {/* Workflow Status */}
                      <td className="px-6 py-4">
                        {isRejected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <X size={13} />
                            <span>Rejected</span>
                          </span>
                        ) : isReferrerPaid && isReferredUserPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={13} />
                            <span>Both Rewarded</span>
                          </span>
                        ) : isReferrerPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Clock size={13} />
                            <span>Step 2: Pay Referee</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                            <Clock size={13} />
                            <span>Pending Referrer Pay</span>
                          </span>
                        )}
                      </td>

                      {/* Rewards breakdown */}
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-gray-400">To Referrer:</span>
                          {isReferrerPaid ? (
                            <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              +₹{(item.referrerRewardAmount / 100).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400 font-bold">Unpaid</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-gray-400">To Referee:</span>
                          {isReferredUserPaid ? (
                            <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              +₹{(item.referredUserRewardAmount / 100).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400 font-bold">Unpaid</span>
                          )}
                        </div>
                      </td>

                      {/* Admin Actions */}
                      <td className="px-6 py-4 text-right space-x-2">
                        {/* Step 1: Send to Referrer */}
                        {!isReferrerPaid && !isRejected && (
                          <button
                            type="button"
                            onClick={() => openRewardModal(item, 'referrer')}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4A3AFF] to-[#6C5DD3] hover:from-[#3D2EE0] hover:to-[#5B4DC7] text-white text-xs font-bold shadow-xs transition cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>1. Pay Referrer</span>
                            <ArrowRight size={13} />
                          </button>
                        )}

                        {/* Step 2: Send to Referred User */}
                        {isReferrerPaid && !isReferredUserPaid && !isRejected && (
                          <button
                            type="button"
                            onClick={() => openRewardModal(item, 'referredUser')}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>2. Pay Referred User</span>
                            <Sparkles size={13} />
                          </button>
                        )}

                        {/* Reject button */}
                        {!isReferrerPaid && !isRejected && (
                          <button
                            type="button"
                            onClick={() => openRejectModal(item)}
                            className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                          >
                            Reject
                          </button>
                        )}

                        {isReferrerPaid && isReferredUserPaid && (
                          <span className="text-[11px] font-bold text-emerald-600 inline-flex items-center gap-1">
                            <Check size={14} strokeWidth={3} /> Completed
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

      {/* ACTION MODAL */}
      {actionModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  {actionModal.type === 'referrer' ? 'Send Reward to Referrer' :
                   actionModal.type === 'referredUser' ? 'Send Reward to Referred User' :
                   'Reject Referral Reward'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Deposit of ₹{((actionModal.item?.depositAmount || 0) / 100).toFixed(2)} by {actionModal.item?.referredUser?.name}
                </p>
              </div>
              <button
                onClick={() => setActionModal({ show: false, type: '', item: null, amount: '', note: '', error: '', submitting: false })}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            {actionModal.error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
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
                    Will be credited directly to {actionModal.type === 'referrer' ? actionModal.item?.referrer?.name : actionModal.item?.referredUser?.name}'s Cashly Wallet with a ledger credit entry.
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

