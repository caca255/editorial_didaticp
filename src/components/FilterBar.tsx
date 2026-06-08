import React from 'react';
import { Service } from '../types';
import { Search, RotateCcw, Star, Check } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedServices: Service[];
  toggleService: (service: Service) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  onClearFilters: () => void;
}

const servicesList: Service[] = [
  'Edição de Conteúdo',
  'Leitura Crítica',
  'Leitura Técnica',
  'Autoria',
  'Elaboração de Itens'
];

export const SERVICE_THEMES: Record<Service, { emoji: string; color: string; border: string; bg: string; text: string }> = {
  'Edição de Conteúdo': { emoji: '🟣', color: '#d3e', border: 'border-purple-200', bg: 'bg-purple-50 hover:bg-purple-100', text: 'text-purple-700' },
  'Leitura Crítica': { emoji: '🔵', color: '#256', border: 'border-blue-200', bg: 'bg-blue-50 hover:bg-blue-100', text: 'text-blue-700' },
  'Leitura Técnica': { emoji: '🟡', color: '#f59', border: 'border-amber-200', bg: 'bg-amber-50 hover:bg-amber-100', text: 'text-amber-700' },
  'Autoria': { emoji: '🔴', color: '#dc2', border: 'border-red-200', bg: 'bg-red-50 hover:bg-red-100', text: 'text-red-750' },
  'Elaboração de Itens': { emoji: '🟢', color: '#16a', border: 'border-emerald-250', bg: 'bg-emerald-50 hover:bg-emerald-100', text: 'text-emerald-700' }
};

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedServices,
  toggleService,
  minRating,
  setMinRating,
  onClearFilters
}: FilterBarProps) {
  const isAnyFilterActive = searchQuery !== '' || selectedServices.length > 0 || minRating > 0;

  return (
    <div 
      id="filter-bar-container"
      className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs mb-6 space-y-4"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="search-editors-input"
            type="text"
            placeholder="Buscar editor por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Rating selection with stars */}
        <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto whitespace-nowrap self-stretch">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Nota Mínima:
          </span>
          <div className="flex space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 text-sm">
            {[0, 4.0, 4.5, 4.8].map((val) => {
              const isSelected = minRating === val;
              return (
                <button
                  key={val}
                  id={`rating-filter-${val}`}
                  onClick={() => setMinRating(val)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200/50 font-bold'
                      : 'text-slate-655 hover:text-slate-900 font-medium'
                  }`}
                >
                  {val === 0 ? (
                    'Qualquer'
                  ) : (
                    <span className="flex items-center space-x-1">
                      <span>{val.toFixed(1)}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="text-slate-400">+</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear Filters Button */}
        {isAnyFilterActive && (
          <button
            id="clear-filters-btn"
            onClick={onClearFilters}
            className="flex items-center space-x-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100/75 px-3 py-1.5 rounded-lg border border-rose-150 transition-colors w-full md:w-auto justify-center cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>
        )}
      </div>

      {/* Services Filter Chips */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 font-sans">
          Filtrar por Serviço Prestado:
        </p>
        <div className="flex flex-wrap gap-2">
          {servicesList.map((service) => {
            const isSelected = selectedServices.includes(service);
            const theme = SERVICE_THEMES[service];

            return (
              <button
                key={service}
                id={`filter-service-${service.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => toggleService(service)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-medium border cursor-pointer select-none transition-all ${
                  isSelected
                    ? 'ring-2 ring-blue-500 ring-offset-1 border-transparent bg-blue-50 text-slate-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-650 hover:border-slate-350 hover:text-slate-905'
                }`}
                style={isSelected ? { backgroundColor: `${theme.color}15` } : {}}
              >
                <span className="text-sm">{theme.emoji}</span>
                <span className="text-slate-750">{service}</span>
                {isSelected && (
                  <span className="p-0.5 bg-slate-900 text-white rounded-full">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
