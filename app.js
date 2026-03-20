// 캔버스는 항상 1280x720 기준으로 렌더링합니다.
const C = document.getElementById("thumb");
const ctx = C.getContext("2d");
const W = 1280;
const H = 720;

const LS_SETTINGS = "thumb_editor_v7_settings";
const LS_PRESETS = "thumb_editor_v7_presets";
const LS_HISTORY = "thumb_editor_v7_phrase_history";

const THEMES = {
  warning: { accent: "#ff5757", glow: "rgba(255,87,87,0.26)", fill: "rgba(255,87,87,0.17)", label: "warning", colorKey: "red" },
  rising: { accent: "#1fe89a", glow: "rgba(31,232,154,0.24)", fill: "rgba(31,232,154,0.17)", label: "rising", colorKey: "green" },
  reversal: { accent: "#53a6ff", glow: "rgba(83,166,255,0.24)", fill: "rgba(83,166,255,0.17)", label: "reversal", colorKey: "blue" },
  chance: { accent: "#f2c14e", glow: "rgba(242,193,78,0.25)", fill: "rgba(242,193,78,0.17)", label: "chance", colorKey: "gold" }
};

// 비트코인 채널 톤을 유지하되 알트 예측 영상에도 쓸 수 있는 문구 풀입니다.
const COPY_BANK = {
  warning: {
    main: ["이 구간은 방심 금지", "지금 흔들리면 늦습니다", "오늘 변동성 크게 나옵니다", "밀리면 바로 그림 바뀝니다"],
    em: ["지지 이탈 확인", "지금 자금이 빠집니다", "반등 실패 신호", "단기 기준선 재점검"],
    sub: ["비트코인 기준 먼저 확인하고 알트 따라올 순서를 봅니다", "오늘은 비트코인 흐름이 알트 방향까지 결정할 수 있습니다", "메인 기준선이 무너지면 알트도 순서대로 흔들릴 수 있습니다"],
    title: ["비트코인 오늘 이 구간 놓치면 위험합니다, 알트 따라올 후보까지 정리", "비트코인 지금 흔들리는 이유, 오늘 알트까지 같이 봐야 하는 자리", "비트코인 지지 이탈 체크, 알트코인 오늘 따라올 종목 후보 점검"]
  },
  rising: {
    main: ["추세가 다시 살아납니다", "오늘 방향이 위로 열립니다", "비트코인 힘이 붙었습니다", "눌림 뒤 재가속 구간"],
    em: ["돌파 자리 확인", "수급 다시 붙는 중", "고점 재도전 구간", "오늘 강한 흐름"],
    sub: ["비트코인 기준 강세가 유지되면 알트도 오늘 순환이 붙을 수 있습니다", "주도 흐름은 비트코인이고 알트는 그 뒤를 따라오는 구조입니다", "오늘은 비트코인 강도 확인 뒤 알트 확산 가능성까지 점검합니다"],
    title: ["비트코인 오늘 다시 위로 엽니다, 알트 따라올 후보까지 한 번에 정리", "비트코인 돌파 자리 확인, 오늘 알트 순환까지 이어질지 봅니다", "비트코인 수급 다시 붙었습니다, 알트코인 오늘 움직일 후보 체크"]
  },
  reversal: {
    main: ["반전 신호가 나왔습니다", "방향이 뒤집히는 자리", "오늘 흐름 전환 봅니다", "이 자리부터 해석이 달라집니다"],
    em: ["추세 전환 확인", "매도 압력 둔화", "반등 캔들 핵심", "다음 파동 시작점"],
    sub: ["비트코인 반전이 확인되면 알트도 오늘 뒤늦게 반응할 수 있습니다", "지금은 비트코인 반전 강도를 먼저 보고 알트 확산 여부를 체크합니다", "알트 예측도 결국 비트코인 전환 타이밍에서 시작합니다"],
    title: ["비트코인 반전 신호 나왔습니다, 오늘 알트 따라올 후보까지 확인", "비트코인 방향 전환 자리, 알트코인 오늘 살아날 종목은 무엇인가", "비트코인 추세 전환 확인, 오늘 알트까지 이어질지 정리합니다"]
  },
  chance: {
    main: ["오늘 기회는 여기입니다", "눌림 뒤 매력 구간", "기회는 조용할 때 옵니다", "이번 파동 먼저 봐야 합니다"],
    em: ["선행 신호 포착", "자리 선점 구간", "오늘 주목할 포인트", "늦기 전 체크"],
    sub: ["비트코인 기준 좋은 자리에서 알트까지 연결될 후보를 함께 봅니다", "비트코인 안정 구간이 나오면 알트도 오늘 선별 접근이 가능합니다", "기회 구간은 비트코인에서 먼저 확인하고 알트는 후순위로 붙입니다"],
    title: ["비트코인 오늘 기회 구간 나왔습니다, 알트 따라올 후보까지 선별", "비트코인 눌림 뒤 체크할 자리, 오늘 알트까지 어디를 볼지 정리", "비트코인 선행 신호 포착, 알트코인 오늘 볼 후보를 함께 정리합니다"]
  }
};


const CONTENT_BANK = {
  bitcoin: {
    badge: "비트코인",
    sub: [
      "비트코인 핵심 자리와 오늘 대응 포인트를 바로 정리합니다",
      "오늘 비트코인 기준선만 정확히 보면 됩니다",
      "실전 기준은 비트코인 가격대 3개로 정리합니다"
    ],
    title: [
      "비트코인 오늘 핵심 가격대와 대응 전략을 빠르게 정리합니다",
      "비트코인 지금 추격해도 되는지 핵심 자리만 보겠습니다",
      "비트코인 오늘은 이 가격만 보시면 됩니다"
    ]
  },
  alt: {
    badge: "비트코인/알트",
    sub: [
      "비트코인 기준 확인 후 알트 순환매 후보까지 같이 봅니다",
      "오늘은 비트코인과 알트 연결 구간을 같이 체크합니다",
      "비트코인 흐름 뒤에 붙는 알트 후보를 빠르게 정리합니다"
    ],
    title: [
      "비트코인 흐름과 오늘 알트 후보까지 한 번에 정리합니다",
      "비트코인 기준 확인 후 알트코인 움직일 종목까지 보겠습니다",
      "오늘은 비트코인과 알트 연결 흐름을 같이 봐야 합니다"
    ]
  }
};


const VISUAL_PRESETS = {
  auto: { label: "AUTO", key: "auto", accent: null },
  breakout: { label: "돌파형", key: "breakout", accent: "#19e59c" },
  warning: { label: "경고형", key: "warning", accent: "#ff5d6c" },
  level: { label: "가격형", key: "level", accent: "#45c8ff" },
  reversal: { label: "반전형", key: "reversal", accent: "#ffcc58" },
  tension: { label: "불안형", key: "tension", accent: "#ff9c43" },
  alt: { label: "알트형", key: "alt", accent: "#a978ff" }
};

const STRUCTURES = [
  { key: "split", build: (main, em, sub) => ({ main, em, sub }) },
  { key: "question", build: (main, em, sub) => ({ main: `${main}?`, em, sub }) },
  { key: "stack", build: (main, em, sub) => ({ main, em: `${em}`, sub }) },
  { key: "short", build: (main, em, sub) => ({ main: trimCopy(main, 13), em: trimCopy(em, 11), sub }) }
];

const S = {
  days: 1,
  periodLabel: "1일봉",
  type: "warning",
  autoMode: false,
  prices: [],
  badge: "BITCOIN",
  main: "방향 나오기 직전",
  em: "오늘 눌림 끝 확인",
  sub: "알트도 오늘 따라올 후보 정리",
  title: "비트코인 오늘 방향 확인, 알트 따라올 후보까지 한 번에 봅니다",
  ctrScore: 0,
  chartTop: 58,
  chartRight: 42,
  contentMode: "bitcoin",
  candidateCount: 3,
  advancedOpen: false,
  visualPreset: "auto"
};

const els = {
  liveDot: document.getElementById("liveDot"),
  liveStatus: document.getElementById("liveStatus"),
  loadEl: document.getElementById("loadEl"),
  autoTag: document.getElementById("autoTag"),
  candidateList: document.getElementById("candidateList"),
  historyBox: document.getElementById("historyBox"),
  mobilePreview: document.getElementById("mobilePreview"),
  listThumb: document.getElementById("listThumb"),
  listTitle: document.getElementById("listTitle"),
  sCtr: document.getElementById("sCtr"),
  advancedToneBox: document.getElementById("advancedToneBox"),
  btnAdvancedToggle: document.getElementById("btnAdvancedToggle"),
  editorModal: document.getElementById("editorModal"),
  modalPreviewImg: document.getElementById("modalPreviewImg")
};

let logoImg = null;
let saveTimer = null;
let refreshSeed = 0;
let currentCandidates = [];
let modalSnapshot = null;
let modalOpen = false;
let overlayImages = [];
let activeOverlayId = "";
let shapes = [];
let shapeCounter = 1;

const DEFAULT_BG_OPTIONS = {
  gradient: "on",
  glow: "on",
  beam: "on",
  grid: "off",
  horizon: "on"
};

const DEFAULT_BG_COLORS = {
  top: "#091825",
  mid: "#0b1b27",
  bottom: "#08131d",
  glow: "#45c8ff",
  beam: "#45c8ff"
};


bootstrap();

function bootstrap() {
  bindControls();
  bindRangeNumberPairs();
  loadLogo();
  restoreSettings();
  refreshPresetList();
  syncLabels();
  updateTypeButtons();
  updateContentButtons();
  updatePresetButtons();
  renderAdvancedState();
  bindModalControls();
  bindImageControls();
  refreshOverlayList();
  bindShapeControls();
  refreshShapeList();
  fetchBTC(S.days);
}

