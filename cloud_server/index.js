const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Ensure data file exists
let store = {};
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8') || '{}';
    store = JSON.parse(raw);
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf8');
    store = {};
  }
} catch (err) {
  console.error('Error reading data file:', err);
  store = {};
}

function persist() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing data file:', err);
  }
}

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10);
}

app.post('/new', (req, res) => {
  const id = makeId();
  store[id] = { created: Date.now(), payload: null };
  persist();
  res.json({ id });
});

app.post('/save/:id', (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const body = req.body;
  store[id] = store[id] || {};
  store[id].payload = body;
  store[id].updated = Date.now();
  persist();
  res.json({ ok: true });
});

app.get('/load/:id', (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  if (!store[id] || !store[id].payload) return res.status(404).json({ error: 'Not found' });
  res.json(store[id].payload);
});

app.listen(PORT, () => {
  console.log(`StudyMaster cloud server listening on http://localhost:${PORT}`);
});
