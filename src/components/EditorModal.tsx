import React, { useState, useEffect } from 'react';
import { Editor, Service, ComponenteCurricular } from '../types';
import { ALL_COMPONENTS, ALL_SERVICES } from '../mockData';
import { SERVICE_THEMES } from './FilterBar';
import { X, Check, BookOpen, Layers, PhoneCall, MailOpen, UserRound, ArrowRight } from 'lucide-react';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (editorData: Omit<Editor, 'id' | 'rating' | 'comments'> & { id?: string; initialCommentText?: string; initialCommentAuthor?: string; initialCommentRating?: number }) => void;
  editorToEdit?: Editor | null;
}

export default function EditorModal({
  isOpen,
  onClose,
  onSave,
  editorToEdit
}: EditorModalProps) {
  // Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedComponentes, setSelectedComponentes] = useState<ComponenteCurricular[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  
  // States for optional initial comment (only when creating new editor)
  const [initialCommentText, setInitialCommentText] = useState('');
  const [initialCommentAuthor, setInitialCommentAuthor] = useState('');
  const [initialCommentRating, setInitialCommentRating] = useState(5);

  // Validation feedback
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editorToEdit) {
      setName(editorToEdit.name);
      setEmail(editorToEdit.email);
      setPhone(editorToEdit.phone);
      setBio(editorToEdit.bio || '');
      setAvatarUrl(editorToEdit.avatarUrl || '');
      setSelectedComponentes(editorToEdit.componentes);
      setSelectedServices(editorToEdit.services);
      
      // Clean comment state since editing existing ones doesn't modify historical comment directly through creation modal
      setInitialCommentText('');
      setInitialCommentAuthor('');
      setInitialCommentRating(5);
    } else {
      // Clear fields for new registration
      setName('');
      setEmail('');
      setPhone('');
      setBio('');
      setAvatarUrl('');
      setSelectedComponentes([]);
      setSelectedServices([]);
      setInitialCommentText('Fácil comunicação e cumprimento de cronogramas.');
      setInitialCommentAuthor('Coordenação Editorial');
      setInitialCommentRating(5);
    }
    setErrors({});
  }, [editorToEdit, isOpen]);

  if (!isOpen) return null;

  // Toggle helpers for multiple selection
  const handleToggleComponente = (comp: ComponenteCurricular) => {
    if (selectedComponentes.includes(comp)) {
      setSelectedComponentes(selectedComponentes.filter(c => c !== comp));
    } else {
      setSelectedComponentes([...selectedComponentes, comp]);
    }
  };

  const handleToggleService = (service: Service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSelectAllComponents = () => {
    if (selectedComponentes.length === ALL_COMPONENTS.length) {
      setSelectedComponentes([]);
    } else {
      setSelectedComponentes([...ALL_COMPONENTS] as ComponenteCurricular[]);
    }
  };

  // Basic Validation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nome completo é obrigatório.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'E-mail válido é obrigatório.';
    if (!phone.trim()) newErrors.phone = 'Telefone é obrigatório.';
    if (selectedComponentes.length === 0) newErrors.componentes = 'Selecione ao menos um componente curricular.';
    if (selectedServices.length === 0) newErrors.services = 'Selecione ao menos um serviço prestado.';

    if (!editorToEdit) {
      if (initialCommentText.trim() && !initialCommentAuthor.trim()) {
        newErrors.commentAuthor = 'Informe quem escreveu o comentário.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top of form
      const el = document.getElementById('modal-scroll-container');
      if (el) el.scrollTop = 0;
      return;
    }

    // Call onSave
    onSave({
      id: editorToEdit?.id,
      name,
      email,
      phone,
      bio,
      avatarUrl,
      componentes: selectedComponentes,
      services: selectedServices,
      ...(editorToEdit ? {} : {
        initialCommentText,
        initialCommentAuthor,
        initialCommentRating
      })
    });

    onClose();
  };

  return (
    <div 
      id="editor-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div 
        id="editor-modal-content"
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header bar */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {editorToEdit ? 'Editar Dados do Editor' : 'Cadastrar Novo Editor'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {editorToEdit 
                ? `Altere as informações profissionais de ${editorToEdit.name}` 
                : 'Preencha as informações para registrar o profissional no catálogo'
              }
            </p>
          </div>
          <button
            id="close-editor-modal-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form 
          onSubmit={handleFormSubmit} 
          className="flex-1 overflow-y-auto p-6 space-y-6"
          id="modal-scroll-container"
        >
          {errors.componentes && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs px-4 py-3 rounded-lg font-medium">
              ⚠️ {errors.componentes} ou {errors.services}
            </div>
          )}

          {/* Section 1: Informações de Contato */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UserRound className="w-3.5 h-3.5 text-blue-500" />
              <span>Dados Pessoais & Contato</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  id="input-editor-name"
                  type="text"
                  placeholder="Ex: Amanda Albuquerque Martins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full text-sm px-3.5 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-rose-300 focus:ring-rose-200' 
                      : 'border-slate-200 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                />
                {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
              </div>

              {/* Avatar opcional */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL da Foto de Perfil (Opcional)
                </label>
                <input
                  id="input-editor-avatar"
                  type="url"
                  placeholder="Ex: https://images.images.com/my-photo.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail de Contato *
                </label>
                <input
                  id="input-editor-email"
                  type="email"
                  placeholder="Ex: amanda.editora@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-sm px-3.5 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-rose-300 focus:ring-rose-200' 
                      : 'border-slate-200 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                />
                {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  id="input-editor-phone"
                  type="text"
                  placeholder="Ex: (11) 99999-8888"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full text-sm px-3.5 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.phone 
                      ? 'border-rose-300 focus:ring-rose-200' 
                      : 'border-slate-200 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                />
                {errors.phone && <p className="text-rose-500 text-[11px] mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Bio profissional */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minicurrículo / Bio Profissional (Opcional)
              </label>
              <textarea
                id="input-editor-bio"
                rows={2}
                placeholder="Ex: Graduada em Matemática com pós-graduação em Design Instrucional. Atua principalmente com leitura crítica de obras didáticas dos Anos Finais há 6 anos."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Section 2: Serviços Prestados (Múltipla Seleção) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Serviços Prestados *</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">(Seleção Múltipla)</span>
            </div>
            
            <p className="text-xs text-slate-500">
              Selecione todos os serviços didáticos que este editor está apto a prestar:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_SERVICES.map((srv) => {
                const service = srv as Service;
                const isSelected = selectedServices.includes(service);
                const theme = SERVICE_THEMES[service];

                return (
                  <button
                    key={service}
                    type="button"
                    id={`modal-service-toggle-${service.toLowerCase().replace(/ /g, '-')}`}
                    onClick={() => handleToggleService(service)}
                    className={`flex items-center space-x-3 p-2.5 rounded-lg border text-sm text-left font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 ring-1 ring-blue-500/30 font-semibold text-blue-900 bg-blue-50/40'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                    style={isSelected ? { backgroundColor: `${theme.color}10` } : {}}
                  >
                    <span className="text-lg">{theme.emoji}</span>
                    <span className="flex-1 text-slate-700 font-medium">{service}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.services && <p className="text-rose-500 text-[11px] mt-1">{errors.services}</p>}
          </div>

          {/* Section 3: Componentes Curriculares (Múltipla Seleção) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Componentes Curriculares / Disciplinas *</span>
              </h3>
              <button
                type="button"
                onClick={handleSelectAllComponents}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                {selectedComponentes.length === ALL_COMPONENTS.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </button>
            </div>
            
            <p className="text-xs text-slate-500">
              O editor ficará visível no catálogo destas disciplinas:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1.5 border border-slate-200 rounded-lg bg-slate-50">
              {ALL_COMPONENTS.map((compName) => {
                const comp = compName as ComponenteCurricular;
                const isSelected = selectedComponentes.includes(comp);

                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => handleToggleComponente(comp)}
                    className={`flex items-center justify-between p-2 rounded-md border text-xs text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{comp}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white text-blue-600 border-white' : 'border-slate-300 text-transparent'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.componentes && <p className="text-rose-500 text-[11px] mt-1">{errors.componentes}</p>}
          </div>

          {/* Section 4: Initial Review (Only on creation block) */}
          {!editorToEdit && (
            <div className="space-y-4 pt-4 border-t border-slate-100 bg-sky-50/40 p-4 rounded-xl border border-sky-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                <span className="text-sm">⭐</span>
                <span>Primeira Avaliação / Comentário de Teste (Sugestão)</span>
              </h3>
              <p className="text-xs text-sky-700">
                Adicione uma avaliação inicial caso queira testar a exibição da nota e comentário do editor de imediato.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Comment Text */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Comentário Didático
                  </label>
                  <input
                    type="text"
                    value={initialCommentText}
                    onChange={(e) => setInitialCommentText(e.target.value)}
                    placeholder="Ex: Excelente material didático entregue."
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none bg-white font-medium"
                  />
                </div>

                {/* Commenter Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={initialCommentAuthor}
                    onChange={(e) => setInitialCommentAuthor(e.target.value)}
                    placeholder="Ex: Coordenação"
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none bg-white font-medium"
                  />
                  {errors.commentAuthor && <p className="text-rose-500 text-[10px] mt-0.5">{errors.commentAuthor}</p>}
                </div>
              </div>

              {/* Comment Rating */}
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-slate-700">Nota da Avaliação:</span>
                <div className="flex space-x-1.5">
                  {[1, 2, 3, 4, 5].map((starsCount) => {
                    return (
                      <button
                        key={starsCount}
                        type="button"
                        onClick={() => setInitialCommentRating(starsCount)}
                        className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <span className="text-lg">
                          {starsCount <= initialCommentRating ? '★' : '☆'}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-slate-600">
                  {initialCommentRating} / 5 estrelas
                </span>
              </div>
            </div>
          )}
        </form>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={handleFormSubmit}
            className="flex items-center space-x-1.5 px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            <span>{editorToEdit ? 'Salvar Alterações' : 'Concluir Cadastro'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
