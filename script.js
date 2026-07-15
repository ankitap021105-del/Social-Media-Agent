/* ============================================================
   script.js  –  AI Social Media Agent
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   0.  GROQ API Helper  (for AI generation)
   ───────────────────────────────────────────────────────────── */
const GROQ_API_KEY   = "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";
const GROQ_API_URL   = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL     = "llama3-8b-8192";

async function groqGenerate(prompt) {
  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.85
      })
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    return null;  // fall back to local templates
  }
}

/* ─────────────────────────────────────────────────────────────
   1.  APP STATE
   ───────────────────────────────────────────────────────────── */
const state = {
  theme:          "light",
  activePage:     "dashboard",
  feedFilter:     "all",
  searchQuery:    "",
  selectedImage:  null,
  chartInstances: {},
  postingPlatform: "Instagram",
  selectedHashtags: [],
  aiGenerating:   false
};

/* ─────────────────────────────────────────────────────────────
   2.  UTILITY HELPERS
   ───────────────────────────────────────────────────────────── */
function $(id)  { return document.getElementById(id); }
function $q(sel) { return document.querySelector(sel); }
function $qa(sel) { return document.querySelectorAll(sel); }

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000)    return (n / 1000).toFixed(1)    + "K";
  return n.toString();
}

function platformColor(p) {
  const map = { "Instagram": "#e1306c", "X (Twitter)": "#1da1f2", "Facebook": "#1877f2", "LinkedIn": "#0a66c2" };
  return map[p] || "#3b82d4";
}

function platformIcon(p) {
  const map = { "Instagram": "fab fa-instagram", "X (Twitter)": "fab fa-x-twitter", "Facebook": "fab fa-facebook-f", "LinkedIn": "fab fa-linkedin-in" };
  return map[p] || "fas fa-globe";
}

function showToast(msg, type = "info") {
  const c = $("toast-container");
  const div = document.createElement("div");
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  div.className = `toast-msg ${type}`;
  div.innerHTML = `<span>${icons[type] || "ℹ️"}</span><span>${msg}</span>`;
  c.appendChild(div);
  setTimeout(() => { div.style.opacity = "0"; div.style.transform = "translateX(60px)"; div.style.transition = "0.3s"; setTimeout(() => div.remove(), 300); }, 3200);
}

function animateValue(el, start, end, duration = 800) {
  const range = end - start;
  const step  = range / (duration / 16);
  let cur = start;
  const timer = setInterval(() => {
    cur += step;
    if ((step > 0 && cur >= end) || (step < 0 && cur <= end)) { cur = end; clearInterval(timer); }
    el.textContent = formatNumber(Math.round(cur));
  }, 16);
}

/* ─────────────────────────────────────────────────────────────
   3.  THEME (Dark / Light)
   ───────────────────────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem("sma-theme") || "light";
  applyTheme(saved);
}
function applyTheme(t) {
  state.theme = t;
  document.documentElement.setAttribute("data-theme", t);
  const btn = $("theme-toggle");
  if (btn) btn.innerHTML = t === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem("sma-theme", t);
  // re-render charts with updated colours
  if (Object.keys(state.chartInstances).length) {
    setTimeout(() => renderAllCharts(), 50);
  }
}
function toggleTheme() { applyTheme(state.theme === "dark" ? "light" : "dark"); }

/* ─────────────────────────────────────────────────────────────
   4.  SIDEBAR / NAVIGATION
   ───────────────────────────────────────────────────────────── */
function initNav() {
  $qa("[data-nav]").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      navigateTo(el.dataset.nav);
      // close sidebar on mobile
      if (window.innerWidth < 769) closeSidebar();
    });
  });
  $("sidebar-toggle")?.addEventListener("click", toggleSidebar);
  $("sidebar-overlay")?.addEventListener("click", closeSidebar);
}

function navigateTo(page) {
  state.activePage = page;
  // sections
  $qa(".page-section").forEach(s => s.classList.remove("active"));
  const sec = $(`section-${page}`);
  if (sec) sec.classList.add("active");
  // nav links
  $qa("[data-nav]").forEach(el => el.classList.toggle("active", el.dataset.nav === page));
  // page title
  const titles = {
    dashboard: "Dashboard", feed: "Social Feed", generator: "AI Generator",
    trending: "Trending Hashtags", timing: "Best Posting Times",
    competitors: "Competitor Analysis", analytics: "Analytics", scheduler: "Scheduler"
  };
  const titleEl = $("page-title");
  if (titleEl) titleEl.textContent = titles[page] || page;
  // lazy render
  if (page === "analytics") renderAllCharts();
  if (page === "dashboard") renderDashboardCharts();
  if (page === "timing")    renderTimingGrid("Instagram");
  if (page === "feed")      renderFeed();
  if (page === "trending")  renderTrending();
  if (page === "competitors") renderCompetitors();
  if (page === "scheduler") renderScheduler();
}

