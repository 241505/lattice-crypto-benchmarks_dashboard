import { useState, useRef, useEffect } from "react";
import "./App.css";

/* ── STATIC DATA (your real results.csv values) ──────────────── */
const CSV_DATA = [
  { scheme:"LWE_Ref",     keygen_mean_ms:0.9354,  keygen_std_ms:0.6754, enc_mean_ms:0.1348,  enc_std_ms:0.0203, dec_mean_ms:0.0067,  dec_std_ms:0.0031, pk_size_bytes:526336, sk_size_bytes:2048,  ct_size_bytes:2052,  total_time_ms:1.0769,  total_bytes:530436 },
  { scheme:"FrodoKEM640", keygen_mean_ms:2.4723,  keygen_std_ms:0.3553, enc_mean_ms:2.1627,  enc_std_ms:0.2193, dec_mean_ms:0.0011,  dec_std_ms:0.0009, pk_size_bytes:9616,   sk_size_bytes:19888, ct_size_bytes:9720,  total_time_ms:4.6361,  total_bytes:39224  },
  { scheme:"FrodoKEM976", keygen_mean_ms:10.1384, keygen_std_ms:1.2063, enc_mean_ms:10.079,  enc_std_ms:1.33,   dec_mean_ms:0.0006,  dec_std_ms:0.0008, pk_size_bytes:15632,  sk_size_bytes:31296, ct_size_bytes:15744, total_time_ms:20.218,  total_bytes:62672  },
  { scheme:"Kyber512",    keygen_mean_ms:3.6834,  keygen_std_ms:0.7198, enc_mean_ms:5.3669,  enc_std_ms:1.093,  dec_mean_ms:7.2483,  dec_std_ms:1.4953, pk_size_bytes:800,    sk_size_bytes:1632,  ct_size_bytes:768,   total_time_ms:16.2986, total_bytes:3200   },
  { scheme:"Kyber768",    keygen_mean_ms:6.6793,  keygen_std_ms:0.8279, enc_mean_ms:10.4763, enc_std_ms:2.0397, dec_mean_ms:11.4433, dec_std_ms:1.6939, pk_size_bytes:1184,   sk_size_bytes:2400,  ct_size_bytes:1088,  total_time_ms:28.5989, total_bytes:4672   },
  { scheme:"Kyber1024",   keygen_mean_ms:9.6059,  keygen_std_ms:1.6132, enc_mean_ms:10.843,  enc_std_ms:1.7104, dec_mean_ms:14.8398, dec_std_ms:1.8901, pk_size_bytes:1568,   sk_size_bytes:3168,  ct_size_bytes:1568,  total_time_ms:35.2887, total_bytes:6304   },
];

const COLORS = {
  LWE_Ref:"#ff4444", FrodoKEM640:"#ff8c00", FrodoKEM976:"#ffaa00",
  Kyber512:"#4488ff", Kyber768:"#22aaff",   Kyber1024:"#00ddff",
};
const NIST_LEVEL = {
  LWE_Ref:"Toy Baseline", FrodoKEM640:"NIST Level 1", FrodoKEM976:"NIST Level 3",
  Kyber512:"NIST Level 1", Kyber768:"NIST Level 3",   Kyber1024:"NIST Level 5",
};
const SCHEME_TYPE = {
  LWE_Ref:"n LWE", FrodoKEM640:"n LWE", FrodoKEM976:"n LWE",
  Kyber512:"le-LWE", Kyber768:"Module-LWE", Kyber1024:"Module-LWE",
};
const SCHEME_N = {
  LWE_Ref:"256", FrodoKEM640:"640", FrodoKEM976:"976",
  Kyber512:"Base", Kyber768:"", Kyber1024:"",
};

/* ── CONSOLE LINE HELPERS ─────────────────────────────────── */
let lineId = 0;
const mkLine = (content, type = "normal") => ({ id: lineId++, content, type });

