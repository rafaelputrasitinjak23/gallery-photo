(function () {
  const FAVORITE_KEY = 'aesthetic-gallery-favorites';
  const search = document.getElementById('templateSearch');
  const category = document.getElementById('categoryFilter');
  const items = Array.from(document.querySelectorAll('.template-item'));
  const empty = document.getElementById('emptyTemplate');
  const quickFilters = Array.from(document.querySelectorAll('.quick-filter'));
  let activeQuickFilter = new URLSearchParams(window.location.search).get('filter') || 'all';

  function getFavorites() {
    try {
      return new Set(JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]'));
    } catch (error) {
      return new Set();
    }
  }

  function saveFavorites(favorites) {
    try {
      localStorage.setItem(FAVORITE_KEY, JSON.stringify(Array.from(favorites)));
    } catch (error) {}
  }

  function syncFavoriteButtons() {
    const favorites = getFavorites();
    document.querySelectorAll('[data-favorite]').forEach((button) => {
      const id = button.getAttribute('data-favorite');
      const active = favorites.has(id);
      button.classList.toggle('active', active);
      button.textContent = button.classList.contains('control-btn') ? (active ? '♥ Favorit' : '♡ Favorit') : (active ? '♥' : '♡');
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function applyInitialQuickFilter() {
    quickFilters.forEach((button) => {
      button.classList.toggle('active', button.dataset.filter === activeQuickFilter);
    });
  }

  function filterTemplates() {
    const query = search ? search.value.toLowerCase().trim() : '';
    const selectedCategory = category ? category.value : 'all';
    const favorites = getFavorites();
    let shown = 0;

    items.forEach((item) => {
      const name = item.dataset.name || (item.dataset.title || '').toLowerCase();
      const description = item.dataset.description || '';
      const itemCategory = item.dataset.category || '';
      const tags = item.dataset.tags || '';
      const id = item.dataset.id || '';
      const matchesQuery = !query || name.includes(query) || description.includes(query) || itemCategory.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || itemCategory === selectedCategory;
      const matchesQuick = activeQuickFilter === 'all'
        || (activeQuickFilter === 'favorite' ? favorites.has(id) : tags.includes(activeQuickFilter));
      const visible = matchesQuery && matchesCategory && matchesQuick;
      item.classList.toggle('hidden', !visible);
      if (visible) shown += 1;
    });

    if (empty) empty.classList.toggle('hidden', shown !== 0);
  }

  function createPreviewModal() {
    let modal = document.getElementById('templatePreviewModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'templatePreviewModal';
    modal.className = 'preview-modal hidden';
    modal.innerHTML = `
      <button class="preview-modal-close" type="button" data-preview-close>Tutup</button>
      <div class="preview-modal-body">
        <div class="preview-modal-card">
          <img id="templatePreviewModalImg" alt="Preview template" />
          <div class="preview-modal-info">
            <p id="templatePreviewModalKicker" class="section-kicker">Preview besar</p>
            <h2 id="templatePreviewModalTitle"></h2>
            <p id="templatePreviewModalDesc"></p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span id="templatePreviewModalRatio" class="pill"></span>
              <span id="templatePreviewModalSlots" class="pill"></span>
            </div>
            <a id="templatePreviewModalUse" class="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white" href="#">Pakai Template</a>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('[data-preview-close]')) modal.classList.add('hidden');
    });
    return modal;
  }

  function openPreview(card) {
    if (!card) return;
    const modal = createPreviewModal();
    const img = modal.querySelector('#templatePreviewModalImg');
    const title = modal.querySelector('#templatePreviewModalTitle');
    const desc = modal.querySelector('#templatePreviewModalDesc');
    const ratio = modal.querySelector('#templatePreviewModalRatio');
    const slots = modal.querySelector('#templatePreviewModalSlots');
    const use = modal.querySelector('#templatePreviewModalUse');
    img.src = card.dataset.preview || '';
    img.alt = `Preview ${card.dataset.title || 'template'}`;
    title.textContent = card.dataset.title || 'Template';
    desc.textContent = card.dataset.description || 'Lihat detail hasil akhir template sebelum dipakai.';
    ratio.textContent = card.dataset.ratio || '';
    slots.textContent = `${card.dataset.slots || '0'} slot foto`;
    use.href = `/create/${card.dataset.id || ''}`;
    modal.classList.remove('hidden');
  }

  if (search) search.addEventListener('input', filterTemplates);
  if (category) category.addEventListener('change', filterTemplates);

  quickFilters.forEach((button) => {
    button.addEventListener('click', () => {
      activeQuickFilter = button.dataset.filter || 'all';
      quickFilters.forEach((item) => item.classList.toggle('active', item === button));
      filterTemplates();
    });
  });

  document.addEventListener('click', (event) => {
    const favoriteBtn = event.target.closest('[data-favorite]');
    if (favoriteBtn) {
      event.preventDefault();
      const favorites = getFavorites();
      const id = favoriteBtn.getAttribute('data-favorite');
      if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
      saveFavorites(favorites);
      syncFavoriteButtons();
      filterTemplates();
      return;
    }

    const previewBtn = event.target.closest('.preview-btn');
    if (previewBtn) {
      event.preventDefault();
      openPreview(previewBtn.closest('.template-item'));
    }
  });

  document.querySelectorAll('.delete-result').forEach((button) => {
    button.addEventListener('click', async () => {
      const card = button.closest('[data-id]');
      if (!card) return;
      const ok = confirm('Hapus hasil ini dari riwayat?');
      if (!ok) return;
      try {
        const response = await fetch(`/api/results/${card.dataset.id}`, { method: 'DELETE' });
        const data = await response.json();
        if (!data.success) throw new Error('failed');
        card.remove();
      } catch (error) {
        alert('Hasil belum bisa dihapus. Silakan coba lagi.');
      }
    });
  });

  const adminMessage = document.getElementById('adminMessage');
  function setAdminMessage(text, danger) {
    if (!adminMessage) return;
    adminMessage.textContent = text;
    adminMessage.className = `mt-4 rounded-2xl p-4 text-sm font-semibold ${danger ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`;
  }

  const createTemplateBtn = document.getElementById('createTemplateBtn');
  if (createTemplateBtn) {
    createTemplateBtn.addEventListener('click', async () => {
      try {
        const payload = JSON.parse(document.getElementById('newTemplateJson').value);
        const response = await fetch('/admin/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'failed');
        setAdminMessage('Template berhasil disimpan. Refresh halaman untuk melihat perubahan.');
      } catch (error) {
        setAdminMessage('JSON tidak valid atau template belum bisa disimpan.', true);
      }
    });
  }

  document.querySelectorAll('.update-template').forEach((button) => {
    button.addEventListener('click', async () => {
      const card = button.closest('[data-id]');
      const textarea = card.querySelector('.template-json');
      try {
        const payload = JSON.parse(textarea.value);
        delete payload._id;
        delete payload.__v;
        const response = await fetch(`/admin/templates/${card.dataset.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'failed');
        alert('Template berhasil diperbarui.');
      } catch (error) {
        alert('Template belum bisa diperbarui. Pastikan JSON valid.');
      }
    });
  });

  document.querySelectorAll('.toggle-template').forEach((button) => {
    button.addEventListener('click', async () => {
      const card = button.closest('[data-id]');
      try {
        const response = await fetch(`/admin/templates/${card.dataset.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: button.dataset.active === 'true' })
        });
        const data = await response.json();
        if (!data.success) throw new Error('failed');
        location.reload();
      } catch (error) {
        alert('Status template belum bisa diperbarui.');
      }
    });
  });

  document.querySelectorAll('.delete-template').forEach((button) => {
    button.addEventListener('click', async () => {
      const card = button.closest('[data-id]');
      const ok = confirm('Hapus template ini?');
      if (!ok) return;
      try {
        const response = await fetch(`/admin/templates/${card.dataset.id}`, { method: 'DELETE' });
        const data = await response.json();
        if (!data.success) throw new Error('failed');
        card.remove();
      } catch (error) {
        alert('Template belum bisa dihapus.');
      }
    });
  });

  applyInitialQuickFilter();
  syncFavoriteButtons();
  filterTemplates();
})();