function bindControls() {
  document.querySelectorAll("[data-period]").forEach((btn) => {
    btn.addEventListener("click", () => {
      S.days = Number(btn.dataset.period);
      S.periodLabel = btn.textContent.trim();
      document.querySelectorAll("[data-period]").forEach((node) => node.classList.toggle("active", node === btn));
      saveSettings();
      fetchBTC(S.days);
    });
  });

  document.querySelectorAll("[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      S.autoMode = type === "auto";
      document.getElementById("selTone").value = type;
      if (S.autoMode) {
        inferAutoTone();
      } else {
        S.type = type;
      }
      updateTypeButtons();
      renderAutoTag();
      generateCandidates({ pickFirst: true, silent: true });
      redraw();
      saveSettings();
    });
  });

  document.querySelectorAll("[data-content]").forEach((btn) => {
    btn.addEventListener("click", () => {
      S.contentMode = btn.dataset.content;
      updateContentButtons();
      if (S.contentMode === "alt") {
        document.getElementById("iBadge").value = "비트코인/알트";
      } else if (!document.getElementById("iBadge").value.trim() || document.getElementById("iBadge").value === "비트코인/알트") {
        document.getElementById("iBadge").value = "비트코인";
      }
      generateCandidates({ pickFirst: true, silent: true });
      redraw();
      saveSettings();
    });
  });

  document.getElementById("selCandidateCount").addEventListener("change", (e) => {
    S.candidateCount = Number(e.target.value || 3);
    generateCandidates({ pickFirst: false, silent: true });
    saveSettings();
  });

  document.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      S.visualPreset = btn.dataset.preset;
      document.getElementById("selVisualPreset").value = S.visualPreset;
      updatePresetButtons();
      generateCandidates({ pickFirst: true, silent: true });
      redraw();
      saveSettings();
    });
  });
  document.getElementById("selVisualPreset").addEventListener("change", (e) => {
    S.visualPreset = e.target.value;
    updatePresetButtons();
    redraw();
    saveSettings();
  });

  els.btnAdvancedToggle.addEventListener("click", () => {
    S.advancedOpen = !S.advancedOpen;
    renderAdvancedState();
    saveSettings();
  });

  document.querySelectorAll("input[type='text'], input[type='color'], select, input[type='range']").forEach((el) => {
    el.addEventListener("input", onManualInput);
    el.addEventListener("change", onManualInput);
  });

  document.getElementById("btnGenerate").addEventListener("click", () => {
    generateCandidates({ forceRefresh: true, pickFirst: true });
  });
  document.getElementById("btnRefresh").addEventListener("click", () => {
    refreshSeed += 1;
    generateCandidates({ forceRefresh: true, pickFirst: true });
  });
  document.getElementById("btnOptimize").addEventListener("click", optimizeCurrentCopy);
  document.getElementById("btnDownload").addEventListener("click", downloadPng);
  document.getElementById("btnSavePreset").addEventListener("click", savePreset);
  document.getElementById("btnLoadPreset").addEventListener("click", loadPreset);
}


function bindImageControls() {
  const upload = document.getElementById("imgUpload");
  const removeBtn = document.getElementById("btnRemoveImage");
  const select = document.getElementById("selOverlayImage");
  const flipBtn = document.getElementById("btnFlipImage");

  upload?.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files || []).slice(0, Math.max(0, 5 - overlayImages.length));
    for (const file of files) {
      const dataUrl = await readFileAsDataUrl(file);
      const img = await loadImageFromUrl(dataUrl);
      const id = `overlay-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
      overlayImages.push({
        id,
        img,
        name: file.name || `사진 ${overlayImages.length + 1}`,
        scale: 100,
        opacity: 100,
        x: Math.min(1180, 900 + overlayImages.length * 52),
        y: Math.min(620, 120 + overlayImages.length * 28),
        flipX: false
      });
      activeOverlayId = id;
    }
    refreshOverlayList(activeOverlayId);
    if (upload) upload.value = "";
    redraw();
  });

  select?.addEventListener("change", () => {
    activeOverlayId = select.value;
    syncOverlayControls();
    redraw();
  });

  ["rOverlayScale","rOverlayOpacity","rOverlayX","rOverlayY"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", onOverlayControlInput);
    document.getElementById(id)?.addEventListener("change", onOverlayControlInput);
  });

  flipBtn?.addEventListener("click", () => {
    const item = getActiveOverlay();
    if (!item) return;
    item.flipX = !item.flipX;
    redraw();
  });

  removeBtn?.addEventListener("click", () => {
    if (!activeOverlayId) return;
    overlayImages = overlayImages.filter((item) => item.id !== activeOverlayId);
    activeOverlayId = overlayImages[0]?.id || "";
    refreshOverlayList(activeOverlayId);
    redraw();
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImageFromUrl(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function getActiveOverlay() {
  return overlayImages.find((item) => item.id === activeOverlayId) || null;
}

function refreshOverlayList(selectedId = "") {
  const select = document.getElementById("selOverlayImage");
  if (!select) return;
  const current = selectedId || activeOverlayId || select.value;
  select.innerHTML = '<option value="">사진 없음</option>';
  overlayImages.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${index + 1}. ${item.name}`;
    if (item.id === current) option.selected = true;
    select.appendChild(option);
  });
  activeOverlayId = overlayImages.some((item) => item.id === current) ? current : (overlayImages[0]?.id || "");
  if (activeOverlayId) select.value = activeOverlayId;
  syncOverlayControls();
}

function syncOverlayControls() {
  const item = getActiveOverlay();
  const src = item || { scale:100, opacity:100, x:980, y:120 };
  [["rOverlayScale","vOverlayScale","scale"],["rOverlayOpacity","vOverlayOpacity","opacity"],["rOverlayX","vOverlayX","x"],["rOverlayY","vOverlayY","y"]].forEach(([rid, vid, key]) => {
    const r = document.getElementById(rid);
    const v = document.getElementById(vid);
    if (r) r.value = src[key];
    if (v) v.textContent = src[key];
  });
}

function onOverlayControlInput(e) {
  const item = getActiveOverlay();
  const value = Number(e.target.value || 0);
  const map = { rOverlayScale:["scale","vOverlayScale"], rOverlayOpacity:["opacity","vOverlayOpacity"], rOverlayX:["x","vOverlayX"], rOverlayY:["y","vOverlayY"] };
  const target = map[e.target.id];
  if (!target) return;
  if (item) item[target[0]] = value;
  const label = document.getElementById(target[1]);
  if (label) label.textContent = value;
  redraw();
}

function bindShapeControls() {
  document.querySelectorAll('[data-shape-add]').forEach((btn) => {
    btn.addEventListener('click', () => addShape(btn.dataset.shapeAdd));
  });
  document.getElementById('selShape')?.addEventListener('change', syncShapeControlsFromSelected);
  ['shapeColor','shapeSize','shapeSecondary','shapeX','shapeY'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', onShapeControlInput);
    document.getElementById(id)?.addEventListener('change', onShapeControlInput);
  });
  document.getElementById('btnDeleteShape')?.addEventListener('click', deleteSelectedShape);
  document.getElementById('btnClearShapes')?.addEventListener('click', () => {
    shapes = [];
    refreshShapeList();
    redraw();
  });
}

function addShape(type) {
  const defaultColor = document.getElementById('shapeColor')?.value || '#00ffc8';
  const shape = normalizeShape({
    id: `shape-${shapeCounter++}`,
    type,
    x: 950,
    y: 250,
    size: 120,
    stroke: 10,
    length: 180,
    color: defaultColor
  });
  shapes.push(shape);
  refreshShapeList(shape.id);
  redraw();
  saveSettingsDebounced();
}

function refreshShapeList(selectedId = '') {
  const select = document.getElementById('selShape');
  if (!select) return;
  const currentId = selectedId || select.value;
  select.innerHTML = '<option value="">도형 없음</option>';
  shapes.forEach((shape, index) => {
    const option = document.createElement('option');
    option.value = shape.id;
    option.textContent = `${index + 1}. ${shapeLabel(shape.type)}`;
    if (shape.id === currentId) option.selected = true;
    select.appendChild(option);
  });
  syncShapeControlsFromSelected();
}

function shapeLabel(type) {
  return ({circle:'원', box:'네모박스', 'arrow-up':'화살표 위', 'arrow-down':'화살표 아래', 'arrow-left':'화살표 왼쪽', 'arrow-right':'화살표 오른쪽'})[type] || type;
}

function getSelectedShape() {
  const id = document.getElementById('selShape')?.value;
  return shapes.find((shape) => shape.id === id) || null;
}

function isArrowShape(type) {
  return String(type || '').startsWith('arrow-');
}

function getShapeSecondaryMeta(shape) {
  if (isArrowShape(shape?.type)) {
    return { label: '화살표 길이', min: 40, max: 520, value: Number(shape.length || 180) };
  }
  return { label: '선 두께', min: 2, max: 26, value: Number(shape?.stroke || 10) };
}

function normalizeShape(shape) {
  const normalized = { ...shape };
  normalized.size = Number(normalized.size ?? 120);
  normalized.x = Number(normalized.x ?? 950);
  normalized.y = Number(normalized.y ?? 250);
  normalized.stroke = Number(normalized.stroke ?? 10);
  normalized.length = Number(normalized.length ?? Math.max(80, normalized.size * 1.5));
  normalized.color = normalized.color || '#00ffc8';
  return normalized;
}

