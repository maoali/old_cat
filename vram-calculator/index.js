// ===== Built-in Model Presets =====
const BUILTIN_PRESETS = {
  'llama-7b': { params: 7, layers: 32, hiddenDim: 4096, heads: 32, kvHeads: 32, weightBytes: 2, maxSeqLen: 4096, name: 'LLaMA-2 7B', group: 'LLaMA 系列' },
  'llama-13b': { params: 13, layers: 40, hiddenDim: 5120, heads: 40, kvHeads: 40, weightBytes: 2, maxSeqLen: 4096, name: 'LLaMA-2 13B', group: 'LLaMA 系列' },
  'llama-70b': { params: 70, layers: 80, hiddenDim: 8192, heads: 64, kvHeads: 8, weightBytes: 2, maxSeqLen: 4096, name: 'LLaMA-2 70B', group: 'LLaMA 系列' },
  'llama3-8b': { params: 8, layers: 32, hiddenDim: 4096, heads: 32, kvHeads: 8, weightBytes: 2, maxSeqLen: 8192, name: 'LLaMA-3 8B', group: 'LLaMA 系列' },
  'llama3-70b': { params: 70, layers: 80, hiddenDim: 8192, heads: 64, kvHeads: 8, weightBytes: 2, maxSeqLen: 8192, name: 'LLaMA-3 70B', group: 'LLaMA 系列' },
  'llama3-405b': { params: 405, layers: 126, hiddenDim: 16384, heads: 128, kvHeads: 8, weightBytes: 2, maxSeqLen: 131072, name: 'LLaMA-3.1 405B', group: 'LLaMA 系列' },
  'qwen2-7b': { params: 7.6, layers: 28, hiddenDim: 3584, heads: 28, kvHeads: 4, weightBytes: 2, maxSeqLen: 131072, name: 'Qwen-2.5 7B', group: 'Qwen 系列' },
  'qwen2-14b': { params: 14.7, layers: 48, hiddenDim: 5120, heads: 40, kvHeads: 8, weightBytes: 2, maxSeqLen: 131072, name: 'Qwen-2.5 14B', group: 'Qwen 系列' },
  'qwen2-72b': { params: 72.7, layers: 80, hiddenDim: 8192, heads: 64, kvHeads: 8, weightBytes: 2, maxSeqLen: 131072, name: 'Qwen-2.5 72B', group: 'Qwen 系列' },
  'mistral-7b': { params: 7.2, layers: 32, hiddenDim: 4096, heads: 32, kvHeads: 8, weightBytes: 2, maxSeqLen: 32768, name: 'Mistral 7B', group: 'Mistral 系列' },
  'mixtral-8x7b': { params: 46.7, layers: 32, hiddenDim: 4096, heads: 32, kvHeads: 8, weightBytes: 2, maxSeqLen: 32768, name: 'Mixtral 8×7B (MoE)', group: 'Mistral 系列', numExperts: 8, expertsPerToken: 2 },
  'deepseek-v3': { params: 671, layers: 61, hiddenDim: 7168, heads: 128, kvHeads: 128, weightBytes: 2, maxSeqLen: 163840, name: 'DeepSeek-V3 671B (MoE)', group: 'DeepSeek 系列', numExperts: 256, expertsPerToken: 8 },
  'deepseek-r1': { params: 671, layers: 61, hiddenDim: 7168, heads: 128, kvHeads: 128, weightBytes: 2, maxSeqLen: 163840, name: 'DeepSeek-R1 671B (MoE)', group: 'DeepSeek 系列', numExperts: 256, expertsPerToken: 8 },
  'glm-5': { params: 753.9, layers: 78, hiddenDim: 6144, heads: 64, kvHeads: 64, weightBytes: 2, maxSeqLen: 131072, name: 'GLM-5 744B (MoE)', group: 'GLM 系列', numExperts: 256, expertsPerToken: 8 },
};

