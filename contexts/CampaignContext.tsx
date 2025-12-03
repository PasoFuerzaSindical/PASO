
import React, { createContext, useContext, ReactNode, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { CampaignPhase } from '../lib/campaignGems';

interface CampaignContextType {
  campaignPhase: CampaignPhase;
  setCampaignPhase: (phase: CampaignPhase) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaignPhase, setCampaignPhase] = useLocalStorage<CampaignPhase>('paso-campaign-phase', 'Llegada');

  const value = { campaignPhase, setCampaignPhase };

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