function toggleSidebar() {
  $("sidebar").classList.toggle("open");
  $("sidebar-overlay").classList.toggle("open");
}
function closeSidebar() {
  $("sidebar").classList.remove("open");
  $("sidebar-overlay").classList.remove("open");
}

/* ─────────────────────────────────────────────────────────────
   5.  SEARCH
   ───────────────────────────────────────────────────────────── */
function initSearch() {
  const inp = $("global-search");
  if (!inp) return;
  inp.addEventListener("input", () => {
    state.searchQuery = inp.value.toLowerCase().trim();
    if (state.activePage === "feed") renderFeed();
  });
}

/* ─────────────────────────────────────────────────────────────
   6.  DASHBOARD
   ───────────────────────────────────────────────────────────── */
function renderDashboard() {
  // Stat cards
  const stats = [
    { id: "stat-followers", val: 128400, lbl: "Total Followers", delta: "+12.4%", up: true, icon: "fas fa-users", color: "#3b82d4" },
    { id: "stat-reach",     val: 245800, lbl: "Weekly Reach",    delta: "+8.7%",  up: true, icon: "fas fa-eye",   color: "#22c55e" },
    { id: "stat-posts",     val: 342,    lbl: "Total Posts",     delta: "+4 this week", up: true, icon: "fas fa-image", color: "#f59e0b" },
    { id: "stat-eng",       val: 4.7,    lbl: "Avg Engagement",  delta: "+0.3%",  up: true, icon: "fas fa-chart-line", color: "#ec4899", suffix: "%" }
  ];
  stats.forEach(s => {
    const el = $(s.id);
    if (!el) return;
    el.innerHTML = `
      <div class="stat-icon" style="background:${s.color}20;color:${s.color}"><i class="${s.icon}"></i></div>
      <div class="stat-val" id="${s.id}-val">${s.id === "stat-eng" ? s.val + "%" : formatNumber(s.val)}</div>
      <div class="stat-lbl">${s.lbl}</div>
      <div class="stat-delta up"><i class="fas fa-arrow-up"></i> ${s.delta}</div>`;
    // animate the number
    if (s.id !== "stat-eng") {
      setTimeout(() => animateValue($(`${s.id}-val`), 0, s.val), 200);
    }
  });

  // Recent posts preview
  renderDashboardRecentPosts();
  renderDashboardCharts();
  renderSentimentMeter();
}

function renderDashboardRecentPosts() {
  const c = $("dashboard-recent-posts");
  if (!c) return;
  const recent = MOCK_POSTS.slice(0, 4);
  c.innerHTML = recent.map(p => `
    <div class="post-card">
      <div class="post-card-header">
        <img class="post-avatar" src="${p.avatar}" alt="${p.author}" onerror="this.src='https://ui-avatars.com/api/?name=User&size=48'">
        <div>
          <div class="post-author">${p.author}</div>
          <div class="post-time">${p.time}</div>
        </div>
        <span class="platform-badge ${p.platform.replace(/[^a-z]/gi,'')}" style="background:${platformColor(p.platform)}20;color:${platformColor(p.platform)}">
          <i class="${platformIcon(p.platform)}"></i> ${p.platform}
        </span>
      </div>
      <div class="post-content-text">${truncate(p.content, 120)}</div>
      <div class="post-stats">
        <span><i class="fas fa-heart" style="color:#ef4444"></i> ${formatNumber(p.likes)}</span>
        <span><i class="fas fa-comment" style="color:#3b82d4"></i> ${formatNumber(p.comments)}</span>
        <span><i class="fas fa-share" style="color:#22c55e"></i> ${formatNumber(p.shares)}</span>
        <span class="ms-auto"><span class="sentiment-badge ${p.sentiment}">${sentimentEmoji(p.sentiment)} ${capitalize(p.sentiment)}</span></span>
      </div>
    </div>`).join("");
}

function renderSentimentMeter() {
  const el = $("sentiment-meter-bars");
  if (!el) return;
  const { Positive, Neutral, Negative } = MOCK_ANALYTICS.sentimentBreakdown;
  el.innerHTML = `
    <div class="sentiment-bar-wrap">
      <div class="sentiment-seg pos" style="width:${Positive}%"></div>
      <div class="sentiment-seg neu" style="width:${Neutral}%"></div>
      <div class="sentiment-seg neg" style="width:${Negative}%"></div>
    </div>
    <div class="sentiment-labels">
      <span style="color:var(--success)">😊 Positive ${Positive}%</span>
      <span style="color:var(--warning)">😐 Neutral ${Neutral}%</span>
      <span style="color:var(--danger)">😠 Negative ${Negative}%</span>
    </div>`;
}

