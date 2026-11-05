import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const ReferralSettingContext = createContext({
  referrerBonusRupees: 100,
  refereeBonusRupees: 100,
  description: '',
  isActive: true,
  loading: true,
  refreshSettings: () => {}
});

export const ReferralSettingProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    referrerBonusRupees: 100,
    refereeBonusRupees: 100,
    description: '',
    isActive: true,
    loading: true
  });

  const fetchSettings = async () => {
    try {
      const res = await api.get('/services/referral-settings', { cache: false });
      if (res.data?.success && res.data.data) {
        setSettings({
          referrerBonusRupees: res.data.data.referrerBonusRupees ?? 100,
          refereeBonusRupees: res.data.data.refereeBonusRupees ?? 100,
          description: res.data.data.description || '',
          isActive: res.data.data.isActive ?? true,
          loading: false
        });
      }
    } catch (err) {
      console.warn('Could not fetch public referral settings, using defaults');
      setSettings(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <ReferralSettingContext.Provider value={{ ...settings, refreshSettings: fetchSettings }}>
      {children}
    </ReferralSettingContext.Provider>
  );
};

export const useReferralSetting = () => useContext(ReferralSettingContext);
