import React from 'react';
import { ComponenteCurricular, Editor } from '../types';
import { 
  Calculator, Atom, FlaskConical, Dna, Microscope, 
  History, Globe, SpellCheck, Library, Languages, 
  MessageCircle, Palette, Dumbbell, Brain, Users, 
  Heart, Baby, School, Sparkles, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  selectedComponente: ComponenteCurricular;
  onSelectComponente: (componente: ComponenteCurricular) => void;
  editors: Editor[];
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const componentIcons: Record<ComponenteCurricular, React.ComponentType<{ className?: string }>> = {
  'Matemática': Calculator,
  'Física': Atom,
  'Química': FlaskConical,
  'Biologia': Dna,
  'Ciências': Microscope,
  'História': History,
  'Geografia': Globe,
  'Língua Portuguesa': SpellCheck,
  'Literatura': Library,
  'Inglês': Languages,
  'Espanhol': MessageCircle,
  'Artes': Palette,
  'Educação Física': Dumbbell,
  'Filosofia': Brain,
  'Sociologia': Users,
  'Ensino Religioso': Heart,
  'Educação Infantil': Baby,
  'Anos Iniciais': School,
  'Outros': Sparkles
};

export default function Sidebar({
  selectedComponente,
  onSelectComponente,
  editors,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  // Calculate count of editors for each component
  const getCountForComponente = (comp: ComponenteCurricular) => {
    return editors.filter(e => e.componentes.includes(comp)).length;
  };

  const componentesList: ComponenteCurricular[] = [
    'Matemática', 'Física', 'Química', 'Biologia', 'Ciências',
    'História', 'Geografia', 'Língua Portuguesa', 'Literatura',
    'Inglês', 'Espanhol', 'Artes', 'Educação Física', 'Filosofia',
    'Sociologia', 'Ensino Religioso', 'Educação Infantil', 'Anos Iniciais', 'Outros'
  ];

  return (
    <>
      {/* Mobile drawer backdrop */}
      {isMobileOpen && (
        <div 
          id="sidebar-overlay"
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        id="sidebar-container"
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-4.5rem)] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-xs">
              ED
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-sm block">
                Portal de Editores
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                Educação Didática
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-mono">
            {componentesList.length} total
          </span>
        </div>

        {/* Scrollable Menu of components */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-1">
            Disciplinas
          </p>
          {componentesList.map((comp) => {
            const Icon = componentIcons[comp];
            const isSelected = selectedComponente === comp;
            const count = getCountForComponente(comp);

            return (
              <button
                key={comp}
                id={`sidebar-item-${comp.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => {
                  onSelectComponente(comp);
                  setIsMobileOpen(false); // close drawer on mobile
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm font-medium transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 shadow-2xs font-semibold'
                    : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'
                  }`} />
                  <span className="truncate">{comp}</span>
                </div>
                
                <span className={`text-[10px] ml-2 px-1.5 py-0.5 rounded-md font-bold font-mono transition-colors ${
                  isSelected 
                    ? 'bg-blue-100 text-blue-800' 
                    : count > 0 
                      ? 'bg-slate-100 text-slate-600 group-hover:bg-slate-200' 
                      : 'bg-transparent text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/55 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300/40 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
              GE
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-slate-900 truncate">Gestor Editorial</p>
              <p className="text-[10px] text-slate-500 truncate">Unidade São Paulo</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
