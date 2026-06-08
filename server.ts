import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_EDITORS } from './src/mockData';
import { Editor, Comment } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

const DB_PATH = path.join(process.cwd(), 'editors.json');

// Initialize local JSON database if empty or not existing
function getEditors(): Editor[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading editors.json, fallback to initial:', err);
  }
  
  // Seed database
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_EDITORS, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write default editors.json:', err);
  }
  return INITIAL_EDITORS;
}

function saveEditors(editors: Editor[]): boolean {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(editors, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving editors to file:', err);
    return false;
  }
}

// Ensure the JSON DB file is seeded on launch
getEditors();

// API Routes
// GET all editors
app.get('/api/editors', (req, res) => {
  const editors = getEditors();
  res.json(editors);
});

// CREATE new editor
app.post('/api/editors', (req, res) => {
  const formData = req.body;
  
  const newComment: Comment = {
    id: `c-${Date.now()}`,
    authorName: formData.initialCommentAuthor || 'Coordenação',
    rating: Number(formData.initialCommentRating || 5),
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
    componentes: formData.componentes || [],
    services: formData.services || [],
    rating: newComment.rating,
    comments: [newComment]
  };

  const editors = getEditors();
  const updated = [newEditor, ...editors];
  saveEditors(updated);

  res.status(201).json(newEditor);
});

// UPDATE editor
app.put('/api/editors/:id', (req, res) => {
  const { id } = req.params;
  const formData = req.body;

  const editors = getEditors();
  let updatedEditor: Editor | null = null;
  const updated = editors.map(editor => {
    if (editor.id === id) {
      updatedEditor = {
        ...editor,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio || undefined,
        avatarUrl: formData.avatarUrl || undefined,
        componentes: formData.componentes || [],
        services: formData.services || []
      };
      return updatedEditor;
    }
    return editor;
  });

  if (!updatedEditor) {
    return res.status(404).json({ error: 'Editor não encontrado' });
  }

  saveEditors(updated);
  res.json(updatedEditor);
});

// ADD comment / rating review to editor
app.post('/api/editors/:id/comments', (req, res) => {
  const { id } = req.params;
  const commentData = req.body; // authorName, rating, text

  const newComment: Comment = {
    id: `c-${Date.now()}`,
    authorName: commentData.authorName,
    rating: Number(commentData.rating),
    text: commentData.text,
    createdAt: new Date().toISOString()
  };

  const editors = getEditors();
  let updatedEditor: Editor | null = null;

  const updated = editors.map(editor => {
    if (editor.id === id) {
      const updatedComments = [newComment, ...(editor.comments || [])];
      // Recalculate average rating
      const sum = updatedComments.reduce((acc, c) => acc + c.rating, 0);
      const avg = Math.round((sum / updatedComments.length) * 10) / 10;

      updatedEditor = {
        ...editor,
        comments: updatedComments,
        rating: avg
      };
      return updatedEditor;
    }
    return editor;
  });

  if (!updatedEditor) {
    return res.status(404).json({ error: 'Editor não encontrado' });
  }

  saveEditors(updated);
  res.json(updatedEditor);
});

// DELETE editor
app.delete('/api/editors/:id', (req, res) => {
  const { id } = req.params;
  
  const editors = getEditors();
  const editorExists = editors.some(e => e.id === id);
  if (!editorExists) {
    return res.status(404).json({ error: 'Editor não encontrado' });
  }

  const updated = editors.filter(e => e.id !== id);
  saveEditors(updated);
  res.json({ success: true });
});

// Vite middleware for development / Static file serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