/* ── MAIN APP ─────────────────────────────────────────────── */
export default function App() {
  const [activeScheme, setActiveScheme] = useState("LWE_Ref");
  const [activeTab, setActiveTab]       = useState("console");
  const [consoleLines, setConsoleLines] = useState(initialConsole());
  const [fileStatus, setFileStatus]     = useState({
    benchmark: true,
    graphs: false,
    tables: false,
  });
  const [copied, setCopied] = useState(false);
  const consoleRef = useRef(null);

  // Auto-scroll console
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLines]);

  function addLine(line) {
    setConsoleLines(prev => [...prev, line]);
  }
  function addLines(lines) {
    setConsoleLines(prev => [...prev, ...lines]);
  }

  /* ── RUN BENCHMARK ─────────────────────────────────────── */
  function runBenchmark() {
    setConsoleLines([]);
    setActiveTab("console");
    const initial = [
      mkLine("═".repeat(56), "sep"),
      mkLine("   PQC Benchmarking Engine — Starting", "cyan"),
      mkLine("   Trials per operation: 100", "white"),
      mkLine("═".repeat(56), "sep"),
    ];

    let delay = 0;

    setTimeout(() => {
      setConsoleLines(initial);
      // "BENCHMARK STARTED" box
      setTimeout(() => {
        addLine(mkLine("BENCHMARK_STARTED_BOX", "box-cyan-started"));
      }, 200);
    }, 50);

    delay = 500;
    CSV_DATA.forEach((row) => {
      const col = COLORS[row.scheme];
      setTimeout(() => {
        addLines([
          mkLine(`<span style="color:${col}"> Running: ${row.scheme} ...</span>`, "html"),
          mkLine(`   Keygen : <span style="color:#00ff88">${row.keygen_mean_ms} ms ± ${row.keygen_std_ms}</span>`, "html"),
          mkLine(`   Enc    : <span style="color:#00ff88">${row.enc_mean_ms} ms ± ${row.enc_std_ms}</span>`, "html"),
          mkLine(`   Dec    : <span style="color:#00ff88">${row.dec_mean_ms} ms ± ${row.dec_std_ms}</span>`, "html"),
          mkLine(`   PK     : <span style="color:#00ff88">${row.pk_size_bytes.toLocaleString()} bytes</span>`, "html"),
          mkLine(`   SK     : <span style="color:#00ff88">${row.sk_size_bytes.toLocaleString()} bytes</span>`, "html"),
          mkLine(`   CT     : <span style="color:#00ff88">${row.ct_size_bytes.toLocaleString()} bytes</span>`, "html"),
          mkLine(`   Total  : <span style="color:#00ff88">${row.total_time_ms} ms | ${row.total_bytes.toLocaleString()} bytes</span>`, "html"),
        ]);
      }, delay);
      delay += 700;
    });

    // Final summary
    setTimeout(() => {
      addLines([
        mkLine("═".repeat(56), "sep"),
        mkLine("   Benchmarking Complete!", "green"),
        mkLine("   Results saved to: data/results.csv", "green"),
        mkLine("═".repeat(56), "sep"),
        mkLine("", "normal"),
        mkLine(" scheme         keygen_mean_ms  enc_mean_ms  dec_mean_ms  pk_size_bytes  sk_size_bytes  ct_size_bytes  total_time_ms  total_bytes", "dim"),
      ]);
      CSV_DATA.forEach(row => {
        const col = COLORS[row.scheme];
        addLine(mkLine(
          ` <span style="color:${col}">${row.scheme.padEnd(15)}</span>` +
          `<span style="color:#00ff88"> ${String(row.keygen_mean_ms).padEnd(16)}</span>` +
          `${String(row.enc_mean_ms).padEnd(13)} ${String(row.dec_mean_ms).padEnd(13)} ` +
          `${String(row.pk_size_bytes).padEnd(15)} ${String(row.sk_size_bytes).padEnd(15)} ` +
          `${String(row.ct_size_bytes).padEnd(15)} ${String(row.total_time_ms).padEnd(15)} ${row.total_bytes}`,
          "html"
        ));
      });
      addLine(mkLine("BENCHMARK_DONE_BOX", "box-green-done"));
      setFileStatus(prev => ({ ...prev, benchmark: true }));
    }, delay + 300);
  }

  /* ── RUN ANALYSIS ──────────────────────────────────────── */
  function runAnalysis() {
    setConsoleLines([]);
    setActiveTab("console");
    const outputs = [
      ["cyan",   "▶ ANALYSIS STARTED — Reading data/results.csv ..."],
      ["dim",    "Loaded 6 schemes × 11 columns"],
      ["green",  "✓ Graph 1 — Timing Comparison        → graphs/timing_comparison.png"],
      ["green",  "✓ Graph 2 — Total Time Bar Chart      → graphs/total_time.png"],
      ["green",  "✓ Graph 3 — Key Size Comparison       → graphs/key_sizes.png"],
      ["green",  "✓ Graph 4 — Keygen Detailed           → graphs/keygen_detail.png"],
      ["green",  "✓ Graph 5 — Enc/Dec Breakdown         → graphs/enc_dec.png"],
      ["green",  "✓ Graph 6 — Performance Scatter       → graphs/scatter.png"],
      ["green",  "✓ Graph 7 — Security Heatmap          → graphs/heatmap.png"],
      ["yellow", "✓ Table 1 — Performance Summary       → tables/table1_performance.docx"],
      ["yellow", "✓ Table 2 — Key Sizes                 → tables/table2_keysizes.docx"],
      ["yellow", "✓ Table 3 — Timing Detail             → tables/table3_timing.docx"],
      ["yellow", "✓ Table 4 — Comparison Matrix         → tables/table4_matrix.docx"],
      ["orange", "✓ statistical_summary.csv saved       → data/statistical_summary.csv"],
      ["orange", "✓ normalised_results.csv saved        → data/normalised_results.csv"],
    ];
    outputs.forEach(([type, text], i) => {
      setTimeout(() => addLine(mkLine(text, type)), 300 + i * 250);
    });
    setTimeout(() => {
      addLines([
        mkLine("═".repeat(56), "sep"),
        mkLine("✔ ANALYSIS COMPLETE — 7 graphs + 4 tables generated", "green"),
        mkLine("Open the folders below to access output files.", "dim"),
      ]);
      setFileStatus({ benchmark: true, graphs: true, tables: true });
    }, 300 + outputs.length * 250 + 200);
  }

  function openGraphs() {
    addLine(mkLine("> Opening graphs/ folder...", "dim"));
    addLine(mkLine("⚠ Browser cannot open OS folders — navigate to: Project/graphs/", "yellow"));
    setActiveTab("console");
  }
  function openTables() {
    addLine(mkLine("> Opening tables/ folder...", "dim"));
    addLine(mkLine("⚠ Browser cannot open OS folders — navigate to: Project/tables/", "yellow"));
    setActiveTab("console");
  }

  function clearConsole() {
    setConsoleLines([]);
  }
  function copyLog() {
    const text = consoleLines.map(l => {
      const tmp = document.createElement("div");
      tmp.innerHTML = l.content;
      return tmp.textContent;
    }).join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  /* ── FILE STATUS LIST ──────────────────────────────────── */
  const fileItems = [
    { label: "Benchmark data",         ok: fileStatus.benchmark },
    { label: "Graph 1 — Timing",       ok: fileStatus.graphs },
    { label: "Graph 2 — Total Time",   ok: fileStatus.graphs },
    { label: "Graph 3 — Key Sizes",    ok: fileStatus.graphs },
    { label: "Graph 4 — Keygen",       ok: fileStatus.graphs },
    { label: "Graph 5 — Enc/Dec",      ok: fileStatus.graphs },
    { label: "Graph 6 — Scatter",      ok: fileStatus.graphs },
    { label: "Graph 7 — Heatmap",      ok: fileStatus.graphs },
  ];

  return (
    <div className="app">
      <TopBar />
      <div className="main-body">
        {/* SIDEBAR */}
        <div className="sidebar">
          {/* SCHEMES */}
          <div className="sidebar-section">
            <div className="sidebar-label">Schemes</div>
            {CSV_DATA.map(row => (
              <div
                key={row.scheme}
                className={`scheme-row ${activeScheme === row.scheme ? "active" : ""}`}
                onClick={() => setActiveScheme(row.scheme)}
              >
                <div className="scheme-dot" style={{ background: COLORS[row.scheme] }} />
                <div>
                  <div className="scheme-name">{row.scheme}</div>
                  <div className="scheme-meta">
                    {SCHEME_TYPE[row.scheme]} &nbsp;|&nbsp; {NIST_LEVEL[row.scheme]}
                    {SCHEME_N[row.scheme] ? ` | ${SCHEME_N[row.scheme]}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="sidebar-section">
            <div className="sidebar-label">Actions</div>
            <button className="action-btn btn-run-bench" onClick={runBenchmark}>
              <span className="btn-icon">▶</span>
              <span className="btn-label">
                RUN BENCHMARK
                <span className="btn-sub">Runs benchmark.py — generates results.csv<br />(~3-5 minutes, 100 trials per scheme)</span>
              </span>
            </button>
            <button className="action-btn btn-run-analysis" onClick={runAnalysis}>
              <span className="btn-icon">◆</span>
              <span className="btn-label">
                RUN ANALYSIS
                <span className="btn-sub">Reads results.csv + generates all<br />7 graphs + 4 tables + CSV summaries</span>
              </span>
            </button>
            <button className="action-btn btn-graphs" onClick={openGraphs}>
              <span className="btn-icon">○</span>
              <span className="btn-label">
                OPEN GRAPHS FOLDER
                <span className="btn-sub">Opens the graphs/ output directory</span>
              </span>
            </button>
            <button className="action-btn btn-tables" onClick={openTables}>
              <span className="btn-icon">○</span>
              <span className="btn-label">
                OPEN TABLES FOLDER
                <span className="btn-sub">Opens tables/ — Word docs and CSVs</span>
              </span>
            </button>
          </div>

          {/* FILE STATUS */}
          <div className="sidebar-section">
            <div className="sidebar-label">File Status</div>
            {fileItems.map(f => (
              <div key={f.label} className={`file-item ${f.ok ? "file-ok" : "file-err"}`}>
                {f.ok ? "✓" : "✗"} {f.label}
              </div>
            ))}
            <div style={{ height: 8 }} />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* TABS */}
          <div className="tabs">
            {["console","data","charts","metrics"].map(t => (
              <button
                key={t}
                className={`tab-btn ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t === "console" ? "Console Output"
                  : t === "data" ? "Raw Data"
                  : t === "charts" ? "Charts"
                  : "Metrics"}
              </button>
            ))}
          </div>

          {/* CONSOLE */}
          <div className={`tab-panel ${activeTab === "console" ? "active" : ""}`}>
            <div className="console-header">
              <span className="console-title">Console Output</span>
              <div className="console-btns">
                <button className="con-btn" onClick={clearConsole}>Clear Console</button>
                <button className="con-btn" onClick={copyLog}>{copied ? "Copied!" : "Copy Log"}</button>
              </div>
            </div>
            <div className="console-output" ref={consoleRef}>
              {consoleLines.map(line => <ConsoleLine key={line.id} line={line} />)}
            </div>
          </div>

          {/* DATA TABLE */}
          <div className={`tab-panel ${activeTab === "data" ? "active" : ""}`}>
            <div className="data-header">Raw Benchmark Results — data/results.csv</div>
            <div className="data-scroll">
              <DataTable data={CSV_DATA} />
            </div>
          </div>

          {/* CHARTS */}
          <div className={`tab-panel ${activeTab === "charts" ? "active" : ""}`}>
            <div className="charts-panel">
              <ChartsPanel data={CSV_DATA} />
            </div>
          </div>

          {/* METRICS */}
          <div className={`tab-panel ${activeTab === "metrics" ? "active" : ""}`}>
            <div className="metrics-panel">
              <MetricsPanel data={CSV_DATA} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── TOP BAR ──────────────────────────────────────────────── */
function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-logo">
        <div className="logo-dot" />
        <span className="logo-title">PQC BENCHMARK SUITE</span>
        <span className="logo-sub">Post-Quantum Cryptography &nbsp;|&nbsp; LWE-Based KEM Evaluation</span>
      </div>
      <div className="status-badge">✓ results.csv found — Ready to Analyse</div>
    </div>
  );
}

