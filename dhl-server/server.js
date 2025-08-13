// dhl-server/server.js (CommonJS)
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());               // allow requests from Vite (5173)
app.use(express.json());       // parse JSON bodies

// ---- In-memory storage (resets when server restarts) ----
const users = []; // { username, password, createdAt }
const posts = []; // { id, title, content, author, createdAt }

// ---- Auth ----
app.post("/api/signup", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "Missing fields" });
  if (users.find(u => u.username === username)) return res.status(409).json({ message: "Username already exists" });
  users.push({ username, password, createdAt: Date.now() }); // demo only (no hashing)
  res.status(201).json({ message: "Account created" });
});

app.post("/api/signin", (req, res) => {
  const { username, password } = req.body || {};
  const ok = users.find(u => u.username === username && u.password === password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ username });
});

// ---- Blogs ----
app.get("/api/blogs", (_req, res) => {
  const sorted = [...posts].sort((a,b)=>b.createdAt - a.createdAt);
  res.json(sorted);
});

app.post("/api/blogs", (req, res) => {
  const { title, content, author } = req.body || {};
  if (!title || !content || !author) return res.status(400).json({ message: "Title, content, author required" });
  const blog = { id: Date.now().toString(), title, content, author, createdAt: Date.now() };
  posts.push(blog);
  res.status(201).json({ message: "Blog published", blog });
});

app.listen(PORT, () => console.log(`✅ API running at http://localhost:${PORT}`));
