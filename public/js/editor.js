(function () {
  const template = JSON.parse(document.getElementById('templateData').textContent);
  const result = JSON.parse(document.getElementById('resultData').textContent);
  const today = JSON.parse(document.getElementById('todayData').textContent);
  const canvas = document.getElementById('editorCanvas');
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

  const defaultFonts = ['Inter', 'Playfair Display', 'Arial', 'Georgia'];
  const brokenObjectTexts = new Set(['[object Object]', '[object object]', 'object object']);

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

  (template.textElements || []).forEach((element) => {
    textValues[element.id] = normalizeTextValue(element, textValues[element.id]);
  });

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
    saveStatus.textContent = text;
    saveStatus.className = `rounded-2xl p-4 text-sm font-semibold ${danger ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`;
  }

  function getActivePhoto() {
    return photos[activePhotoSlot.value];
  }

  async function render() {
    await window.TemplateRenderer.renderTemplate(canvas, template, photos, textValues, { textStyle: {} });
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
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveResult, 650);
  }

  async function saveResult() {
    try {
      setStatus('Menyimpan perubahan...');
      await render();
      const thumbnail = canvas.toDataURL('image/jpeg', 0.55);
      const finalImage = canvas.toDataURL('image/jpeg', 0.84);
      const payload = {
        templateSlug: template.slug,
        photos: Object.values(photos),
        textValues,
        thumbnail,
        finalImage
      };
      const response = await fetch(`/api/results/${result._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!data.success) throw new Error('failed');
      setStatus('Perubahan tersimpan otomatis.');
    } catch (error) {
      setStatus('Perubahan belum tersimpan. Download tetap bisa digunakan.', true);
    }
  }

  function download(type) {
    render().then(() => {
      const mime = type === 'jpg' ? 'image/jpeg' : 'image/png';
      const ext = type === 'jpg' ? 'jpg' : 'png';
      const url = canvas.toDataURL(mime, type === 'jpg' ? 0.92 : undefined);
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
      if (!navigator.share || !navigator.canShare) {
        setStatus('Browser belum mendukung fitur share langsung.', true);
        return;
      }
      await render();
      const blob = await window.TemplateRenderer.canvasToBlob(canvas, 'image/png');
      const file = new File([blob], `${template.slug}.png`, { type: 'image/png' });
      if (!navigator.canShare({ files: [file] })) {
        setStatus('Browser belum bisa share file gambar ini.', true);
        return;
      }
      await navigator.share({ files: [file], title: template.name, text: 'Hasil galeri foto estetik' });
    } catch (error) {}
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

  document.getElementById('downloadPngBtn').addEventListener('click', () => download('png'));
  document.getElementById('downloadJpgBtn').addEventListener('click', () => download('jpg'));
  document.getElementById('shareBtn').addEventListener('click', shareResult);

  buildTextControls();
  buildPhotoControls();
  syncTextStyleControls();
  render().then(saveResult);
})();
