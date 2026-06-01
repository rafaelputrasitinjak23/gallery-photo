(function () {
  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius || 0, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      if (!src) return reject(new Error('empty image'));
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('image failed'));
      img.src = src;
    });
  }

  function drawCover(ctx, img, x, y, width, height, transform) {
    const scale = Math.max(width / img.width, height / img.height) * (Number(transform.zoom) || 1);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = x + (width - dw) / 2 + (Number(transform.offsetX) || 0);
    const dy = y + (height - dh) / 2 + (Number(transform.offsetY) || 0);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function getFilter(filterName) {
    const filters = {
      normal: 'none',
      bright: 'brightness(1.16) saturate(1.06)',
      warm: 'sepia(.18) saturate(1.25) brightness(1.04)',
      cool: 'saturate(1.08) hue-rotate(185deg) brightness(1.03)',
      bw: 'grayscale(1) contrast(1.05)',
      sepia: 'sepia(.75) contrast(1.02)',
      vintage: 'sepia(.32) contrast(.95) saturate(.9)',
      soft: 'brightness(1.08) contrast(.94) saturate(1.02)',
      contrast: 'contrast(1.22) saturate(1.08)',
      fade: 'brightness(1.06) contrast(.82) saturate(.78)',
      blur: 'blur(1.2px) brightness(1.04)'
    };
    return filters[filterName] || filters.normal;
  }

  function gradientFromString(ctx, gradientString, width, height, fallback) {
    const colors = String(gradientString || '').match(/#[0-9a-fA-F]{3,8}/g) || [];
    if (!colors.length) return fallback || '#f7eee5';
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (colors.length === 1) {
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[0]);
    } else {
      colors.slice(0, 4).forEach((color, index, arr) => gradient.addColorStop(index / (arr.length - 1), color));
    }
    return gradient;
  }

  async function drawBackground(ctx, template) {
    const width = template.canvas.width;
    const height = template.canvas.height;
    const bg = template.background || {};

    ctx.save();
    ctx.fillStyle = bg.gradient ? gradientFromString(ctx, bg.gradient, width, height, bg.color) : (bg.color || '#ffffff');
    ctx.fillRect(0, 0, width, height);

    if (bg.image) {
      try {
        const img = await loadImage(bg.image);
        ctx.globalAlpha = 0.28;
        drawCover(ctx, img, 0, 0, width, height, { zoom: 1 });
        ctx.globalAlpha = 1;
      } catch (error) {}
    }

    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 26; i += 1) {
      ctx.beginPath();
      ctx.arc((i * 173) % width, (i * 311) % height, 2 + (i % 6), 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? '#ffffff' : '#111827';
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPlaceholder(ctx, slot) {
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    roundedRect(ctx, slot.x, slot.y, slot.width, slot.height, slot.radius || 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(15,23,42,.12)';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = 'rgba(15,23,42,.35)';
    ctx.font = `700 ${Math.max(24, slot.width / 10)}px Inter, Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PHOTO', slot.x + slot.width / 2, slot.y + slot.height / 2);
    ctx.restore();
  }

  async function drawPhotoSlot(ctx, slot, photo) {
    const cx = slot.x + slot.width / 2;
    const cy = slot.y + slot.height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(((Number(slot.rotation) || 0) * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    ctx.shadowColor = 'rgba(0,0,0,.18)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 18;
    ctx.fillStyle = '#ffffff';
    roundedRect(ctx, slot.x - 12, slot.y - 12, slot.width + 24, slot.height + 54, (slot.radius || 20) + 8);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    if (!photo || !photo.dataUrl) {
      drawPlaceholder(ctx, slot);
    } else {
      try {
        const img = await loadImage(photo.dataUrl);
        ctx.save();
        roundedRect(ctx, slot.x, slot.y, slot.width, slot.height, slot.radius || 18);
        ctx.clip();
        const transform = photo.transform || {};
        ctx.translate(slot.x + slot.width / 2, slot.y + slot.height / 2);
        ctx.rotate(((Number(transform.rotate) || 0) * Math.PI) / 180);
        ctx.translate(-(slot.x + slot.width / 2), -(slot.y + slot.height / 2));
        ctx.filter = getFilter(photo.filter || slot.filter || 'normal');
        drawCover(ctx, img, slot.x, slot.y, slot.width, slot.height, transform);
        ctx.filter = 'none';
        ctx.restore();
      } catch (error) {
        drawPlaceholder(ctx, slot);
      }
    }

    const caption = photo && photo.caption !== undefined ? photo.caption : slot.caption;
    if (caption) {
      ctx.fillStyle = '#43352d';
      ctx.font = `700 ${Math.max(22, slot.width / 15)}px Inter, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(String(caption).slice(0, 50), slot.x + slot.width / 2, slot.y + slot.height + 16, slot.width + 20);
    }
    ctx.restore();
  }

  function drawDecoration(ctx, item) {
    const x = Number(item.x) || 0;
    const y = Number(item.y) || 0;
    const width = Number(item.width) || 80;
    const height = Number(item.height) || 80;
    const color = item.color || '#111827';
    const cx = x + width / 2;
    const cy = y + height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(((Number(item.rotation) || 0) * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(3, width / 28);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (item.type) {
      case 'heart':
        ctx.beginPath();
        ctx.moveTo(cx, y + height * 0.82);
        ctx.bezierCurveTo(x - width * 0.15, y + height * 0.42, x + width * 0.18, y, cx, y + height * 0.27);
        ctx.bezierCurveTo(x + width * 0.82, y, x + width * 1.15, y + height * 0.42, cx, y + height * 0.82);
        ctx.fill();
        break;
      case 'sparkle':
      case 'star':
        ctx.beginPath();
        for (let i = 0; i < 8; i += 1) {
          const r = i % 2 === 0 ? width / 2 : width / 6;
          const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        break;
      case 'tape':
        ctx.globalAlpha = 0.82;
        roundedRect(ctx, x, y, width, height, 10);
        ctx.fill();
        break;
      case 'circle-doodle':
        ctx.beginPath();
        ctx.ellipse(cx, cy, width / 2, height / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx + 8, cy - 3, width / 2.15, height / 2.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'doodle-arrow':
        ctx.beginPath();
        ctx.moveTo(x + 5, cy);
        ctx.quadraticCurveTo(x + width * .42, y, x + width - 24, cy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + width - 26, cy);
        ctx.lineTo(x + width - 58, cy - 26);
        ctx.moveTo(x + width - 26, cy);
        ctx.lineTo(x + width - 58, cy + 26);
        ctx.stroke();
        break;
      case 'hand-line':
      case 'dashed-line':
        if (item.type === 'dashed-line') ctx.setLineDash([20, 18]);
        ctx.beginPath();
        ctx.moveTo(x, cy);
        ctx.bezierCurveTo(x + width * .25, cy - 15, x + width * .7, cy + 15, x + width, cy);
        ctx.stroke();
        ctx.setLineDash([]);
        break;
      case 'balloon':
        ctx.beginPath();
        ctx.ellipse(cx, y + height * .35, width * .42, height * .32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, y + height * .68);
        ctx.quadraticCurveTo(cx - 20, y + height * .85, cx + 10, y + height);
        ctx.stroke();
        break;
      case 'map-pin':
        ctx.beginPath();
        ctx.arc(cx, y + height * .35, width * .32, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, y + height * .9);
        ctx.lineTo(cx - width * .2, y + height * .53);
        ctx.lineTo(cx + width * .2, y + height * .53);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, y + height * .35, width * .12, 0, Math.PI * 2);
        ctx.fill();
        break;
      default:
        ctx.beginPath();
        ctx.arc(cx, cy, width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text || '').split(' ');
    let line = '';
    let currentY = y;
    for (let n = 0; n < words.length; n += 1) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  function normalizeTextOverride(value) {
    if (typeof value === 'string') return { text: value };
    if (value && typeof value === 'object') return value;
    return {};
  }

  function drawTextElement(ctx, textElement, values, globalTextStyle) {
    const id = textElement.id;
    const override = normalizeTextOverride(values && values[id]);
    let text = override.text !== undefined ? override.text : textElement.text;
    if (typeof text === 'object' || String(text || '').trim() === '[object Object]') text = textElement.text;
    if (text === '{{date}}') text = values && values.__date ? values.__date : new Date().toLocaleDateString('id-ID');
    text = String(text || '').replace('{{date}}', values && values.__date ? values.__date : new Date().toLocaleDateString('id-ID'));

    const fontSize = Number(override.fontSize || globalTextStyle.fontSize || textElement.fontSize || 32);
    const fontFamily = override.fontFamily || globalTextStyle.fontFamily || textElement.fontFamily || 'Inter';
    const fontWeight = Number(textElement.fontWeight || 700);
    const x = Number(textElement.x) || 0;
    const y = Number(textElement.y) || 0;
    const width = Number(textElement.width) || 500;

    ctx.save();
    ctx.translate(x + width / 2, y);
    ctx.rotate(((Number(textElement.rotation) || 0) * Math.PI) / 180);
    ctx.translate(-(x + width / 2), -y);
    ctx.fillStyle = override.color || globalTextStyle.color || textElement.color || '#111827';
    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", Inter, Arial, sans-serif`;
    ctx.textAlign = textElement.align || 'left';
    ctx.textBaseline = 'top';
    const drawX = textElement.align === 'center' ? x + width / 2 : textElement.align === 'right' ? x + width : x;
    wrapText(ctx, text, drawX, y, width, fontSize * 1.18);
    ctx.restore();
  }

  async function renderTemplate(canvas, template, photos, textValues, options) {
    if (!canvas || !template || !template.canvas) return null;
    const ctx = canvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    canvas.width = template.canvas.width * ratio;
    canvas.height = template.canvas.height * ratio;
    canvas.style.aspectRatio = `${template.canvas.width}/${template.canvas.height}`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, template.canvas.width, template.canvas.height);

    await drawBackground(ctx, template);

    const photoMap = Array.isArray(photos) ? Object.fromEntries(photos.map((item) => [item.slotId || item.id, item])) : (photos || {});
    const drawItems = [];
    (template.photoSlots || []).forEach((slot) => drawItems.push({ kind: 'slot', zIndex: slot.zIndex || 1, slot }));
    (template.decorations || []).forEach((decoration) => drawItems.push({ kind: 'decoration', zIndex: decoration.zIndex || 7, decoration }));
    drawItems.sort((a, b) => a.zIndex - b.zIndex);

    for (const item of drawItems) {
      if (item.kind === 'slot') {
        await drawPhotoSlot(ctx, item.slot, photoMap[item.slot.id]);
      } else {
        drawDecoration(ctx, item.decoration);
      }
    }

    const textStyle = options && options.textStyle ? options.textStyle : {};
    (template.textElements || [])
      .slice()
      .sort((a, b) => (a.zIndex || 8) - (b.zIndex || 8))
      .forEach((textElement) => drawTextElement(ctx, textElement, textValues || {}, textStyle));

    return canvas;
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  }

  window.TemplateRenderer = {
    renderTemplate,
    canvasToBlob,
    getFilter
  };
})();
