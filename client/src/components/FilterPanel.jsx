import React from 'react';
import { Search, Filter, X, Check, RotateCcw } from 'lucide-react';
import { FEATURE_CONFIG } from './FeatureChecklist';
import { usePreferences } from '../context/PreferencesContext';

export const FilterPanel = ({
  search,
  setSearch,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  areas = [],
  selectedArea,
  setSelectedArea,
  organizations = [],
  selectedOrganization,
  setSelectedOrganization,
  selectedSector,
  setSelectedSector,
  selectedStatus,
  setSelectedStatus,
  featureFilters,
  setFeatureFilters,
  sortBy,
  setSortBy,
  onReset
}) => {
  const { t, translateCategory, translateFeature } = usePreferences();

  const toggleFeature = (key) => {
    setFeatureFilters((prev) => ({
      ...prev,
      [key]: prev[key] === 'AVAILABLE' ? '' : 'AVAILABLE'
    }));
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(selectedCategory) ||
    Boolean(selectedArea) ||
    Boolean(selectedOrganization) ||
    Boolean(selectedSector) ||
    Boolean(selectedStatus) ||
    Object.values(featureFilters).some(Boolean) ||
    sortBy !== 'recent';

  return (
    <div className="bg-white rounded-2xl p-5 border border-empoway-blush/60 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-empoway-coffee flex items-center gap-2">
          <Filter className="w-4 h-4 text-empoway-terracotta" />
          {t('filterPlaces')}
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-empoway-terracotta hover:text-empoway-terracotta-dark flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('clearAll')}
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div>
        <label className="block text-xs font-semibold text-empoway-coffee mb-1.5">
          {t('searchByNameOrArea')}
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-empoway-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchExplorePlaceholder')}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee placeholder:text-empoway-muted/70 focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-empoway-muted hover:text-empoway-coffee"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-empoway-coffee mb-1.5">
          {t('category')}
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full py-2 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta transition-all"
        >
          <option value="">{t('allCategories')} ({categories.length})</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {translateCategory(cat.slug || cat.name) || cat.name} ({cat.placeCount || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Colombo Area Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-empoway-coffee mb-1.5">
          {t('colomboDistrict', 'Colombo Area')}
        </label>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="w-full py-2 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta transition-all"
        >
          <option value="">{t('allAreas', 'All Colombo Areas')} ({areas.length})</option>
          {areas.map((a) => {
            const areaName = typeof a === 'string' ? a : a.name;
            const count = typeof a === 'object' && a.totalPlaces ? ` (${a.totalPlaces})` : '';
            return (
              <option key={areaName} value={areaName}>
                {areaName}{count}
              </option>
            );
          })}
        </select>
      </div>

      {/* Parent Organization Filter */}
      {organizations.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-empoway-coffee mb-1.5">
            {t('parentOrganization', 'Parent Organization')}
          </label>
          <select
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta transition-all"
          >
            <option value="">{t('allOrganizations', 'All Organizations')} ({organizations.length})</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.branchCount || 0} branches)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sector Filter */}
      <div>
        <label className="block text-xs font-semibold text-empoway-coffee mb-1.5">
          {t('sector', 'Sector')}
        </label>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: '', label: 'All' },
            { id: 'public', label: 'Public' },
            { id: 'private', label: 'Private' }
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSelectedSector(selectedSector === sec.id ? '' : sec.id)}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all ${
                selectedSector === sec.id
                  ? 'border-empoway-terracotta bg-empoway-cream text-empoway-terracotta shadow-xs'
                  : 'border-empoway-blush/60 bg-empoway-ivory text-empoway-coffee hover:bg-empoway-cream/40'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Status */}
      <div>
        <label className="block text-xs font-semibold text-empoway-coffee mb-2">
          {t('infoStatus')}
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {[
            { id: '', label: t('allStatuses') },
            { id: 'VERIFIED', label: t('verified'), color: 'text-emerald-700 bg-emerald-50' },
            { id: 'COMMUNITY_REPORTED', label: t('communityReported'), color: 'text-amber-800 bg-amber-50' },
            { id: 'NOT_YET_ASSESSED', label: t('notYetAssessed', 'Not Yet Assessed'), color: 'text-slate-700 bg-slate-100' },
            { id: 'UNKNOWN', label: t('unknown'), color: 'text-stone-700 bg-stone-100' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedStatus(item.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${
                selectedStatus === item.id
                  ? 'border-empoway-terracotta bg-empoway-cream text-empoway-terracotta font-bold shadow-xs'
                  : 'border-transparent hover:bg-empoway-cream/40 text-empoway-coffee'
              }`}
            >
              <span>{item.label}</span>
              {selectedStatus === item.id && <Check className="w-3.5 h-3.5 text-empoway-terracotta" />}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Feature Filters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-empoway-coffee">
            {t('physicalFeaturesTitle')}
          </label>
          <span className="text-[10px] text-empoway-muted font-normal">
            {t('available')}
          </span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {FEATURE_CONFIG.map((f) => {
            const isChecked = featureFilters[f.key] === 'AVAILABLE';
            const Icon = f.icon;
            const labelText = t(f.key) || f.label;
            return (
              <label
                key={f.key}
                onClick={() => toggleFeature(f.key)}
                className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                  isChecked
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-semibold'
                    : 'bg-empoway-ivory border-empoway-blush/60 text-empoway-coffee hover:bg-empoway-cream/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isChecked ? 'text-emerald-700' : 'text-empoway-muted'}`} />
                  <span className="text-[11px]">{labelText}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    isChecked
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-empoway-blush bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sorting */}
      <div>
        <label className="block text-xs font-semibold text-empoway-coffee mb-1.5">
          {t('sortBy')}
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full py-2 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta transition-all"
        >
          <option value="recent">{t('mostRecent')}</option>
          <option value="personal_match">⚡ Best Match for My Profile</option>
          <option value="transit_connectivity">🚆 Best Transit Connection</option>
          <option value="verified">{t('verified')}</option>
          <option value="score">{t('highestScore')}</option>
          <option value="name_asc">{t('nameAZ')}</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