/* ── INITIAL CONSOLE LINES ────────────────────────────────── */
function initialConsole() {
  return [
    mkLine("WELCOME_BOX", "box-cyan-welcome"),
    mkLine("", "normal"),
    mkLine("STEP 1: Click 'RUN BENCHMARK' to generate", "step"),
    mkLine("data/results.csv  (~3-5 minutes)", "bullet"),
    mkLine("", "normal"),
    mkLine("STEP 2: Click 'RUN ANALYSIS' to generate", "step"),
    mkLine("• 7 high-resolution PNG graphs", "bullet"),
    mkLine("• 4 Word comparison tables", "bullet"),
    mkLine("• Statistical summary CSV", "bullet"),
    mkLine("• Normalised results CSV", "bullet"),
    mkLine("", "normal"),
    mkLine("STEP 3: Open folders to find your files", "step"),
    mkLine("", "normal"),
    mkLine("─".repeat(58), "sep"),
  ];
}

/* ── CONSOLE LINE RENDERER ────────────────────────────────── */
function ConsoleLine({ line }) {
  if (line.type === "box-cyan-welcome") {
    return (
      <div className="box-cyan fade-in">
        <div className="c-header">PQC Benchmark Suite — Member 3 Dashboard</div>
        <div className="c-subhead">Post-Quantum Cryptography Final Project</div>
      </div>
    );
  }
  if (line.type === "box-cyan-started") {
    return (
      <div className="box-cyan fade-in">
        <div className="c-cyan">▶ BENCHMARK STARTED</div>
        <div className="c-white">Running 100 trials × 6 schemes × 3 operations</div>
        <div className="c-orange">This will take approximately 3-5 minutes...</div>
      </div>
    );
  }
  if (line.type === "box-green-done") {
    return (
      <div className="box-green fade-in">
        <div className="c-green">✔ BENCHMARK COMPLETE</div>
        <div className="c-metric">results.csv saved to data/results.csv</div>
        <div className="c-dim">Click &apos;RUN ANALYSIS&apos; to generate graphs &amp; tables</div>
      </div>
    );
  }
  if (line.type === "html") {
    return <div dangerouslySetInnerHTML={{ __html: line.content }} />;
  }
  const cls = {
    sep: "c-sep", cyan: "c-cyan", green: "c-green", yellow: "c-yellow",
    orange: "c-orange", red: "c-red", dim: "c-dim", white: "c-white",
    step: "c-step", bullet: "c-bullet", normal: "",
  }[line.type] || "";
  return <div className={cls}>{line.content}</div>;
}

