// ===== Model Presets =====
const MODEL_PRESETS = {
  'llama-7b':    { params: 7,    layers: 32,  hiddenDim: 4096,  heads: 32, kvHeads: 32, name: 'LLaMA-2 7B' },
  'llama-13b':   { params: 13,   layers: 40,  hiddenDim: 5120,  heads: 40, kvHeads: 40, name: 'LLaMA-2 13B' },
  'llama-70b':   { params: 70,   layers: 80,  hiddenDim: 8192,  heads: 64, kvHeads: 8,  name: 'LLaMA-2 70B' },
  'llama3-8b':   { params: 8,    layers: 32,  hiddenDim: 4096,  heads: 32, kvHeads: 8,  name: 'LLaMA-3 8B' },
  'llama3-70b':  { params: 70,   layers: 80,  hiddenDim: 8192,  heads: 64, kvHeads: 8,  name: 'LLaMA-3 70B' },
  'llama3-405b': { params: 405,  layers: 126, hiddenDim: 16384, heads: 128, kvHeads: 8, name: 'LLaMA-3.1 405B' },
  'qwen2-7b':    { params: 7.6,  layers: 28,  hiddenDim: 3584,  heads: 28, kvHeads: 4,  name: 'Qwen-2.5 7B' },
  'qwen2-14b':   { params: 14.7, layers: 48,  hiddenDim: 5120,  heads: 40, kvHeads: 8,  name: 'Qwen-2.5 14B' },
  'qwen2-72b':   { params: 72.7, layers: 80,  hiddenDim: 8192,  heads: 64, kvHeads: 8,  name: 'Qwen-2.5 72B' },
  'mistral-7b':  { params: 7.2,  layers: 32,  hiddenDim: 4096,  heads: 32, kvHeads: 8,  name: 'Mistral 7B' },
  'mixtral-8x7b': { params: 46.7, layers: 32, hiddenDim: 4096,  heads: 32, kvHeads: 8,  name: 'Mixtral 8×7B' },
  'deepseek-v3': { params: 671,  layers: 61,  hiddenDim: 7168,  heads: 128, kvHeads: 128, name: 'DeepSeek-V3 671B' },
  'deepseek-r1': { params: 671,  layers: 61,  hiddenDim: 7168,  heads: 128, kvHeads: 128, name: 'DeepSeek-R1 671B' },
};

// ===== GPU Database =====
const GPUS = [
  { name: 'RTX 4090',    vram: 24  },
  { name: 'A100 40GB',   vram: 40  },
  { name: 'A100 80GB',   vram: 80  },
  { name: 'H100 80GB',   vram: 80  },
  { name: 'H200 141GB',  vram: 141 },
  { name: 'B200 192GB',  vram: 192 },
];

// ===== DOM References =====
const $ = id => document.getElementById(id);

const els = {
  preset:         $('model-preset'),
  params:         $('params'),
  weightPrecision: $('weight-precision'),
  numLayers:      $('num-layers'),
  hiddenDim:      $('hidden-dim'),
  numHeads:       $('num-heads'),
  numKvHeads:     $('num-kv-heads'),
  seqLen:         $('seq-len'),
  batchSize:      $('batch-size'),
  kvPrecision:    $('kv-precision'),
  overhead:       $('overhead'),
  calcBtn:        $('calculate-btn'),
  placeholder:    $('results-placeholder'),
  content:        $('results-content'),
  totalVram:      $('total-vram'),
  totalSub:       $('total-sub'),
  valWeights:     $('val-weights'),
  valKv:          $('val-kv'),
  valActivation:  $('val-activation'),
  valOverhead:    $('val-overhead'),
  barWeights:     $('bar-weights'),
  barKv:          $('bar-kv'),
  barActivation:  $('bar-activation'),
  barOverhead:    $('bar-overhead'),
  formulaWeights: $('formula-weights'),
  formulaKv:      $('formula-kv'),
  formulaActivation: $('formula-activation'),
  formulaOverhead:$('formula-overhead'),
  gpuList:        $('gpu-list'),
  attentionInfo:  $('attention-info'),
};

