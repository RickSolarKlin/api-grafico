const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir o parsing de JSON com um limite maior
app.use(express.json({ limit: '10mb' })); // Aumenta o limite para 10MB
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'
app.use('/uploads', express.static('uploads')); // Serve arquivos estáticos da pasta 'uploads'

// Rota para a URL raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve o index.html
});

// Rota para receber a imagem
app.post('/upload', (req, res) => {
    console.log('Imagem recebida:', req.body.image); // Log da imagem recebida
    // Verifica se a imagem foi enviada
    if (!req.body.image) {
        return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    }

    // Remove o prefixo da string base64
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(__dirname, 'uploads', `chart-${Date.now()}.png`); // Define o caminho do arquivo

    // Salva a imagem no servidor
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao salvar a imagem.' });
        }
        // Retorna a URL da imagem
        res.json({ url: `http://localhost:${PORT}/uploads/${path.basename(filePath)}` });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});