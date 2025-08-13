import React, { useEffect, useState } from "react";

const API = "http://localhost:5000"; // backend URL

export default function App() {
  const [mode, setMode] = useState("signin");   // 'signin' | 'signup'
  const [user, setUser] = useState(() => localStorage.getItem("dhl_user") || "");
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [p2, setP2] = useState("");
  const [msg, setMsg] = useState("");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  // Load posts
  const loadPosts = async () => {
    const res = await fetch(`${API}/api/blogs`);
    const data = await res.json();
    setPosts(data);
  };
  useEffect(() => { loadPosts(); }, []);

  // Auth
  async function handleSignIn(e){
    e.preventDefault(); setMsg("");
    try{
      const r = await fetch(`${API}/api/signin`, {
        method: "POST", headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ username: u, password: p })
      });
      if(!r.ok) throw new Error((await r.json()).message || "Sign in failed");
      const data = await r.json();
      localStorage.setItem("dhl_user", data.username);
      setUser(data.username);
    }catch(err){ setMsg(err.message); }
  }

  async function handleSignUp(e){
    e.preventDefault(); setMsg("");
    if(p !== p2) return setMsg("Passwords do not match");
    try{
      const r = await fetch(`${API}/api/signup`, {
        method: "POST", headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ username: u, password: p })
      });
      if(!r.ok) throw new Error((await r.json()).message || "Sign up failed");
      setMsg("Account created! You can sign in now."); setMode("signin");
    }catch(err){ setMsg(err.message); }
  }

  function logout(){
    localStorage.removeItem("dhl_user");
    setUser("");
  }

  // Publish blog
  async function publish(e){
    e.preventDefault();
    if(!user) return setMsg("Please sign in first.");
    if(!title || !content) return setMsg("Please fill title and content.");
    setBusy(true); setMsg("");
    try{
      const r = await fetch(`${API}/api/blogs`, {
        method: "POST", headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ title, content, author: user })
      });
      if(!r.ok) throw new Error((await r.json()).message || "Publish failed");
      setTitle(""); setContent("");
      await loadPosts();
      setMsg("✅ Blog published!");
    }catch(err){ setMsg(err.message); }
    finally{ setBusy(false); }
  }

  // ---------- UI ----------
  if(!user){
    return (
      <div className="screen center">
        <div className="card auth">
          <h1 className="brand">Ducanh <span>Healthy Life</span></h1>
          <p className="muted">Sign in to read & share your healthy-life blogs 🌱</p>

          <div className="tabs">
            <button className={`tab ${mode==="signin"?"active":""}`} onClick={()=>{setMode("signin");setMsg("");}}>Sign In</button>
            <button className={`tab ${mode==="signup"?"active":""}`} onClick={()=>{setMode("signup");setMsg("");}}>Sign Up</button>
          </div>

          {mode==="signin" ? (
            <form className="form" onSubmit={handleSignIn}>
              <input className="input" placeholder="Username" value={u} onChange={e=>setU(e.target.value)} />
              <input className="input" type="password" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} />
              <button className="btn primary">Sign In</button>
            </form>
          ) : (
            <form className="form" onSubmit={handleSignUp}>
              <input className="input" placeholder="Choose a username" value={u} onChange={e=>setU(e.target.value)} />
              <input className="input" type="password" placeholder="Create a password" value={p} onChange={e=>setP(e.target.value)} />
              <input className="input" type="password" placeholder="Confirm password" value={p2} onChange={e=>setP2(e.target.value)} />
              <button className="btn primary">Create Account</button>
            </form>
          )}
          <p className="msg">{msg}</p>
        </div>
      </div>
    );
  }

  // Logged-in view
  return (
    <>
      <header className="nav">
        <div className="nav-left">
          <div className="logo">🍃</div>
          <div className="brand">Ducanh <span>Healthy Life</span></div>
        </div>
        <div className="nav-right">
          <span className="welcome">Hi, {user}</span>
          <button className="btn ghost" onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <h2>Live active. Eat clean. Feel great.</h2>
          <p>Share short blogs about sports & a dynamic life.</p>
          <a href="#composer" className="btn cta">Write a post</a>
        </div>
      </section>

      <section id="composer" className="container">
        <h3>Share something healthy today 💬</h3>
        <form className="post-form" onSubmit={publish}>
          <input className="input" placeholder="Post title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="textarea" rows="5" placeholder="Your content..." value={content} onChange={e=>setContent(e.target.value)} />
          <button className="btn primary" disabled={busy}>{busy ? "Publishing..." : "Publish"}</button>
        </form>
        {msg && <p className="msg">{msg}</p>}
      </section>

      <section className="container">
        <h3>Latest posts</h3>
        <div className="grid">
          {posts.map(p => (
            <article key={p.id} className="card-post">
              <h4>{p.title}</h4>
              <div className="meta">By {p.author} • {timeAgo(p.createdAt)}</div>
              <p>{p.content}</p>
            </article>
          ))}
        </div>
        {!posts.length && <p className="muted center">No posts yet.</p>}
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Ducanh Healthy Life</p>
      </footer>
    </>
  );
}

function timeAgo(ts){
  const s = Math.floor((Date.now()-ts)/1000);
  if(s<60) return `${s}s ago`;
  const m=Math.floor(s/60); if(m<60) return `${m}m ago`;
  const h=Math.floor(m/60); if(h<24) return `${h}h ago`;
  const d=Math.floor(h/24); return `${d}d ago`;
}