function truncate(str, n) { return str.length > n ? str.slice(0, n) + "…" : str; }
function capitalize(s)    { return s.charAt(0).toUpperCase() + s.slice(1); }
function sentimentEmoji(s) { return s === "positive" ? "😊" : s === "negative" ? "😠" : "😐"; }

/* ─────────────────────────────────────────────────────────────
   7.  SOCIAL FEED
   ───────────────────────────────────────────────────────────── */
function initFeedFilters() {
  $qa("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      $qa("[data-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.feedFilter = btn.dataset.filter;
      renderFeed();
    });
  });
}

function renderFeed() {
  const c = $("feed-container");
  if (!c) return;
  let posts = [...MOCK_POSTS];
  if (state.feedFilter !== "all") {
    posts = posts.filter(p => p.platform.toLowerCase().includes(state.feedFilter.toLowerCase()));
  }
  if (state.searchQuery) {
    posts = posts.filter(p =>
      p.content.toLowerCase().includes(state.searchQuery) ||
      p.author.toLowerCase().includes(state.searchQuery) ||
      p.hashtags.some(h => h.toLowerCase().includes(state.searchQuery))
    );
  }
  if (posts.length === 0) {
    c.innerHTML = `<div style="text-align:center;padding:48px;color:var(--text-muted)"><i class="fas fa-search" style="font-size:32px"></i><br><br>No posts found for your search.</div>`;
    return;
  }
  c.innerHTML = posts.map(p => postCardHTML(p)).join("");
}

