import { Editor } from './types';

export const INITIAL_EDITORS: Editor[] = [
  {
    id: 'editor-1',
    name: 'Ana Martins',
    email: 'ana.martins@editoradit.com',
    phone: '(11) 98765-4321',
    componentes: ['Matemática', 'Física', 'Ciências'],
    services: ['Edição de Conteúdo', 'Leitura Crítica', 'Elaboração de Itens'],
    rating: 4.6,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Especialista em exatas para o Ensino Fundamental II e Ensino Médio, com mais de 8 anos de experiência na produção editorial de coleções didáticas aprovadas pelo PNLD.',
    comments: [
      {
        id: 'c-1-1',
        authorName: 'Sérgio Ramos (Coord. FTC)',
        rating: 5,
        text: 'Boa experiência com material didático de Matemática. Entrega sempre no prazo com muito rigor conceitual.',
        createdAt: '2026-05-12T14:32:00Z'
      },
      {
        id: 'c-1-2',
        authorName: 'Patrícia Souza',
        rating: 4,
        text: 'Ótima autoria de itens, com foco na taxonomia de Bloom.',
        createdAt: '2026-04-10T09:15:00Z'
      }
    ]
  },
  {
    id: 'editor-2',
    name: 'Roberto Alencar',
    email: 'roberto.alencar@educa.net',
    phone: '(21) 97455-8812',
    componentes: ['História', 'Sociologia', 'Filosofia'],
    services: ['Autoria', 'Leitura Crítica'],
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Doutor em História Social. Atua com elaboração de textos de apoio inovadores e leitura crítica rigorosa sobre diversidade cultural e história do Brasil.',
    comments: [
      {
        id: 'c-2-1',
        authorName: 'Juliana Mendes',
        rating: 5,
        text: 'Didática fantástica na autoria de recursos didáticos para o Ensino Médio. Recomendo fortemente.',
        createdAt: '2026-06-02T16:40:00Z'
      }
    ]
  },
  {
    id: 'editor-3',
    name: 'Mariana Silva',
    email: 'mariana.silva@leituracritica.com',
    phone: '(31) 98822-4433',
    componentes: ['Língua Portuguesa', 'Literatura', 'Outros'],
    services: ['Leitura Crítica', 'Leitura Técnica', 'Edição de Conteúdo'],
    rating: 4.8,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    bio: 'Revisora gramatical e especialista em estilística literária. Atua há 10 anos lapidando textos didáticos e originais literários para grandes selos brasileiros.',
    comments: [
      {
        id: 'c-3-1',
        authorName: 'Gustavo Lima (Ed. Horizonte)',
        rating: 5,
        text: 'Excelente revisão técnica de literatura do século XIX para o material do Ensino Médio.',
        createdAt: '2026-05-29T10:05:00Z'
      }
    ]
  },
  {
    id: 'editor-4',
    name: 'Carlos Alberto Santos',
    email: 'carlos.santos@physics.com',
    phone: '(19) 99121-0022',
    componentes: ['Física', 'Química', 'Matemática'],
    services: ['Elaboração de Itens', 'Leitura Técnica'],
    rating: 4.2,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Professor universitário de física aplicada com foco em elaboração de itens de alta complexidade para vestibulares e ENEM.',
    comments: [
      {
        id: 'c-4-1',
        authorName: 'Renato M. (Gerente de Avaliações)',
        rating: 4,
        text: 'Itens bem estruturados de Física Mecânica. Às vezes precisa ajustar a linguagem para o Ensino Médio, mas o nível técnico é exemplar.',
        createdAt: '2026-05-20T11:22:00Z'
      }
    ]
  },
  {
    id: 'editor-5',
    name: 'Fernanda Rocha',
    email: 'fernanda.biologa@bio.com',
    phone: '(41) 99823-7451',
    componentes: ['Biologia', 'Ciências', 'Educação Infantil'],
    services: ['Edição de Conteúdo', 'Autoria'],
    rating: 4.7,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: 'Bióloga apaixonada por transpor conceitos complexos em linguagem lúdica para ensino infantil e de anos iniciais baseados na BNCC.',
    comments: [
      {
        id: 'c-5-1',
        authorName: 'Clara Albuquerque',
        rating: 5,
        text: 'Texto fluido para livros de ciências do 4º ano, com ilustrações sugeridas impecáveis.',
        createdAt: '2026-06-05T08:50:00Z'
      }
    ]
  },
  {
    id: 'editor-6',
    name: 'Sofia Martinez',
    email: 'sofia.spanish@idioma.com',
    phone: '(11) 98321-4567',
    componentes: ['Espanhol', 'Inglês', 'Literatura'],
    services: ['Autoria', 'Leitura Crítica', 'Edição de Conteúdo'],
    rating: 4.5,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    bio: 'Nativa hispanohablante da Argentina, residente no Brasil. Experiência robusta com materiais didáticos de línguas estrangeiras focados no turismo e negócios.',
    comments: [
      {
        id: 'c-6-1',
        authorName: 'Thiago Faria',
        rating: 4.5,
        text: 'Profissional dedicada. Tradução e adaptação didática primorosas.',
        createdAt: '2026-05-18T14:15:00Z'
      }
    ]
  },
  {
    id: 'editor-7',
    name: 'Jorge Henderson',
    email: 'jorge.henderson@lingua.com',
    phone: '(21) 99245-5621',
    componentes: ['Inglês', 'Anos Iniciais'],
    services: ['Edição de Conteúdo', 'Elaboração de Itens'],
    rating: 4.3,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bio: 'Criador de conteúdo para metodologias de ensino bilíngue infantil e elaborador de quizzes interativos para plataformas digitais.',
    comments: [
      {
        id: 'c-7-1',
        authorName: 'Lúcia Prado',
        rating: 4,
        text: 'Roteiros de áudio interativos ótimos e design de jogos cognitivos excelentes para ensino de inglês.',
        createdAt: '2026-06-01T17:02:00Z'
      }
    ]
  },
  {
    id: 'editor-8',
    name: 'Beatriz Vasconcelos',
    email: 'beatriz.v@arteseducacao.com',
    phone: '(31) 97711-2244',
    componentes: ['Artes', 'História', 'Educação Infantil'],
    services: ['Autoria', 'Edição de Conteúdo'],
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Pesquisadora em arte-educação e patrimônio histórico. Cria projetos pedagógicos integradores combinando teoria de arte e história prática.',
    comments: [
      {
        id: 'c-8-1',
        authorName: 'Mateus Castro',
        rating: 5,
        text: 'Material de Artes impecável, focado na cultura popular brasileira. As propostas de atividades manuais são muito bem contextualizadas.',
        createdAt: '2026-06-03T11:45:00Z'
      }
    ]
  },
  {
    id: 'editor-9',
    name: 'Daniel Castro',
    email: 'daniel.geo@terra.com',
    phone: '(51) 99112-2334',
    componentes: ['Geografia', 'Ciências'],
    services: ['Leitura Técnica', 'Edição de Conteúdo', 'Elaboração de Itens'],
    rating: 4.4,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    bio: 'Cartógrafo e geógrafo especializado em ensino fundamental e médio. Especialista em adaptar mapas complexos em ilustrações didáticas legíveis.',
    comments: [
      {
        id: 'c-9-1',
        authorName: 'Gisele P.',
        rating: 4,
        text: 'Muito claro nos comentários de geologia e geomorfologia aplicados ao ensino.',
        createdAt: '2026-04-18T13:30:00Z'
      }
    ]
  },
  {
    id: 'editor-10',
    name: 'Professor Ricardo Lima',
    email: 'ricardo.edufis@escola.com',
    phone: '(81) 98765-1122',
    componentes: ['Educação Física', 'Ensino Religioso'],
    services: ['Autoria', 'Elaboração de Itens'],
    rating: 4.1,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    bio: 'Desenvolvedor de currículos de bem-estar corporal, jogos cooperativos e projetos interdisciplinares de sociologia do esporte.',
    comments: [
      {
        id: 'c-10-1',
        authorName: 'André Neves',
        rating: 4,
        text: 'Iniciativas excelentes de integração social através dos esportes coletivos em seu material didático.',
        createdAt: '2026-03-29T15:20:00Z'
      }
    ]
  }
];

export const ALL_COMPONENTS: string[] = [
  'Matemática',
  'Física',
  'Química',
  'Biologia',
  'Ciências',
  'História',
  'Geografia',
  'Língua Portuguesa',
  'Literatura',
  'Inglês',
  'Espanhol',
  'Artes',
  'Educação Física',
  'Filosofia',
  'Sociologia',
  'Ensino Religioso',
  'Educação Infantil',
  'Anos Iniciais',
  'Outros'
];

export const ALL_SERVICES: string[] = [
  'Edição de Conteúdo',
  'Leitura Crítica',
  'Leitura Técnica',
  'Autoria',
  'Elaboração de Itens'
];
