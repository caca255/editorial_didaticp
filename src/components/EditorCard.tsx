import React, { useState } from 'react';
import { Editor, Service, ComponenteCurricular } from '../types';
import { SERVICE_THEMES } from './FilterBar';
import { Star, Mail, Phone, MessageSquarePlus, Edit3, Trash2, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditorCardProps {
  key?: string;
  editor: Editor;
  onEdit: (editor: Editor) => void;
  onDelete: (id: string) => void;
  onAddCommentClick: (editor: Editor) => void;
}

export default function EditorCard({
  editor,
  onEdit,
  onDelete,
  onAddCommentClick,
}: EditorCardProps) {
  const [showAllComments, setShowAllComments] = useState(false);

  // Take the most recent comment
  const latestComment = editor.comments && editor.comments.length > 0 
    ? editor.comments[0] 
    : null;

  // Render yellow stars based on numeric rating
  const renderStars = (numRating: number) => {
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.3; // Show half star if rating is .3 to .8
    const starsArray = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsArray.push(
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        starsArray.push(
          <div key={i} className="relative inline-block shrink-0">
            <Star className="w-4 h-4 text-slate-200" />
            <div className="absolute top-0 left-0 w-[50%] overflow-hidden">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        starsArray.push(
          <Star key={i} className="w-4 h-4 text-slate-200 shrink-0" />
        );
      }
    }
    return starsArray;
  };

  // Extract Initials for placeholder avatar
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  // Color generator for avatar based on editor ID or name
  const getRandomBgColor = (name: string) => {
    const colors = [
      'bg-indigo-600', 'bg-emerald-600', 'bg-pink-600', 
      'bg-sky-600', 'bg-violet-600', 'bg-amber-600', 
      'bg-teal-600', 'bg-rose-600'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <div 
      id={`editor-card-${editor.id}`}
      className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full group"
    >
      {/* Top Details & Metadata */}
      <div className="p-5 md:p-6 flex-1">
        <div className="flex items-start justify-between gap-3">
          {/* Avatar and Essential details */}
          <div className="flex items-center space-x-4">
            {editor.avatarUrl ? (
              <img
                src={editor.avatarUrl}
                alt={editor.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-slate-100"
              />
            ) : (
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0 border-2 border-slate-100 ${getRandomBgColor(editor.name)}`}>
                {getInitials(editor.name)}
              </div>
            )}
            
            <div>
              <h3 className="font-bold text-slate-900 text-base md:text-lg group-hover:text-blue-600 transition-colors">
                {editor.name}
              </h3>
              
              {/* Star Rating visualization */}
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="text-sm font-bold text-slate-800 font-mono">
                  {editor.rating.toFixed(1)}
                </span>
                <div className="flex">
                  {renderStars(editor.rating)}
                </div>
                <span className="text-xs text-slate-400">
                  ({editor.comments?.length || 0} avaliações)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Admin Actions (Edit / Delete) */}
          <div className="flex items-center space-x-1">
            <button
              id={`edit-editor-btn-${editor.id}`}
              onClick={() => onEdit(editor)}
              title="Editar Cadastro"
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-55 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              id={`delete-editor-btn-${editor.id}`}
              onClick={() => {
                if (window.confirm(`Tem certeza que deseja excluir o cadastro de ${editor.name}?`)) {
                  onDelete(editor.id);
                }
              }}
              title="Excluir Editor"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact info row */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3.5">
          <div className="flex items-center space-x-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{editor.email}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{editor.phone}</span>
          </div>
        </div>

        {/* Professional Bio */}
        {editor.bio && (
          <p className="mt-3.5 text-xs text-slate-600 leading-relaxed line-clamp-3">
            {editor.bio}
          </p>
        )}

        {/* Colored Services Badges (Multi-selection on top of card) */}
        <div className="mt-4 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Serviços Prestados:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {editor.services.map((service) => {
              const theme = SERVICE_THEMES[service] || { emoji: '📌', color: '#64748b', border: 'border-slate-200', bg: 'bg-slate-50', text: 'text-slate-600' };
              return (
                <span
                  key={service}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${theme.bg} ${theme.border} ${theme.text}`}
                >
                  <span>{theme.emoji}</span>
                  <span>{service}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Curricular Components tags */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Disciplinas de Atuação:
          </p>
          <div className="flex flex-wrap gap-1">
            {editor.componentes.map((comp) => (
              <span
                key={comp}
                className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Review Section */}
      <div className="border-t border-slate-150 bg-slate-50 rounded-b-2xl p-5 flex flex-col space-y-3 justify-end">
        {latestComment ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 uppercase tracking-tight">
                Comentário mais recente:
              </span>
              <span className="text-slate-400 flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(latestComment.createdAt).toLocaleDateString('pt-BR')}</span>
              </span>
            </div>
            
            {/* Elegant Quotation block */}
            <div className="bg-white border-l-4 border-blue-500 rounded-r-lg p-3 text-xs italic text-slate-600 block relative">
              <p className="line-clamp-3">"{latestComment.text}"</p>
              <div className="mt-2 flex items-center justify-between font-normal not-italic text-[10px] text-slate-400">
                <span className="font-semibold text-slate-500">{latestComment.authorName}</span>
                <span className="flex items-center space-x-0.5">
                  <span>Nota dada: {latestComment.rating}</span>
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 text-center text-xs text-slate-400 italic">
            Sem comentários registrados. Seja o primeiro a avaliar!
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Toggle read more if multi comments */}
          {editor.comments && editor.comments.length > 1 ? (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              <span>{showAllComments ? 'Ocultar anteriores' : `Ver histórico (${editor.comments.length})`}</span>
              {showAllComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          ) : (
            <div className="text-xs text-slate-400">Canal único</div>
          )}

          <button
            id={`add-comment-btn-${editor.id}`}
            onClick={() => onAddCommentClick(editor)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-blue-500" />
            <span>Avaliar</span>
          </button>
        </div>

        {/* Render rest of evaluations inside full dynamic collapse */}
        <AnimatePresence>
          {showAllComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-2.5 pt-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Avaliações anteriores:
              </p>
              {editor.comments.slice(1).map((comment) => (
                <div key={comment.id} className="bg-white/80 border border-slate-100 rounded-lg p-2.5 text-[11px] text-slate-600">
                  <p className="italic">"{comment.text}"</p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-500">{comment.authorName}</span>
                    <div className="flex items-center space-x-1">
                      <span>{comment.rating}</span>
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span className="ml-1 text-slate-300">|</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
