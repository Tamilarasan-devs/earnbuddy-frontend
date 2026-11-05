import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  ChevronDown, 
  Wallet, 
  ArrowDownToLine, 
  Users, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    category: 'Deposit & Wallet',
    q: 'How do I add cash to my EarnBuddy wallet?',
    a: 'Navigate to "Add Cash" from the bottom navigation or home screen. Enter your desired deposit amount, select your preferred payment app (PhonePe, Paytm, Google Pay, or QR code), make the payment, and paste the 12-digit UTR/reference number from your payment receipt. Once verified, the funds are instantly credited to your wallet.'
  },
  {
    category: 'Deposit & Wallet',
    q: 'What is a 12-digit UTR and where can I find it?',
    a: 'UTR (Unique Transaction Reference) is a 12-digit number provided by your UPI app (PhonePe, Google Pay, Paytm) on the payment receipt. You can find it under "UPI Ref ID" or "Transaction ID" in your payment history.'
  },
  {
    category: 'Investments & Returns',
    q: 'How do product plans and daily returns work?',
    a: 'When you subscribe to an active investment product using your wallet balance, you receive daily cash returns credited directly to your Earning Balance every 24 hours for the duration of the plan. You can claim available daily profits at any time from your Dashboard or My Products page.'
  },
  {
    category: 'Investments & Returns',
    q: 'Can I purchase multiple investment products at the same time?',
    a: 'Yes! You can hold multiple active subscriptions simultaneously. Each plan operates on its own schedule and generates daily returns independently.'
  },
  {
    category: 'Withdrawals',
    q: 'How do I withdraw my earnings to my bank account?',
    a: 'Go to the Wallet section, enter the amount you wish to withdraw, and ensure your bank details (Account Number, IFSC, Account Holder Name, or UPI ID) are saved. Once submitted, our automated payout system and financial desk review and process the withdrawal directly to your designated bank account.'
  },
  {
    category: 'Withdrawals',
    q: 'What are the withdrawal timings and minimum limits?',
    a: 'Withdrawal requests can be submitted daily. The minimum withdrawal limit is clearly displayed in your Wallet page. Standard bank transfers typically arrive within 15 minutes to 24 hours depending on banking network availability.'
  },
  {
    category: 'Referral & Bonus',
    q: 'How does the Refer & Earn program work?',
    a: 'Share your exclusive referral code or link with friends. When your friend signs up and makes their first qualifying wallet deposit, you receive an instant cash referral bonus! Note: You must make at least one verified deposit yourself to unlock and qualify for referral rewards.'
  },
  {
    category: 'Security & Account',
    q: 'Is my personal information and bank details secure?',
    a: 'Yes, we employ industry-standard 256-bit SSL encryption and strict data segregation. Your payment credentials and bank records are encrypted and never shared with third parties.'
  }
];

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using the EarnBuddy web application, services, products, and platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and all related company policies. If you do not agree, please discontinue using the service immediately.'
  },
  {
    title: '2. User Eligibility & Account Registration',
    content: 'Users must be at least 18 years of age. You agree to provide true, accurate, and current information during registration. Each user is strictly permitted to maintain only one active account. Duplicate accounts, multi-accounting, or fraudulent registrations will result in immediate suspension and forfeiture of bonus balances.'
  },
  {
    title: '3. Wallet Balances & Deposits',
    content: 'All wallet top-ups must be executed via sanctioned UPI and banking methods. Users must provide genuine 12-digit UTR numbers corresponding to actual bank debit transactions. Any attempt to submit forged, duplicate, or falsified UTR records constitutes fraud and will result in permanent account termination.'
  },
  {
    title: '4. Product Subscriptions & Scheduled Returns',
    content: 'Product plans represent fixed-term digital financial models. Daily earnings are credited according to plan specifications. Users may collect their daily dividends manually or have them credited to their Earning Balance. Company terms and duration policies apply to all active plan cycles.'
  },
  {
    title: '5. Withdrawals & Payout Policy',
    content: 'Withdrawal requests are processed to the verified bank account or UPI ID registered on the user profile. Users are responsible for providing correct bank IFSC codes and account numbers. EarnBuddy is not liable for failed or misdirected transfers resulting from incorrect user input.'
  },
  {
    title: '6. Refer & Earn Qualification',
    content: 'Referral bonuses are awarded when invited peers complete their initial verified wallet deposit. In accordance with system anti-abuse guidelines, referrers must have made at least one approved deposit on their own account to unlock eligibility for referral bonus payouts.'
  },
  {
    title: '7. System Security & Fair Use Policy',
    content: 'Any use of automated bots, scraping scripts, exploit manipulation, or reverse engineering will lead to instantaneous account closure and reporting. We reserve the right to review flagged accounts and request KYC verification before authorizing payouts.'
  },
  {
    title: '8. Modifications to Service & Terms',
    content: 'EarnBuddy reserves the right to modify, amend, or update these terms, plan offerings, and operational policies at any time. Continued use of the platform after updates signifies full acceptance of revised terms.'
  }
];

