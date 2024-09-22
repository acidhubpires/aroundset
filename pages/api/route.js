// pages/api/route.js
import axios from 'axios';

export default async function handler(req, res) {
  const { start, end } = req.query; // Pega os parâmetros da requisição
  
  // Verifica se já foram feitas mais de 5 consultas
  if (req.session.routes && req.session.routes.length >= 5) {
    return res.status(429).json({ error: 'Limite de 5 rotas por sessão atingido.' });
  }

  // Sua chave de API está segura aqui
  const API_KEY = process.env.OPEN_ROUTE_API_KEY; // Chave escondida no servidor (configurar no Vercel)

  try {
    const response = await axios.get(`https://api.openrouteservice.org/v2/directions/driving-car`, {
      params: {
        api_key: API_KEY,
        start: start,
        end: end
      }
    });
    
    // Armazena a rota na sessão para controle de limite
    req.session.routes = req.session.routes || [];
    req.session.routes.push({ start, end });

    // Retorna os dados da rota
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar a rota' });
  }
}
