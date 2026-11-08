import React from 'react';
import { ShieldCheck, Users, HelpCircle, AlertCircle, Clock } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export const StatusBadge = ({ status, size = 'md', showDescription = false }) => {
  const { t, translateStatus } = usePreferences();
  const normStatus = (status || 'UNKNOWN').toUpperCase();

  const configs = {
    VERIFIED: {
      labelKey: 'verified',
      defaultLabel: 'VERIFIED',
      icon: ShieldCheck,
      descKey: 'auditedAndConfirmed',
      defaultDesc: 'Physically assessed & verified',
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-600/20',
      iconClass: 'text-emerald-700',
      dotClass: 'bg-emerald-600'
    },
    COMMUNITY_REPORTED: {
      labelKey: 'communityReported',
      defaultLabel: 'COMMUNITY REPORTED',
      icon: Users,
      descKey: 'crowdsourcedInsights',
      defaultDesc: 'Submitted by community, unverified',
      classes: 'bg-amber-50 text-amber-900 border-amber-300 ring-amber-600/20',
      iconClass: 'text-amber-700',
      dotClass: 'bg-amber-500'
    },
    NOT_YET_ASSESSED: {
      labelKey: 'notYetAssessed',
      defaultLabel: 'NOT YET ASSESSED',
      icon: Clock,
      descKey: 'directoryPlaceUnassessed',
      defaultDesc: 'Listed in Colombo Directory • Awaiting physical audit',
      classes: 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-400/20',
      iconClass: 'text-slate-500',
      dotClass: 'bg-slate-400'
    },
    UNKNOWN: {
      labelKey: 'unknown',
      defaultLabel: 'UNKNOWN',
      icon: HelpCircle,
      descKey: 'awaitingAudit',
      defaultDesc: 'Insufficient data available',
      classes: 'bg-stone-100 text-stone-700 border-stone-300 ring-stone-500/20',
      iconClass: 'text-stone-500',
      dotClass: 'bg-stone-400'
    }
  };

  const config = configs[normStatus] || configs.UNKNOWN;
  const Icon = config.icon;
  const label = t(config.labelKey, config.defaultLabel);
  const desc = t(config.descKey, config.defaultDesc);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold'
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <span
        className={`inline-flex items-center rounded-full border shadow-xs tracking-wide ${config.classes} ${sizeClasses[size]}`}
        title={desc}
      >
        <Icon className={`w-3.5 h-3.5 shrink-0 ${config.iconClass}`} />
        <span>{label}</span>
      </span>
      {showDescription && (
        <span className="text-[11px] text-empoway-muted font-normal italic">
          {desc}
        </span>
      )}
    </div>
  );
};

export const DemoDataBadge = ({ size = 'sm' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md bg-empoway-cream border border-empoway-champagne text-empoway-coffee font-medium ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
      title="This record is part of the initial Colombo Pilot demonstration dataset."
    >
      <AlertCircle className="w-3 h-3 text-empoway-caramel shrink-0" />
      <span>Demonstration Pilot Record</span>
    </span>
  );
};

export default StatusBadge;