const Terms = () => {
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs' | 'terms'
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="space-y-7 max-w-4xl mx-auto pb-20">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[30px] p-7 sm:p-9 bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#0284C7] text-white shadow-xl shadow-blue-500/15">
        <div className="absolute right-0 top-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-xs font-black uppercase tracking-wider mb-3.5">
            <ShieldCheck size={16} className="text-cyan-200" />
            <span>Transparency & Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Terms of Service & FAQs
          </h1>
          <p className="mt-3 text-sm sm:text-base text-blue-100 font-medium leading-relaxed">
            Everything you need to know about our platform guidelines, wallet deposits, daily returns, withdrawals, and referral rules.
          </p>
        </div>
      </div>

      {/* Navigation Switch Tabs */}
      <div className="flex items-center gap-2.5 p-2 bg-slate-200/70 rounded-2xl shadow-inner max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm sm:text-base font-black transition-all cursor-pointer ${
            activeTab === 'faqs'
              ? 'bg-white text-[#2563EB] shadow-md shadow-slate-200/80 scale-[1.02]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle size={18} />
          <span>Frequently Asked Questions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm sm:text-base font-black transition-all cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-white text-[#2563EB] shadow-md shadow-slate-200/80 scale-[1.02]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText size={18} />
          <span>Terms of Service</span>
        </button>
      </div>

      {/* TAB 1: FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Quick Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Wallet size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Instant Deposit</p>
                <p className="text-xs text-slate-500 font-medium">Fast UPI & QR reconciliation</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Daily Payouts</p>
                <p className="text-xs text-slate-500 font-medium">Guaranteed return cycles</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Refer & Earn</p>
                <p className="text-xs text-slate-500 font-medium">Extra cash on peer deposits</p>
              </div>
            </div>
          </div>

          {/* Accordion Questions */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(15,23,42,0.04)] border border-slate-100 divide-y divide-slate-100">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 py-1.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                        {idx + 1}
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition tracking-tight">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pl-10 pr-2 pt-2.5 pb-1 text-sm sm:text-base text-slate-600 font-medium leading-relaxed animate-fadeIn">
                      <p>{faq.a}</p>
                      <span className="inline-block mt-2.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                        Category: {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TERMS OF SERVICE */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-[0_4px_25px_rgba(15,23,42,0.04)] border border-slate-100 space-y-7 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">User Agreement & Platform Terms</h2>
              <p className="text-sm text-slate-500 mt-1">Last revised: November 2026</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs sm:text-sm font-black flex items-center gap-1.5">
              <CheckCircle2 size={15} />
              <span>Legally Binding</span>
            </div>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {TERMS_SECTIONS.map((sec, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-2">
                <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  {sec.title}
                </h3>
                <p className="text-slate-600 pl-5 text-sm sm:text-base leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-950 flex items-start gap-3.5">
            <AlertCircle size={22} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-base">Disclaimer on Financial Performance</p>
              <p className="mt-1 text-sm text-amber-900 leading-relaxed">
                Participation in investment products involves risk. Ensure you evaluate plan durations and returns before depositing. EarnBuddy operates in accordance with digital services regulations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Help CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" />
            Still have questions or need assistance?
          </h4>
          <p className="text-sm text-slate-600 mt-1">
            Our 24/7 financial support desk is ready to assist you with deposits, plans, and withdrawals.
          </p>
        </div>

        <Link
          to="/services/support"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0284C7] hover:brightness-105 text-white font-black text-sm sm:text-base shadow-md shadow-blue-500/20 transition active:scale-95 text-center shrink-0 cursor-pointer"
        >
          Contact Support Desk
        </Link>
      </div>

    </div>
  );
};

export default Terms;