function setShapeSecondaryControl(meta) {
  const label = document.getElementById('shapeSecondaryLabel');
  const range = document.getElementById('shapeSecondary');
  const number = document.getElementById('nShapeSecondary');
  if (label) label.textContent = meta.label;
  [range, number].forEach((el) => {
    if (!el) return;
    el.min = meta.min;
    el.max = meta.max;
    el.value = meta.value;
  });
}

function syncShapeControlsFromSelected() {
  const shape = getSelectedShape();
  const disabled = !shape;
  ['shapeColor','shapeSize','shapeSecondary','shapeX','shapeY','btnDeleteShape','nShapeSize','nShapeSecondary','nShapeX','nShapeY'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = disabled;
  });
  if (!shape) {
    setShapeSecondaryControl({ label: '선 두께', min: 2, max: 26, value: 10 });
    syncLabels();
    return;
  }
  const normalized = normalizeShape(shape);
  Object.assign(shape, normalized);
  document.getElementById('shapeColor').value = shape.color;
  document.getElementById('shapeSize').value = shape.size;
  document.getElementById('nShapeSize').value = shape.size;
  setShapeSecondaryControl(getShapeSecondaryMeta(shape));
  document.getElementById('shapeX').value = shape.x;
  document.getElementById('nShapeX').value = shape.x;
  document.getElementById('shapeY').value = shape.y;
  document.getElementById('nShapeY').value = shape.y;
  syncLabels();
}

function onShapeControlInput() {
  const shape = getSelectedShape();
  if (!shape) return;
  const normalized = normalizeShape(shape);
  Object.assign(shape, normalized);
  shape.color = document.getElementById('shapeColor').value;
  shape.size = Number(document.getElementById('shapeSize').value);
  if (isArrowShape(shape.type)) {
    shape.length = Number(document.getElementById('shapeSecondary').value);
  } else {
    shape.stroke = Number(document.getElementById('shapeSecondary').value);
  }
  shape.x = Number(document.getElementById('shapeX').value);
  shape.y = Number(document.getElementById('shapeY').value);
  syncLabels();
  redraw();
  saveSettingsDebounced();
}

function deleteSelectedShape() {
  const id = document.getElementById('selShape')?.value;
  if (!id) return;
  shapes = shapes.filter((shape) => shape.id !== id);
  refreshShapeList(shapes[0]?.id || '');
  redraw();
  saveSettingsDebounced();
}

function onManualInput() {
  syncLabels();
  pullControlsIntoState();
  if (document.getElementById("selTone").value === "auto") {
    S.autoMode = true;
    inferAutoTone();
    updateTypeButtons();
  } else {
    S.autoMode = false;
    S.type = document.getElementById("selTone").value;
  }
  refreshCurrentMetrics();
  redraw();
  saveSettingsDebounced();
}

function getBackgroundOptions() {
  return {
    gradient: document.getElementById('selBgGradient')?.value || DEFAULT_BG_OPTIONS.gradient,
    glow: document.getElementById('selBgGlow')?.value || DEFAULT_BG_OPTIONS.glow,
    beam: document.getElementById('selBgBeam')?.value || DEFAULT_BG_OPTIONS.beam,
    grid: document.getElementById('selBgGrid')?.value || DEFAULT_BG_OPTIONS.grid,
    horizon: document.getElementById('selBgHorizon')?.value || DEFAULT_BG_OPTIONS.horizon
  };
}

function getBackgroundColors() {
  return {
    top: document.getElementById('bgColorTop')?.value || DEFAULT_BG_COLORS.top,
    mid: document.getElementById('bgColorMid')?.value || DEFAULT_BG_COLORS.mid,
    bottom: document.getElementById('bgColorBottom')?.value || DEFAULT_BG_COLORS.bottom,
    glow: document.getElementById('bgGlowColor')?.value || DEFAULT_BG_COLORS.glow,
    beam: document.getElementById('bgBeamColor')?.value || DEFAULT_BG_COLORS.beam
  };
}

function hexToRgba(hex, alpha) {
  const clean = String(hex || '').replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return `rgba(69,200,255,${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function loadLogo() {
  const img = new Image();
  img.onload = () => {
    logoImg = img;
    redraw();
  };
  img.onerror = () => {
    logoImg = null;
    redraw();
  };
  img.src = "dog.png";
}

async function fetchBTC(days) {
  setLoading(true);
  setStatus("연결 중...", false);
  try {
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&precision=0`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    S.prices = (data.prices || []).map((entry) => entry[1]);
    if (!S.prices.length) throw new Error("empty");
    setStatus("실시간 BTC 연동 중", true);
  } catch (error) {
    S.prices = samplePrices(days);
    setStatus("연결 실패 · 샘플 데이터", false);
  }
  updateStats();
  inferAutoTone();
  renderAutoTag();
  generateCandidates({ pickFirst: true, silent: true });
  redraw();
  setLoading(false);
}

function samplePrices(days) {
  const length = days === 1 ? 42 : days === 7 ? 76 : 92;
  const base = 83000 + refreshSeed * 120;
  const values = [];
  let current = base;
  for (let i = 0; i < length; i += 1) {
    const drift = Math.sin(i / 6 + refreshSeed) * 240;
    const noise = (Math.random() - 0.5) * 680;
    current = Math.max(52000, current + drift + noise);
    values.push(current);
  }
  return values;
}

function updateStats() {
  if (!S.prices.length) return;
  const first = S.prices[0];
  const last = S.prices[S.prices.length - 1];
  const high = Math.max(...S.prices);
  const low = Math.min(...S.prices);
  const change = ((last - first) / first) * 100;
  setStat("sP", `$${Math.round(last).toLocaleString()}`, change >= 0 ? "up" : "dn");
  setStat("sC", `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`, change >= 0 ? "up" : "dn");
  setStat("sH", `$${Math.round(high).toLocaleString()}`, "up");
  setStat("sL", `$${Math.round(low).toLocaleString()}`, "dn");
  setStat("sT", getTrendLabel(change), change >= 0 ? "up" : "dn");
}

function getTrendLabel(change) {
  if (change > 3.5) return "상승 가속";
  if (change > 0.8) return "완만 상승";
  if (change < -3.5) return "하락 경계";
  if (change < -0.8) return "약세 진행";
  return "횡보 전환";
}

function setStat(id, text, cls) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = `sv ${cls || ""}`.trim();
}

function inferAutoTone() {
  if (!S.prices.length) return;
  const selectedTone = document.getElementById("selTone").value;
  S.autoMode = selectedTone === "auto";
  if (!S.autoMode) {
    S.type = selectedTone;
    return;
  }

  const first = S.prices[0];
  const last = S.prices[S.prices.length - 1];
  const min = Math.min(...S.prices);
  const max = Math.max(...S.prices);
  const mid = (min + max) / 2;
  const change = ((last - first) / first) * 100;
  const recent = S.prices.slice(-Math.max(4, Math.floor(S.prices.length / 5)));
  const recentChange = ((recent[recent.length - 1] - recent[0]) / recent[0]) * 100;
  const volatility = ((max - min) / mid) * 100;

  if (change <= -2.8 || recentChange <= -1.7) {
    S.type = "warning";
  } else if (change >= 3 || recentChange >= 1.9) {
    S.type = "rising";
  } else if (recentChange > 0.9 && change < 1.2) {
    S.type = "reversal";
  } else if (volatility < 3.8) {
    S.type = "chance";
  } else {
    S.type = change >= 0 ? "chance" : "reversal";
  }
}

function renderAutoTag() {
  if (S.autoMode) {
    els.autoTag.textContent = `AUTO ON · ${S.type.toUpperCase()}`;
    els.autoTag.className = "auto-tag on";
  } else {
    els.autoTag.textContent = "AUTO OFF";
    els.autoTag.className = "auto-tag";
  }
}

function updateTypeButtons() {
  const typeMap = { warning: "t-red", rising: "t-green", reversal: "t-blue", chance: "t-gold" };
  document.querySelectorAll("[data-type]").forEach((btn) => {
    const type = btn.dataset.type;
    btn.className = "btn";
    if (type === "auto") {
      btn.classList.toggle("active", S.autoMode);
      return;
    }
    if ((S.autoMode && type === S.type) || (!S.autoMode && type === S.type)) btn.classList.add("active");
    if (btn.classList.contains("active") && typeMap[type]) btn.classList.add(typeMap[type]);
  });
}


function updateContentButtons() {
  document.querySelectorAll("[data-content]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.content === S.contentMode);
  });
}

function updatePresetButtons() {
  document.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.preset === S.visualPreset);
  });
}

function renderAdvancedState() {
  const isOpen = !!S.advancedOpen;
  if (els.advancedToneBox) els.advancedToneBox.hidden = !isOpen;
  if (els.btnAdvancedToggle) els.btnAdvancedToggle.textContent = isOpen ? "고급 모드 닫기" : "고급 모드 열기";
  document.body.classList.toggle("advanced-on", isOpen);
}

