(function () {
  const template = JSON.parse(document.getElementById('templateData').textContent);
  const today = JSON.parse(document.getElementById('todayData').textContent);
  const video = document.getElementById('cameraPreview');
  const canvas = document.getElementById('templateCanvas');
  const captureBtn = document.getElementById('captureBtn');
  const switchBtn = document.getElementById('switchCameraBtn');
  const frontBtn = document.getElementById('frontCameraBtn');
  const backBtn = document.getElementById('backCameraBtn');
  const slotButtons = document.getElementById('slotButtons');
  const message = document.getElementById('cameraMessage');
  const countdown = document.getElementById('countdown');
  const overlay = document.getElementById('cameraOverlay');
  const flash = document.getElementById('flash');
  const slotProgress = document.getElementById('slotProgress');
  const openEditorBtn = document.getElementById('openEditorBtn');

  let stream = null;
  let mode = 'user';
  let activeSlotIndex = 0;
  const photos = {};
  const textValues = { __date: today, __watermark: { enabled: false, text: 'Aesthetic Gallery' }, __design: { theme: 'default' } };
  const draftKey = `gallery-create-draft:${template.slug}`;

  (template.textElements || []).forEach((item) => {
    textValues[item.id] = { text: String(item.text || '').replace('{{date}}', today) };
  });

  function safeMessage(text, danger) {
    message.textContent = text;
    message.className = `mt-4 rounded-2xl p-4 text-sm font-semibold ${danger ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`;
  }

  function currentSlot() {
    return (template.photoSlots || [])[activeSlotIndex];
  }

  function saveCreateDraft() {
    try {
      localStorage.setItem(draftKey, JSON.stringify({ photos, activeSlotIndex, updatedAt: Date.now() }));
    } catch (error) {}
  }

  function restoreCreateDraft() {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft || !draft.photos) return;
      Object.values(draft.photos).forEach((photo) => {
        if (photo && photo.slotId && photo.dataUrl) photos[photo.slotId] = photo;
      });
      if (Number.isInteger(draft.activeSlotIndex)) activeSlotIndex = Math.min(Math.max(draft.activeSlotIndex, 0), (template.photoSlots || []).length - 1);
      safeMessage('Draft foto sebelumnya dipulihkan dari browser ini.');
    } catch (error) {}
  }

  function clearCreateDraft() {
    try { localStorage.removeItem(draftKey); } catch (error) {}
  }

  function updateSlotButtons() {
    slotButtons.innerHTML = '';
    (template.photoSlots || []).forEach((slot, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `slot-btn ${index === activeSlotIndex ? 'active' : ''} ${photos[slot.id] ? 'filled' : ''}`;
      button.textContent = `${index + 1}${photos[slot.id] ? ' ✓' : ''}`;
      button.addEventListener('click', () => {
        activeSlotIndex = index;
        updateSlotButtons();
        saveCreateDraft();
        safeMessage(`Slot ${index + 1} aktif. Ambil foto untuk mengganti slot ini.`);
      });
      slotButtons.appendChild(button);
    });

    const filled = Object.keys(photos).length;
    slotProgress.textContent = `${filled}/${(template.photoSlots || []).length}`;
    openEditorBtn.disabled = filled === 0;
  }

  async function renderPreview() {
    await window.TemplateRenderer.renderTemplate(canvas, template, photos, textValues);
  }

  async function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
  }

  function constraintsFor(cameraMode) {
    if (cameraMode === 'environment') {
      return {
        video: { facingMode: { exact: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };
    }
    return {
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    };
  }

  async function startCamera(cameraMode) {
    try {
      await stopCamera();
      mode = cameraMode;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraintsFor(cameraMode));
      } catch (error) {
        if (cameraMode === 'environment') {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
        } else {
          throw error;
        }
      }
      video.srcObject = stream;
      video.classList.toggle('mirror', mode === 'user');
      frontBtn.classList.toggle('active', mode === 'user');
      backBtn.classList.toggle('active', mode === 'environment');
      safeMessage(mode === 'user' ? 'Kamera depan aktif dengan mirror mode.' : 'Kamera belakang aktif.');
    } catch (error) {
      safeMessage('Kamera tidak bisa dibuka. Pastikan izin kamera sudah diaktifkan.', true);
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function runCountdown() {
    overlay.classList.remove('hidden');
    overlay.classList.add('grid');
    for (let i = 3; i >= 1; i -= 1) {
      countdown.textContent = String(i);
      await wait(650);
    }
    overlay.classList.add('hidden');
    overlay.classList.remove('grid');
  }

  function flashEffect() {
    flash.classList.remove('hidden');
    setTimeout(() => flash.classList.add('hidden'), 180);
  }

  function captureFrame() {
    const sourceWidth = video.videoWidth || 1280;
    const sourceHeight = video.videoHeight || 720;
    const maxSide = 1280;
    const ratio = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));
    const width = Math.round(sourceWidth * ratio);
    const height = Math.round(sourceHeight * ratio);
    const temp = document.createElement('canvas');
    temp.width = width;
    temp.height = height;
    const ctx = temp.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (mode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);
    return temp.toDataURL('image/jpeg', 0.78);
  }

  function nextEmptySlotIndex() {
    return (template.photoSlots || []).findIndex((slot) => !photos[slot.id]);
  }

  async function createResultAndOpenEditor() {
    openEditorBtn.disabled = true;
    safeMessage('Membuat editor hasil...');

    const payload = {
      templateSlug: template.slug,
      photos: Object.values(photos),
      textValues
    };

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!data.success) throw new Error('failed');
      clearCreateDraft();
      window.location.href = `/editor/${data.id}`;
    } catch (error) {
      openEditorBtn.disabled = false;
      safeMessage('Hasil belum bisa dibuat. Silakan coba lagi.', true);
    }
  }

  async function capture() {
    const slot = currentSlot();
    if (!slot) return;
    captureBtn.disabled = true;
    try {
      await runCountdown();
      const dataUrl = captureFrame();
      photos[slot.id] = {
        slotId: slot.id,
        dataUrl,
        filter: slot.filter || 'normal',
        caption: slot.caption || '',
        transform: { zoom: 1, rotate: 0, offsetX: 0, offsetY: 0 }
      };
      flashEffect();
      safeMessage(`Foto masuk ke slot ${activeSlotIndex + 1}. Gambar sudah dikompres agar ringan di HP.`);
      const nextIndex = nextEmptySlotIndex();
      if (nextIndex !== -1) activeSlotIndex = nextIndex;
      updateSlotButtons();
      saveCreateDraft();
      await renderPreview();

      if (Object.keys(photos).length === (template.photoSlots || []).length) {
        safeMessage('Semua slot terisi. Membuka editor...');
        await wait(500);
        await createResultAndOpenEditor();
      }
    } catch (error) {
      safeMessage('Foto gagal diambil. Silakan coba lagi.', true);
    } finally {
      captureBtn.disabled = false;
    }
  }

  captureBtn.addEventListener('click', capture);
  switchBtn.addEventListener('click', () => startCamera(mode === 'user' ? 'environment' : 'user'));
  frontBtn.addEventListener('click', () => startCamera('user'));
  backBtn.addEventListener('click', () => startCamera('environment'));
  openEditorBtn.addEventListener('click', createResultAndOpenEditor);
  window.addEventListener('beforeunload', stopCamera);

  restoreCreateDraft();
  updateSlotButtons();
  renderPreview();

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    safeMessage('Browser ini belum mendukung kamera langsung.', true);
  } else {
    startCamera('user');
  }
})();
