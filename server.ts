import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/register', async (req, res) => {
    const { full_name, matric_number, department, phone_number, group_number } = req.body;
    
    if (!full_name || !matric_number || !department || !phone_number || !group_number) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([{ 
          full_name, 
          matric_number, 
          department, 
          phone_number, 
          group_number: parseInt(group_number) 
        }])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ error: error.message || 'Failed to register' });
    }
  });

  app.get('/api/groups/:groupNumber', async (req, res) => {
    const { groupNumber } = req.params;
    
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('full_name, department, phone_number, created_at')
        .eq('group_number', parseInt(groupNumber))
        .order('created_at', { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch group members' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
