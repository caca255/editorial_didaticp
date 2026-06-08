import React, { useState, useEffect } from 'react';
import { Editor, Comment } from '../types';
import { X, Star, CheckCheck } from 'lucide-react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  onSaveComment: (editorId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

export default function CommentModal({
  isOpen,
  onClose,
  editor,
  onSaveComment
}: CommentModalProps) {
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAuthorName('');
    setRating(5);
    setText('');
    setError('');
  }, [editor, isOpen]);

  if (!isOpen || !editor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!authorName.trim()) {
      setError('Por favor, informe seu nome ou departamento.');
      return;
    }
    if (!text.trim() || text.length < 5) {
      setError('Por favor, escreva um comentário de pelo menos 5 caracteres.');
      return;
    }

    onSaveComment(editor.id, {
      authorName: authorName.trim(),
      rating,
      text: text.trim()
    });

    onClose();
  };

  return (
    <div 
      id="comment-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div 
        id="comment-modal-content"
        className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col p-5 md:p-6"
      >
        {/* Header section */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Avaliar Editor
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Deixe seu feedback sobre <strong className="text-blue-600">{editor.name}</strong>
            </p>
          </div>
          <button
            id="close-comment-modal-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Evaluation input form */}
        <form id="comment-modal-form" onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs px-3.5 py-2.5 rounded-lg font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Star selector */}
          <div className="flex flex-col items-center justify-center py-2 bg-slate-50 border border-slate-200/50 rounded-xl space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sua nota para o serviço:
            </span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((starNum) => {
                const isSelected = starNum <= rating;
                return (
                  <button
                    key={starNum}
                    type="button"
                    onClick={() => setRating(starNum)}
                    className="transform hover:scale-125 transition-transform text-2xl text-amber-400 cursor-pointer"
                  >
                    {isSelected ? '★' : '☆'}
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-slate-700">
              {rating === 5 ? 'Excelente (5/5)' : 
               rating === 4 ? 'Muito Bom (4/5)' :
               rating === 3 ? 'Bom (3/5)' :
               rating === 2 ? 'Regular (2/5)' : 'Ruim (1/5)'}
            </span>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seu Nome ou Empresa/Departamento *
            </label>
            <input
              id="input-comment-author"
              type="text"
              placeholder="Ex: Editora Horizonte / Coord. João"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-slate-800"
            />
          </div>

          {/* Comment text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Comentário sobre a experiência *
            </label>
            <textarea
              id="input-comment-text"
              rows={3}
              placeholder="Descreva brevemente sobre a entrega do editor, qualidade gramatical, conformidade técnica com o componente, etc."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none text-slate-800"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg shadow-xs shadow-blue-150 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Registrar Nota</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
