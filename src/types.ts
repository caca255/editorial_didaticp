export type Service = 
  | 'Edição de Conteúdo'
  | 'Leitura Crítica'
  | 'Leitura Técnica'
  | 'Autoria'
  | 'Elaboração de Itens';

export type ComponenteCurricular =
  | 'Matemática'
  | 'Física'
  | 'Química'
  | 'Biologia'
  | 'Ciências'
  | 'História'
  | 'Geografia'
  | 'Língua Portuguesa'
  | 'Literatura'
  | 'Inglês'
  | 'Espanhol'
  | 'Artes'
  | 'Educação Física'
  | 'Filosofia'
  | 'Sociologia'
  | 'Ensino Religioso'
  | 'Educação Infantil'
  | 'Anos Iniciais'
  | 'Outros';

export interface Comment {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Editor {
  id: string;
  name: string;
  email: string;
  phone: string;
  componentes: ComponenteCurricular[]; // Can act in multiple components
  services: Service[]; // Can offer multiple services
  rating: number; // Average rating
  comments: Comment[]; // History of comments, most recent first
  bio?: string;
  avatarUrl?: string;
}
