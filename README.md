<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AUTH.REVIEW — Prior Authorization Platform</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0f0f0f;--ink2:#3a3a3a;--ink3:#777;--ink4:#bbb;
  --surface:#fff;--surface2:#f7f7f5;--surface3:#efefeb;
  --border:rgba(0,0,0,.1);--border2:rgba(0,0,0,.06);
  --accent:#1a6b4a;--accent-bg:#e8f5ef;--accent-text:#0d4a32;
  --warn:#b45309;--warn-bg:#fef3c7;--warn-text:#78350f;
  --danger:#b91c1c;--danger-bg:#fee2e2;--danger-text:#7f1d1d;
  --info:#1d4ed8;--info-bg:#eff6ff;--info-text:#1e3a8a;
  --font:'IBM Plex Sans',sans-serif;--mono:'IBM Plex Mono',monospace;
  --radius:5px;--radius-lg:8px;
}
html{font-size:14px}
body{font-family:var(--font);color:var(--ink);background:var(--surface2);min-height:100vh}

.topnav{background:var(--surface);border-bottom:1px solid var(--border);padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:52px;position:sticky;top:0;z-index:100}
.brand{font-family:var(--mono);font-size:14px;font-weight:500;letter-spacing:-.01em;color:var(--ink)}
.brand span{color:var(--accent)}
.nav-right{display:flex;align-items:center;gap:12px}
.nav-badge{font-family:var(--mono);font-size:10px;padding:3px 8px;border-radius:3px;background:var(--accent-bg);color:var(--accent-text);font-weight:500}

.container{max-width:860px;margin:0 auto;padding:2rem 1.5rem}

.mode-bar{display:flex;gap:2px;background:var(--surface3);border-radius:var(--radius-lg);padding:3px;margin-bottom:1.5rem;width:fit-content}
.mode-tab{font-size:12px;font-family:var(--mono);padding:6px 16px;border-radius:var(--radius);cursor:pointer;color:var(--ink3);border:none;background:transparent;font-weight:400;transition:all .15s}
.mode-tab.active{background:var(--surface);color:var(--ink);font-weight:500;box-shadow:0 1px 3px rgba(0,0,0,.1)}

.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;margin-bottom:1rem}
.panel-title{font-family:var(--mono);font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);margin-bottom:1rem}

.page{display:none}.page.active{display:block}

.slabel{font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.07em;color:var(--ink3);text-transform:uppercase;margin-bottom:6px;margin-top:1rem}
.slabel:first-child{margin-top:0}

