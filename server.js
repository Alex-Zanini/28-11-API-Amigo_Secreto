const express = require("express");
const app = express();
app.use(express.json());

let participants = [];
let results = [];

// 1. Adicionar participante
app.post("/participantes", (req, res) => {
  const { nome, ra } = req.body;
  const id = participants.length + 1;
  participants.push({ id, nome, ra });
  res.status(201).json({ message: "Participante adicionado!", id });
});

// 2. Listar participantes
app.get("/participantes", (req, res) => {
  // Retorna apenas nome e ra de cada participante
  const lista = participants.map(p => ({ nome: p.nome, ra: p.ra }));
  res.json(lista);
});

// 3. Remover participante
app.delete("/participants/:id", (req, res) => {
  const id = parseInt(req.params.id);
  participants = participantes.filter(p => p.id !== id);
  res.json({ message: "Participante removido!" });
});

// 4. Realizar sorteio
app.post("/draw", (req, res) => {
  if (participants.length < 3) {
    return res.status(400).json({ error: "Precisa de pelo menos 3 participantes!" });
  }

  let shuffled = [...participants].sort(() => Math.random() - 0.5);
  results = shuffled.map((p, i) => ({
    giver: p.nome,
    receiver: shuffled[(i + 1) % shuffled.length].nome
  }));

  res.json(results);
});

// 5. Consultar resultado individual
app.get("/result/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const participant = participants.find(p => p.id === id);
  if (!participant) return res.status(404).json({ error: "Participante não encontrado!" });

  const result = results.find(r => r.giver === participant.name);
  res.json(result || { message: "Sorteio ainda não realizado." });
});

app.listen(3000, () => console.log("API Amigo Secreto rodando na porta padrão 3000 "));