// ===== Preset Loading =====
els.preset.addEventListener('change', () => {
  const key = els.preset.value;
  if (!key || !MODEL_PRESETS[key]) return;
  const p = MODEL_PRESETS[key];
  els.params.value    = p.params;
  els.numLayers.value = p.layers;
  els.hiddenDim.value = p.hiddenDim;
  els.numHeads.value  = p.heads;
  els.numKvHeads.value = p.kvHeads;
});

// ===== Calculation =====
function calculate() {
  const params        = parseFloat(els.params.value) || 0;
  const weightBytes   = parseFloat(els.weightPrecision.value) || 2;
  const numLayers     = parseInt(els.numLayers.value) || 0;
  const hiddenDim     = parseInt(els.hiddenDim.value) || 0;
  const numHeads      = parseInt(els.numHeads.value) || 1;
  const numKvHeads    = parseInt(els.numKvHeads.value) || 1;
  const seqLen        = parseInt(els.seqLen.value) || 0;
  const batchSize     = parseInt(els.batchSize.value) || 1;
  const kvBytes       = parseFloat(els.kvPrecision.value) || 2;
  const overheadPct   = parseFloat(els.overhead.value) || 0;

  const headDim = hiddenDim / numHeads;
  const BYTES_PER_GB = 1024 ** 3;

  // 1. Model Weights
  const weightMem = (params * 1e9 * weightBytes) / BYTES_PER_GB;

  // 2. KV Cache
  // Per token per layer: 2 (K+V) × kv_heads × head_dim × kv_bytes
  const kvCachePerToken = 2 * numKvHeads * headDim * kvBytes;
  const kvCache = (batchSize * seqLen * numLayers * kvCachePerToken) / BYTES_PER_GB;

  // 3. Activation Memory
  // Approximate: batch × seq × hidden × layers × 2 × precision (simplified)
  const activationMem = (batchSize * seqLen * hiddenDim * numLayers * 2 * kvBytes) / BYTES_PER_GB;

  // 4. Overhead
  const subtotal = weightMem + kvCache + activationMem;
  const overheadMem = subtotal * (overheadPct / 100);

  // 5. Total
  const total = subtotal + overheadMem;

  // Determine attention type
  let attnType = 'MHA (Multi-Head Attention)';
  if (numKvHeads === 1) {
    attnType = 'MQA (Multi-Query Attention)';
  } else if (numKvHeads < numHeads) {
    attnType = `GQA (Grouped-Query Attention, ${numHeads / numKvHeads}:1)`;
  }

  return {
    weightMem,
    kvCache,
    activationMem,
    overheadMem,
    total,
    params,
    weightBytes,
    numLayers,
    hiddenDim,
    numHeads,
    numKvHeads,
    headDim,
    seqLen,
    batchSize,
    kvBytes,
    overheadPct,
    attnType,
  };
}

// ===== Formatting =====
function formatGB(gb) {
  if (gb >= 1000) return (gb / 1000).toFixed(2) + ' TB';
  if (gb >= 100) return gb.toFixed(1) + ' GB';
  if (gb >= 10) return gb.toFixed(2) + ' GB';
  if (gb >= 1) return gb.toFixed(2) + ' GB';
  return (gb * 1024).toFixed(1) + ' MB';
}

function precisionLabel(bytes) {
  const map = { 4: 'FP32', 2: 'FP16/BF16', 1: 'FP8/INT8', 0.5: 'INT4' };
  return map[bytes] || `${bytes}B`;
}