.pgroup-label{font-size:10px;font-family:var(--mono);color:var(--ink4);margin:10px 0 5px;text-transform:uppercase;letter-spacing:.05em}
.payer-scroll{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px}
.ptag{font-size:12px;font-family:var(--mono);padding:4px 10px;border-radius:4px;border:1px solid var(--border);cursor:pointer;color:var(--ink3);background:var(--surface);transition:all .12s;white-space:nowrap;user-select:none}
.ptag:hover{border-color:rgba(0,0,0,.25);color:var(--ink)}
.ptag.sel{background:var(--ink);color:#fff;border-color:var(--ink)}

.loc-grid{display:flex;flex-wrap:wrap;gap:6px}
.ltag{font-size:11px;font-family:var(--mono);padding:7px 10px;border-radius:4px;border:1px solid var(--border);cursor:pointer;color:var(--ink3);background:var(--surface);transition:all .12s;text-align:center;min-width:76px;user-select:none}
.ltag .lname{font-weight:500;font-size:11px;color:var(--ink2);display:block}
.ltag .lasam{font-size:10px;color:var(--ink4);display:block;margin-top:1px}
.ltag:hover{border-color:rgba(0,0,0,.25)}
.ltag.sel{background:var(--ink);border-color:var(--ink)}
.ltag.sel .lname,.ltag.sel .lasam{color:#fff}

textarea{width:100%;border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;font-size:13px;font-family:var(--font);color:var(--ink);background:var(--surface);resize:vertical;line-height:1.6;transition:border .15s;min-height:160px}
textarea:focus{outline:none;border-color:rgba(0,0,0,.3)}
textarea::placeholder{color:var(--ink4)}

select{width:100%;border:1px solid var(--border);border-radius:var(--radius);padding:8px 10px;font-size:12px;font-family:var(--mono);color:var(--ink);background:var(--surface)}
select:focus{outline:none}

input[type="text"]{border:1px solid var(--border);border-radius:var(--radius);padding:6px 10px;font-size:12px;font-family:var(--mono);color:var(--ink);background:var(--surface);width:100%}
input[type="text"]:focus{outline:none;border-color:rgba(0,0,0,.3)}

.btn{font-family:var(--mono);font-size:12px;font-weight:500;padding:8px 16px;border-radius:var(--radius);border:1px solid var(--border);cursor:pointer;background:var(--surface);color:var(--ink2);transition:all .12s;white-space:nowrap}
.btn:hover{background:var(--surface3);border-color:rgba(0,0,0,.2)}
.btn:active{transform:scale(.98)}
.btn:disabled{opacity:.35;cursor:default;transform:none}
.btn-dark{background:var(--ink);color:#fff;border-color:var(--ink)}.btn-dark:hover{opacity:.88;background:var(--ink)}
.btn-accent{background:var(--accent);color:#fff;border-color:var(--accent)}.btn-accent:hover{opacity:.88;background:var(--accent)}
.btn-ghost{border-color:transparent;color:var(--ink3)}.btn-ghost:hover{background:var(--surface3);border-color:var(--border)}
.btn-sm{padding:5px 10px;font-size:11px}

.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px}

.upload-zone{border:1.5px dashed var(--border);border-radius:var(--radius-lg);padding:1.25rem;text-align:center;cursor:pointer;margin-bottom:8px;transition:all .12s}
.upload-zone:hover{background:var(--surface2);border-color:rgba(0,0,0,.2)}
.upload-zone .uzh{font-size:13px;font-weight:500;color:var(--ink2);margin-bottom:3px}
.upload-zone p{font-size:12px;color:var(--ink3)}
input[type="file"]{display:none}

.divider{display:flex;align-items:center;gap:8px;margin:8px 0}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border2)}
.divider span{font-size:11px;color:var(--ink4);font-family:var(--mono)}

.spinner-wrap{text-align:center;padding:4rem 1rem}
.spinner{width:28px;height:28px;border:2px solid var(--border);border-top-color:var(--ink);border-radius:50%;animation:spin .75s linear infinite;margin:0 auto 14px}
@keyframes spin{to{transform:rotate(360deg)}}
.spinner-wrap p{font-size:12px;font-family:var(--mono);color:var(--ink3);margin-bottom:4px}
.spinner-wrap small{font-size:11px;color:var(--ink4);font-family:var(--mono)}

.score-donut{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:500;font-family:var(--mono);border:3px solid;margin:0 auto 10px}
.sd-low{border-color:#ef4444;color:#b91c1c;background:#fee2e2}
.sd-mid{border-color:#f59e0b;color:#92400e;background:#fef3c7}
.sd-high{border-color:#10b981;color:#065f46;background:#d1fae5}

.verdict-chip{display:inline-block;font-size:11px;font-family:var(--mono);font-weight:500;padding:3px 10px;border-radius:3px;margin-bottom:6px}
.vc-denied{background:var(--danger-bg);color:var(--danger-text)}
.vc-approved{background:var(--accent-bg);color:var(--accent-text)}
.vc-supp{background:var(--warn-bg);color:var(--warn-text)}
.vc-insuff{background:var(--info-bg);color:var(--info-text)}

.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:1rem}
.stat-box{background:var(--surface2);border-radius:var(--radius);padding:.75rem}
.stat-box .sbl{font-size:10px;font-family:var(--mono);color:var(--ink3);margin-bottom:3px}
.stat-box .sbv{font-size:20px;font-weight:500;font-family:var(--mono)}
.sbv.r{color:#b91c1c}.sbv.a{color:#92400e}.sbv.g{color:#065f46}

.dim-row{border:1px solid var(--border2);border-radius:var(--radius);margin-bottom:6px;overflow:hidden;background:var(--surface)}
.dim-hdr{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;transition:background .1s}
.dim-hdr:hover{background:var(--surface2)}
.dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.dot-r{background:#ef4444}.dot-a{background:#f59e0b}.dot-g{background:#10b981}
.dim-name{font-size:12px;font-weight:500;color:var(--ink2);flex:1;font-family:var(--mono)}
.badge{font-size:10px;font-family:var(--mono);padding:2px 7px;border-radius:3px;font-weight:500}
.b-gap{background:var(--danger-bg);color:var(--danger-text)}
.b-par{background:var(--warn-bg);color:var(--warn-text)}
.b-met{background:var(--accent-bg);color:var(--accent-text)}
.dim-body{display:none;padding:10px 12px 12px;border-top:1px solid var(--border2)}
.dim-body.open{display:block}
.dim-body p{font-size:12px;color:var(--ink3);line-height:1.7;margin-bottom:8px}
.rec-box{font-size:12px;line-height:1.6;padding:8px 10px;border-left:2px solid var(--accent);color:var(--ink2);border-radius:0 var(--radius) var(--radius) 0;background:var(--accent-bg)}
.rec-box strong{color:var(--accent-text);font-size:10px;font-family:var(--mono);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:3px}

.crit-item{display:flex;align-items:flex-start;gap:7px;margin-bottom:5px}
.crit-dot{width:5px;height:5px;border-radius:50%;background:#ef4444;margin-top:5px;flex-shrink:0}
.crit-dot.blue{background:#3b82f6}
.crit-text{font-size:12px;color:var(--ink3);line-height:1.6}

.sum-box{font-size:12px;line-height:1.7;color:var(--ink3);padding:10px 12px;background:var(--surface2);border-radius:var(--radius);margin-bottom:1rem}
.sum-box strong{color:var(--ink);font-weight:500}
.payer-info-bar{font-size:11px;font-family:var(--mono);color:var(--ink3);padding:6px 10px;background:var(--surface2);border-radius:var(--radius);margin-bottom:1rem;line-height:1.5;border-left:2px solid var(--border)}

.action-bar{display:flex;gap:6px;flex-wrap:wrap;margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--border2)}

.concurrent-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.diff-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1rem}
.diff-card .dc-label{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.dc-pill{font-size:10px;padding:2px 7px;border-radius:3px;font-family:var(--mono)}
.dc-initial{background:var(--info-bg);color:var(--info-text)}
.dc-concurrent{background:var(--warn-bg);color:var(--warn-text)}

.batch-slot{background:var(--surface2);border-radius:var(--radius);padding:10px 12px;margin-bottom:8px;border:1px solid var(--border2)}
.batch-slot-hdr{display:flex;align-items:center;gap:8px;margin-bottom:8px}

.cs-card{background:var(--surface2);border-radius:var(--radius);padding:10px 12px;margin-bottom:1rem;border-left:3px solid var(--accent)}
.cs-card.step-down{border-left-color:var(--warn)}
.cs-card.step-up{border-left-color:var(--danger)}
.cs-card.insuff{border-left-color:var(--ink4)}

.rem-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;margin-top:1.25rem}
.rem-card-hdr{padding:8px 12px;background:var(--surface2);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.rem-card-hdr span{font-family:var(--mono);font-size:11px;font-weight:500;color:var(--ink2)}
.rem-card-body{padding:12px}
.rem-dim{margin-bottom:12px}
.rem-dim-label{font-family:var(--mono);font-size:10px;font-weight:500;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.rem-dim-text{font-size:12px;color:var(--ink2);line-height:1.7;background:var(--surface2);border-radius:var(--radius);padding:8px 10px}

.chevron{font-size:10px;color:var(--ink4);font-family:var(--mono)}

.hero{text-align:center;padding:3rem 1rem 2rem}
.hero h1{font-size:28px;font-weight:300;font-family:var(--font);color:var(--ink);margin-bottom:8px;letter-spacing:-.02em}
.hero h1 strong{font-weight:500}
.hero p{font-size:13px;color:var(--ink3);max-width:440px;margin:0 auto 1.5rem;line-height:1.7}

.error-box{background:var(--danger-bg);border:1px solid rgba(185,28,28,.2);border-radius:var(--radius);padding:10px 12px;font-size:12px;color:var(--danger-text);font-family:var(--mono);margin-bottom:1rem}

@media(max-width:640px){
  .container{padding:1rem}
  .concurrent-grid{grid-template-columns:1fr}
  .topnav{padding:0 1rem}
  .mode-bar{width:100%}
  .mode-tab{flex:1;text-align:center}
  .stats-row{grid-template-columns:1fr 1fr 1fr}
}
</style>
</head>
<body>

<nav class="topnav">
  <div class="brand">AUTH<span>.</span>REVIEW</div>
  <div class="nav-right">
    <span class="nav-badge">Beta</span>
    <span style="font-size:11px;font-family:var(--mono);color:var(--ink3)">Behavioral Health UR Platform</span>
  </div>
</nav>

<div class="container">

  <div class="hero">
    <h1>Prior <strong>Authorization</strong> Review</h1>
    <p>Analyze clinical documentation against ASAM criteria and payer-specific requirements across 14 payers and 10 levels of care.</p>
    <div class="mode-bar">
      <button class="mode-tab active" onclick="setMode('single',this)">Single Review</button>
      <button class="mode-tab" onclick="setMode('concurrent',this)">Concurrent Stay</button>
      <button class="mode-tab" onclick="setMode('batch',this)">Batch Review</button>
    </div>
  </div>

  <!-- SINGLE MODE -->
  <div class="page active" id="mode-single">
    <div class="panel">
      <div class="panel-title">Payer selection</div>
      <div class="pgroup-label">Florida Medicaid Managed Care</div>
      <div class="payer-scroll">
        <span class="ptag sel" data-p="sunshine" onclick="sp(this)">Sunshine Health</span>
        <span class="ptag" data-p="aetna_med" onclick="sp(this)">Aetna Better Health FL</span>
        <span class="ptag" data-p="molina" onclick="sp(this)">Molina FL</span>
        <span class="ptag" data-p="simply" onclick="sp(this)">Simply Healthcare</span>
        <span class="ptag" data-p="humana_med" onclick="sp(this)">Humana Medicaid FL</span>
        <span class="ptag" data-p="united_med" onclick="sp(this)">UHC Community FL</span>
      </div>
      <div class="pgroup-label">Commercial / Medicare Advantage</div>
      <div class="payer-scroll">
        <span class="ptag" data-p="bcbs" onclick="sp(this)">BCBS Florida</span>
        <span class="ptag" data-p="cigna" onclick="sp(this)">Cigna</span>
        <span class="ptag" data-p="aetna_comm" onclick="sp(this)">Aetna Commercial</span>
        <span class="ptag" data-p="uhc_comm" onclick="sp(this)">UnitedHealthcare</span>
        <span class="ptag" data-p="humana_comm" onclick="sp(this)">Humana Commercial</span>
        <span class="ptag" data-p="magellan" onclick="sp(this)">Magellan Health</span>
        <span class="ptag" data-p="carelon" onclick="sp(this)">Carelon / Beacon</span>
        <span class="ptag" data-p="tricare" onclick="sp(this)">TRICARE</span>
      </div>
      <div class="pgroup-label">Medicare</div>
      <div class="payer-scroll">
        <span class="ptag" data-p="medicare" onclick="sp(this)">Traditional Medicare</span>
        <span class="ptag" data-p="medicare_adv" onclick="sp(this)">Medicare Advantage</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">Level of care</div>
      <div class="loc-grid">
        <span class="ltag" data-l="detox_med" onclick="sl(this)"><span class="lname">Med Detox</span><span class="lasam">4-WM</span></span>
        <span class="ltag" data-l="detox_res" onclick="sl(this)"><span class="lname">Res Detox</span><span class="lasam">3.2-WM</span></span>
        <span class="ltag" data-l="detox_amb" onclick="sl(this)"><span class="lname">Amb Detox</span><span class="lasam">2-WM</span></span>
        <span class="ltag" data-l="res_hi" onclick="sl(this)"><span class="lname">Res High</span><span class="lasam">3.5</span></span>
        <span class="ltag" data-l="res_lo" onclick="sl(this)"><span class="lname">Res Low</span><span class="lasam">3.1</span></span>
        <span class="ltag sel" data-l="php" onclick="sl(this)"><span class="lname">PHP</span><span class="lasam">2.5</span></span>
        <span class="ltag" data-l="iop" onclick="sl(this)"><span class="lname">IOP</span><span class="lasam">2.1</span></span>
        <span class="ltag" data-l="op" onclick="sl(this)"><span class="lname">Outpatient</span><span class="lasam">1.0</span></span>
        <span class="ltag" data-l="mat" onclick="sl(this)"><span class="lname">MAT / OTP</span><span class="lasam">OTP</span></span>
        <span class="ltag" data-l="inpat" onclick="sl(this)"><span class="lname">Inpatient</span><span class="lasam">Psych/Dual</span></span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">Clinical documentation</div>
      <div class="upload-zone" onclick="document.getElementById('fileS').click()">
        <div class="uzh">Drop file or click to upload</div>
        <p>Supports .txt files</p>
        <input type="file" id="fileS" accept=".txt" />
      </div>
      <div class="divider"><span>or paste text</span></div>
      <textarea id="singleDoc" placeholder="Paste progress note, H&P, assessment, discharge summary..."></textarea>
      <div class="row">
        <button class="btn btn-dark" id="singleBtn" onclick="runSingle()">Analyze for authorization ↗</button>
        <button class="btn" onclick="loadSample('single')">Load sample note</button>
        <span style="font-size:11px;color:var(--ink4);font-family:var(--mono);margin-left:auto" id="sCC">0 chars</span>
      </div>
    </div>

    <div class="page" id="single-loading" style="display:none">
      <div class="panel"><div class="spinner-wrap"><div class="spinner"></div><p id="sLoadMsg">Analyzing documentation...</p><small>This takes 10–20 seconds</small></div></div>
    </div>
    <div id="single-results"></div>
  </div>

  <!-- CONCURRENT MODE -->
  <div class="page" id="mode-concurrent">
    <div class="panel">
      <div class="panel-title">Payer &amp; level of care</div>
      <div class="payer-scroll" id="concPayerWrap">
        <span class="ptag sel" data-p2="sunshine" onclick="sp2(this)">Sunshine Health</span>
        <span class="ptag" data-p2="aetna_med" onclick="sp2(this)">Aetna Better Health FL</span>
        <span class="ptag" data-p2="molina" onclick="sp2(this)">Molina FL</span>
        <span class="ptag" data-p2="simply" onclick="sp2(this)">Simply Healthcare</span>
        <span class="ptag" data-p2="bcbs" onclick="sp2(this)">BCBS Florida</span>
        <span class="ptag" data-p2="cigna" onclick="sp2(this)">Cigna</span>
        <span class="ptag" data-p2="uhc_comm" onclick="sp2(this)">UnitedHealthcare</span>
        <span class="ptag" data-p2="medicare" onclick="sp2(this)">Medicare</span>
      </div>
      <div style="margin-top:10px">
        <div class="loc-grid" id="concLocWrap">
          <span class="ltag" data-l2="res_hi" onclick="sl2(this)"><span class="lname">Res High</span><span class="lasam">3.5</span></span>
          <span class="ltag" data-l2="res_lo" onclick="sl2(this)"><span class="lname">Res Low</span><span class="lasam">3.1</span></span>
          <span class="ltag sel" data-l2="php" onclick="sl2(this)"><span class="lname">PHP</span><span class="lasam">2.5</span></span>
          <span class="ltag" data-l2="iop" onclick="sl2(this)"><span class="lname">IOP</span><span class="lasam">2.1</span></span>
          <span class="ltag" data-l2="op" onclick="sl2(this)"><span class="lname">Outpatient</span><span class="lasam">1.0</span></span>
        </div>
      </div>
    </div>
    <div class="concurrent-grid">
      <div class="diff-card">
        <div class="dc-label"><span class="dc-pill dc-initial">Initial Auth</span> Original authorization note</div>
        <textarea id="concDoc1" style="min-height:180px" placeholder="Paste initial admission or authorization note..."></textarea>
      </div>
      <div class="diff-card">
        <div class="dc-label"><span class="dc-pill dc-concurrent">Concurrent</span> Current progress note</div>
        <textarea id="concDoc2" style="min-height:180px" placeholder="Paste current progress note for continued stay review..."></textarea>
      </div>
    </div>
    <div class="row" style="margin-top:10px">
      <button class="btn btn-dark" id="concBtn" onclick="runConcurrent()">Compare for continued stay ↗</button>
      <button class="btn" onclick="loadSample('concurrent')">Load sample pair</button>
    </div>
    <div class="page" id="conc-loading" style="display:none">
      <div class="panel" style="margin-top:1rem"><div class="spinner-wrap"><div class="spinner"></div><p id="cLoadMsg">Comparing documents...</p><small>This takes 10–20 seconds</small></div></div>
    </div>
    <div id="conc-results"></div>
  </div>

  <!-- BATCH MODE -->
  <div class="page" id="mode-batch">
    <div class="panel">
      <div class="panel-title">Payer &amp; level of care</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div><div class="slabel">Payer</div>
        <select id="batchPayer">
          <option value="sunshine">Sunshine Health (FL Medicaid)</option>
          <option value="aetna_med">Aetna Better Health FL</option>
          <option value="molina">Molina FL</option>
          <option value="simply">Simply Healthcare FL</option>
          <option value="bcbs">BCBS Florida</option>
          <option value="cigna">Cigna</option>
          <option value="aetna_comm">Aetna Commercial</option>
          <option value="uhc_comm">UnitedHealthcare</option>
          <option value="humana_comm">Humana Commercial</option>
          <option value="magellan">Magellan Health</option>
          <option value="carelon">Carelon / Beacon</option>
          <option value="tricare">TRICARE</option>
          <option value="medicare">Traditional Medicare</option>
          <option value="medicare_adv">Medicare Advantage</option>
        </select></div>
        <div><div class="slabel">Level of Care</div>
        <select id="batchLoc">
          <option value="php">PHP — ASAM 2.5</option>
          <option value="iop">IOP — ASAM 2.1</option>
          <option value="res_hi">Residential High — ASAM 3.5</option>
          <option value="res_lo">Residential Low — ASAM 3.1</option>
          <option value="detox_med">Medical Detox — 4-WM</option>
          <option value="detox_res">Residential Detox — 3.2-WM</option>
          <option value="detox_amb">Ambulatory Detox — 2-WM</option>
          <option value="op">Outpatient — 1.0</option>
          <option value="mat">MAT / OTP</option>
          <option value="inpat">Inpatient Psych / Dual</option>
        </select></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-title">Documents <span style="color:var(--ink4);font-weight:400">(up to 8)</span></div>
      <div id="batchSlots"></div>
      <button class="btn" style="margin-top:4px" onclick="addSlot()">+ Add document</button>
    </div>
    <div class="row">
      <button class="btn btn-dark" id="batchBtn" onclick="runBatch()">Analyze all ↗</button>
      <button class="btn" onclick="loadSample('batch')">Load sample batch</button>
    </div>
    <div class="page" id="batch-loading" style="display:none">
      <div class="panel" style="margin-top:1rem"><div class="spinner-wrap"><div class="spinner"></div><p id="bLoadMsg">Analyzing batch...</p><small id="bLoadSub"></small></div></div>
    </div>
    <div id="batch-results"></div>
  </div>

</div>

<script>
const PAYERS={
  sunshine:{name:'Sunshine Health (FL Medicaid)',fw:'ASAM Criteria (SUD) / InterQual (MH)',notes:'PHP is an In Lieu of Service (ILOS). Requires AHCA approval. ASAM 2.5 for SUD primary dx; InterQual for primary MH. Extended stay fax form required for continued auth.'},
  aetna_med:{name:'Aetna Better Health FL (Medicaid)',fw:'ASAM Criteria / MCG',notes:'ASAM dimensional criteria for SUD. MCG for co-occurring MH. Bio-psychosocial assessment and individualized treatment plan with measurable goals required.'},
  molina:{name:'Molina Healthcare FL',fw:'ASAM Criteria / InterQual',notes:'AHCA-aligned criteria. ASAM for SUD LOC placement. Requires documentation of failed lower LOC or clinical justification for initial higher LOC.'},
  simply:{name:'Simply Healthcare FL',fw:'ASAM Criteria',notes:'DCF-aligned. Strong emphasis on Dimension 5 (relapse risk) and Dimension 6 (recovery environment) for PHP authorization.'},
  humana_med:{name:'Humana Medicaid FL',fw:'ASAM / InterQual',notes:'Comprehensive bio-psychosocial assessment required. PHP requires evidence IOP was insufficient or clinically contraindicated.'},
  united_med:{name:'UHC Community Plan FL',fw:'Optum / ASAM 4th Ed.',notes:'Optum manages BH. ASAM 4th edition. Co-occurring disorder documentation and recovery environment assessment emphasized.'},
  bcbs:{name:'BCBS Florida / Florida Blue',fw:'MCG (Milliman Care Guidelines)',notes:'Uses MCG guidelines rather than ASAM directly. Requires acute clinical need and documented clinical inappropriateness of lower LOC.'},
  cigna:{name:'Cigna Behavioral Health',fw:'ASAM Criteria',notes:'Dimension 3 (emotional/behavioral severity) and Dimension 5 (relapse risk) weighted heavily for PHP authorization.'},
  aetna_comm:{name:'Aetna (Commercial)',fw:'ASAM / MCG',notes:'ASAM for SUD, MCG for MH. Physician or APRN oversight required. Individualized treatment plan with goals required.'},
  uhc_comm:{name:'UnitedHealthcare (Commercial)',fw:'Optum / ASAM 4th Ed.',notes:'Person-centered documentation required — must show daily monitoring need, not just diagnosis. ASAM 4th edition criteria.'},
  humana_comm:{name:'Humana (Commercial)',fw:'ASAM / InterQual',notes:'Psychiatric evaluation and medication management documentation required. Evidence member cannot be safely treated at lower LOC.'},
  magellan:{name:'Magellan Health',fw:'ASAM Criteria',notes:'Measurable treatment goals and demonstrated progress emphasized. Weekly treatment plan reviews required. Documentation of clinical justification for continued LOC.'},
  carelon:{name:'Carelon / Beacon',fw:'ASAM 4th Ed.',notes:'Bio-psychosocial assessment within 24hrs of admission. Daily face-to-face psychiatric contact documentation required. ASAM 4th edition.'},
  tricare:{name:'TRICARE',fw:'ASAM / VA-DoD CPG',notes:'VA/DoD Clinical Practice Guidelines apply. Psychiatric eval within 24hrs required. PHP requires 20+ hours/week of structured programming documentation.'},
  medicare:{name:'Traditional Medicare',fw:'CMS / InterQual',notes:'Physician certification of medical necessity required. 20+ hours/week of therapy. Must document that inpatient hospitalization would otherwise be required.'},
  medicare_adv:{name:'Medicare Advantage',fw:'CMS baseline + plan-specific',notes:'Must meet CMS minimum Medicare PHP criteria. Individual plans may add requirements. ASAM criteria often referenced by MA plans.'}
};
const LOCS={
  detox_med:{label:'Medical Detox',asam:'ASAM 4-WM',dims:['Severe withdrawal requiring 24hr medical management (CIWA ≥15, seizure history, delirium risk)','Significant medical complications (cardiac, hepatic failure, respiratory compromise)','Psychiatric stability sufficient to engage in medically supervised detox process','Willing to engage in medically supervised detox and subsequent treatment','High risk of life-threatening complications (seizure, DTs) without hospital-level monitoring','Environment unsafe or patient physiologically unable to self-monitor']},
  detox_res:{label:'Residential Detox',asam:'ASAM 3.2-WM',dims:['Moderate-severe withdrawal needing 24hr oversight but not hospital-level care (CIWA 8-14)','Biomedical conditions manageable without ICU/hospital (stable vitals, no organ failure)','Sufficient psychiatric stability to participate in residential detox milieu','Engaged in detox process and willing to transition to ongoing treatment','Risk of complications without residential support but hospital level not required','Lacks safe or supportive home environment for ambulatory detox']},
  detox_amb:{label:'Ambulatory Detox',asam:'ASAM 2-WM',dims:['Mild-moderate withdrawal manageable with daily outpatient monitoring (CIWA <8)','No significant biomedical complications or comorbidities affecting detox safety','Psychiatric stability adequate for ambulatory detox management','Motivated and committed to ambulatory detox and follow-through','Moderate complication risk manageable with daily clinical check-ins','Adequate home support and safe environment for ambulatory detox']},
  res_hi:{label:'Residential High Intensity',asam:'ASAM 3.5',dims:['Withdrawal managed or clinically not a primary concern at this stage','Significant biomedical conditions requiring ongoing monitoring within residential setting','Marked psychiatric/emotional instability requiring 24hr structured therapeutic milieu','Limited readiness/insight requiring intensive motivational intervention in structured environment','High relapse potential — unable to maintain abstinence without 24hr structure and supervision','Severely deficient social supports, dangerous living environment, or homelessness']},
  res_lo:{label:'Residential Low Intensity',asam:'ASAM 3.1',dims:['Withdrawal not a primary clinical concern; medically stable','Stable biomedical status manageable within a residential treatment setting','Moderate emotional/behavioral concerns requiring structure of residential environment','Some motivation present; benefits from immersion in 24hr recovery milieu','Significant relapse risk in unstructured community setting','Unstable housing, absent recovery supports, or recovery-hostile living environment']},
  php:{label:'PHP',asam:'ASAM 2.5',dims:['Withdrawal risk requiring daily clinical monitoring but not 24hr residential care','Biomedical conditions stable but requiring daily nursing oversight or medical monitoring','Significant psychiatric/emotional instability requiring daily structured programming (5-7 hrs/day)','Ambivalence, limited insight, or poor coping requiring intensive daily clinical intervention','High relapse potential — failed lower LOC (IOP/OP) or clinically contraindicated; documented cravings/triggers','Recovery environment insufficient to support lower LOC; inadequate home support or high-risk living situation']},
  iop:{label:'IOP',asam:'ASAM 2.1',dims:['Withdrawal risk minimal and manageable without daily medical monitoring','Biomedical conditions stable; not currently affecting treatment participation','Moderate emotional/behavioral symptoms that impair functioning but not requiring daily programming','Willing to engage in structured treatment; some motivation present but needs more than weekly sessions','Moderate relapse risk with identified triggers and inadequate coping skills for less structured setting','Home environment presents challenges but is not acutely destabilizing or recovery-hostile']},
  op:{label:'Standard Outpatient',asam:'ASAM 1.0',dims:['No acute withdrawal concern; medically stable','No significant biomedical complications affecting treatment','Mild-moderate emotional/behavioral symptoms — manageable in weekly outpatient setting','Good motivation, insight, and commitment to treatment plan','Low relapse risk with adequate coping skills and strong recovery network','Stable, supportive living environment conducive to recovery']},
  mat:{label:'MAT / OTP',asam:'OTP',dims:['Opioid use disorder with documented physical dependence requiring pharmacological intervention','Biomedical stability sufficient for community-based MAT administration','Co-occurring psychiatric conditions stable or manageable in outpatient setting','Motivated to engage in MAT protocol, counseling, and random drug screening','Risk of relapse or continued use without pharmacological support','Stable enough for community-based MAT; safe housing accessible for program compliance']},
  inpat:{label:'Inpatient Psych / Dual Dx',asam:'ASAM 4 / Psych Inpat',dims:['Acute severe withdrawal, life-threatening intoxication, or medical instability requiring hospital-level management','Significant acute biomedical conditions requiring inpatient medical care and monitoring','Acute psychiatric crisis — active SI/HI with plan/intent, acute psychosis, severe manic episode, or grave disability','Unable to participate in or benefit from treatment due to acute severity; requires stabilization first','Imminent risk of harm to self or others that cannot be safely managed at lower LOC','Living environment is acutely dangerous, abusive, or patient physically unable to care for self']}
};
const SAMPLE1=`PATIENT: Bradford Baker, DOB 01/27/1979\nADMISSION: 03/27/2026 | CRC Sarasota\n\nMedical Progress Note — 04/02/2026 03:00 PM\nProvider: Rishma Kaur, APRN\n\nPatient is a 47-year-old male presenting for weekly medication management session. Alert, cooperative, fully engaged, well-groomed. Mood reported as "good overall" with some ongoing anxiety; affect congruent. Thought processes coherent, linear, goal-directed. No thought disorganization. Denied SI, HI, and current withdrawal symptoms. Demonstrated good insight. Remains compliant with treatment plan.\n\nPHYSICAL: BP 142/88, HR 52, RR 22. Well-developed. Regular rate. No SOB. Non-distended abdomen. Well-perfused skin. Normal gait. No edema. No focal neurological deficits.\n\nMENTAL STATUS: Well groomed, calm, cooperative. Congruent affect. Fluent speech. Logical and coherent thought process. Denies SI/HI/AH/VH. Alert and oriented x4. Insight good.\n\nMEDICATIONS: Buprenorphine-naloxone 8-2mg sublingual daily (MAT restart), fluoxetine 20mg daily (mood), gabapentin 300mg TID (mood/neuropathy), olanzapine 10mg QHS (mood). NKA.\n\nPLAN: Continue current medications. Monitor progress. Encourage group and individual therapy participation. Follow up weekly or sooner if needed.`;
const SAMPLE2=`PATIENT: Bradford Baker — Week 2 Progress Note 04/09/2026\n\nPatient continues in residential treatment. Attended all scheduled groups this week. Reports cravings rated 4/10 in the evenings, particularly when reminded of prior using environment (home neighborhood). Began opening up in group about family conflict as primary relapse driver. Sleep remains disrupted despite olanzapine.\n\nMSE: Alert and oriented. Mood "frustrated but hopeful." Affect congruent with stated mood. Denies SI/HI. No current withdrawal symptoms. Insight fair and improving with therapy engagement.\n\nPatient expressed some ambivalence about length of stay. Motivational interviewing utilized to address discrepancy between stated goals (sobriety) and ambivalence about structure. Patient agreed to remain through week 4 and revisit discharge plan at that time.\n\nDRUG SCREEN: Negative for all substances except prescribed buprenorphine.\n\nPLAN: Continue medications. Increase individual therapy frequency to 3x/week. Family session scheduled. Monitor sleep, cravings, and relapse triggers. Continue current LOC.`;

let selP='sunshine',selL='php',selP2='sunshine',selL2='php';
let bSlotCount=0;

function setMode(m,el){
  document.querySelectorAll('.mode-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  ['single','concurrent','batch'].forEach(x=>{
    document.getElementById('mode-'+x).classList.toggle('active',x===m);
  });
}
function sp(el){document.querySelectorAll('#mode-single .ptag').forEach(t=>t.classList.remove('sel'));el.classList.add('sel');selP=el.dataset.p}
function sl(el){document.querySelectorAll('#mode-single .ltag').forEach(t=>t.classList.remove('sel'));el.classList.add('sel');selL=el.dataset.l}
function sp2(el){document.querySelectorAll('#concPayerWrap .ptag').forEach(t=>t.classList.remove('sel'));el.classList.add('sel');selP2=el.dataset.p2}
function sl2(el){document.querySelectorAll('#concLocWrap .ltag').forEach(t=>t.classList.remove('sel'));el.classList.add('sel');selL2=el.dataset.l2}

document.getElementById('fileS').addEventListener('change',function(e){
  const f=e.target.files[0];if(!f||f.type!=='text/plain')return;
  const r=new FileReader();r.onload=ev=>{document.getElementById('singleDoc').value=ev.target.result;updateCC()};r.readAsText(f);
});
document.getElementById('singleDoc').addEventListener('input',updateCC);
function updateCC(){document.getElementById('sCC').textContent=document.getElementById('singleDoc').value.length.toLocaleString()+' chars'}

function loadSample(mode){
  if(mode==='single'){document.getElementById('singleDoc').value=SAMPLE1;updateCC()}
  else if(mode==='concurrent'){document.getElementById('concDoc1').value=SAMPLE1;document.getElementById('concDoc2').value=SAMPLE2}
  else if(mode==='batch'){
    document.getElementById('batchSlots').innerHTML='';bSlotCount=0;
    addSlot('Patient A — Baker, Bradford',SAMPLE1);
    addSlot('Patient B — Week 2 Progress',SAMPLE2);
    addSlot('Patient C — Stable Outpatient','PATIENT: Jane M, DOB 06/15/1988\n\nWeekly outpatient check-in. Mood stable, reports 1-2/10 cravings managed with coping skills. No withdrawal symptoms. Compliant with naltrexone 50mg daily. Engaged in weekly individual therapy and AA. Lives with supportive family. Working part-time. No recent use per self-report and UDS negative. Insight and motivation excellent. Treatment goals on track.');
  }
}

function addSlot(label='',prefill=''){
  if(bSlotCount>=8)return;
  bSlotCount++;
  const i=bSlotCount;
  const div=document.createElement('div');
  div.id='bs-'+i;div.className='batch-slot';
  div.innerHTML=`<div class="batch-slot-hdr"><input type="text" id="bl-${i}" value="${label||'Patient '+i}" style="flex:1" placeholder="Patient / document label" /><button class="btn btn-ghost btn-sm" onclick="rmSlot(${i})">Remove</button></div><textarea id="bd-${i}" style="min-height:90px;font-size:12px" placeholder="Paste clinical documentation...">${prefill}</textarea>`;
  document.getElementById('batchSlots').appendChild(div);
}
function rmSlot(i){const el=document.getElementById('bs-'+i);if(el)el.remove()}

const LMSGS=['Parsing clinical documentation...','Mapping ASAM dimensional criteria...','Applying payer-specific requirements...','Evaluating authorization readiness...','Generating gap analysis...'];
function startLoad(msgId){
  let i=0;const el=document.getElementById(msgId);if(!el)return;el.textContent=LMSGS[0];
  return setInterval(()=>{i=(i+1)%LMSGS.length;el.textContent=LMSGS[i]},2200);
}

function showLoader(id,show){
  const el=document.getElementById(id);
  if(el)el.style.display=show?'block':'none';
}

function buildSys(pKey,lKey,extra=''){
  const p=PAYERS[pKey]||PAYERS.sunshine;
  const l=LOCS[lKey]||LOCS.php;
  const dims=l.dims.map((d,i)=>`Dimension ${i+1}: ${d}`).join('\n');
  return `You are a behavioral health utilization review specialist with deep expertise in ASAM criteria and insurance prior authorization requirements. Analyze the provided clinical documentation for authorization readiness.
PAYER: ${p.name}
CRITERIA FRAMEWORK: ${p.fw}
PAYER CONTEXT: ${p.notes}
REQUESTED LEVEL OF CARE: ${l.label} (${l.asam})
ASAM DIMENSIONAL CRITERIA FOR ${l.asam}:
${dims}
${extra}
Return ONLY valid JSON (no markdown fences, no preamble):
{"auth_score":number,"verdict":"likely_approved"|"likely_denied"|"insufficient_documentation"|"needs_supplementation","verdict_label":string,"summary":string,"met_count":number,"partial_count":number,"gap_count":number,"dimensions":[{"id":number,"name":string,"status":"met"|"partial"|"gap","finding":string,"recommendation":string}],"critical_gaps":[string],"payer_specific_issues":[string],"overall_recommendation":string}`;
}

async function callAPI(system,content){
  const resp=await fetch('/api/analyze',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({system,messages:[{role:'user',content}],max_tokens:1000})
  });
  if(!resp.ok){const e=await resp.json().catch(()=>({}));throw new Error(e.error||'API error '+resp.status)}
  const data=await resp.json();
  const txt=data.content.map(i=>i.text||'').join('');
  return JSON.parse(txt.replace(/```json|```/g,'').trim());
}

async function runSingle(){
  const text=document.getElementById('singleDoc').value.trim();
  if(!text){alert('Please add clinical documentation first.');return}
  document.getElementById('singleBtn').disabled=true;
  document.getElementById('single-results').innerHTML='';
  showLoader('single-loading',true);
  const t=startLoad('sLoadMsg');
  try{
    const d=await callAPI(buildSys(selP,selL),text);
    clearInterval(t);showLoader('single-loading',false);
    renderSingle(d,selP,selL,text);
  }catch(e){
    clearInterval(t);showLoader('single-loading',false);
    document.getElementById('single-results').innerHTML=`<div class="error-box">Analysis failed: ${e.message}. Please check your API key is set in Vercel environment variables.</div>`;
  }
  document.getElementById('singleBtn').disabled=false;
}

async function runConcurrent(){
  const d1=document.getElementById('concDoc1').value.trim();
  const d2=document.getElementById('concDoc2').value.trim();
  if(!d1||!d2){alert('Please provide both the initial and concurrent documents.');return}
  document.getElementById('concBtn').disabled=true;
  document.getElementById('conc-results').innerHTML='';
  showLoader('conc-loading',true);
  const t=startLoad('cLoadMsg');
  const extra=`Additionally, you are performing a CONCURRENT STAY review — comparing an initial authorization note against a current progress note. Assess whether clinical acuity justifies continued stay, step-down, or step-up. Add a "continued_stay_assessment" field: {"status":"supported"|"step_down_indicated"|"step_up_indicated"|"insufficient_evidence","rationale":string,"trajectory":string}`;
  try{
    const d=await callAPI(buildSys(selP2,selL2,extra),`INITIAL AUTH NOTE:\n${d1}\n\n---\nCURRENT PROGRESS NOTE (for continued stay):\n${d2}`);
    clearInterval(t);showLoader('conc-loading',false);
    renderConcurrent(d,selP2,selL2);
  }catch(e){
    clearInterval(t);showLoader('conc-loading',false);
    document.getElementById('conc-results').innerHTML=`<div class="error-box">Analysis failed: ${e.message}</div>`;
  }
  document.getElementById('concBtn').disabled=false;
}

async function runBatch(){
  const pKey=document.getElementById('batchPayer').value;
  const lKey=document.getElementById('batchLoc').value;
  const slots=[];
  for(let i=1;i<=10;i++){
    const d=document.getElementById('bd-'+i);
    const l=document.getElementById('bl-'+i);
    if(d&&d.value.trim())slots.push({label:l?l.value||'Patient '+i:'Patient '+i,text:d.value.trim()});
  }
  if(!slots.length){alert('Please add at least one document.');return}
  document.getElementById('batchBtn').disabled=true;
  document.getElementById('batch-results').innerHTML='';
  showLoader('batch-loading',true);
  document.getElementById('bLoadMsg').textContent=`Analyzing ${slots.length} document${slots.length>1?'s':''}...`;
  document.getElementById('bLoadSub').textContent='Processing sequentially — please wait';
  const results=[];
  for(let i=0;i<slots.length;i++){
    document.getElementById('bLoadMsg').textContent=`Analyzing ${i+1} of ${slots.length}: ${slots[i].label}`;
    try{const d=await callAPI(buildSys(pKey,lKey),slots[i].text);results.push({...slots[i],data:d,pKey,lKey})}
    catch(e){results.push({...slots[i],error:e.message,pKey,lKey})}
  }
  showLoader('batch-loading',false);
  renderBatch(results,pKey,lKey);
  document.getElementById('batchBtn').disabled=false;
}

function sc(s){return s>=70?'sd-high':s>=40?'sd-mid':'sd-low'}
function vc(v){return{likely_approved:'vc-approved',likely_denied:'vc-denied',needs_supplementation:'vc-supp',insufficient_documentation:'vc-insuff'}[v]||'vc-supp'}
function dc(s){return{met:'dot-g',partial:'dot-a',gap:'dot-r'}[s]}
function bc(s){return{met:'b-met',partial:'b-par',gap:'b-gap'}[s]}
function bl(s){return{met:'Met',partial:'Partial',gap:'Gap'}[s]}

function renderDims(dims,prefix='d'){
  return dims.map((dim,i)=>`<div class="dim-row">
    <div class="dim-hdr" onclick="td('${prefix}${i}')">
      <div class="dot ${dc(dim.status)}"></div>
      <div class="dim-name">Dim.${dim.id} — ${dim.name}</div>
      <span class="badge ${bc(dim.status)}">${bl(dim.status)}</span>
      <span class="chevron" id="cv-${prefix}${i}">▼</span>
    </div>
    <div class="dim-body" id="db-${prefix}${i}">
      <p>${dim.finding}</p>
      <div class="rec-box"><strong>Add to documentation</strong>${dim.recommendation}</div>
    </div>
  </div>`).join('');
}
function td(id){
  const b=document.getElementById('db-'+id),c=document.getElementById('cv-'+id);
  if(b){b.classList.toggle('open');if(c)c.textContent=b.classList.contains('open')?'▲':'▼'}
}

function renderSingle(d,pKey,lKey,originalText){
  const p=PAYERS[pKey]||PAYERS.sunshine;
  const l=LOCS[lKey]||LOCS.php;
  let h=`<div class="panel">
    <div style="text-align:center;padding:.75rem 0 1rem">
      <div class="score-donut ${sc(d.auth_score)}">${Math.round(d.auth_score)}%</div>
      <span class="verdict-chip ${vc(d.verdict)}">${d.verdict_label}</span>
      <div style="font-size:11px;color:var(--ink4);font-family:var(--mono);margin-top:4px">${p.name} · ${l.label} (${l.asam})</div>
    </div>
    <div class="payer-info-bar"><strong>${p.fw}</strong> — ${p.notes}</div>
    <div class="sum-box">${d.summary}</div>
    <div class="stats-row">
      <div class="stat-box"><div class="sbl">Criteria met</div><div class="sbv g">${d.met_count}</div></div>
      <div class="stat-box"><div class="sbl">Partial</div><div class="sbv a">${d.partial_count}</div></div>
      <div class="stat-box"><div class="sbl">Gaps</div><div class="sbv r">${d.gap_count}</div></div>
    </div>`;
  if(d.critical_gaps?.length){
    h+=`<div style="margin-bottom:1rem"><div class="slabel">Critical gaps</div>`;
    d.critical_gaps.forEach(g=>{h+=`<div class="crit-item"><div class="crit-dot"></div><span class="crit-text">${g}</span></div>`});
    h+=`</div>`;
  }
  if(d.payer_specific_issues?.length){
    h+=`<div style="margin-bottom:1rem"><div class="slabel">Payer-specific requirements</div>`;
    d.payer_specific_issues.forEach(g=>{h+=`<div class="crit-item"><div class="crit-dot blue"></div><span class="crit-text">${g}</span></div>`});
    h+=`</div>`;
  }
  h+=`<div class="slabel" style="margin-bottom:6px">ASAM dimensional assessment</div>${renderDims(d.dimensions,'s')}`;
  h+=`<div style="margin-top:1rem"><div class="slabel">Recommendation</div><div class="sum-box"><strong>Next step:</strong> ${d.overall_recommendation}</div></div>`;
  h+=`<div class="action-bar">
    <button class="btn btn-accent" onclick="draftRemediation(window._sData.d,window._sData.text,'${pKey}','${lKey}',this)">Draft remediation language ↗</button>
    <button class="btn" onclick="doExport('single')">Export PDF report</button>
    <button class="btn btn-ghost" onclick="document.getElementById('single-results').innerHTML='';document.getElementById('singleDoc').value='';updateCC()">Clear</button>
  </div>
  <div id="rem-single"></div>
  </div>`;
  window._sData={d,pKey,lKey,text:originalText};
  document.getElementById('single-results').innerHTML=h;
  document.getElementById('single-results').scrollIntoView({behavior:'smooth',block:'start'});
}

function renderConcurrent(d,pKey,lKey){
  const p=PAYERS[pKey]||PAYERS.sunshine;
  const l=LOCS[lKey]||LOCS.php;
  const cs=d.continued_stay_assessment;
  const csColors={supported:'vc-approved',step_down_indicated:'vc-supp',step_up_indicated:'vc-denied',insufficient_evidence:'vc-insuff'};
  const csLabels={supported:'Continued stay supported',step_down_indicated:'Step-down indicated',step_up_indicated:'Step-up indicated',insufficient_evidence:'Insufficient evidence for continued stay'};
  const csCard={supported:'',step_down_indicated:'step-down',step_up_indicated:'step-up',insufficient_evidence:'insuff'};
  let h=`<div class="panel">
    <div style="text-align:center;padding:.75rem 0 1rem">
      <div class="score-donut ${sc(d.auth_score)}">${Math.round(d.auth_score)}%</div>
      <span class="verdict-chip ${vc(d.verdict)}">${d.verdict_label}</span>
      <div style="font-size:11px;color:var(--ink4);font-family:var(--mono);margin-top:4px">${p.name} · ${l.label} — Continued Stay Review</div>
    </div>`;
  if(cs){
    h+=`<div style="margin-bottom:1rem">
      <div class="slabel">Continued stay assessment</div>
      <div class="cs-card ${csCard[cs.status]||''}">
        <span class="verdict-chip ${csColors[cs.status]||'vc-supp'}" style="margin-bottom:6px;display:inline-block">${csLabels[cs.status]||cs.status}</span>
        <div style="font-size:12px;color:var(--ink3);line-height:1.7;margin-bottom:4px">${cs.rationale||''}</div>
        ${cs.trajectory?`<div style="font-size:11px;font-family:var(--mono);color:var(--ink3)">Clinical trajectory: ${cs.trajectory}</div>`:''}
      </div>
    </div>`;
  }
  h+=`<div class="sum-box">${d.summary}</div>
    <div class="stats-row">
      <div class="stat-box"><div class="sbl">Met</div><div class="sbv g">${d.met_count}</div></div>
      <div class="stat-box"><div class="sbl">Partial</div><div class="sbv a">${d.partial_count}</div></div>
      <div class="stat-box"><div class="sbl">Gaps</div><div class="sbv r">${d.gap_count}</div></div>
    </div>
    <div class="slabel" style="margin-bottom:6px">Dimensional assessment (concurrent note)</div>
    ${renderDims(d.dimensions,'c')}
    <div style="margin-top:1rem"><div class="slabel">Recommendation</div><div class="sum-box"><strong>Next step:</strong> ${d.overall_recommendation}</div></div>
    <div class="action-bar">
      <button class="btn" onclick="doExport('concurrent')">Export PDF report</button>
    </div>
  </div>`;
  window._cData=d;
  document.getElementById('conc-results').innerHTML=h;
  document.getElementById('conc-results').scrollIntoView({behavior:'smooth',block:'start'});
}

function renderBatch(results,pKey,lKey){
  const p=PAYERS[pKey]||PAYERS.sunshine;
  const l=LOCS[lKey]||LOCS.php;
  const valid=results.filter(r=>r.data);
  const avg=valid.length?Math.round(valid.reduce((s,r)=>s+r.data.auth_score,0)/valid.length):0;
  const approved=valid.filter(r=>r.data.verdict==='likely_approved').length;
  const denied=valid.filter(r=>r.data.verdict==='likely_denied').length;
  let h=`<div class="panel">
    <div class="panel-title">Batch summary — ${results.length} document${results.length>1?'s':''}</div>
    <div style="font-size:11px;font-family:var(--mono);color:var(--ink3);margin-bottom:10px">${p.name} · ${l.label} (${l.asam})</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:1.25rem">
      <div class="stat-box"><div class="sbl">Avg score</div><div class="sbv ${avg>=70?'g':avg>=40?'a':'r'}">${avg}%</div></div>
      <div class="stat-box"><div class="sbl">Likely approved</div><div class="sbv g">${approved}</div></div>
      <div class="stat-box"><div class="sbl">Likely denied</div><div class="sbv r">${denied}</div></div>
      <div class="stat-box"><div class="sbl">Needs work</div><div class="sbv a">${valid.length-approved-denied}</div></div>
    </div>
    <div class="slabel" style="margin-bottom:8px">Individual results</div>`;

  results.forEach((r,idx)=>{
    if(r.error){
      h+=`<div class="dim-row"><div class="dim-hdr"><div class="dot dot-r"></div><div class="dim-name">${r.label}</div><span style="font-size:11px;color:var(--ink4);font-family:var(--mono)">Error: ${r.error}</span></div></div>`;
      return;
    }
    const dd=r.data;
    h+=`<div class="dim-row">
      <div class="dim-hdr" onclick="td('b${idx}')">
        <div class="dot ${dc(dd.auth_score>=70?'met':dd.auth_score>=40?'partial':'gap')}"></div>
        <div class="dim-name">${r.label}</div>
        <span style="font-size:12px;font-family:var(--mono);font-weight:500;margin-right:6px;color:${dd.auth_score>=70?'#065f46':dd.auth_score>=40?'#92400e':'#b91c1c'}">${Math.round(dd.auth_score)}%</span>
        <span class="badge ${vc(dd.verdict)}">${dd.verdict_label}</span>
        <span class="chevron" id="cv-b${idx}" style="margin-left:6px">▼</span>
      </div>
      <div class="dim-body" id="db-b${idx}">
        <div class="sum-box" style="margin-bottom:10px">${dd.summary}</div>
        ${dd.critical_gaps?.map(g=>`<div class="crit-item"><div class="crit-dot"></div><span class="crit-text">${g}</span></div>`).join('')||''}
        <div style="margin-top:10px">${renderDims(dd.dimensions,'b${idx}x')}</div>
        <div class="action-bar" style="margin-top:8px;padding-top:8px">
          <button class="btn btn-accent btn-sm" onclick="draftRemediation(window._bData[${idx}].data,window._bData[${idx}].text,'${pKey}','${lKey}',this,'brem${idx}')">Draft remediation ↗</button>
        </div>
        <div id="brem${idx}"></div>
      </div>
    </div>`;
  });

  h+=`<div class="action-bar">
    <button class="btn" onclick="doExport('batch')">Export batch PDF report</button>
  </div></div>`;
  window._bData=results;
  document.getElementById('batch-results').innerHTML=h;
  document.getElementById('batch-results').scrollIntoView({behavior:'smooth',block:'start'});
}

async function draftRemediation(d,originalText,pKey,lKey,btn,targetId='rem-single'){
  const gaps=d.dimensions.filter(x=>x.status==='gap'||x.status==='partial');
  if(!gaps.length){alert('No gaps found — documentation appears sufficient for this level of care.');return}
  const orig=btn.textContent;
  btn.disabled=true;btn.textContent='Drafting...';
  const p=PAYERS[pKey]||PAYERS.sunshine;
  const l=LOCS[lKey]||LOCS.php;
  const sys=`You are a behavioral health documentation specialist. Write specific supplemental clinical language the provider should add to their documentation to strengthen prior authorization for ${l.label} (${l.asam}) with ${p.name}. Language must be clinically accurate, specific, and written in the style of a clinical progress note or addendum. Return ONLY valid JSON: {"addendum_intro":string,"remediations":[{"dimension":string,"draft_language":string}]}`;
  const msg=`ORIGINAL CLINICAL NOTE:\n${originalText}\n\nGAPS TO ADDRESS:\n${gaps.map(g=>`Dim ${g.id} — ${g.name}: ${g.recommendation}`).join('\n')}`;
  try{
    const parsed=await callAPI(sys,msg);
    const target=document.getElementById(targetId);
    if(!target)return;
    let h=`<div class="rem-card">
      <div class="rem-card-hdr"><span>Remediation draft — addendum language</span><button class="btn btn-sm" onclick="copyRem('${targetId}-content')">Copy all text</button></div>
      <div class="rem-card-body" id="${targetId}-content">`;
    if(parsed.addendum_intro){h+=`<div style="font-size:12px;color:var(--ink3);line-height:1.7;margin-bottom:12px;font-style:italic;padding:8px 10px;background:var(--surface2);border-radius:var(--radius)">${parsed.addendum_intro}</div>`}
    parsed.remediations.forEach(r=>{
      h+=`<div class="rem-dim"><div class="rem-dim-label">${r.dimension}</div><div class="rem-dim-text">${r.draft_language}</div></div>`;
    });
    h+=`</div></div>`;
    target.innerHTML=h;
    target.scrollIntoView({behavior:'smooth',block:'start'});
  }catch(e){alert('Remediation drafting failed: '+e.message)}
  btn.disabled=false;btn.textContent=orig;
}

function copyRem(id){
  const el=document.getElementById(id);if(!el)return;
  navigator.clipboard.writeText(el.innerText||el.textContent).then(()=>{
    const b=event.target;const orig=b.textContent;b.textContent='Copied!';setTimeout(()=>b.textContent=orig,2000);
  }).catch(()=>alert('Could not copy — please select and copy manually.'));
}

function doExport(mode){
  let title='Authorization Review Report';
  let lines=[];
  const ts=new Date().toLocaleString();
  lines.push('AUTH.REVIEW — Prior Authorization Review Platform');
  lines.push('Generated: '+ts);
  lines.push('');
  if(mode==='single'&&window._sData){
    const{d,pKey,lKey}=window._sData;
    lines=lines.concat(buildReport(d,PAYERS[pKey]||PAYERS.sunshine,LOCS[lKey]||LOCS.php,'Single Document Review'));
  } else if(mode==='concurrent'&&window._cData){
    const d=window._cData;title='Concurrent Stay Authorization Report';
    lines=lines.concat(buildReport(d,PAYERS[selP2]||PAYERS.sunshine,LOCS[selL2]||LOCS.php,'Concurrent Stay Review'));
    if(d.continued_stay_assessment){
      const cs=d.continued_stay_assessment;
      lines.push('CONTINUED STAY ASSESSMENT');lines.push('-'.repeat(50));
      lines.push('Status: '+cs.status);lines.push('Rationale: '+cs.rationale);
      if(cs.trajectory)lines.push('Trajectory: '+cs.trajectory);lines.push('');
    }
  } else if(mode==='batch'&&window._bData){
    title='Batch Authorization Review Report';
    window._bData.forEach((r,i)=>{
      if(r.data)lines=lines.concat(buildReport(r.data,PAYERS[r.pKey]||PAYERS.sunshine,LOCS[r.lKey]||LOCS.php,`Document ${i+1}: ${r.label}`));
      lines.push('');lines.push('='.repeat(60));lines.push('');
    });
  } else {alert('No results to export yet.');return}
  openPrint(title,lines.join('\n'));
}

function buildReport(d,p,l,heading){
  const lines=[];
  lines.push(heading);lines.push('='.repeat(60));
  lines.push('Payer: '+p.name);lines.push('Level of Care: '+l.label+' ('+l.asam+')');
  lines.push('Framework: '+p.fw);lines.push('');
  lines.push('AUTHORIZATION READINESS: '+Math.round(d.auth_score)+'%');
  lines.push('VERDICT: '+d.verdict_label);lines.push('');
  lines.push('SUMMARY:');lines.push(d.summary);lines.push('');
  lines.push('DIMENSIONAL ASSESSMENT:');lines.push('-'.repeat(50));
  d.dimensions.forEach(dim=>{
    lines.push(`Dim.${dim.id} — ${dim.name}: [${dim.status.toUpperCase()}]`);
    lines.push('  Finding: '+dim.finding);lines.push('  Add: '+dim.recommendation);lines.push('');
  });
  if(d.critical_gaps?.length){lines.push('CRITICAL GAPS:');d.critical_gaps.forEach(g=>lines.push('• '+g));lines.push('')}
  if(d.payer_specific_issues?.length){lines.push('PAYER-SPECIFIC ISSUES:');d.payer_specific_issues.forEach(g=>lines.push('• '+g));lines.push('')}
  lines.push('RECOMMENDATION:');lines.push(d.overall_recommendation);
  return lines;
}

function openPrint(title,content){
  const w=window.open('','_blank','width=820,height=700');
  if(!w){alert('Please allow popups to export the PDF report.');return}
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    body{font-family:'Courier New',monospace;font-size:12px;line-height:1.7;padding:40px;max-width:740px;margin:0 auto;color:#111;background:#fff}
    h1{font-size:14px;margin-bottom:4px;font-family:sans-serif}
    .sub{font-size:11px;color:#666;margin-bottom:24px;font-family:sans-serif}
    pre{white-space:pre-wrap;word-break:break-word}
    .no-print{margin-bottom:20px}
    button{font-family:monospace;padding:8px 18px;cursor:pointer;border:1px solid #ccc;border-radius:4px;background:#f5f5f5;font-size:12px;margin-right:8px}
    @media print{.no-print{display:none}body{padding:20px}}
  </style></head><body>
  <div class="no-print">
    <button onclick="window.print()">Print / Save as PDF</button>
    <button onclick="navigator.clipboard.writeText(document.getElementById('rc').innerText).then(()=>alert('Copied!'))">Copy text</button>
  </div>
  <h1>${title}</h1>
  <pre id="rc">${content.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
  </body></html>`);
  w.document.close();
}

addSlot();
</script>
</body>
</html>