function generateCandidates(options = {}) {
  // 최근 이력과 유사 문구, 구조, 색상 연속 반복을 줄이며 후보안을 만듭니다.
  pullControlsIntoState();
  const tone = S.type;
  const bank = getActiveCopyBank(tone);
  const candidateCount = Number(document.getElementById("selCandidateCount")?.value || S.candidateCount || 3);
  const history = getHistory();
  const usedStructures = history.slice(0, 4).map((item) => item.structure);
  const candidates = [];
  let attempt = 0;

  while (candidates.length < candidateCount && attempt < Math.max(36, candidateCount * 14)) {
    const structure = chooseStructure(usedStructures, candidates.map((item) => item.structure));
    const baseMain = pickVariant(bank.main, attempt);
    const baseEm = pickVariant(bank.em, attempt + 1);
    const baseSub = pickVariant(bank.sub, attempt + 2);
    const baseTitle = pickVariant(bank.title, attempt + 3);
    const built = structure.build(baseMain, baseEm, diversifySub(baseSub, attempt));
    const candidate = {
      tone,
      structure: structure.key,
      main: diversifyMain(built.main, attempt),
      em: diversifyEm(built.em, attempt),
      sub: built.sub,
      title: diversifyTitle(baseTitle, attempt),
      pointMode: choosePointMode(candidates.length),
      colorKey: chooseColorKey(history, candidates, tone, attempt),
      badge: getDefaultBadge(),
      preset: choosePresetForCandidate(candidates.length, tone)
    };
    candidate.signature = makeSignature(candidate);
    candidate.ctr = computeCtr(candidate);
    if (shouldAcceptCandidate(candidate, history, candidates, attempt)) {
      candidates.push(candidate);
    }
    attempt += 1;
  }

  currentCandidates = candidates.sort((a, b) => b.ctr - a.ctr);
  renderCandidates();

  if (options.pickFirst !== false && currentCandidates[0]) {
    applyCandidate(currentCandidates[0], { persistHistory: !options.silent });
  }
}

function getDefaultBadge() {
  return S.contentMode === "alt" ? "비트코인/알트" : "비트코인";
}

function getActiveCopyBank(tone) {
  const base = COPY_BANK[tone];
  const content = CONTENT_BANK[S.contentMode] || CONTENT_BANK.bitcoin;
  return {
    main: base.main,
    em: base.em,
    sub: [...base.sub, ...content.sub],
    title: [...base.title, ...content.title]
  };
}

function resolveActivePreset() {
  if (S.visualPreset && S.visualPreset !== "auto") return S.visualPreset;
  if (S.contentMode === "alt") return "alt";
  if (S.type === "warning") return "warning";
  if (S.type === "reversal") return "reversal";
  if (S.type === "rising") return "breakout";
  return "level";
}

function choosePresetForCandidate(index, tone) {
  if (S.visualPreset && S.visualPreset !== "auto") return S.visualPreset;
  const cycle = S.contentMode === "alt"
    ? ["alt", "level", "breakout", "reversal"]
    : tone === "warning"
      ? ["warning", "tension", "reversal", "level"]
      : tone === "reversal"
        ? ["reversal", "level", "breakout", "tension"]
        : tone === "rising"
          ? ["breakout", "level", "reversal", "tension"]
          : ["level", "breakout", "tension", "reversal"];
  return cycle[index % cycle.length];
}

function getPresetMeta(name, theme = THEMES[S.type]) {
  const key = name === "auto" ? resolveActivePreset() : (name || resolveActivePreset());
  const map = {
    breakout: { key, label: "돌파형", accent: "#19e59c", accentSoft: "rgba(25,229,156,0.18)", beam: "rgba(25,229,156,0.14)", panel: "rgba(25,229,156,0.08)", textMain: "#f7fbff", textEm: "#19e59c", chart: "#19e59c", shadow: "rgba(25,229,156,0.42)" },
    warning: { key, label: "경고형", accent: "#ff5d6c", accentSoft: "rgba(255,93,108,0.18)", beam: "rgba(255,93,108,0.12)", panel: "rgba(255,93,108,0.08)", textMain: "#fff6f7", textEm: "#ff5d6c", chart: "#ff5d6c", shadow: "rgba(255,93,108,0.4)" },
    level: { key, label: "가격형", accent: "#45c8ff", accentSoft: "rgba(69,200,255,0.18)", beam: "rgba(69,200,255,0.14)", panel: "rgba(69,200,255,0.08)", textMain: "#f7fbff", textEm: "#45c8ff", chart: "#45c8ff", shadow: "rgba(69,200,255,0.36)" },
    reversal: { key, label: "반전형", accent: "#ffcc58", accentSoft: "rgba(255,204,88,0.18)", beam: "rgba(255,204,88,0.13)", panel: "rgba(255,204,88,0.08)", textMain: "#fffaf1", textEm: "#ffcc58", chart: "#ffcc58", shadow: "rgba(255,204,88,0.38)" },
    tension: { key, label: "불안형", accent: "#ff9c43", accentSoft: "rgba(255,156,67,0.18)", beam: "rgba(255,156,67,0.12)", panel: "rgba(255,156,67,0.08)", textMain: "#fff8f2", textEm: "#ff9c43", chart: "#ff9c43", shadow: "rgba(255,156,67,0.35)" },
    alt: { key, label: "알트형", accent: "#a978ff", accentSoft: "rgba(169,120,255,0.18)", beam: "rgba(169,120,255,0.14)", panel: "rgba(169,120,255,0.08)", textMain: "#faf7ff", textEm: "#a978ff", chart: "#a978ff", shadow: "rgba(169,120,255,0.4)" }
  };
  return map[key] || map.level;
}

function chooseStructure(historyStructures, currentStructures) {
  const available = STRUCTURES.filter((item) => !historyStructures.includes(item.key) && !currentStructures.includes(item.key));
  const pool = available.length ? available : STRUCTURES;
  return pool[(refreshSeed + Math.floor(Math.random() * pool.length)) % pool.length];
}

function diversifyMain(text, attempt) {
  const variants = [
    text,
    text.replace("오늘", "지금"),
    text.replace("구간", "자리"),
    text.replace("확인", "체크")
  ];
  return trimCopy(variants[attempt % variants.length], 16);
}

function diversifyEm(text, attempt) {
  const replacements = [
    text,
    text.replace("확인", "점검"),
    text.replace("구간", "타이밍"),
    text.replace("자리", "포인트")
  ];
  return trimCopy(replacements[attempt % replacements.length], 13);
}

function diversifySub(text, attempt) {
  const additions = [
    text,
    `${text} 흐름까지`,
    text.replace("오늘", "당일"),
    text.replace("후보", "종목")
  ];
  return trimCopy(additions[attempt % additions.length], 28);
}

function diversifyTitle(text, attempt) {
  const options = [
    text,
    text.replace("오늘", "지금"),
    text.replace("한 번에", "빠르게"),
    text.replace("정리", "점검")
  ];
  return trimCopy(options[attempt % options.length], 54);
}

function choosePointMode(index) {
  const requested = document.getElementById("selPointMode").value;
  if (requested !== "auto") return requested;
  return ["circle", "box", "zone"][index % 3];
}

function chooseColorKey(history, candidates, tone, attempt) {
  const themeColor = THEMES[tone].colorKey;
  const recentColors = history.slice(0, 3).map((item) => item.colorKey);
  const currentColors = candidates.map((item) => item.colorKey);
  const palette = [themeColor, "red", "green", "blue", "gold"];
  const available = palette.filter((color) => !recentColors.includes(color) && !currentColors.includes(color));
  return available[attempt % Math.max(1, available.length)] || themeColor;
}

function shouldAcceptCandidate(candidate, history, existing, attempt) {
  if (existing.some((item) => item.signature === candidate.signature)) return false;
  const similarityToRecent = history.slice(0, 8).some((item) => computeSimilarity(item.signature, candidate.signature) > 0.72);
  if (similarityToRecent && attempt < 24) return false;
  const sameColor = history[0] && history[0].colorKey === candidate.colorKey;
  if (sameColor && attempt < 10) return false;
  return true;
}

function renderCandidates() {
  els.candidateList.innerHTML = "";
  currentCandidates.forEach((candidate, index) => {
    const theme = resolveColor(candidate.colorKey);
    const item = document.createElement("article");
    item.className = "candidate-item";
    item.innerHTML = `
      <div class="candidate-top">
        <div class="candidate-tone" style="color:${getPresetMeta(candidate.preset, theme).accent}">${getPresetMeta(candidate.preset, theme).label} · ${candidate.tone.toUpperCase()}</div>
        <div class="candidate-meta"><span>CTR ${candidate.ctr}</span><span>${candidate.structure}</span></div>
      </div>
      <div class="candidate-preview" style="color:${getPresetMeta(candidate.preset, theme).accent};background:linear-gradient(165deg,${getPresetMeta(candidate.preset, theme).panel},transparent 32%),radial-gradient(circle at top right,${getPresetMeta(candidate.preset, theme).accentSoft},transparent 30%),linear-gradient(180deg,#07141d,#020509)">
        <div class="candidate-badge">${escapeHtml(candidate.badge || getDefaultBadge())}</div>
        <strong style="color:#f5f8ff">${escapeHtml(candidate.main)}</strong>
        <em>${escapeHtml(candidate.em)}</em>
        <small>${escapeHtml(candidate.sub)}</small>
      </div>
      <div class="candidate-actions">
        <button class="btn apply-btn" type="button">바로 적용</button>
        <button class="dl-btn secondary edit-btn" type="button">큰 창에서 수정</button>
      </div>
    `;
    item.querySelector(".apply-btn").addEventListener("click", () => applyCandidate(candidate, { persistHistory: true }));
    item.querySelector(".edit-btn").addEventListener("click", () => openEditorModal(candidate));
    els.candidateList.appendChild(item);
  });
}