// ===== GPU Database =====
const GPUS = [
  { name: 'RTX 4090', vram: 24 },
  { name: 'RTX 5090', vram: 32 },
  { name: 'A100 40GB', vram: 40 },
  { name: 'RTX 6000 Ada', vram: 48 },
  { name: 'RTX PRO 5000', vram: 72 },
  { name: 'A100 80GB', vram: 80 },
  { name: 'H100 80GB', vram: 80 },
  { name: 'H20 96GB', vram: 96 },
  { name: 'H20 141GB', vram: 141 },
  { name: 'RTX PRO 6000', vram: 96 },
  { name: 'H200 141GB', vram: 141 },
  { name: 'B200 192GB', vram: 192 },
  { name: 'B300 288GB', vram: 288 },
];

// ===== Storage Keys =====
const HF_MODELS_KEY = 'vram_calc_hf_models';
const HF_TIMESTAMP_KEY = 'vram_calc_hf_timestamp';

// ===== Active Presets (merged) =====
let allPresets = { ...BUILTIN_PRESETS };

// ===== DOM References =====
const $ = id => document.getElementById(id);

const els = {
  preset: $('model-preset'),
  params: $('params'),
  weightPrecision: $('weight-precision'),
  numLayers: $('num-layers'),
  hiddenDim: $('hidden-dim'),
  numHeads: $('num-heads'),
  numKvHeads: $('num-kv-heads'),
  seqLen: $('seq-len'),
  batchSize: $('batch-size'),
  kvPrecision: $('kv-precision'),
  overhead: $('overhead'),
  calcBtn: $('calculate-btn'),
  placeholder: $('results-placeholder'),
  content: $('results-content'),
  totalVram: $('total-vram'),
  totalSub: $('total-sub'),
  valWeights: $('val-weights'),
  valKv: $('val-kv'),
  valActivation: $('val-activation'),
  valOverhead: $('val-overhead'),
  barWeights: $('bar-weights'),
  barKv: $('bar-kv'),
  barActivation: $('bar-activation'),
  barOverhead: $('bar-overhead'),
  formulaWeights: $('formula-weights'),
  formulaKv: $('formula-kv'),
  formulaActivation: $('formula-activation'),
  formulaOverhead: $('formula-overhead'),
  gpuList: $('gpu-list'),
  attentionInfo: $('attention-info'),
  gpuPanelPlaceholder: $('gpu-panel-placeholder'),
  gpuPanelContent: $('gpu-panel-content'),
  hfBtn: $('hf-update-btn'),
  hfStatus: $('hf-status'),
  numExperts: $('num-experts'),
  expertsPerToken: $('experts-per-token'),
  presetNameDisplay: $('preset-name-display'),
  moeRow: $('moe-row'),
};

// ===== Preset Name Display =====
function updatePresetNameDisplay(key) {
  const el = els.presetNameDisplay;
  if (!el) return;
  if (!key || !allPresets[key]) {
    el.textContent = '';
    el.classList.remove('visible');
    els.preset.removeAttribute('title');
    return;
  }
  const name = allPresets[key].name || key;
  el.textContent = name;
  el.title = name;
  el.classList.add('visible');
  els.preset.title = name;
}

// ===== Dynamic Preset Rendering =====
function renderPresetOptions() {
  while (els.preset.options.length > 1) {
    els.preset.remove(1);
  }

  const groups = {};
  for (const [key, preset] of Object.entries(allPresets)) {
    const group = preset.group || '其他';
    if (!groups[group]) groups[group] = [];
    groups[group].push({ key, ...preset });
  }

  const builtinGroups = ['LLaMA 系列', 'Qwen 系列', 'Mistral 系列', 'DeepSeek 系列'];
  const allGroups = [...builtinGroups.filter(g => groups[g]), ...Object.keys(groups).filter(g => !builtinGroups.includes(g))];

  for (const groupName of allGroups) {
    const items = groups[groupName];
    if (!items || items.length === 0) continue;

    const optgroup = document.createElement('optgroup');
    optgroup.label = groupName;

    items.sort((a, b) => (a.params || 0) - (b.params || 0));

    for (const item of items) {
      const option = document.createElement('option');
      option.value = item.key;
      option.textContent = item.name;
      optgroup.appendChild(option);
    }

    els.preset.appendChild(optgroup);
  }
}