function postCardHTML(p) {
  return `
    <div class="post-card">
      <div class="post-card-header">
        <img class="post-avatar" src="${p.avatar}" alt="${p.author}" onerror="this.src='https://ui-avatars.com/api/?name=User&size=48'">
        <div>
          <div class="post-author">${p.author}</div>
          <div class="post-time">${p.time} &nbsp;·&nbsp; Reach: ${formatNumber(p.reach)}</div>
        </div>
        <span class="platform-badge" style="background:${platformColor(p.platform)}20;color:${platformColor(p.platform)}">
          <i class="${platformIcon(p.platform)}"></i>&nbsp;${p.platform}
        </span>
      </div>
      ${p.image ? `<img class="post-image" src="${p.image}" alt="post image" loading="lazy" onerror="this.style.display='none'">` : ""}
      <div class="post-content-text">${p.content}</div>
      <div class="post-hashtags">${p.hashtags.map(h => `<span class="hashtag-pill">${h}</span>`).join("")}</div>
      <div class="post-stats">
        <span><i class="fas fa-heart" style="color:#ef4444"></i> ${formatNumber(p.likes)}</span>
        <span><i class="fas fa-comment" style="color:#3b82d4"></i> ${formatNumber(p.comments)}</span>
        <span><i class="fas fa-retweet" style="color:#22c55e"></i> ${formatNumber(p.shares)}</span>
        <span class="ms-auto d-flex align-items-center gap-2">
          <span class="sentiment-badge ${p.sentiment}">${sentimentEmoji(p.sentiment)} ${capitalize(p.sentiment)} ${Math.round(p.sentimentScore * 100)}%</span>
        </span>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   8.  AI CAPTION & HASHTAG GENERATOR
   ───────────────────────────────────────────────────────────── */
function initAIGenerator() {
  const genBtn   = $("btn-generate-caption");
  const copyBtn  = $("btn-copy-caption");
  const hashBtn  = $("btn-generate-hashtags");
  const topicInp = $("ai-topic");
  const toneEl   = $("ai-tone");
  const platEl   = $("ai-platform");
  const imgInput = $("image-upload-input");
  const dropZone = $("upload-dropzone");

  genBtn?.addEventListener("click", generateCaption);
  copyBtn?.addEventListener("click", copyCaption);
  hashBtn?.addEventListener("click", generateHashtags);
  topicInp?.addEventListener("keydown", e => { if (e.key === "Enter") generateCaption(); });

  // Image upload
  imgInput?.addEventListener("change", handleImageUpload);
  dropZone?.addEventListener("dragover",  e => { e.preventDefault(); dropZone.classList.add("drag-over"); });
  dropZone?.addEventListener("dragleave", ()  => dropZone.classList.remove("drag-over"));
  dropZone?.addEventListener("drop",      e  => {
    e.preventDefault(); dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) showImagePreview(file);
  });
  dropZone?.addEventListener("click", () => imgInput?.click());

  // Platform select for posting time suggestion
  platEl?.addEventListener("change", () => {
    state.postingPlatform = platEl.value;
    updateTimeSuggestion();
  });
  updateTimeSuggestion();
}

async function generateCaption() {
  if (state.aiGenerating) return;
  const topic   = $("ai-topic")?.value?.trim() || "our product";
  const tone    = $("ai-tone")?.value    || "product";
  const platform= $("ai-platform")?.value || "Instagram";
  const output  = $("caption-output");
  if (!output) return;

  state.aiGenerating = true;
  output.classList.add("typing");
  output.textContent = "";

  // Show spinner
  const spinner = document.createElement("div");
  spinner.className = "ai-spinner";
  output.appendChild(spinner);

  // Build prompt for Groq
  const prompt = `Write a compelling ${tone} social media caption for ${platform} about: "${topic}".
Requirements:
- 1-3 sentences maximum
- Include 3-5 relevant hashtags at the end
- Use appropriate emojis (2-3 max)
- Tone: ${tone === "motivational" ? "inspiring and energetic" : tone === "educational" ? "informative and clear" : tone === "lifestyle" ? "relatable and aspirational" : "exciting and persuasive"}
- Optimized for ${platform} audience
Only output the caption, nothing else.`;

  let caption = await groqGenerate(prompt);

  // Fallback to local template if Groq fails
  if (!caption) {
    caption = localCaptionGenerate(topic, tone);
  }

  // Simulate typewriter
  output.textContent = "";
  output.classList.remove("typing");
  typeWriter(output, caption, 18);
  state.aiGenerating = false;
  showToast("Caption generated!", "success");

  // Auto-generate hashtags too
  generateHashtags();
}

function localCaptionGenerate(topic, tone) {
  const templates = AI_CAPTION_TEMPLATES[tone] || AI_CAPTION_TEMPLATES.product;
  const t = templates[Math.floor(Math.random() * templates.length)];
  const allTags = Object.values(HASHTAG_SUGGESTIONS).flat();
  const shuffle = arr => arr.sort(() => Math.random() - 0.5);
  const [t1, t2, t3] = shuffle([...allTags]);
  return t.replace("{TOPIC}", topic).replace("{TAG1}", t1.replace("#","")).replace("{TAG2}", t2.replace("#","")).replace("{TAG3}", t3.replace("#",""));
}

function typeWriter(el, text, speed = 20) {
  let i = 0;
  el.textContent = "";
  const timer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

function copyCaption() {
  const txt = $("caption-output")?.textContent || "";
  if (!txt || txt === "Your AI-generated caption will appear here...") return showToast("Generate a caption first!", "error");
  navigator.clipboard.writeText(txt).then(() => showToast("Caption copied!", "success")).catch(() => showToast("Copy failed.", "error"));
}

async function generateHashtags() {
  const topic   = $("ai-topic")?.value?.trim() || "brand";
  const tone    = $("ai-tone")?.value || "product";
  const c       = $("hashtag-suggestions");
  if (!c) return;

  c.innerHTML = `<div class="ai-spinner"></div>`;

  const prompt = `Generate 12 trending and relevant hashtags for a ${tone} post about: "${topic}".
Rules:
- Mix of popular (high reach) and niche (targeted) hashtags
- Include the # symbol
- One hashtag per line, no extra text
- Focus on engagement and discoverability`;

  let result = await groqGenerate(prompt);
  let tags = [];

  if (result) {
    tags = result.split("\n").map(l => l.trim()).filter(l => l.startsWith("#")).slice(0, 12);
  }

  // Fallback: combine local keyword sets
  if (tags.length < 6) {
    const key = tone === "tech" ? "tech" : tone === "motivational" ? "business" : tone === "lifestyle" ? "lifestyle" : "general";
    const pool = [...(HASHTAG_SUGGESTIONS[key] || []), ...HASHTAG_SUGGESTIONS.general];
    const shuffle = arr => arr.sort(() => Math.random() - 0.5);
    tags = shuffle(pool).slice(0, 12);
    // ensure # prefix
    tags = tags.map(t => t.startsWith("#") ? t : "#" + t);
  }

  state.selectedHashtags = [];
  c.innerHTML = tags.map(tag =>
    `<span class="hashtag-chip" onclick="toggleHashtag(this,'${tag}')">${tag}</span>`
  ).join("");
}

function toggleHashtag(el, tag) {
  el.classList.toggle("selected");
  if (el.classList.contains("selected")) {
    state.selectedHashtags.push(tag);
    showToast(`${tag} added!`, "info");
  } else {
    state.selectedHashtags = state.selectedHashtags.filter(t => t !== tag);
  }
}

/* ── Image Upload ── */
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) showImagePreview(file);
}
function showImagePreview(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    state.selectedImage = ev.target.result;
    const prev = $("upload-preview");
    if (prev) {
      prev.innerHTML = `
        <img src="${ev.target.result}" alt="preview" style="max-width:100%;max-height:220px;border-radius:10px;object-fit:cover;border:1px solid var(--border-color)">
        <div style="margin-top:8px;font-size:12px;color:var(--text-muted)">
          <i class="fas fa-check-circle" style="color:var(--success)"></i> ${file.name} (${(file.size/1024).toFixed(1)} KB)
          — <a href="#" onclick="clearImage(event)" style="color:var(--danger)">Remove</a>
        </div>`;
    }
    // Run sentiment on alt-text simulation
    runImageSentiment();
    showToast("Image uploaded!", "success");
  };
  reader.readAsDataURL(file);
}
function clearImage(e) {
  e.preventDefault();
  state.selectedImage = null;
  const prev = $("upload-preview");
  if (prev) prev.innerHTML = "";
  const inp = $("image-upload-input");
  if (inp) inp.value = "";
}
function runImageSentiment() {
  const disp = $("img-sentiment-result");
  if (!disp) return;
  const sentiments = ["Positive 😊", "Energetic 🔥", "Inspiring ✨", "Professional 💼"];
  disp.textContent = sentiments[Math.floor(Math.random() * sentiments.length)];
  disp.style.color = "var(--success)";
}

/* ── Posting time suggestion ── */
function updateTimeSuggestion() {
  const el = $("time-suggestion");
  if (!el) return;
  const plat = state.postingPlatform;
  const times = MOCK_BEST_TIMES[plat] || [];
  const best  = times.sort((a, b) => b.score - a.score)[0];
  if (best) el.textContent = `Best time for ${plat}: ${best.day} ${best.time} (Score: ${best.score}/100)`;
}

/* ── Text Sentiment Analysis ── */
function initSentimentAnalyzer() {
  const btn = $("btn-analyze-sentiment");
  const inp = $("sentiment-input-text");
  btn?.addEventListener("click", analyzeSentiment);
  inp?.addEventListener("input",  () => {
    if (inp.value.length > 10) analyzeSentiment();
  });
}

function analyzeSentiment() {
  const txt  = $("sentiment-input-text")?.value?.toLowerCase() || "";
  const res  = $("sentiment-result");
  if (!txt || !res) return;

  const words = txt.split(/\s+/);
  let posScore = 0, negScore = 0, neuScore = 0;
  words.forEach(w => {
    const clean = w.replace(/[^a-z]/g, "");
    if (SENTIMENT_KEYWORDS.positive.includes(clean)) posScore++;
    if (SENTIMENT_KEYWORDS.negative.includes(clean)) negScore++;
    if (SENTIMENT_KEYWORDS.neutral.includes(clean))  neuScore++;
  });
  const total = posScore + negScore + neuScore + 1;
  const pos   = Math.round((posScore / total) * 100);
  const neg   = Math.round((negScore / total) * 100);
  const neu   = 100 - pos - neg;
  const label = pos > neg && pos > neu ? "positive" : neg > pos && neg > neu ? "negative" : "neutral";

  res.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <span class="sentiment-badge ${label}" style="font-size:14px;padding:5px 14px">${sentimentEmoji(label)} ${capitalize(label)}</span>
      <span style="font-size:12px;color:var(--text-muted)">Confidence: ${Math.max(pos, neg, neu)}%</span>
    </div>
    <div class="sentiment-bar-wrap" style="height:10px;margin:6px 0">
      <div class="sentiment-seg pos" style="width:${pos}%"></div>
      <div class="sentiment-seg neu" style="width:${neu}%"></div>
      <div class="sentiment-seg neg" style="width:${neg}%"></div>
    </div>
    <div class="sentiment-labels">
      <span style="color:var(--success)">😊 ${pos}%</span>
      <span style="color:var(--warning)">😐 ${neu}%</span>
      <span style="color:var(--danger)">😠 ${neg}%</span>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   9.  TRENDING HASHTAGS
   ───────────────────────────────────────────────────────────── */
function renderTrending() {
  const c = $("trending-list");
  if (!c) return;
  c.innerHTML = MOCK_TRENDING_HASHTAGS.map((h, i) => `
    <div class="hashtag-row">
      <div class="hashtag-rank">${i + 1}</div>
      <div style="flex:1">
        <div class="hashtag-name">${h.tag} ${h.trending ? '<i class="fas fa-fire trending-fire"></i>' : ""}</div>
        <div class="hashtag-posts">${h.posts} posts</div>
      </div>
      <div class="hashtag-growth">${h.growth}</div>
    </div>`).join("");
}

/* ─────────────────────────────────────────────────────────────
   10.  BEST POSTING TIMES
   ───────────────────────────────────────────────────────────── */
function initTimingSection() {
  $qa("[data-timing-platform]").forEach(btn => {
    btn.addEventListener("click", () => {
      $qa("[data-timing-platform]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderTimingGrid(btn.dataset.timingPlatform);
    });
  });
}

function renderTimingGrid(platform) {
  const c = $("timing-grid");
  if (!c) return;
  const times = MOCK_BEST_TIMES[platform] || [];
  const max   = Math.max(...times.map(t => t.score));
  c.innerHTML = times.map(t => {
    const isBest = t.score === max;
    return `
      <div class="time-cell ${isBest ? "best" : ""}">
        <div class="day-label">${t.day.slice(0, 3)}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px">${t.time}</div>
        <div class="score-bar"><div class="score-fill" style="width:${t.score}%"></div></div>
        <div style="font-size:12px;font-weight:700;color:${isBest ? "var(--accent)" : "var(--text-muted)"}">${t.score}</div>
        ${isBest ? '<div style="font-size:10px;color:var(--accent)">🏆 Best</div>' : ""}
      </div>`;
  }).join("");

  // Also update the best time summary
  const best = times.sort((a, b) => b.score - a.score)[0];
  const sumEl = $("timing-summary");
  if (sumEl && best) {
    sumEl.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <i class="fas fa-clock text-accent" style="font-size:20px"></i>
        <div>
          <div style="font-weight:700">Best Time: <span style="color:var(--accent)">${best.day}, ${best.time}</span></div>
          <div style="font-size:12px;color:var(--text-muted)">Engagement score: ${best.score}/100 on ${platform}</div>
        </div>
      </div>`;
  }
}

