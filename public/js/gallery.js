(function () {
  const search = document.getElementById('templateSearch');
  const category = document.getElementById('categoryFilter');
  const items = Array.from(document.querySelectorAll('.template-item'));
  const empty = document.getElementById('emptyTemplate');

  function filterTemplates() {
    const query = search ? search.value.toLowerCase().trim() : '';
    const selectedCategory = category ? category.value : 'all';
    let shown = 0;

    items.forEach((item) => {
      const matchesQuery = !query || item.dataset.name.includes(query) || item.dataset.description.includes(query) || item.dataset.category.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || item.dataset.category === selectedCategory;
      const visible = matchesQuery && matchesCategory;
      item.classList.toggle('hidden', !visible);
      if (visible) shown += 1;
    });

    if (empty) empty.classList.toggle('hidden', shown !== 0);
  }

  if (search) search.addEventListener('input', filterTemplates);
  if (category) category.addEventListener('change', filterTemplates);

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
})();