// ===== Preset Loading =====
els.preset.addEventListener('change', () => {
  const key = els.preset.value;
  updatePresetNameDisplay(key);
  if (!key || !allPresets[key]) return;
  const p = allPresets[key];
  els.params.value = p.params;
  els.numLayers.value = p.layers;
  els.hiddenDim.value = p.hiddenDim;
  els.numHeads.value = p.heads;
  els.numKvHeads.value = p.kvHeads;

  // Auto-fill weight precision from config (torch_dtype)
  if (p.weightBytes != null) {
    els.weightPrecision.value = p.weightBytes;
  }

  // Auto-fill max context length from config (max_position_embeddings)
  if (p.maxSeqLen && p.maxSeqLen > 0) {
    els.seqLen.value = p.maxSeqLen;
  }

  // MoE fields
  if (p.numExperts && p.numExperts > 0) {
    els.numExperts.value = p.numExperts;
    els.expertsPerToken.value = p.expertsPerToken;
    els.moeRow.style.display = '';
  } else {
    els.numExperts.value = 0;
    els.expertsPerToken.value = 0;
    els.moeRow.style.display = 'none';
  }
});

// ===== HuggingFace Integration =====
const HF_API_BASE = 'https://huggingface.co';

// Map torch_dtype string → bytes per element
function dtypeToBytes(dtype) {
  if (!dtype) return null;
  const d = dtype.toLowerCase();
  if (d === 'float32' || d === 'fp32') return 4;
  if (d === 'float16' || d === 'bfloat16' || d === 'fp16' || d === 'bf16') return 2;
  if (d.startsWith('float8') || d === 'fp8' || d === 'int8') return 1;
  if (d === 'int4' || d === 'nf4' || d === 'fp4') return 0.5;
  return null; // unknown → keep default
}

function setHFStatus(message, type) {
  els.hfStatus.textContent = message;
  els.hfStatus.className = `hf-status show ${type}`;
  if (type === 'success') {
    setTimeout(() => {
      els.hfStatus.className = 'hf-status';
      els.hfStatus.textContent = '';
    }, 8000);
  }
}

function setHFLoading(loading) {
  if (loading) {
    els.hfBtn.classList.add('loading');
    els.hfBtn.querySelector('.hf-btn-text').textContent = '拉取中…';
  } else {
    els.hfBtn.classList.remove('loading');
    els.hfBtn.querySelector('.hf-btn-text').textContent = '更新模型';
  }
}

