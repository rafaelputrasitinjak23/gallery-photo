(function () {
  const template = JSON.parse(document.getElementById('templateData').textContent);
  const result = JSON.parse(document.getElementById('resultData').textContent);
  const today = JSON.parse(document.getElementById('todayData').textContent);

  const canvas = document.getElementById('editorCanvas');
  const bigPreviewCanvas = document.getElementById('bigPreviewCanvas');
  const textControls = document.getElementById('textControls');
  const activePhotoSlot = document.getElementById('activePhotoSlot');
  const photoCaption = document.getElementById('photoCaption');
  const photoFilter = document.getElementById('photoFilter');
  const photoZoom = document.getElementById('photoZoom');
  const photoRotate = document.getElementById('photoRotate');
  const photoOffsetX = document.getElementById('photoOffsetX');
  const photoOffsetY = document.getElementById('photoOffsetY');
  const textColor = document.getElementById('textColor');
  const textSize = document.getElementById('textSize');
  const fontFamily = document.getElementById('fontFamily');
  const saveStatus = document.getElementById('saveStatus');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const resetPhotoBtn = document.getElementById('resetPhotoBtn');
  const autoEnhanceBtn = document.getElementById('autoEnhanceBtn');
  const watermarkEnabled = document.getElementById('watermarkEnabled');
  const watermarkText = document.getElementById('watermarkText');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  const clearDraftBtn = document.getElementById('clearDraftBtn');
  const previewModal = document.getElementById('editorPreviewModal');
  const fullscreenPreviewBtn = document.getElementById('fullscreenPreviewBtn');
  const closeEditorPreview = document.getElementById('closeEditorPreview');

  const defaultFonts = ['Inter', 'Playfair Display', 'Arial', 'Georgia'];
  const brokenObjectTexts = new Set(['[object Object]', '[object object]', 'object object']);
  const resultId = String(result._id || result.id || result.templateSlug || template.slug);
  const draftKey = `gallery-editor-draft:${resultId}`;

  const themePresets = {
    default: { theme: 'default', backgroundColor: '', gradient: '', textColor: '', accentColor: '' },
    cream: { theme: 'cream', backgroundColor: '#fff7ed', gradient: 'linear-gradient(135deg, #fff7ed, #f7e0c2)', textColor: '#2c211b', accentColor: '#d7a86e' },
    pink: { theme: 'pink', backgroundColor: '#fff0f5', gradient: 'linear-gradient(135deg, #fff1f7, #ffd7e5)', textColor: '#73344d', accentColor: '#ff6f91' },
    blue: { theme: 'blue', backgroundColor: '#eef2ff', gradient: 'linear-gradient(135deg, #f8fbff, #dfe7ff)', textColor: '#1f2748', accentColor: '#8093ff' },
    dark: { theme: 'dark', backgroundColor: '#111827', gradient: 'linear-gradient(135deg, #111827, #312e81)', textColor: '#ffffff', accentColor: '#fbbf24' },
    minimal: { theme: 'minimal', backgroundColor: '#ffffff', gradient: 'linear-gradient(135deg, #ffffff, #f8fafc)', textColor: '#111111', accentColor: '#d4d4d4' }
  };

  const photos = {};
  (result.photos || []).forEach((photo) => {
    photos[photo.slotId] = {
      slotId: photo.slotId,
      dataUrl: photo.dataUrl,
      filter: photo.filter || 'normal',
      caption: photo.caption || '',
      transform: Object.assign({ zoom: 1, rotate: 0, offsetX: 0, offsetY: 0 }, photo.transform || {})
    };
  });

  const textValues = Object.assign({ __date: today }, result.textValues || {});
  let saveTimer = null;
  let selectedTextId = template.textElements && template.textElements[0] ? template.textElements[0].id : '';
  let isDraggingCanvas = false;
  let lastPointer = null;
  let lastTouchDistance = 0;

  function defaultTextFor(element) {
    return String(element && element.text ? element.text : '').replace(/\{\{date\}\}/g, today);
  }

  function isBrokenText(value) {
    return brokenObjectTexts.has(String(value || '').trim());
  }

  function normalizeTextValue(element, value) {
    const fallbackText = defaultTextFor(element);

    if (typeof value === 'string') {
      return { text: isBrokenText(value) ? fallbackText : value };
    }

    if (value && typeof value === 'object') {
      const normalized = Object.assign({}, value);
      if (normalized.text === undefined || normalized.text === null || typeof normalized.text === 'object' || isBrokenText(normalized.text)) {
        normalized.text = fallbackText;
      }
      normalized.text = String(normalized.text).replace(/\{\{date\}\}/g, today);
      if (normalized.color && !/^#[0-9a-fA-F]{6}$/.test(String(normalized.color))) delete normalized.color;
      if (normalized.fontSize && !Number.isFinite(Number(normalized.fontSize))) delete normalized.fontSize;
      if (normalized.fontFamily && !defaultFonts.includes(String(normalized.fontFamily))) delete normalized.fontFamily;
      return normalized;
    }

    return { text: fallbackText };
  }

  function normalizeSpecialValues() {
    if (typeof textValues.__date !== 'string') textValues.__date = today;
    if (!textValues.__watermark || typeof textValues.__watermark !== 'object') {
      textValues.__watermark = { enabled: false, text: 'Aesthetic Gallery', color: '#111827' };
    }
    if (!textValues.__design || typeof textValues.__design !== 'object') {
      textValues.__design = Object.assign({}, themePresets.default);
    }
  }

  (template.textElements || []).forEach((element) => {
    textValues[element.id] = normalizeTextValue(element, textValues[element.id]);
  });
  normalizeSpecialValues();

  function applyDraftIfAvailable() {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft || draft.templateSlug !== template.slug) return;
      if (draft.photos && typeof draft.photos === 'object') {
        Object.keys(photos).forEach((key) => delete photos[key]);
        Object.values(draft.photos).forEach((photo) => {
          if (photo && photo.slotId && photo.dataUrl) {
            photos[photo.slotId] = Object.assign({ filter: 'normal', caption: '', transform: { zoom: 1, rotate: 0, offsetX: 0, offsetY: 0 } }, photo);
            photos[photo.slotId].transform = Object.assign({ zoom: 1, rotate: 0, offsetX: 0, offsetY: 0 }, photos[photo.slotId].transform || {});
          }
        });
      }
      if (draft.textValues && typeof draft.textValues === 'object') {
        Object.assign(textValues, draft.textValues);
        (template.textElements || []).forEach((element) => {
          textValues[element.id] = normalizeTextValue(element, textValues[element.id]);
        });
        normalizeSpecialValues();
      }
      setStatus('Draft lokal berhasil dipulihkan.');
    } catch (error) {}
  }

  function saveLocalDraft() {
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        templateSlug: template.slug,
        photos,
        textValues,
        updatedAt: Date.now()
      }));
    } catch (error) {}
  }

  function clearLocalDraft() {
    try {
      localStorage.removeItem(draftKey);
      setStatus('Draft lokal dihapus.');
    } catch (error) {}
  }

  function labelForText(element) {
    const map = {
      title: 'Judul',
      subtitle: 'Subtitle',
      date: 'Tanggal',
      note: 'Catatan',
      checklist: 'Checklist',
      location: 'Lokasi'
    };
    return map[element.id] || map[element.type] || String(element.type || element.id || 'Teks');
  }

  function setStatus(text, danger) {
    if (!saveStatus) return;
    saveStatus.textContent = text;
    saveStatus.className = `rounded-2xl p-4 text-sm font-semibold ${danger ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`;
  }

  function getActivePhoto() {
    return photos[activePhotoSlot.value];
  }

  async function render(targetCanvas) {
    await window.TemplateRenderer.renderTemplate(targetCanvas || canvas, template, photos, textValues, { textStyle: {} });
  }

  function syncTextStyleControls() {
    const element = (template.textElements || []).find((item) => item.id === selectedTextId) || {};
    const current = textValues[selectedTextId] || {};
    textColor.value = current.color || element.color || '#2c211b';
    textSize.value = current.fontSize || element.fontSize || 34;
    fontFamily.value = current.fontFamily || element.fontFamily || 'Inter';
  }

  function markSelectedTextControl() {
    Array.from(textControls.querySelectorAll('[data-text-card]')).forEach((card) => {
      const active = card.getAttribute('data-text-card') === selectedTextId;
      card.classList.toggle('ring-2', active);
      card.classList.toggle('ring-slate-950', active);
      card.classList.toggle('bg-white', active);
    });
  }

  function buildTextControls() {
    textControls.innerHTML = '';

    if (!template.textElements || !template.textElements.length) {
      textControls.innerHTML = '<p class="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">Template ini belum memiliki teks yang bisa diedit.</p>';
      return;
    }

    template.textElements.forEach((element) => {
      const card = document.createElement('div');
      card.className = 'rounded-3xl border border-slate-200/80 bg-white/70 p-4 transition';
      card.setAttribute('data-text-card', element.id);

      const top = document.createElement('div');
      top.className = 'mb-2 flex items-center justify-between gap-3';

      const label = document.createElement('p');
      label.className = 'text-xs font-black uppercase tracking-[0.16em] text-slate-500';
      label.textContent = labelForText(element);

      const selectBtn = document.createElement('button');
      selectBtn.type = 'button';
      selectBtn.className = 'rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600';
      selectBtn.textContent = 'Style';
      selectBtn.addEventListener('click', () => {
        selectedTextId = element.id;
        syncTextStyleControls();
        markSelectedTextControl();
      });

      const input = document.createElement(element.type === 'note' || element.id === 'note' || String(textValues[element.id].text || '').length > 70 ? 'textarea' : 'input');
      input.className = 'input-soft min-h-[48px] w-full resize-y';
      if (input.tagName === 'TEXTAREA') input.rows = 3;
      input.value = textValues[element.id].text;
      input.maxLength = 300;
      input.placeholder = defaultTextFor(element);

      input.addEventListener('focus', () => {
        selectedTextId = element.id;
        syncTextStyleControls();
        markSelectedTextControl();
      });

      input.addEventListener('input', () => {
        selectedTextId = element.id;
        textValues[element.id] = Object.assign({}, textValues[element.id] || {}, { text: input.value });
        syncTextStyleControls();
        markSelectedTextControl();
        renderAndSave();
      });

      top.appendChild(label);
      top.appendChild(selectBtn);
      card.appendChild(top);
      card.appendChild(input);
      textControls.appendChild(card);
    });

    markSelectedTextControl();
  }

  function buildPhotoControls() {
    activePhotoSlot.innerHTML = '';
    (template.photoSlots || []).forEach((slot, index) => {
      const option = document.createElement('option');
      option.value = slot.id;
      option.textContent = `Slot ${index + 1} - ${slot.caption || slot.id}`;
      activePhotoSlot.appendChild(option);
    });
    syncPhotoControls();
  }

  function syncPhotoControls() {
    const photo = getActivePhoto();
    const slot = (template.photoSlots || []).find((item) => item.id === activePhotoSlot.value) || {};
    photoCaption.value = photo ? photo.caption : (slot.caption || '');
    photoFilter.value = photo ? photo.filter : (slot.filter || 'normal');
    const transform = photo ? photo.transform || {} : {};
    photoZoom.value = transform.zoom || 1;
    photoRotate.value = transform.rotate || 0;
    photoOffsetX.value = transform.offsetX || 0;
    photoOffsetY.value = transform.offsetY || 0;
  }

  function syncWatermarkControls() {
    const watermark = textValues.__watermark || {};
    watermarkEnabled.checked = Boolean(watermark.enabled);
    watermarkText.value = watermark.text || 'Aesthetic Gallery';
  }

  function updateActivePhoto(patch) {
    const slotId = activePhotoSlot.value;
    if (!photos[slotId]) return;
    photos[slotId] = Object.assign({}, photos[slotId], patch);
    renderAndSave();
  }

  function updateActivePhotoTransform(key, value) {
    const photo = getActivePhoto();
    if (!photo) return;
    photo.transform = Object.assign({}, photo.transform || {}, { [key]: Number(value) });
    renderAndSave();
  }

  function renderAndSave() {
    render();
    saveLocalDraft();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveResult, 700);
  }

  async function saveResult() {
    try {
      setStatus('Menyimpan perubahan...');
      await render();
      const thumbnail = canvas.toDataURL('image/jpeg', 0.42);
      const finalImage = canvas.toDataURL('image/jpeg', 0.76);
      const payload = {
        templateSlug: template.slug,
        photos: Object.values(photos),
        textValues,
        thumbnail,
        finalImage
      };
      const response = await fetch(`/api/results/${resultId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!data.success) throw new Error('failed');
      setStatus('Perubahan tersimpan otomatis. Draft lokal juga aktif.');
    } catch (error) {
      setStatus('Perubahan belum tersimpan ke server. Draft lokal dan download tetap bisa digunakan.', true);
    }
  }

  function download(type) {
    render().then(() => {
      const mime = type === 'jpg' ? 'image/jpeg' : 'image/png';
      const ext = type === 'jpg' ? 'jpg' : 'png';
      const url = canvas.toDataURL(mime, type === 'jpg' ? 0.9 : undefined);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.slug}-${Date.now()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      saveResult();
    });
  }

  async function shareResult() {
    try {
      await render();
      const blob = await window.TemplateRenderer.canvasToBlob(canvas, 'image/png');
      const file = new File([blob], `${template.slug}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: template.name, text: 'Hasil galeri foto estetik' });
        return;
      }

      if (navigator.share) {
        await navigator.share({ title: template.name, text: 'Aku baru buat galeri foto estetik.', url: window.location.href });
        return;
      }

      download('png');
      setStatus('Browser belum mendukung share langsung, jadi hasil di-download dulu.', true);
    } catch (error) {
      setStatus('Share dibatalkan atau belum didukung browser.', true);
    }
  }

  function applyAutoEnhance() {
    const photo = getActivePhoto();
    if (!photo) {
      setStatus('Pilih slot yang sudah berisi foto dulu.', true);
      return;
    }
    photo.filter = 'enhance';
    photo.transform = Object.assign({ zoom: 1, rotate: 0, offsetX: 0, offsetY: 0 }, photo.transform || {});
    photo.transform.zoom = Math.max(Number(photo.transform.zoom || 1), 1.04);
    syncPhotoControls();
    renderAndSave();
  }

  function resetActivePhoto() {
    const photo = getActivePhoto();
    if (!photo) return;
    photo.transform = { zoom: 1, rotate: 0, offsetX: 0, offsetY: 0 };
    syncPhotoControls();
    renderAndSave();
  }

  function applyTheme(name) {
    textValues.__design = Object.assign({}, themePresets[name] || themePresets.default);
    if (textValues.__design.textColor) {
      (template.textElements || []).forEach((element) => {
        textValues[element.id] = Object.assign({}, textValues[element.id] || {}, { color: textValues.__design.textColor });
      });
      buildTextControls();
      syncTextStyleControls();
    }
    document.querySelectorAll('.theme-preset').forEach((button) => button.classList.toggle('active', button.dataset.theme === name));
    renderAndSave();
  }

  function updateWatermark() {
    textValues.__watermark = {
      enabled: watermarkEnabled.checked,
      text: watermarkText.value || 'Aesthetic Gallery',
      color: textValues.__design && textValues.__design.textColor ? textValues.__design.textColor : '#111827'
    };
    renderAndSave();
  }

  function handleCanvasDrag(dx, dy) {
    const photo = getActivePhoto();
    if (!photo) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = template.canvas.width / rect.width;
    const scaleY = template.canvas.height / rect.height;
    photo.transform = Object.assign({ zoom: 1, rotate: 0, offsetX: 0, offsetY: 0 }, photo.transform || {});
    photo.transform.offsetX += dx * scaleX;
    photo.transform.offsetY += dy * scaleY;
    photoOffsetX.value = Math.max(-400, Math.min(400, Math.round(photo.transform.offsetX)));
    photoOffsetY.value = Math.max(-400, Math.min(400, Math.round(photo.transform.offsetY)));
    renderAndSave();
  }

  function distanceBetweenTouches(touches) {
    if (!touches || touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  textColor.addEventListener('input', () => {
    if (!selectedTextId) return;
    textValues[selectedTextId] = Object.assign({}, textValues[selectedTextId] || {}, { color: textColor.value });
    renderAndSave();
  });

  textSize.addEventListener('input', () => {
    if (!selectedTextId) return;
    textValues[selectedTextId] = Object.assign({}, textValues[selectedTextId] || {}, { fontSize: Number(textSize.value) || 34 });
    renderAndSave();
  });

  fontFamily.addEventListener('change', () => {
    if (!selectedTextId) return;
    textValues[selectedTextId] = Object.assign({}, textValues[selectedTextId] || {}, { fontFamily: fontFamily.value });
    renderAndSave();
  });

  activePhotoSlot.addEventListener('change', syncPhotoControls);
  photoCaption.addEventListener('input', () => updateActivePhoto({ caption: photoCaption.value }));
  photoFilter.addEventListener('change', () => updateActivePhoto({ filter: photoFilter.value }));
  photoZoom.addEventListener('input', () => updateActivePhotoTransform('zoom', photoZoom.value));
  photoRotate.addEventListener('input', () => updateActivePhotoTransform('rotate', photoRotate.value));
  photoOffsetX.addEventListener('input', () => updateActivePhotoTransform('offsetX', photoOffsetX.value));
  photoOffsetY.addEventListener('input', () => updateActivePhotoTransform('offsetY', photoOffsetY.value));

  removePhotoBtn.addEventListener('click', () => {
    delete photos[activePhotoSlot.value];
    syncPhotoControls();
    renderAndSave();
  });

  resetPhotoBtn.addEventListener('click', resetActivePhoto);
  autoEnhanceBtn.addEventListener('click', applyAutoEnhance);
  watermarkEnabled.addEventListener('change', updateWatermark);
  watermarkText.addEventListener('input', updateWatermark);
  saveDraftBtn.addEventListener('click', () => {
    saveLocalDraft();
    setStatus('Draft tersimpan di browser ini.');
  });
  clearDraftBtn.addEventListener('click', clearLocalDraft);

  document.querySelectorAll('.theme-preset').forEach((button) => {
    button.addEventListener('click', () => applyTheme(button.dataset.theme));
  });

  canvas.addEventListener('pointerdown', (event) => {
    isDraggingCanvas = true;
    lastPointer = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!isDraggingCanvas || !lastPointer) return;
    const dx = event.clientX - lastPointer.x;
    const dy = event.clientY - lastPointer.y;
    lastPointer = { x: event.clientX, y: event.clientY };
    handleCanvasDrag(dx, dy);
  });

  canvas.addEventListener('pointerup', () => {
    isDraggingCanvas = false;
    lastPointer = null;
  });

  canvas.addEventListener('pointercancel', () => {
    isDraggingCanvas = false;
    lastPointer = null;
  });

  canvas.addEventListener('wheel', (event) => {
    const photo = getActivePhoto();
    if (!photo) return;
    event.preventDefault();
    photo.transform = Object.assign({ zoom: 1, rotate: 0, offsetX: 0, offsetY: 0 }, photo.transform || {});
    photo.transform.zoom = Math.max(0.6, Math.min(2.8, Number(photo.transform.zoom || 1) + (event.deltaY < 0 ? 0.04 : -0.04)));
    photoZoom.value = photo.transform.zoom;
    renderAndSave();
  }, { passive: false });

  canvas.addEventListener('touchstart', (event) => {
    if (event.touches.length === 2) lastTouchDistance = distanceBetweenTouches(event.touches);
  }, { passive: true });

  canvas.addEventListener('touchmove', (event) => {
    if (event.touches.length !== 2 || !lastTouchDistance) return;
    const photo = getActivePhoto();
    if (!photo) return;
    event.preventDefault();
    const distance = distanceBetweenTouches(event.touches);
    const diff = distance - lastTouchDistance;
    lastTouchDistance = distance;
    photo.transform = Object.assign({ zoom: 1, rotate: 0, offsetX: 0, offsetY: 0 }, photo.transform || {});
    photo.transform.zoom = Math.max(0.6, Math.min(2.8, Number(photo.transform.zoom || 1) + diff / 260));
    photoZoom.value = photo.transform.zoom;
    renderAndSave();
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    lastTouchDistance = 0;
  });

  fullscreenPreviewBtn.addEventListener('click', async () => {
    await render(bigPreviewCanvas);
    previewModal.classList.remove('hidden');
  });

  closeEditorPreview.addEventListener('click', () => previewModal.classList.add('hidden'));
  previewModal.addEventListener('click', (event) => {
    if (event.target === previewModal) previewModal.classList.add('hidden');
  });

  document.getElementById('downloadPngBtn').addEventListener('click', () => download('png'));
  document.getElementById('downloadJpgBtn').addEventListener('click', () => download('jpg'));
  document.getElementById('shareBtn').addEventListener('click', shareResult);

  applyDraftIfAvailable();
  buildTextControls();
  buildPhotoControls();
  syncTextStyleControls();
  syncWatermarkControls();
  document.querySelectorAll('.theme-preset').forEach((button) => {
    button.classList.toggle('active', button.dataset.theme === (textValues.__design && textValues.__design.theme));
  });
  render().then(saveResult);
})();