/* ─────────────────────────────────────────────────────────────
   11.  COMPETITOR ANALYSIS
   ───────────────────────────────────────────────────────────── */
function renderCompetitors() {
  const c = $("competitor-list");
  if (!c) return;
  c.innerHTML = MOCK_COMPETITORS.map(comp => `
    <div class="competitor-card">
      <div class="comp-header">
        <img class="comp-avatar" src="${comp.avatar}" alt="${comp.name}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(comp.name)}&size=50'">
        <div>
          <div class="comp-name">${comp.name}</div>
          <div class="comp-handle">${comp.handle} &nbsp;·&nbsp; <span class="badge-accent">${comp.topPlatform}</span></div>
        </div>
        <div class="ms-auto text-end">
          <div style="font-weight:800;font-size:16px;color:var(--success)">${comp.growthRate}</div>
          <div style="font-size:11px;color:var(--text-muted)">Monthly Growth</div>
        </div>
      </div>
      <div class="comp-stats">
        <div class="comp-stat">
          <div class="comp-stat-val">${formatNumber(comp.followers)}</div>
          <div class="comp-stat-lbl">Followers</div>
        </div>
        <div class="comp-stat">
          <div class="comp-stat-val">${comp.avgEngagement}</div>
          <div class="comp-stat-lbl">Avg Engagement</div>
        </div>
        <div class="comp-stat">
          <div class="comp-stat-val">${comp.postsPerWeek}/wk</div>
          <div class="comp-stat-lbl">Post Frequency</div>
        </div>
      </div>
      <div style="margin-top:10px">
        <div style="font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:6px">STRENGTHS</div>
        <div class="comp-tags">${comp.strengths.map(s => `<span class="comp-tag strength"><i class="fas fa-check"></i> ${s}</span>`).join("")}</div>
        <div style="font-size:12px;font-weight:700;color:var(--text-muted);margin-top:10px;margin-bottom:6px">WEAKNESSES</div>
        <div class="comp-tags">${comp.weaknesses.map(s => `<span class="comp-tag weakness"><i class="fas fa-times"></i> ${s}</span>`).join("")}</div>
      </div>
    </div>`).join("");

  renderCompetitorChart();
}