async function fetchModelConfig(modelId) {
  try {
    const resp = await fetch(`${HF_API_BASE}/${modelId}/resolve/main/config.json`);
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

async function fetchHFModels() {
  setHFLoading(true);
  setHFStatus('正在从 HuggingFace 获取模型列表…', 'loading');

  try {
    const resp = await fetch(
      `${HF_API_BASE}/api/models?filter=text-generation&sort=trendingScore&direction=-1&limit=500` +
      `&expand[]=safetensors&expand[]=pipeline_tag&expand[]=private&expand[]=downloads&expand[]=library_name`
    );

    if (!resp.ok) throw new Error(`API 请求失败 (${resp.status})`);

    const models = await resp.json();

    // Filter: text-generation, not private, >= 32B params from safetensors.total
    const candidates = models.filter(m => {
      if (m.private) return false;
      if (m.pipeline_tag !== 'text-generation') return false;
      // Use safetensors.total for accurate param count filtering
      const totalParams = m.safetensors && m.safetensors.total;
      if (!totalParams || totalParams < 32e9) return false;
      return true;
    });

    setHFStatus(`正在获取 ${candidates.length} 个模型的架构参数…`, 'loading');

    const hfModels = {};
    let successCount = 0;

    for (let i = 0; i < candidates.length; i += 5) {
      const batch = candidates.slice(i, i + 5);
      const results = await Promise.allSettled(
        batch.map(m => fetchModelConfig(m.id))
      );

      for (let j = 0; j < results.length; j++) {
        const result = results[j];
        const model = batch[j];

        if (result.status !== 'fulfilled' || !result.value) continue;

        const config = result.value;
        if (!config.hidden_size || !config.num_hidden_layers || !config.num_attention_heads) continue;

        const key = 'hf-' + model.id.replace(/\//g, '--');
        const displayName = model.id.split('/').pop();
        // Use safetensors.total for accurate param count (same as HuggingFace "Model size")
        const params = +(model.safetensors.total / 1e9).toFixed(1);

        hfModels[key] = {
          params,
          layers: config.num_hidden_layers,
          hiddenDim: config.hidden_size,
          heads: config.num_attention_heads,
          kvHeads: config.num_key_value_heads || config.num_attention_heads,
          weightBytes: dtypeToBytes(config.torch_dtype),
          maxSeqLen: config.max_position_embeddings || null,
          name: displayName,
          group: 'HuggingFace 热门',
          hfId: model.id,
          downloads: model.downloads,
        };

        // Detect MoE architecture from config
        const nExperts = config.n_routed_experts || config.num_local_experts || config.num_experts || 0;
        const nActive = config.num_experts_per_tok || config.num_selected_experts || 0;
        if (nExperts > 0 && nActive > 0) {
          hfModels[key].numExperts = nExperts;
          hfModels[key].expertsPerToken = nActive;
        }

        successCount++;
      }
    }

    if (successCount === 0) throw new Error('未能获取任何模型的架构参数');

    // Save to localStorage
    saveModelsToLocal(hfModels);

    // Merge and re-render
    mergeHFModels(hfModels);
    renderPresetOptions();

    const timestamp = new Date().toLocaleString('zh-CN');
    setHFStatus(`✓ 成功获取 ${successCount} 个模型（${timestamp}）`, 'success');

  } catch (err) {
    console.error('HF fetch error:', err);
    setHFStatus(`✗ 获取失败：${err.message}`, 'error');
  } finally {
    setHFLoading(false);
  }
}

function saveModelsToLocal(hfModels) {
  try {
    localStorage.setItem(HF_MODELS_KEY, JSON.stringify(hfModels));
    localStorage.setItem(HF_TIMESTAMP_KEY, new Date().toISOString());
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

function loadModelsFromLocal() {
  try {
    const data = localStorage.getItem(HF_MODELS_KEY);
    if (!data) return null;
    return { models: JSON.parse(data), timestamp: localStorage.getItem(HF_TIMESTAMP_KEY) };
  } catch {
    return null;
  }
}

function mergeHFModels(hfModels) {
  for (const key of Object.keys(allPresets)) {
    if (key.startsWith('hf-')) delete allPresets[key];
  }
  Object.assign(allPresets, hfModels);
}

// ===== Calculation =====
function calculate() {
  const params = parseFloat(els.params.value) || 0;
  const weightBytes = parseFloat(els.weightPrecision.value) || 2;
  const numLayers = parseInt(els.numLayers.value) || 0;
  const hiddenDim = parseInt(els.hiddenDim.value) || 0;
  const numHeads = parseInt(els.numHeads.value) || 1;
  const numKvHeads = parseInt(els.numKvHeads.value) || 1;
  const seqLen = parseInt(els.seqLen.value) || 0;
  const batchSize = parseInt(els.batchSize.value) || 1;
  const kvBytes = parseFloat(els.kvPrecision.value) || 2;
  const overheadPct = parseFloat(els.overhead.value) || 0;
  const numExperts = parseInt(els.numExperts.value) || 0;
  const expertsPerToken = parseInt(els.expertsPerToken.value) || 0;

  const headDim = hiddenDim / numHeads;
  const BYTES_PER_GB = 1024 ** 3;
  const isMoE = numExperts > 0 && expertsPerToken > 0;

  // Weight memory: ALL params must be in VRAM (including all experts)
  const weightMem = (params * 1e9 * weightBytes) / BYTES_PER_GB;

  // KV Cache: not affected by MoE (same hidden_dim)
  const kvCachePerToken = 2 * numKvHeads * headDim * kvBytes;
  const kvCache = (batchSize * seqLen * numLayers * kvCachePerToken) / BYTES_PER_GB;

  // Activation memory (inference): only ONE layer's peak activation in memory at a time
  // (each layer computes and discards activations before the next layer)
  // Dense: batch × seq × hiddenDim × 2 × bytes  (attention + FFN intermediate)
  // MoE:   batch × seq × hiddenDim × (1 + expertsPerToken/numExperts) × bytes
  let activationMem;
  if (isMoE) {
    const moeRatio = expertsPerToken / numExperts;
    // Attention part (1×) + FFN part (scaled by active expert ratio)
    activationMem = (batchSize * seqLen * hiddenDim * (1 + moeRatio) * kvBytes) / BYTES_PER_GB;
  } else {
    activationMem = (batchSize * seqLen * hiddenDim * 2 * kvBytes) / BYTES_PER_GB;
  }

  const subtotal = weightMem + kvCache + activationMem;
  const overheadMem = subtotal * (overheadPct / 100);
  const total = subtotal + overheadMem;

  let attnType = 'MHA (Multi-Head Attention)';
  if (numKvHeads === 1) attnType = 'MQA (Multi-Query Attention)';
  else if (numKvHeads < numHeads) attnType = `GQA (Grouped-Query Attention, ${numHeads / numKvHeads}:1)`;

  // Calculate active params for MoE
  let activeParams = params;
  if (isMoE) {
    activeParams = +(params * expertsPerToken / numExperts).toFixed(1);
  }

  return {
    weightMem, kvCache, activationMem, overheadMem, total,
    params, weightBytes, numLayers, hiddenDim,
    numHeads, numKvHeads, headDim,
    seqLen, batchSize, kvBytes, overheadPct, attnType,
    isMoE, numExperts, expertsPerToken, activeParams,
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
  els.placeholder.style.display = 'none';
  els.content.style.display = 'block';

  // Show GPU panel
  els.gpuPanelPlaceholder.style.display = 'none';
  els.gpuPanelContent.style.display = 'block';

  els.content.style.animation = 'none';
  els.content.offsetHeight;
  els.content.style.animation = '';

  els.totalVram.textContent = formatGB(r.total);


  els.valWeights.textContent = formatGB(r.weightMem);
  els.valKv.textContent = formatGB(r.kvCache);
  els.valActivation.textContent = formatGB(r.activationMem);
  els.valOverhead.textContent = formatGB(r.overheadMem);

  const maxForBar = r.total;
  requestAnimationFrame(() => {
    els.barWeights.style.width = (r.weightMem / maxForBar * 100).toFixed(1) + '%';
    els.barKv.style.width = (r.kvCache / maxForBar * 100).toFixed(1) + '%';
    els.barActivation.style.width = (r.activationMem / maxForBar * 100).toFixed(1) + '%';
    els.barOverhead.style.width = (r.overheadMem / maxForBar * 100).toFixed(1) + '%';
  });

  els.formulaWeights.textContent =
    `${r.params}B × ${r.weightBytes} bytes = ${formatGB(r.weightMem)} (${precisionLabel(r.weightBytes)})`;
  els.formulaKv.textContent =
    `${r.batchSize} × ${r.seqLen} × 2 × ${r.numLayers}L × ${r.numKvHeads}kv × ${r.headDim}d × ${r.kvBytes}B = ${formatGB(r.kvCache)}`;
  if (r.isMoE) {
    const moeRatio = (r.expertsPerToken / r.numExperts).toFixed(3);
    els.formulaActivation.textContent =
      `${r.batchSize} × ${r.seqLen} × ${r.hiddenDim} × (1+${r.expertsPerToken}/${r.numExperts}) × ${r.kvBytes}B ≈ ${formatGB(r.activationMem)} (单层峰值)`;
  } else {
    els.formulaActivation.textContent =
      `${r.batchSize} × ${r.seqLen} × ${r.hiddenDim} × 2 × ${r.kvBytes}B ≈ ${formatGB(r.activationMem)} (单层峰值)`;
  }
  els.formulaOverhead.textContent =
    `(${formatGB(r.weightMem + r.kvCache + r.activationMem)}) × ${r.overheadPct}% = ${formatGB(r.overheadMem)}`;

  renderGPUs(r.total);

  let infoHtml =
    `<strong>注意力类型：</strong>${r.attnType}` +
    ` | <strong>Head Dim：</strong>${r.headDim}` +
    ` | <strong>KV Cache 比例：</strong>${(r.kvCache / r.total * 100).toFixed(1)}%`;
  if (r.isMoE) {
    infoHtml += `<br><strong>MoE 架构：</strong>${r.numExperts} 专家 / 每 token 激活 ${r.expertsPerToken} 个` +
      ` | <strong>总参数：</strong>${r.params}B | <strong>激活参数：</strong>≈${r.activeParams}B`;
  }
  els.attentionInfo.innerHTML = infoHtml;
}

function renderGPUs(totalGB) {
  els.gpuList.innerHTML = '';

  GPUS.forEach(gpu => {
    const cardsNeeded = Math.ceil(totalGB / gpu.vram);
    const totalVram = cardsNeeded * gpu.vram;
    const usagePct = (totalGB / totalVram * 100);
    const fillPct = Math.min(usagePct, 100);

    let className = 'fit';
    if (cardsNeeded > 4) className = 'overflow';
    else if (cardsNeeded > 1) className = 'tight';

    const item = document.createElement('div');
    item.className = 'gpu-item';

    let statusText;
    if (cardsNeeded === 1) {
      statusText = `✓ 1 卡可放下 (${usagePct.toFixed(0)}%)`;
    } else {
      statusText = `需 ${cardsNeeded} 卡 (每卡利用 ${usagePct.toFixed(0)}%)`;
    }

    item.innerHTML = `
      <span class="gpu-name">${gpu.name}</span>
      <div class="gpu-bar-wrapper">
        <div class="gpu-bar-fill ${className}" style="width: 0%"></div>
        <span class="gpu-bar-text">${statusText}</span>
      </div>
      <span class="gpu-capacity">${cardsNeeded === 1 ? gpu.vram + 'GB' : cardsNeeded + '×' + gpu.vram + 'GB'}</span>
    `;
    els.gpuList.appendChild(item);

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

document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      els.calcBtn.click();
    }
  });
});

els.preset.addEventListener('change', () => {
  setTimeout(() => {
    const result = calculate();
    render(result);
  }, 50);
});

els.hfBtn.addEventListener('click', () => {
  fetchHFModels();
});

// ===== Init =====
window.addEventListener('DOMContentLoaded', () => {
  // Load cached HF models from localStorage
  const cached = loadModelsFromLocal();
  if (cached && cached.models) {
    mergeHFModels(cached.models);
    const count = Object.keys(cached.models).length;
    const ts = cached.timestamp ? new Date(cached.timestamp).toLocaleString('zh-CN') : '';
    if (count > 0 && ts) {
      setHFStatus(`已加载 ${count} 个缓存模型（${ts}）`, 'success');
    }
  }

  renderPresetOptions();

  const result = calculate();
  render(result);
});