function applyCandidate(candidate, options = {}) {
  document.getElementById("iBadge").value = candidate.badge || getDefaultBadge();
  document.getElementById("iMain").value = candidate.main;
  document.getElementById("iEm").value = candidate.em;
  document.getElementById("iSub").value = candidate.sub;
  document.getElementById("iTitle").value = candidate.title;
  document.getElementById("selPointMode").value = candidate.pointMode;
  if (candidate.tone) {
    S.type = candidate.tone;
    document.getElementById("selTone").value = candidate.tone;
    updateTypeButtons();
  }
  if (candidate.preset) {
    S.visualPreset = candidate.preset;
    const presetSel = document.getElementById("selVisualPreset");
    if (presetSel) presetSel.value = candidate.preset;
    updatePresetButtons();
  }
  S.main = candidate.main;
  S.em = candidate.em;
  S.sub = candidate.sub;
  S.title = candidate.title;
  S.ctrScore = candidate.ctr;
  updateCtrDisplay(candidate.ctr);
  redraw();
  if (options.persistHistory) {
    pushHistory(candidate);
  }
  saveSettingsDebounced();
}

function refreshCurrentMetrics() {
  const current = {
    tone: S.type,
    structure: "manual",
    main: S.main,
    em: S.em,
    sub: S.sub,
    title: S.title,
    pointMode: resolvePointMode(),
    colorKey: THEMES[S.type].colorKey,
    badge: S.badge || getDefaultBadge(),
    preset: resolveActivePreset()
  };
  current.signature = makeSignature(current);
  current.ctr = computeCtr(current);
  updateCtrDisplay(current.ctr);
}

function optimizeCurrentCopy() {
  pullControlsIntoState();
  const optimized = {
    tone: S.type,
    structure: "optimized",
    main: trimCopy(optimizeLine(S.main, 15), 16),
    em: trimCopy(optimizeLine(S.em, 12), 13),
    sub: trimCopy(optimizeSub(S.sub), 28),
    title: trimCopy(optimizeTitle(S.title), 54),
    pointMode: document.getElementById("selPointMode").value === "auto" ? "box" : document.getElementById("selPointMode").value,
    colorKey: THEMES[S.type].colorKey,
    badge: S.badge || getDefaultBadge(),
    preset: resolveActivePreset()
  };
  optimized.signature = makeSignature(optimized);
  optimized.ctr = computeCtr(optimized) + 4;
  applyCandidate(optimized, { persistHistory: true });
}

function optimizeLine(text, maxLen) {
  return text.replace("정말", "").replace("바로", "").replace(/\s+/g, " ").trim().slice(0, maxLen + 4);
}

function optimizeSub(text) {
  return text.replace("한 번에", "빠르게").replace("정리", "체크");
}

function optimizeTitle(text) {
  return text.replace("한 번에", "빠르게").replace("봅니다", "점검합니다");
}

function computeCtr(candidate) {
  const mainLen = candidate.main.length;
  const emLen = candidate.em.length;
  const subLen = candidate.sub.length;
  const historyPenalty = getHistory().slice(0, 6).reduce((score, item) => score + Math.max(0, computeSimilarity(item.signature, candidate.signature) - 0.45) * 18, 0);
  const readability = 100 - Math.abs(12 - mainLen) * 2.5 - Math.abs(9 - emLen) * 2 - Math.max(0, subLen - 26) * 1.4;
  const toneBonus = { warning: 8, rising: 7, reversal: 6, chance: 6 }[candidate.tone] || 5;
  const modeBonus = { circle: 4, box: 6, zone: 5, auto: 4 }[candidate.pointMode] || 0;
  const diversityBonus = getDiversityBonus(candidate);
  return Math.max(51, Math.min(98, Math.round(readability + toneBonus + modeBonus + diversityBonus - historyPenalty)));
}

function getDiversityBonus(candidate) {
  const history = getHistory();
  const latest = history[0];
  let bonus = 0;
  if (!latest) return 8;
  if (latest.structure !== candidate.structure) bonus += 4;
  if (latest.colorKey !== candidate.colorKey) bonus += 4;
  if (!candidate.main.includes("끝") && !candidate.main.includes("무너지")) bonus += 2;
  return bonus;
}

function pullControlsIntoState() {
  S.badge = document.getElementById("iBadge").value.trim() || "BITCOIN";
  S.main = document.getElementById("iMain").value.trim();
  S.em = document.getElementById("iEm").value.trim();
  S.sub = document.getElementById("iSub").value.trim();
  S.title = document.getElementById("iTitle").value.trim();
  S.chartTop = Number(document.getElementById("rChartPadTop").value);
  S.chartRight = Number(document.getElementById("rChartPadRight").value);
}

function redraw() {
  pullControlsIntoState();
  const theme = THEMES[S.type];
  const preset = getPresetMeta(resolveActivePreset(), theme);
  const pointMode = resolvePointMode();
  const characterMode = resolveCharacterMode();

  ctx.clearRect(0, 0, W, H);
  drawBackground(theme, preset);
  drawChart(theme, preset);
  drawBadge(theme, preset);
  drawLogo(theme, characterMode, preset);
  drawOverlayImage();
  drawTexts(theme, pointMode, preset);
  drawShapes(preset);
  drawExtraText();
  drawFrame(preset);
  updatePreviewImages();
  els.listTitle.textContent = S.title;
}

function drawBackground(theme, preset) {
  const options = getBackgroundOptions();
  const colors = getBackgroundColors();

  if (options.gradient === 'on') {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, colors.top);
    bg.addColorStop(0.56, colors.mid);
    bg.addColorStop(1, colors.bottom);
    ctx.fillStyle = bg;
  } else {
    ctx.fillStyle = colors.bottom;
  }
  ctx.fillRect(0, 0, W, H);

  if (options.glow === 'on') {
    const glowA = ctx.createRadialGradient(W * 0.22, H * 0.18, 10, W * 0.22, H * 0.18, 360);
    glowA.addColorStop(0, hexToRgba(colors.glow, 0.16));
    glowA.addColorStop(0.18, hexToRgba(colors.beam, 0.18));
    glowA.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glowA;
    ctx.fillRect(0, 0, W, H);

    const glowB = ctx.createRadialGradient(W * 0.8, H * 0.28, 0, W * 0.8, H * 0.28, 300);
    glowB.addColorStop(0, hexToRgba(colors.glow, 0.22));
    glowB.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glowB;
    ctx.fillRect(0, 0, W, H);
  }

  if (options.beam === 'on') {
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.translate(W * 0.3, H * 0.03);
    ctx.rotate(-0.3);
    const beam = ctx.createLinearGradient(0, 0, W, 0);
    beam.addColorStop(0, "rgba(255,255,255,0)");
    beam.addColorStop(0.5, hexToRgba(colors.beam, 0.26));
    beam.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = beam;
    ctx.fillRect(-120, -40, W * 0.72, H * 0.9);
    ctx.restore();
  }

  if (options.grid === 'on') {
    ctx.save();
    ctx.strokeStyle = "rgba(120,205,255,0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 92) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H * 0.7); ctx.stroke(); }
    for (let y = 0; y < H * 0.7; y += 72) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
  }

  if (options.horizon === 'on') {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.7);
    ctx.lineTo(W, H * 0.7);
    ctx.stroke();
    ctx.restore();
  }
}