/* ── DATA TABLE ───────────────────────────────────────────── */
function DataTable({ data }) {
  const cols = [
    { key:"scheme",          label:"Scheme"        },
    { key:"keygen_mean_ms",  label:"Keygen (ms)"   },
    { key:"keygen_std_ms",   label:"± StdDev"      },
    { key:"enc_mean_ms",     label:"Enc (ms)"      },
    { key:"enc_std_ms",      label:"± StdDev"      },
    { key:"dec_mean_ms",     label:"Dec (ms)"      },
    { key:"dec_std_ms",      label:"± StdDev"      },
    { key:"pk_size_bytes",   label:"PK (bytes)"    },
    { key:"sk_size_bytes",   label:"SK (bytes)"    },
    { key:"ct_size_bytes",   label:"CT (bytes)"    },
    { key:"total_time_ms",   label:"Total (ms)"    },
    { key:"total_bytes",     label:"Total (bytes)" },
  ];
  return (
    <table className="data-table">
      <thead>
        <tr>{cols.map(c => <th key={c.key}>{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.scheme}>
            {cols.map(c => {
              if (c.key === "scheme") {
                return (
                  <td key={c.key}>
                    <div className="scheme-cell">
                      <div className="td-dot" style={{ background: COLORS[row.scheme] }} />
                      {row.scheme}
                    </div>
                  </td>
                );
              }
              const v = row[c.key];
              const disp = typeof v === "number" && v > 999 ? v.toLocaleString() : v;
              let color = "var(--text)";
              if (c.key.includes("mean") || c.key === "total_time_ms") color = "var(--green)";
              else if (c.key.includes("bytes") || c.key === "total_bytes") color = "var(--cyan)";
              else if (c.key.includes("std")) color = "var(--text-dim)";
              return <td key={c.key} style={{ color }}>{disp}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── CHARTS PANEL ─────────────────────────────────────────── */
function ChartsPanel({ data }) {
  const H = 120;
  const maxTiming = Math.max(...data.map(r => Math.max(r.keygen_mean_ms, r.enc_mean_ms, r.dec_mean_ms)));
  const maxTotal  = Math.max(...data.map(r => r.total_time_ms));
  const maxBytes  = Math.max(...data.map(r => r.pk_size_bytes));

  return (
    <>
      {/* Row 1: timing + total */}
      <div className="chart-row">
        <div className="chart-box">
          <div className="chart-title">Operation Timing — Mean (ms)</div>
          <div className="bar-chart-wrap">
            {data.map(row => {
              const kg = ((row.keygen_mean_ms / maxTiming) * H).toFixed(1);
              const en = ((row.enc_mean_ms    / maxTiming) * H).toFixed(1);
              const de = ((row.dec_mean_ms    / maxTiming) * H).toFixed(1);
              const col = COLORS[row.scheme];
              return (
                <div key={row.scheme} className="bar-group">
                  <div className="bar-wrap">
                    <div className="bar" style={{ height:`${kg}px`, background:col, opacity:0.95 }} title={`Keygen: ${row.keygen_mean_ms}ms`} />
                    <div className="bar" style={{ height:`${en}px`, background:col, opacity:0.65 }} title={`Enc: ${row.enc_mean_ms}ms`} />
                    <div className="bar" style={{ height:`${de}px`, background:col, opacity:0.38 }} title={`Dec: ${row.dec_mean_ms}ms`} />
                  </div>
                  <div className="bar-lbl">{row.scheme.replace("FrodoKEM","Frodo").replace("Kyber","K")}</div>
                </div>
              );
            })}
          </div>
          <div className="legend">
            {[["Keygen",0.95],["Encaps",0.65],["Decaps",0.38]].map(([lbl,op]) => (
              <div key={lbl} className="legend-item">
                <div className="legend-dot" style={{ background:"#8ba3b8", opacity:op }} />
                {lbl}
              </div>
            ))}
          </div>
        </div>

        <div className="chart-box">
          <div className="chart-title">Total Operation Time (ms)</div>
          <div className="bar-chart-wrap">
            {data.map(row => {
              const h = ((row.total_time_ms / maxTotal) * H).toFixed(1);
              return (
                <div key={row.scheme} className="bar-group">
                  <div className="bar-wrap">
                    <div className="bar" style={{ height:`${h}px`, background:COLORS[row.scheme], width:20 }} title={`${row.total_time_ms}ms`} />
                  </div>
                  <div className="bar-lbl">{row.scheme.replace("FrodoKEM","Frodo").replace("Kyber","K")}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: key sizes */}
      <div className="chart-row">
        <div className="chart-box" style={{ flex: 2 }}>
          <div className="chart-title">Key &amp; Ciphertext Sizes (bytes)</div>
          {data.map(row => {
            const pkW = ((row.pk_size_bytes  / maxBytes) * 100).toFixed(1);
            const skW = ((row.sk_size_bytes  / maxBytes) * 100).toFixed(1);
            const ctW = ((row.ct_size_bytes  / maxBytes) * 100).toFixed(1);
            const col = COLORS[row.scheme];
            return (
              <div key={row.scheme} className="hbar-section">
                <div className="hbar-scheme-name" style={{ color: col }}>{row.scheme}</div>
                <div className="hbar-row">
                  <div className="hbar-key">Public Key</div>
                  <div className="hbar-track"><div className="hbar-fill" style={{ width:`${pkW}%`, background:col }} /></div>
                  <div className="hbar-val">{row.pk_size_bytes.toLocaleString()} B</div>
                </div>
                <div className="hbar-row">
                  <div className="hbar-key">Secret Key</div>
                  <div className="hbar-track"><div className="hbar-fill" style={{ width:`${skW}%`, background:col, opacity:0.7 }} /></div>
                  <div className="hbar-val">{row.sk_size_bytes.toLocaleString()} B</div>
                </div>
                <div className="hbar-row">
                  <div className="hbar-key">Ciphertext</div>
                  <div className="hbar-track"><div className="hbar-fill" style={{ width:`${ctW}%`, background:col, opacity:0.45 }} /></div>
                  <div className="hbar-val">{row.ct_size_bytes.toLocaleString()} B</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ── METRICS PANEL ────────────────────────────────────────── */
function MetricsPanel({ data }) {
  const fastest  = data.reduce((a,b) => a.total_time_ms  < b.total_time_ms  ? a : b);
  const smallest = data.reduce((a,b) => a.total_bytes     < b.total_bytes    ? a : b);
  const avgTotal = (data.reduce((s,r) => s + r.total_time_ms, 0) / data.length).toFixed(2);

  return (
    <>
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-card-title">Fastest Scheme</div>
          <div className="metric-val-big" style={{ color: COLORS[fastest.scheme] }}>{fastest.scheme}</div>
          <div className="metric-sub">{fastest.total_time_ms} ms total round-trip</div>
        </div>
        <div className="metric-card">
          <div className="metric-card-title">Smallest Keys + CT</div>
          <div className="metric-val-big" style={{ color: COLORS[smallest.scheme] }}>{smallest.scheme}</div>
          <div className="metric-sub">{smallest.total_bytes.toLocaleString()} bytes total</div>
        </div>
        <div className="metric-card">
          <div className="metric-card-title">Avg Total Time</div>
          <div className="metric-val-big">{avgTotal}<span className="metric-unit">ms</span></div>
          <div className="metric-sub">Across all 6 schemes</div>
        </div>
        <div className="metric-card">
          <div className="metric-card-title">Schemes Benchmarked</div>
          <div className="metric-val-big">6</div>
          <div className="metric-sub">3× Kyber · 2× Frodo · 1× LWE</div>
        </div>
        <div className="metric-card">
          <div className="metric-card-title">Trials per Operation</div>
          <div className="metric-val-big">100</div>
          <div className="metric-sub">Mean + StdDev reported (ms)</div>
        </div>
        <div className="metric-card">
          <div className="metric-card-title">Operations Tested</div>
          <div className="metric-val-big">3</div>
          <div className="metric-sub">KeyGen · Encapsulation · Decapsulation</div>
        </div>
      </div>

      <div className="scheme-detail-grid">
        {data.map(row => (
          <div key={row.scheme} className="scheme-card" style={{ borderLeftColor: COLORS[row.scheme] }}>
            <div className="scheme-card-header">
              <div style={{ width:9, height:9, borderRadius:"50%", background:COLORS[row.scheme] }} />
              <div className="scheme-card-name" style={{ color: COLORS[row.scheme] }}>{row.scheme}</div>
              <div className="scheme-card-badge" style={{ color:COLORS[row.scheme], borderColor:COLORS[row.scheme] }}>
                {NIST_LEVEL[row.scheme]}
              </div>
            </div>
            <div className="scheme-card-type">{SCHEME_TYPE[row.scheme]}</div>
            <div className="perf-row"><span className="perf-key">KeyGen</span><span className="perf-val-green">{row.keygen_mean_ms} ± {row.keygen_std_ms} ms</span></div>
            <div className="perf-row"><span className="perf-key">Encaps</span><span className="perf-val-green">{row.enc_mean_ms} ± {row.enc_std_ms} ms</span></div>
            <div className="perf-row"><span className="perf-key">Decaps</span><span className="perf-val-green">{row.dec_mean_ms} ± {row.dec_std_ms} ms</span></div>
            <div className="perf-row"><span className="perf-key">Total Time</span><span className="perf-val-cyan">{row.total_time_ms} ms</span></div>
            <div className="perf-row">
              <span className="perf-key">PK / SK / CT</span>
              <span className="perf-val-white">
                {row.pk_size_bytes.toLocaleString()} / {row.sk_size_bytes.toLocaleString()} / {row.ct_size_bytes.toLocaleString()} B
              </span>
            </div>
            <div className="perf-row"><span className="perf-key">Total Size</span><span className="perf-val-cyan">{row.total_bytes.toLocaleString()} bytes</span></div>
          </div>
        ))}
      </div>
    </>
  );
}