function renderCompetitorChart() {
  const ctx = $("chart-competitor");
  if (!ctx) return;
  if (state.chartInstances["competitor"]) state.chartInstances["competitor"].destroy();
  const isDark = state.theme === "dark";
  const textColor = isDark ? "#e6edf3" : "#1f2328";
  const gridColor = isDark ? "#30363d" : "#e5e7eb";

  state.chartInstances["competitor"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: MOCK_COMPETITORS.map(c => c.name),
      datasets: [
        { label: "Followers (K)",     data: MOCK_COMPETITORS.map(c => Math.round(c.followers/1000)),    backgroundColor: "#3b82d4" },
        { label: "Posts / Week",      data: MOCK_COMPETITORS.map(c => c.postsPerWeek),                  backgroundColor: "#22c55e" },
        { label: "Engagement Rate %", data: MOCK_COMPETITORS.map(c => parseFloat(c.avgEngagement)),     backgroundColor: "#f59e0b" }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   12.  ANALYTICS CHARTS
   ───────────────────────────────────────────────────────────── */
function renderAllCharts() {
  renderReachChart();
  renderEngagementChart();
  renderPlatformPieChart();
  renderMonthlyGrowthChart();
  renderPostTypeChart();
  renderSentimentPieChart();
}

function renderDashboardCharts() {
  renderDashboardReachMini();
  renderDashboardEngMini();
}

function chartDefaults() {
  const isDark = state.theme === "dark";
  return {
    textColor: isDark ? "#e6edf3" : "#1f2328",
    gridColor: isDark ? "#30363d" : "#e5e7eb",
    bg:        isDark ? "#161b22" : "#ffffff"
  };
}

function renderReachChart() {
  const ctx = $("chart-reach");
  if (!ctx) return;
  if (state.chartInstances["reach"]) state.chartInstances["reach"].destroy();
  const { textColor, gridColor } = chartDefaults();
  state.chartInstances["reach"] = new Chart(ctx, {
    type: "line",
    data: {
      labels: MOCK_ANALYTICS.weeklyLabels,
      datasets: [{
        label: "Weekly Reach",
        data: MOCK_ANALYTICS.weeklyReach,
        borderColor: "#3b82d4", backgroundColor: "rgba(59,130,212,0.12)",
        tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: "#3b82d4"
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });
}

function renderEngagementChart() {
  const ctx = $("chart-engagement");
  if (!ctx) return;
  if (state.chartInstances["engagement"]) state.chartInstances["engagement"].destroy();
  const { textColor, gridColor } = chartDefaults();
  state.chartInstances["engagement"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: MOCK_ANALYTICS.weeklyLabels,
      datasets: [{
        label: "Engagements",
        data: MOCK_ANALYTICS.weeklyEngagement,
        backgroundColor: "#22c55e", borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });
}

function renderPlatformPieChart() {
  const ctx = $("chart-platform");
  if (!ctx) return;
  if (state.chartInstances["platform"]) state.chartInstances["platform"].destroy();
  const { textColor } = chartDefaults();
  const data = MOCK_ANALYTICS.platformBreakdown;
  state.chartInstances["platform"] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(data),
      datasets: [{ data: Object.values(data), backgroundColor: ["#e1306c", "#1da1f2", "#1877f2", "#0a66c2"], borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "right", labels: { color: textColor, padding: 12 } } }
    }
  });
}

function renderMonthlyGrowthChart() {
  const ctx = $("chart-growth");
  if (!ctx) return;
  if (state.chartInstances["growth"]) state.chartInstances["growth"].destroy();
  const { textColor, gridColor } = chartDefaults();
  state.chartInstances["growth"] = new Chart(ctx, {
    type: "line",
    data: {
      labels: MOCK_ANALYTICS.monthlyLabels,
      datasets: [{
        label: "Follower Growth",
        data: MOCK_ANALYTICS.monthlyGrowth,
        borderColor: "#ec4899", backgroundColor: "rgba(236,72,153,0.10)",
        tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: "#ec4899"
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });
}

function renderPostTypeChart() {
  const ctx = $("chart-post-type");
  if (!ctx) return;
  if (state.chartInstances["posttype"]) state.chartInstances["posttype"].destroy();
  const { textColor } = chartDefaults();
  const d = MOCK_ANALYTICS.postTypePerformance;
  state.chartInstances["posttype"] = new Chart(ctx, {
    type: "polarArea",
    data: {
      labels: d.labels,
      datasets: [{ data: d.data, backgroundColor: ["rgba(59,130,212,.7)","rgba(34,197,94,.7)","rgba(245,158,11,.7)","rgba(239,68,68,.7)","rgba(168,85,247,.7)"] }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "right", labels: { color: textColor, padding: 10 } } },
      scales: { r: { ticks: { color: textColor }, grid: { color: "transparent" } } }
    }
  });
}

function renderSentimentPieChart() {
  const ctx = $("chart-sentiment");
  if (!ctx) return;
  if (state.chartInstances["sentiment"]) state.chartInstances["sentiment"].destroy();
  const { textColor } = chartDefaults();
  const s = MOCK_ANALYTICS.sentimentBreakdown;
  state.chartInstances["sentiment"] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [{ data: [s.Positive, s.Neutral, s.Negative], backgroundColor: ["#22c55e","#f59e0b","#ef4444"], borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "right", labels: { color: textColor, padding: 12 } } }
    }
  });
}

function renderDashboardReachMini() {
  const ctx = $("chart-mini-reach");
  if (!ctx) return;
  if (state.chartInstances["mini-reach"]) state.chartInstances["mini-reach"].destroy();
  const { textColor, gridColor } = chartDefaults();
  state.chartInstances["mini-reach"] = new Chart(ctx, {
    type: "line",
    data: {
      labels: MOCK_ANALYTICS.weeklyLabels,
      datasets: [{
        data: MOCK_ANALYTICS.weeklyReach, borderColor: "#3b82d4",
        backgroundColor: "rgba(59,130,212,0.10)", tension: 0.4, fill: true, pointRadius: 2
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
}

function renderDashboardEngMini() {
  const ctx = $("chart-mini-eng");
  if (!ctx) return;
  if (state.chartInstances["mini-eng"]) state.chartInstances["mini-eng"].destroy();
  state.chartInstances["mini-eng"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: MOCK_ANALYTICS.weeklyLabels,
      datasets: [{
        data: MOCK_ANALYTICS.weeklyEngagement,
        backgroundColor: "#22c55e", borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   13.  SCHEDULER
   ───────────────────────────────────────────────────────────── */
function renderScheduler() {
  const c = $("scheduled-posts-list");
  if (!c) return;
  c.innerHTML = SCHEDULED_POSTS.map(p => `
    <div class="sched-card">
      <div class="sched-status ${p.status}"></div>
      <div class="sched-info">
        <div class="sched-content">${p.content}</div>
        <div class="sched-meta">
          <span><i class="${platformIcon(p.platform)}" style="color:${platformColor(p.platform)}"></i> ${p.platform}</span>
          <span><i class="fas fa-clock"></i> ${p.scheduledFor}</span>
          <span class="badge-${p.status === "scheduled" ? "success" : "warning"}">${capitalize(p.status)}</span>
        </div>
      </div>
      <button class="btn-outline-custom btn-sm-custom" onclick="showToast('Post editing coming soon!','info')">
        <i class="fas fa-edit"></i>
      </button>
    </div>`).join("");

  initSchedulerForm();
}

function initSchedulerForm() {
  const form = $("scheduler-form");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    const content  = $("sched-content-input")?.value?.trim();
    const platform = $("sched-platform")?.value;
    const datetime = $("sched-datetime")?.value;
    if (!content || !platform || !datetime) return showToast("Fill all fields!", "error");

    SCHEDULED_POSTS.unshift({
      id: Date.now(), platform, content,
      scheduledFor: new Date(datetime).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),
      status: "scheduled"
    });
    form.reset();
    renderScheduler();
    showToast("Post scheduled!", "success");
  });
}

/* ─────────────────────────────────────────────────────────────
   14.  REAL-TIME FEED SIMULATION
   ───────────────────────────────────────────────────────────── */
function startLiveSimulation() {
  setInterval(() => {
    // Randomly bump likes/comments on a post
    const p = MOCK_POSTS[Math.floor(Math.random() * MOCK_POSTS.length)];
    p.likes    += Math.floor(Math.random() * 8);
    p.comments += Math.floor(Math.random() * 3);
    if (state.activePage === "feed" || state.activePage === "dashboard") {
      if (state.activePage === "feed") renderFeed();
      if (state.activePage === "dashboard") renderDashboardRecentPosts();
    }
    // update stat cards too
    const el = $("stat-followers");
    if (el) {
      const valEl = $("stat-followers-val");
      if (valEl) {
        const cur = parseInt(valEl.textContent.replace(/[KM.]/g, v => v === "K" ? "000" : "000000")) || 128400;
        MOCK_ANALYTICS.totalFollowers += Math.floor(Math.random() * 3);
      }
    }
  }, 8000);
}

/* ─────────────────────────────────────────────────────────────
   15.  INIT
   ───────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initSearch();
  initFeedFilters();
  initAIGenerator();
  initSentimentAnalyzer();
  initTimingSection();

  // Bind theme toggle
  $("theme-toggle")?.addEventListener("click", toggleTheme);

  // Default page
  navigateTo("dashboard");
  renderDashboard();
  startLiveSimulation();

  // Notification bell
  $("btn-notifications")?.addEventListener("click", () => showToast("3 new notifications!", "info"));

  console.log("✅ AI Social Media Agent loaded.");
});
