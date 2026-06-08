import React, { useState, useEffect } from 'react';
import { Editor, Service, ComponenteCurricular, Comment } from './types';
import { INITIAL_EDITORS, ALL_COMPONENTS } from './mockData';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import EditorCard from './components/EditorCard';
import EditorModal from './components/EditorModal';
import CommentModal from './components/CommentModal';
import { 
  UserPlus, NotebookTabs, Compass, Award, 
  HelpCircle, Sparkles, SlidersHorizontal, LogOut, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'catalogo_editores_data_v1';

export default function App() {
  // State for all editors
  const [editors, setEditors] = useState<Editor[]>([]);

  // Selection states
  const [selectedComponente, setSelectedComponente] = useState<ComponenteCurricular>('Matemática');
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [minRating, setMinRating] = useState<number>(0);

  // Responsive Drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal control states
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editorToEdit, setEditorToEdit] = useState<Editor | null>(null);
  
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [editorToReview, setEditorToReview] = useState<Editor | null>(null);

  // Operation alert notifications
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // 1. Load initial data from localStorage or fallback to standard presets
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setEditors(JSON.parse(savedData));
      } catch (err) {
        console.error('Failed to parse localStorage data, utilizing defaults', err);
        setEditors(INITIAL_EDITORS);
      }
    } else {
      setEditors(INITIAL_EDITORS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EDITORS));
    }
  }, []);

  // Save changes to storage whenever editors change
  const saveToStorage = (updatedEditors: Editor[]) => {
    setEditors(updatedEditors);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEditors));
  };

  // Trigger brief alert confirmation banner
  const triggerAlert = (text: string, type: 'success' | 'info' = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  // 2. Filter actions
  const toggleServiceFilter = (service: Service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedServices([]);
    setMinRating(0);
    triggerAlert('Filtros redefinidos com sucesso.', 'info');
  };

  // 3. Database operations (CRUD)
  
  // ADD or EDIT editor
  const handleSaveEditor = (formData: any) => {
    if (formData.id) {
      // EDIT existing editor
      const updated = editors.map(editor => {
        if (editor.id === formData.id) {
          return {
            ...editor,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
            avatarUrl: formData.avatarUrl,
            componentes: formData.componentes,
            services: formData.services
          };
        }
        return editor;
      });
      saveToStorage(updated);
      triggerAlert(`Cadastro de ${formData.name} atualizado com sucesso!`);
    } else {
      // CREATE new editor
      const newComment: Comment = {
        id: `c-${Date.now()}`,
        authorName: formData.initialCommentAuthor || 'Coordenação',
        rating: formData.initialCommentRating || 5,
        text: formData.initialCommentText || 'Cadastro inicial realizado sem feedbacks anteriores.',
        createdAt: new Date().toISOString()
      };

      const newEditor: Editor = {
        id: `editor-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio || undefined,
        avatarUrl: formData.avatarUrl || undefined,
        componentes: formData.componentes,
        services: formData.services,
        rating: newComment.rating,
        comments: [newComment]
      };

      saveToStorage([newEditor, ...editors]);
      triggerAlert(`Editor(a) ${formData.name} cadastrado(a) com sucesso!`);
      
      // Auto switch view to the first checked discipline for easy verification
      if (formData.componentes.length > 0 && !formData.componentes.includes(selectedComponente)) {
        setSelectedComponente(formData.componentes[0] as ComponenteCurricular);
      }
    }
    setEditorToEdit(null);
  };

  // DELETE editor
  const handleDeleteEditor = (id: string) => {
    const editorName = editors.find(e => e.id === id)?.name || 'Profissional';
    const updated = editors.filter(e => e.id !== id);
    saveToStorage(updated);
    triggerAlert(`Cadastro de ${editorName} removido do catálogo.`, 'info');
  };

  // ADD comment / rating review
  const handleSaveComment = (editorId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorName: commentData.authorName,
      rating: commentData.rating,
      text: commentData.text,
      createdAt: new Date().toISOString()
    };

    const updated = editors.map(editor => {
      if (editor.id === editorId) {
        const updatedComments = [newComment, ...(editor.comments || [])];
        // Recalculate average rating
        const sum = updatedComments.reduce((acc, c) => acc + c.rating, 0);
        const avg = Math.round((sum / updatedComments.length) * 10) / 10;

        return {
          ...editor,
          comments: updatedComments,
          rating: avg
        };
      }
      return editor;
    });

    saveToStorage(updated);
    const editorName = editors.find(e => e.id === editorId)?.name || '';
    triggerAlert(`Obrigado! Sua avaliação para ${editorName} foi registrada.`);
    setEditorToReview(null);
  };

  // Open edit modal
  const handleEditClick = (editor: Editor) => {
    setEditorToEdit(editor);
    setIsEditorModalOpen(true);
  };

  // Open review modal
  const handleAddCommentClick = (editor: Editor) => {
    setEditorToReview(editor);
    setIsCommentModalOpen(true);
  };

  // 4. Filtering computation
  const filteredEditors = editors.filter(editor => {
    // A. Must belong to selected Componente (discipline tab)
    const matchesComponente = editor.componentes.includes(selectedComponente);
    if (!matchesComponente) return false;

    // B. Search Query filter (matches name)
    const matchesSearch = editor.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // C. Rating threshold filter
    if (minRating > 0 && editor.rating < minRating) return false;

    // D. Service filter (editor must offer ALL selected services)
    if (selectedServices.length > 0) {
      const matchesServices = selectedServices.every(srv => editor.services.includes(srv));
      if (!matchesServices) return false;
    }

    return true;
  });

  return (
    <div id="app-root-layout" className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      
      {/* Dynamic Toast Alerts */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            id="toast-notification-banner"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{alertMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Corporate Header */}
      <header id="main-header" className="bg-slate-900 text-white sticky top-0 z-30 shadow-xs border-b border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo and Subtitle */}
          <div className="flex items-center space-x-3">
            {/* Hamburger for mobile drawer navigation */}
            <button
              id="mobile-hamburger-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 mr-1 hover:bg-slate-800 rounded-lg lg:hidden transition-colors cursor-pointer"
              title="Menu de Componentes"
            >
              <SlidersHorizontal className="w-5 h-5 text-blue-400" />
            </button>

            <span className="p-2 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <NotebookTabs className="w-5 h-5 text-white" />
            </span>
            <div>
              <h1 className="font-bold text-base sm:text-lg tracking-tight hover:text-blue-100 transition-colors">
                Catálogo de Editores de Material Didático
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide prose uppercase hidden sm:block">
                Editoria Pedagógica & Homologações
              </p>
            </div>
          </div>

          {/* Quick Stats & Action to add new professional */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2.5 text-xs bg-slate-950 border border-slate-800/80 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300">
                <strong className="text-white">{editors.length}</strong> Editores no banco
              </span>
            </div>

            <button
              id="register-editor-btn"
              onClick={() => {
                setEditorToEdit(null);
                setIsEditorModalOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold py-2 p-3 sm:px-4 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-blue-500"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Cadastrar Editor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div id="workspace-container" className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row relative">
        
        {/* Fixed Left Sidebar Drawer */}
        <Sidebar
          selectedComponente={selectedComponente}
          onSelectComponente={(comp) => {
            setSelectedComponente(comp);
            triggerAlert(`Navegando para o Painel de ${comp}`, 'info');
          }}
          editors={editors}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Primary Content Canvas */}
        <main id="main-content-canvas" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* Active Discipline Header bar */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-5 md:p-6 text-white mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-blue-400 bg-blue-950/55 px-2.5 py-1 rounded-full border border-blue-800/30">
                Componente Ativo
              </span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1.5 font-sans">
                Editores de {selectedComponente}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">
                Profissionais qualificados para avaliar, editar, revisar ou propor sequências didáticas e itens do componente curricular de {selectedComponente}.
              </p>
            </div>

            <div className="bg-slate-850/80 border border-slate-700/30 rounded-xl px-4 py-2.5 text-center self-start md:self-auto shrink-0 font-medium">
              <p className="text-xs text-slate-400">Total na disciplina</p>
              <p className="text-xl font-bold text-white">
                {editors.filter(e => e.componentes.includes(selectedComponente)).length}
              </p>
            </div>
          </div>

          {/* Filtering Subsystem */}
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedServices={selectedServices}
            toggleService={toggleServiceFilter}
            minRating={minRating}
            setMinRating={setMinRating}
            onClearFilters={handleClearFilters}
          />

          {/* Grid of Active Editors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider pb-1">
              <span>Resultado da busca:</span>
              <span>
                {filteredEditors.length === 1 
                  ? '1 editor localizado' 
                  : `${filteredEditors.length} editores localizados`
                }
              </span>
            </div>

            {filteredEditors.length > 0 ? (
              <div 
                id="editors-list-grid"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredEditors.map((editor) => (
                  <EditorCard
                    key={editor.id}
                    editor={editor}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteEditor}
                    onAddCommentClick={handleAddCommentClick}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search State */
              <div 
                id="empty-editors-view"
                className="bg-white border border-slate-200 rounded-2xl p-10 md:p-16 text-center shadow-2xs flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border border-slate-200">
                  <Compass className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-850 text-base md:text-lg">
                    Nenhum editor localizado com estes critérios
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Não encontramos resultados na disciplina <strong>{selectedComponente}</strong> {
                      (searchQuery || selectedServices.length > 0 || minRating > 0) 
                        ? 'com os filtros aplicados neste momento. Experimente limpar ou reescrever a busca.' 
                        : 'cadastrado de forma padrão. Clique em "Cadastrar Editor" para incluir o primeiro profissional!'
                    }
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2 justify-center">
                  {(searchQuery || selectedServices.length > 0 || minRating > 0) && (
                    <button
                      id="empty-clear-btn"
                      onClick={handleClearFilters}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg cursor-pointer"
                    >
                      Limpar Filtros
                    </button>
                  )}
                  <button
                    id="empty-add-editor-btn"
                    onClick={() => {
                      setEditorToEdit(null);
                      setIsEditorModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg shadow-xs cursor-pointer"
                  >
                    Cadastrar Novo Profissional em {selectedComponente}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Editor registration or edit modal dialog */}
      <EditorModal
        isOpen={isEditorModalOpen}
        onClose={() => {
          setIsEditorModalOpen(false);
          setEditorToEdit(null);
        }}
        onSave={handleSaveEditor}
        editorToEdit={editorToEdit}
      />

      {/* Comment / review score submission modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => {
          setIsCommentModalOpen(false);
          setEditorToReview(null);
        }}
        editor={editorToReview}
        onSaveComment={handleSaveComment}
      />

      {/* Simple Professional footer */}
      <footer id="app-footer" className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Editora Didática. Catálogo unificado de disciplinas escolares com base na BNCC.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Políticas de Revisão</a>
            <a href="#" className="hover:text-white transition-colors">Suporte Pedagógico</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