function drawChart(theme, preset) {
  if (S.prices.length < 2) return;
  const left = 34;
  const right = W - S.chartRight;
  const top = S.chartTop;
  const bottom = H * 0.62;
  const max = Math.max(...S.prices);
  const min = Math.min(...S.prices);
  const range = max - min || 1;
  const xs = S.prices.map((_, index) => left + (index / (S.prices.length - 1)) * (right - left));
  const ys = S.prices.map((value) => top + (1 - (value - min) / range) * (bottom - top));

  ctx.save();
  ctx.beginPath();
  xs.forEach((x, index) => {
    const y = ys[index];
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(xs[xs.length - 1], bottom);
  ctx.lineTo(xs[0], bottom);
  ctx.closePath();
  const fill = ctx.createLinearGradient(0, top, 0, bottom);
  fill.addColorStop(0, theme.fill);
  fill.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();

  [12, 22, 8].forEach((blur, index) => {
    ctx.save();
    ctx.beginPath();
    xs.forEach((x, pointIndex) => {
      const y = ys[pointIndex];
      if (pointIndex === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = index === 0 ? "rgba(255,255,255,0.9)" : preset.chart;
    ctx.shadowColor = index === 0 ? "rgba(255,255,255,0.15)" : preset.shadow;
    ctx.shadowBlur = blur;
    ctx.globalAlpha = index === 1 ? 0.85 : 1;
    ctx.lineWidth = index === 0 ? 4.8 : index === 1 ? 7.8 : 2.4;
    ctx.stroke();
    ctx.restore();
  });

  const lastX = xs[xs.length - 1];
  const lastY = ys[ys.length - 1];
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = preset.accent;
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = preset.chart;
  ctx.arc(lastX, lastY, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawPriceLabel(theme, preset, `$${Math.round(S.prices[S.prices.length - 1]).toLocaleString()}`, lastX + 18, lastY - 10);
}

function drawPriceLabel(theme, preset, text, x, y) {
  ctx.save();
  ctx.font = '900 18px "Bebas Neue", sans-serif';
  const width = ctx.measureText(text).width + 22;
  roundedRect(ctx, Math.min(W - width - 12, x), y, width, 34, 8);
  ctx.fillStyle = "rgba(0,0,0,0.84)";
  ctx.fill();
  ctx.strokeStyle = preset.accent;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = preset.accent;
  ctx.fillText(text, Math.min(W - width - 2, x + 11), y + 23);
  ctx.restore();
}

function drawBadge(theme, preset) {
  ctx.save();
  const badgeSize = Number(document.getElementById("rBadgeSize")?.value || 22);
  ctx.font = `700 ${badgeSize}px "Bebas Neue", sans-serif`;
  const width = ctx.measureText(S.badge).width + 36;
  const height = Math.max(34, badgeSize + 22);
  roundedRect(ctx, 28, 24, width, height, 6);
  const badgeGrad = ctx.createLinearGradient(28, 24, 28 + width, 24);
  badgeGrad.addColorStop(0, "rgba(0,0,0,0.35)");
  badgeGrad.addColorStop(1, preset.panel);
  ctx.fillStyle = badgeGrad;
  ctx.fill();
  ctx.strokeStyle = preset.accent;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.fillStyle = "#dffef2";
  ctx.fillText(S.badge, 46, 24 + Math.max(24, badgeSize + 7));
  ctx.restore();
}

function drawLogo(theme, characterMode, preset) {
  let size = Number(document.getElementById("rLogoSize").value);
  if (overlayImages.length) size = Math.max(54, size * 0.78);
  const textSize = Number(document.getElementById("rChanSize").value);
  const cx = W - 56 - size / 2;
  const cy = 24 + size / 2;

  if (characterMode !== "off") {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2 + 6, 0, Math.PI * 2);
    ctx.strokeStyle = preset.accent;
    ctx.lineWidth = characterMode === "focus" ? 4 : 2.4;
    ctx.shadowColor = characterMode === "focus" ? preset.accent : "transparent";
    ctx.shadowBlur = characterMode === "focus" ? 18 : 0;
    ctx.stroke();
    ctx.restore();
  }

  if (logoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.clip();
    if (characterMode === "calm") ctx.globalAlpha = 0.88;
    ctx.drawImage(logoImg, cx - size / 2, cy - size / 2, size, size);
    ctx.restore();
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fill();
    ctx.font = '900 28px "Bebas Neue", sans-serif';
    ctx.fillStyle = "#f4f4f4";
    ctx.textAlign = "center";
    ctx.fillText("BTC", cx, cy + 9);
    ctx.restore();
  }

  const channel = document.getElementById("iChan").value.trim() || "블랙제리의 한입시황";
  ctx.save();
  ctx.font = `700 ${textSize}px "Noto Sans KR", sans-serif`;
  ctx.textAlign = "center";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(0,0,0,0.88)";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.strokeText(channel, cx, cy + size / 2 + 26);
  ctx.fillText(channel, cx, cy + size / 2 + 26);
  ctx.restore();
}

function drawOverlayImage() {
  if (!overlayImages.length) return;
  overlayImages.forEach((item) => {
    const scale = Number(item.scale || 100) / 100;
    const opacity = Number(item.opacity || 100) / 100;
    const cx = Number(item.x || 980);
    const cy = Number(item.y || 120);
    const base = 220 * scale;
    const ratio = item.img.width / item.img.height || 1;
    const w = ratio >= 1 ? base : base * ratio;
    const h = ratio >= 1 ? base / ratio : base;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 18;
    if (item.flipX) {
      ctx.translate(cx, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(item.img, -w / 2, cy - h / 2, w, h);
    } else {
      ctx.drawImage(item.img, cx - w / 2, cy - h / 2, w, h);
    }
    ctx.restore();
  });
}

function drawShapes(preset) {
  shapes.forEach((shape) => {
    const normalized = normalizeShape(shape);
    Object.assign(shape, normalized);
    ctx.save();
    ctx.strokeStyle = shape.color || preset.accent;
    ctx.fillStyle = shape.color || preset.accent;
    ctx.lineWidth = shape.stroke || 8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    if (shape.type === 'circle') {
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.size * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === 'box') {
      roundedRect(ctx, shape.x - shape.size * 0.6, shape.y - shape.size * 0.38, shape.size * 1.2, shape.size * 0.76, 18);
      ctx.stroke();
    } else {
      drawArrowShape(shape);
    }
    ctx.restore();
  });
}

function drawArrowShape(shape) {
  const thickness = Math.max(14, shape.size * 0.24);
  const halfThickness = thickness / 2;
  const length = Math.max(shape.length || 180, thickness * 2.4);
  const shaft = Math.max(length * 0.56, length - shape.size * 0.62);
  ctx.beginPath();
  if (shape.type === 'arrow-right') {
    ctx.moveTo(shape.x - length * 0.5, shape.y - halfThickness);
    ctx.lineTo(shape.x + shaft - length * 0.5, shape.y - halfThickness);
    ctx.lineTo(shape.x + shaft - length * 0.5, shape.y - shape.size * 0.36);
    ctx.lineTo(shape.x + length * 0.5, shape.y);
    ctx.lineTo(shape.x + shaft - length * 0.5, shape.y + shape.size * 0.36);
    ctx.lineTo(shape.x + shaft - length * 0.5, shape.y + halfThickness);
    ctx.lineTo(shape.x - length * 0.5, shape.y + halfThickness);
  } else if (shape.type === 'arrow-left') {
    ctx.moveTo(shape.x + length * 0.5, shape.y - halfThickness);
    ctx.lineTo(shape.x - shaft + length * 0.5, shape.y - halfThickness);
    ctx.lineTo(shape.x - shaft + length * 0.5, shape.y - shape.size * 0.36);
    ctx.lineTo(shape.x - length * 0.5, shape.y);
    ctx.lineTo(shape.x - shaft + length * 0.5, shape.y + shape.size * 0.36);
    ctx.lineTo(shape.x - shaft + length * 0.5, shape.y + halfThickness);
    ctx.lineTo(shape.x + length * 0.5, shape.y + halfThickness);
  } else if (shape.type === 'arrow-up') {
    ctx.moveTo(shape.x - halfThickness, shape.y + length * 0.5);
    ctx.lineTo(shape.x - halfThickness, shape.y - shaft + length * 0.5);
    ctx.lineTo(shape.x - shape.size * 0.36, shape.y - shaft + length * 0.5);
    ctx.lineTo(shape.x, shape.y - length * 0.5);
    ctx.lineTo(shape.x + shape.size * 0.36, shape.y - shaft + length * 0.5);
    ctx.lineTo(shape.x + halfThickness, shape.y - shaft + length * 0.5);
    ctx.lineTo(shape.x + halfThickness, shape.y + length * 0.5);
  } else if (shape.type === 'arrow-down') {
    ctx.moveTo(shape.x - halfThickness, shape.y - length * 0.5);
    ctx.lineTo(shape.x - halfThickness, shape.y + shaft - length * 0.5);
    ctx.lineTo(shape.x - shape.size * 0.36, shape.y + shaft - length * 0.5);
    ctx.lineTo(shape.x, shape.y + length * 0.5);
    ctx.lineTo(shape.x + shape.size * 0.36, shape.y + shaft - length * 0.5);
    ctx.lineTo(shape.x + halfThickness, shape.y + shaft - length * 0.5);
    ctx.lineTo(shape.x + halfThickness, shape.y - length * 0.5);
  }
  ctx.closePath();
  ctx.fill();
}

function drawExtraText() {
  const text = document.getElementById('iExtraText')?.value?.trim();
  if (!text) return;
  const size = Number(document.getElementById('rExtraSize')?.value || 42);
  const x = Number(document.getElementById('rExtraX')?.value || 980);
  const y = Number(document.getElementById('rExtraY')?.value || 640);
  const color = document.getElementById('extraColor')?.value || '#ffffff';
  const font = document.getElementById('selExtraFont')?.value || 'Noto Sans KR';
  ctx.save();
  ctx.font = `900 ${size}px "${font}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.lineWidth = Math.max(4, Math.round(size * 0.12));
  ctx.strokeStyle = 'rgba(0,0,0,0.82)';
  ctx.fillStyle = color;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawTexts(theme, pointMode, preset) {
  const mainSize = Number(document.getElementById("rMainSize").value);
  const emSize = Number(document.getElementById("rEmSize").value);
  const subSize = Number(document.getElementById("rSubSize").value);
  const glow = Number(document.getElementById("rGlow").value);
  const mainY = H - Number(document.getElementById("rMainY").value);
  const emY = H - Number(document.getElementById("rEmY").value);
  const mainFont = document.getElementById("selMainFont").value;
  const emFont = document.getElementById("selEmFont").value;
  const subFont = document.getElementById("selSubFont")?.value || "Noto Sans KR";

  const highlightBox = measureLine(S.em, emFont, emSize, 36, emY);
  drawPointHighlight(theme, preset, pointMode, highlightBox);

  ctx.save();
  ctx.font = `900 ${mainSize}px "${mainFont}", sans-serif`;
  ctx.lineWidth = 9;
  ctx.strokeStyle = "rgba(0,0,0,0.74)";
  ctx.shadowColor = "rgba(255,255,255,0.08)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = preset.textMain;
  ctx.strokeText(S.main, 36, mainY);
  ctx.fillText(S.main, 36, mainY);
  ctx.restore();

  ctx.save();
  ctx.font = `900 ${emSize}px "${emFont}", sans-serif`;
  ctx.lineWidth = 10;
  ctx.strokeStyle = "rgba(0,0,0,0.78)";
  ctx.shadowColor = preset.accent;
  ctx.shadowBlur = glow > 0 ? glow * 0.7 : 0;
  const emGrad = ctx.createLinearGradient(36, emY - emSize, 36, emY + 10);
  emGrad.addColorStop(0, "#ffffff");
  emGrad.addColorStop(0.18, preset.accent);
  emGrad.addColorStop(1, preset.accent);
  ctx.fillStyle = emGrad;
  ctx.strokeText(S.em, 36, emY);
  ctx.fillText(S.em, 36, emY);
  ctx.restore();

  ctx.save();
  ctx.font = `700 ${subSize}px "${subFont}", sans-serif`;
  ctx.textAlign = "right";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(0,0,0,0.9)";
  ctx.fillStyle = preset.textMain === "#f7fbff" ? "#dfe9f8" : "#f0ebe0";
  ctx.strokeText(S.sub, W - 34, H - 28);
  ctx.fillText(S.sub, W - 34, H - 28);
  ctx.restore();
}

function drawPointHighlight(theme, preset, mode, box) {
  if (!box) return;
  ctx.save();
  if (mode === "circle") {
    ctx.beginPath();
    ctx.strokeStyle = preset.accent;
    ctx.lineWidth = 5;
    ctx.arc(box.x + box.w * 0.52, box.y + box.h * 0.5, Math.max(box.w, box.h) * 0.42, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (mode === "box") {
    roundedRect(ctx, box.x - 14, box.y - 10, box.w + 28, box.h + 20, 14);
    ctx.fillStyle = "rgba(0,0,0,0.26)";
    ctx.fill();
    ctx.strokeStyle = preset.accent;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  if (mode === "zone") {
    const grad = ctx.createLinearGradient(box.x - 30, box.y, box.x + box.w + 30, box.y);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.2, preset.panel);
    grad.addColorStop(0.8, preset.panel);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(box.x - 34, box.y - 16, box.w + 68, box.h + 30);
  }
  ctx.restore();
}

function drawFrame(preset) {
  ctx.save();
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, H * 0.9);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.42)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function resolvePointMode() {
  const mode = document.getElementById("selPointMode").value;
  if (mode !== "auto") return mode;
  if (S.type === "warning") return "circle";
  if (S.type === "rising") return "box";
  return "zone";
}

function resolveCharacterMode() {
  const mode = document.getElementById("selCharacterMode").value;
  if (mode !== "auto") return mode;
  return S.type === "warning" || S.type === "rising" ? "focus" : "calm";
}

function measureLine(text, font, size, x, baselineY) {
  ctx.save();
  ctx.font = `900 ${size}px "${font}", sans-serif`;
  const width = ctx.measureText(text).width;
  ctx.restore();
  return { x, y: baselineY - size, w: width, h: size + 14 };
}

function updatePreviewImages() {
  const data = C.toDataURL("image/png");
  els.mobilePreview.src = data;
  els.listThumb.src = data;
  if (els.modalPreviewImg) els.modalPreviewImg.src = data;
}

function updateCtrDisplay(score) {
  S.ctrScore = score;
  els.sCtr.textContent = `${score}점`;
  els.sCtr.className = `sv ${score >= 78 ? "up" : score <= 64 ? "dn" : ""}`.trim();
}

function saveSettingsDebounced() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveSettings, 150);
}

function saveSettings() {
  pullControlsIntoState();
  const values = {};
  document.querySelectorAll("input, select").forEach((el) => {
    if (el.id) values[el.id] = el.value;
  });
  values._days = S.days;
  values._type = S.type;
  values._autoMode = S.autoMode ? "1" : "0";
  values._contentMode = S.contentMode;
  values._candidateCount = String(S.candidateCount || 3);
  values._advancedOpen = S.advancedOpen ? "1" : "0";
  values._visualPreset = S.visualPreset;
  values._shapes = JSON.stringify(shapes);
  localStorage.setItem(LS_SETTINGS, JSON.stringify(values));
}

function buildPresetSnapshot() {
  const values = readJson(LS_SETTINGS, {});
  delete values.iPresetName;
  delete values.selPresetList;
  return values;
}

function restoreSettings() {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    if (!raw) return;
    const values = JSON.parse(raw);
    Object.entries({
      selBgGradient: DEFAULT_BG_OPTIONS.gradient,
      selBgGlow: DEFAULT_BG_OPTIONS.glow,
      selBgBeam: DEFAULT_BG_OPTIONS.beam,
      selBgGrid: DEFAULT_BG_OPTIONS.grid,
      selBgHorizon: DEFAULT_BG_OPTIONS.horizon,
      bgColorTop: DEFAULT_BG_COLORS.top,
      bgColorMid: DEFAULT_BG_COLORS.mid,
      bgColorBottom: DEFAULT_BG_COLORS.bottom,
      bgGlowColor: DEFAULT_BG_COLORS.glow,
      bgBeamColor: DEFAULT_BG_COLORS.beam
    }).forEach(([key, fallback]) => {
      if (values[key] == null) values[key] = fallback;
    });
    Object.entries(values).forEach(([key, value]) => {
      if (key.startsWith("_")) return;
      const el = document.getElementById(key);
      if (el) el.value = value;
    });
    S.days = Number(values._days || 1);
    S.type = values._type || "warning";
    S.autoMode = values._autoMode === "1";
    S.contentMode = values._contentMode || "bitcoin";
    S.candidateCount = Number(values._candidateCount || 3);
    S.advancedOpen = values._advancedOpen === "1";
    S.visualPreset = values._visualPreset || "auto";
    try { shapes = values._shapes ? JSON.parse(values._shapes).map(normalizeShape) : []; } catch (e) { shapes = []; }
    shapeCounter = Math.max(1, shapes.length + 1);
    document.querySelectorAll("[data-period]").forEach((btn) => btn.classList.toggle("active", Number(btn.dataset.period) === S.days));
    document.getElementById("selTone").value = S.autoMode ? "auto" : S.type;
    const countSel = document.getElementById("selCandidateCount");
    if (countSel) countSel.value = String(S.candidateCount || 3);
    const presetSel = document.getElementById("selVisualPreset");
    if (presetSel) presetSel.value = S.visualPreset || "auto";
    renderAutoTag();
    updateContentButtons();
    updatePresetButtons();
    renderAdvancedState();
    refreshShapeList();
  } catch (error) {
    console.error(error);
  }
}

function savePreset() {
  const name = document.getElementById("iPresetName").value.trim();
  if (!name) {
    alert("프리셋 이름을 입력해주세요.");
    return;
  }
  const store = readJson(LS_PRESETS, {});
  saveSettings();
  store[name] = buildPresetSnapshot();
  localStorage.setItem(LS_PRESETS, JSON.stringify(store));
  refreshPresetList(name);
  document.getElementById("selPresetList").value = name;
  document.getElementById("iPresetName").value = name;
  alert(`프리셋 "${name}" 저장 완료`);
}

function loadPreset() {
  const name = document.getElementById("selPresetList").value;
  const store = readJson(LS_PRESETS, {});
  if (!store[name]) {
    alert("불러올 프리셋을 선택해주세요.");
    return;
  }
  localStorage.setItem(LS_SETTINGS, JSON.stringify(store[name]));
  restoreSettings();
  document.getElementById("selPresetList").value = name;
  document.getElementById("iPresetName").value = name;
  syncLabels();
  pullControlsIntoState();
  redraw();
}

function refreshPresetList(selected = "") {
  const store = readJson(LS_PRESETS, {});
  const select = document.getElementById("selPresetList");
  select.innerHTML = '<option value="">프리셋 선택</option>';
  Object.keys(store).sort((a, b) => a.localeCompare(b, "ko")).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    if (name === selected) option.selected = true;
    select.appendChild(option);
  });
}

function pushHistory(candidate) {
  const history = getHistory();
  history.unshift({
    main: candidate.main,
    em: candidate.em,
    sub: candidate.sub,
    title: candidate.title,
    signature: candidate.signature,
    colorKey: candidate.colorKey,
    structure: candidate.structure,
    time: Date.now()
  });
  localStorage.setItem(LS_HISTORY, JSON.stringify(history.slice(0, 12)));
  renderHistory();
}

function getHistory() {
  return readJson(LS_HISTORY, []);
}

function renderHistory() {
  const history = getHistory();
  if (!history.length) {
    els.historyBox.textContent = "아직 저장된 문구가 없습니다.";
    return;
  }
  els.historyBox.textContent = history
    .slice(0, 5)
    .map((item, index) => `${index + 1}. ${item.main} / ${item.em} / ${item.colorKey}`)
    .join("\n");
}


function bindModalControls() {
  const ids = ["mBadge","mMain","mEm","mSub","mTitle","mPointMode","mTone","mPreset","mMainSize","mEmSize","mSubSize","mGlow","mMainY","mEmY","mChartPadTop","mChartPadRight"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", syncModalToMain);
    el.addEventListener("change", syncModalToMain);
  });
  document.getElementById("btnModalCancel")?.addEventListener("click", closeEditorModal);
  document.getElementById("btnModalSave")?.addEventListener("click", saveEditorModal);
  els.editorModal?.addEventListener("click", (e) => {
    if (e.target === els.editorModal) closeEditorModal();
  });
}

function snapshotControls() {
  const ids = ["iBadge","iMain","iEm","iSub","iTitle","selPointMode","selTone","rBadgeSize","rMainSize","rEmSize","rSubSize","rGlow","rMainY","rEmY","rChartPadTop","rChartPadRight"];
  const data = {};
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) data[id] = el.value;
  });
  data._type = S.type;
  data._autoMode = S.autoMode;
  return data;
}

function applySnapshot(data) {
  Object.entries(data).forEach(([id, value]) => {
    if (id.startsWith("_")) return;
    const el = document.getElementById(id);
    if (el) el.value = value;
  });
  S.type = data._type || S.type;
  S.autoMode = !!data._autoMode;
  syncLabels();
  updateTypeButtons();
  renderAutoTag();
  refreshCurrentMetrics();
  redraw();
}

function openEditorModal(candidate) {
  modalSnapshot = snapshotControls();
  applyCandidate(candidate, { persistHistory: false });
  document.getElementById("mBadge").value = document.getElementById("iBadge").value;
  document.getElementById("mMain").value = document.getElementById("iMain").value;
  document.getElementById("mEm").value = document.getElementById("iEm").value;
  document.getElementById("mSub").value = document.getElementById("iSub").value;
  document.getElementById("mTitle").value = document.getElementById("iTitle").value;
  document.getElementById("mPointMode").value = document.getElementById("selPointMode").value;
  document.getElementById("mTone").value = S.type;
  document.getElementById("mPreset").value = S.visualPreset || "auto";
  document.getElementById("mMainSize").value = document.getElementById("rMainSize").value;
  document.getElementById("mEmSize").value = document.getElementById("rEmSize").value;
  document.getElementById("mSubSize").value = document.getElementById("rSubSize").value;
  document.getElementById("mGlow").value = document.getElementById("rGlow").value;
  document.getElementById("mMainY").value = document.getElementById("rMainY").value;
  document.getElementById("mEmY").value = document.getElementById("rEmY").value;
  document.getElementById("mChartPadTop").value = document.getElementById("rChartPadTop").value;
  document.getElementById("mChartPadRight").value = document.getElementById("rChartPadRight").value;
  modalOpen = true;
  els.editorModal.hidden = false;
}

function syncModalToMain() {
  if (!modalOpen) return;
  document.getElementById("iBadge").value = document.getElementById("mBadge").value;
  document.getElementById("iMain").value = document.getElementById("mMain").value;
  document.getElementById("iEm").value = document.getElementById("mEm").value;
  document.getElementById("iSub").value = document.getElementById("mSub").value;
  document.getElementById("iTitle").value = document.getElementById("mTitle").value;
  document.getElementById("selPointMode").value = document.getElementById("mPointMode").value;
  document.getElementById("selTone").value = document.getElementById("mTone").value;
  document.getElementById("selVisualPreset").value = document.getElementById("mPreset").value;
  S.autoMode = false;
  S.type = document.getElementById("mTone").value;
  S.visualPreset = document.getElementById("mPreset").value;
  updatePresetButtons();
  document.getElementById("rMainSize").value = document.getElementById("mMainSize").value;
  document.getElementById("rEmSize").value = document.getElementById("mEmSize").value;
  document.getElementById("rSubSize").value = document.getElementById("mSubSize").value;
  document.getElementById("rGlow").value = document.getElementById("mGlow").value;
  document.getElementById("rMainY").value = document.getElementById("mMainY").value;
  document.getElementById("rEmY").value = document.getElementById("mEmY").value;
  document.getElementById("rChartPadTop").value = document.getElementById("mChartPadTop").value;
  document.getElementById("rChartPadRight").value = document.getElementById("mChartPadRight").value;
  syncLabels();
  updateTypeButtons();
  renderAutoTag();
  refreshCurrentMetrics();
  redraw();
}

function closeEditorModal() {
  if (modalSnapshot) applySnapshot(modalSnapshot);
  modalOpen = false;
  els.editorModal.hidden = true;
}

function saveEditorModal() {
  modalOpen = false;
  els.editorModal.hidden = true;
  modalSnapshot = null;
  const current = {
    tone: S.type,
    structure: "modal",
    main: S.main,
    em: S.em,
    sub: S.sub,
    title: S.title,
    pointMode: resolvePointMode(),
    colorKey: THEMES[S.type].colorKey,
    badge: S.badge || getDefaultBadge()
  };
  current.signature = makeSignature(current);
  pushHistory(current);
  saveSettingsDebounced();
}

function triggerDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function makeDownloadFilename() {
  const base = (S.title || S.main || "thumbnail")
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, "_")
    .slice(0, 40)
    .replace(/^_+|_+$/g, "");
  return `${base || "thumbnail"}_${Date.now()}.png`;
}

function downloadPng() {
  redraw();
  const filename = makeDownloadFilename();
  if (typeof C.toBlob === "function") {
    C.toBlob((blob) => {
      if (!blob) {
        triggerDownload(C.toDataURL("image/png"), filename);
        return;
      }
      const url = URL.createObjectURL(blob);
      triggerDownload(url, filename);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
    return;
  }
  triggerDownload(C.toDataURL("image/png"), filename);
}

function setLoading(isLoading) {
  els.loadEl.className = `loading${isLoading ? "" : " off"}`;
}

function setStatus(text, live) {
  els.liveStatus.textContent = text;
  els.liveDot.className = `dot${live ? " on" : ""}`;
}

function syncLabels() {
  [
    ["vLogoSize", "rLogoSize"],
    ["vChanSize", "rChanSize"],
    ["vBadgeSize", "rBadgeSize"],
    ["vMainSize", "rMainSize"],
    ["vEmSize", "rEmSize"],
    ["vSubSize", "rSubSize"],
    ["vGlow", "rGlow"],
    ["vMainY", "rMainY"],
    ["vEmY", "rEmY"],
    ["vChartPadTop", "rChartPadTop"],
    ["vChartPadRight", "rChartPadRight"],
    ["vOverlayScale", "rOverlayScale"],
    ["vOverlayOpacity", "rOverlayOpacity"],
    ["vOverlayX", "rOverlayX"],
    ["vOverlayY", "rOverlayY"],
    ["vShapeSize", "shapeSize"],
    ["vShapeSecondary", "shapeSecondary"],
    ["vShapeX", "shapeX"],
    ["vShapeY", "shapeY"],
    ["vExtraSize", "rExtraSize"],
    ["vExtraX", "rExtraX"],
    ["vExtraY", "rExtraY"]
  ].forEach(([labelId, inputId]) => {
    const label = document.getElementById(labelId);
    const input = document.getElementById(inputId);
    if (label && input) label.textContent = input.value;
  });
  syncLinkedNumberInputs();
  renderHistory();
}

function bindRangeNumberPairs() {
  const pairs = {
    rBadgeSize: 'nBadgeSize',
    rMainSize: 'nMainSize',
    rEmSize: 'nEmSize',
    rSubSize: 'nSubSize',
    rGlow: 'nGlow',
    rMainY: 'nMainY',
    rEmY: 'nEmY',
    rChartPadTop: 'nChartPadTop',
    rChartPadRight: 'nChartPadRight',
    rExtraSize: 'nExtraSize',
    rExtraX: 'nExtraX',
    rExtraY: 'nExtraY',
    shapeSize: 'nShapeSize',
    shapeSecondary: 'nShapeSecondary',
    shapeX: 'nShapeX',
    shapeY: 'nShapeY'
  };

  Object.entries(pairs).forEach(([rangeId, numberId]) => {
    const range = document.getElementById(rangeId);
    const number = document.getElementById(numberId);
    if (!range || !number) return;

    const apply = (value) => {
      const min = Number(range.min || 0);
      const max = Number(range.max || value);
      const next = Math.min(max, Math.max(min, Number(value || 0)));
      range.value = next;
      number.value = next;
      if (range.id.startsWith('shape')) {
        onShapeControlInput();
        return;
      }
      syncLabels();
      redraw();
      saveSettingsDebounced();
    };

    range.addEventListener('input', () => { number.value = range.value; });
    range.addEventListener('change', () => { number.value = range.value; });
    number.addEventListener('input', () => apply(number.value));
    number.addEventListener('change', () => apply(number.value));
    number.addEventListener('wheel', (e) => {
      e.preventDefault();
      const step = Number(number.step || 1) || 1;
      const current = Number(number.value || range.value || 0);
      apply(current + (e.deltaY < 0 ? step : -step));
    }, { passive: false });
  });
  syncLinkedNumberInputs();
}

function syncLinkedNumberInputs() {
  const pairs = {
    rBadgeSize: 'nBadgeSize',
    rMainSize: 'nMainSize',
    rEmSize: 'nEmSize',
    rSubSize: 'nSubSize',
    rGlow: 'nGlow',
    rMainY: 'nMainY',
    rEmY: 'nEmY',
    rChartPadTop: 'nChartPadTop',
    rChartPadRight: 'nChartPadRight',
    rExtraSize: 'nExtraSize',
    rExtraX: 'nExtraX',
    rExtraY: 'nExtraY',
    shapeSize: 'nShapeSize',
    shapeSecondary: 'nShapeSecondary',
    shapeX: 'nShapeX',
    shapeY: 'nShapeY'
  };
  Object.entries(pairs).forEach(([rangeId, numberId]) => {
    const range = document.getElementById(rangeId);
    const number = document.getElementById(numberId);
    if (range && number) number.value = range.value;
  });
}

function roundedRect(context, x, y, w, h, r) {
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + w - r, y);
  context.arcTo(x + w, y, x + w, y + r, r);
  context.lineTo(x + w, y + h - r);
  context.arcTo(x + w, y + h, x + w - r, y + h, r);
  context.lineTo(x + r, y + h);
  context.arcTo(x, y + h, x, y + h - r, r);
  context.lineTo(x, y + r);
  context.arcTo(x, y, x + r, y, r);
  context.closePath();
}

function resolveColor(colorKey) {
  const map = {
    red: THEMES.warning,
    green: THEMES.rising,
    blue: THEMES.reversal,
    gold: THEMES.chance
  };
  return map[colorKey] || THEMES[S.type];
}

function pickVariant(list, offset) {
  return list[(Math.floor(Math.random() * list.length) + refreshSeed + offset) % list.length];
}

function trimCopy(text, maxLen) {
  return text.length > maxLen ? `${text.slice(0, maxLen).trim()}` : text;
}

function makeSignature(candidate) {
  return normalizeText([candidate.main, candidate.em, candidate.sub, candidate.title].join(" "));
}

function normalizeText(text) {
  return text.toLowerCase().replace(/[^가-힣a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function computeSimilarity(a, b) {
  const aa = new Set(a.split(" "));
  const bb = new Set(b.split(" "));
  let same = 0;
  aa.forEach((word) => {
    if (bb.has(word)) same += 1;
  });
  return same / Math.max(aa.size, bb.size, 1);
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
