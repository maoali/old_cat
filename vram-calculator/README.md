# LLM VRAM Calculator | 大模型推理显存计算器

一个基于 Web 的前端工具，用于精确计算大语言模型（LLM）在推理时所需的 GPU 显存（VRAM）。

无论是进行大模型部署规划、硬件采购，还是本地化运行测试，本工具都能为您提供详尽的显存占用分布和 GPU 硬件需求评估。不仅支持常规的 Dense 模型，还全面支持最新的 **Mixture of Experts (MoE)** 架构模型。

---

## ✨ 主要功能 (Features)

### 1. 灵活的参数配置
*   **模型参数**：支持自定义模型总参数量、Transformer 层数、隐藏维度（Hidden Dim）、注意力头数（Q Heads）及 KV 头数（支持自适应识别 MHA, MQA, GQA 架构）。
*   **MoE 架构支持**：全面支持 MoE 模型，可自定义总专家数（Total Experts）和单 Token 激活专家数（Active Experts per Token），精准计算激活参数量及显存开销。
*   **精度控制**：可独立设置**权重精度**和 **KV Cache 精度**，支持 FP32 (4 bytes), FP16 / BF16 (2 bytes), FP8 / INT8 (1 byte), INT4 (0.5 bytes)。
*   **推理上下文**：支持设定批处理大小（Batch Size）、序列长度（Sequence Length）及系统开销比例（CUDA 上下文、显存碎片等）。

### 2. 丰富的模型预设与一键同步
*   **内置预设**：开箱即用，内置 LLaMA 系列 (LLaMA-2/3/3.1)、Qwen-2.5 系列、Mistral/Mixtral、DeepSeek (V3/R1) 以及 GLM-5 等当下热门模型参数。
*   **HuggingFace 动态同步**：支持通过 HuggingFace API 一键拉取当前最热门（Trending）的 Text-Generation 大模型（>32B），自动解析 `config.json` 获取底层架构参数，并缓存在浏览器本地中。

### 3. 可视化结果与公式透明化
*   **显存拆解**：计算结果细分为 **模型权重 (Weights)**、**KV Cache**、**激活值 (Activations)** 与 **系统开销 (Overhead)**，并提供进度条可视化比例。
*   **公式展示**：每项显存计算底部均附有精确的计算公式与过程，保证结果的透明与可追溯性。

### 4. 硬件需求推荐 (GPU Comparison)
*   **多机多卡评估**：内置市面主流 AI 显卡规格（如 RTX 4090/5090, A100, H100, H20, B200 等）。
*   根据总显存需求，自动计算并以进度条形式展示每种 GPU 所需的**最少卡数**及**单卡显存利用率**。

---

## 🧮 计算原理解析

工具底层的核心显存估算基于以下公式：

1.  **模型权重 (Model Weights)**
    *   `Params (B) × 精度字节数`
    *   *注：即使是 MoE 模型，所有专家的权重也必须全部驻留在显存中。*
2.  **KV Cache**
    *   `Batch Size × Seq Length × 2 (K&V) × 层数 × KV头数 × Head Dimension × KV精度字节数`
3.  **激活值 (Activations) - 单层峰值**
    *   *Dense 模型*：`Batch Size × Seq Length × Hidden Dim × 2 × 精度`
    *   *MoE 模型*：由于 FFN 层只有部分专家激活，公式调整为 `Batch Size × Seq Length × Hidden Dim × (1 + ActiveExperts/TotalExperts) × 精度`
4.  **系统开销 (Overhead)**
    *   `(权重 + KV Cache + 激活值) × 系统开销百分比`

---

## 🚀 快速开始 (How to Use)

本工具为纯前端实现，**无需安装任何依赖或后端环境**。

### 运行方式
1. 将本项目克隆或下载到本地：
   ```bash
   git clone <你的仓库地址>
   cd vram-calculator
   ```
2. 直接在任意现代浏览器（Chrome, Edge, Firefox, Safari）中双击打开 `index.html` 即可使用。

### 使用步骤
1. 点击左侧 **模型预设** 下拉框，选择你感兴趣的模型，或直接手动在下方输入自定义架构参数。
2. （可选）点击 **更新模型** 按钮，从 HuggingFace 实时拉取最新热门模型的参数配置。
3. 调整右侧的 **推理设置**（如修改序列长度和并发数）。
4. 点击 **计算显存** 按钮。
5. 在右侧面板查看总显存需求、详细拆解以及所需的 GPU 显卡数量评估。

---

## 🛠 技术栈 (Tech Stack)

*   **HTML5 & CSS3**：采用原生 CSS，实现 Grid 响应式布局、毛玻璃效果（Glassmorphism）与平滑动画，提供极简的 Modern UI 体验。
*   **Vanilla JavaScript (ES6+)**：无任何框架依赖（如 React/Vue）。
*   **HuggingFace REST API**：使用 `fetch` 异步获取模型列表与配置，利用 `localStorage` 实现数据缓存。

---

## 📁 目录结构 (Project Structure)

```text
vram-calculator/
├── index.html       # 页面骨架与主结构
├── index.css        # 样式文件（UI 响应式、主题与动画）
├── index.js         # 核心逻辑（参数解析、显存计算、HF API交互、DOM 操作）
└── README.md        # 项目说明文档
```

---

*免责声明：本计算器提供的显存占用为理论估算值。实际推理时，受到具体推理框架（如 vLLM, TensorRT-LLM, llama.cpp）、Quantization 算法的具体实现方式、以及操作系统显存保留策略等因素的影响，实际显存占用可能会有一定偏差，仅供部署前参考。*