// ===== Rendering =====
function render(r) {
  // Show results
  els.placeholder.style.display = 'none';
  els.content.style.display = 'block';

  // Trigger re-animation
  els.content.style.animation = 'none';
  els.content.offsetHeight; // reflow
  els.content.style.animation = '';

  // Total
  els.totalVram.textContent = formatGB(r.total);
  const gpuCount80 = Math.ceil(r.total / 80);
  const gpuCount24 = Math.ceil(r.total / 24);
  els.totalSub.textContent = `≈ ${gpuCount80} × A100/H100 (80GB) | ≈ ${gpuCount24} × RTX 4090 (24GB)`;

  // Breakdown values
  els.valWeights.textContent = formatGB(r.weightMem);
  els.valKv.textContent = formatGB(r.kvCache);
  els.valActivation.textContent = formatGB(r.activationMem);
  els.valOverhead.textContent = formatGB(r.overheadMem);

  // Bars (relative to total)
  const maxForBar = r.total;
  requestAnimationFrame(() => {
    els.barWeights.style.width    = (r.weightMem / maxForBar * 100).toFixed(1) + '%';
    els.barKv.style.width         = (r.kvCache / maxForBar * 100).toFixed(1) + '%';
    els.barActivation.style.width = (r.activationMem / maxForBar * 100).toFixed(1) + '%';
    els.barOverhead.style.width   = (r.overheadMem / maxForBar * 100).toFixed(1) + '%';
  });

  // Formulas
  els.formulaWeights.textContent =
    `${r.params}B × ${r.weightBytes} bytes = ${formatGB(r.weightMem)} (${precisionLabel(r.weightBytes)})`;

  els.formulaKv.textContent =
    `${r.batchSize} × ${r.seqLen} × 2 × ${r.numLayers}L × ${r.numKvHeads}kv × ${r.headDim}d × ${r.kvBytes}B = ${formatGB(r.kvCache)}`;

  els.formulaActivation.textContent =
    `${r.batchSize} × ${r.seqLen} × ${r.hiddenDim} × ${r.numLayers}L × 2 × ${r.kvBytes}B ≈ ${formatGB(r.activationMem)}`;

  els.formulaOverhead.textContent =
    `(${formatGB(r.weightMem + r.kvCache + r.activationMem)}) × ${r.overheadPct}% = ${formatGB(r.overheadMem)}`;

  // GPU Comparison
  renderGPUs(r.total);

  // Attention info
  els.attentionInfo.innerHTML =
    `<strong>注意力类型：</strong>${r.attnType}` +
    ` | <strong>Head Dim：</strong>${r.headDim}` +
    ` | <strong>KV Cache 比例：</strong>${(r.kvCache / r.total * 100).toFixed(1)}%`;
}

function renderGPUs(totalGB) {
  els.gpuList.innerHTML = '';

  GPUS.forEach(gpu => {
    const pct = (totalGB / gpu.vram * 100);
    const fillPct = Math.min(pct, 100);

    let className = 'fit';
    if (pct > 100) className = 'overflow';
    else if (pct > 70) className = 'tight';

    const item = document.createElement('div');
    item.className = 'gpu-item';

    const statusIcon = pct <= 100 ? '✓' : '✗';
    const statusText = pct <= 100 ? `${pct.toFixed(0)}%` : `${pct.toFixed(0)}% 超出`;

    item.innerHTML = `
      <span class="gpu-name">${gpu.name}</span>
      <div class="gpu-bar-wrapper">
        <div class="gpu-bar-fill ${className}" style="width: 0%">
          <span class="gpu-bar-text">${statusIcon} ${statusText}</span>
        </div>
      </div>
      <span class="gpu-capacity">${gpu.vram}GB</span>
    `;
    els.gpuList.appendChild(item);

    // Animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        item.querySelector('.gpu-bar-fill').style.width = fillPct + '%';
      });
    });
  });
}

// ===== Event Listeners =====
els.calcBtn.addEventListener('click', () => {
  const result = calculate();
  render(result);
});

// Allow Enter key to calculate
document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      els.calcBtn.click();
    }
  });
});

// Auto-calculate on preset change
els.preset.addEventListener('change', () => {
  // Allow DOM to update first
  setTimeout(() => {
    const result = calculate();
    render(result);
  }, 50);
});

// Calculate on page load with defaults
window.addEventListener('DOMContentLoaded', () => {
  const result = calculate();
  render(result);
});
