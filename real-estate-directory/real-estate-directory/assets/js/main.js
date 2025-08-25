
// Simple client-side filtering for properties page based on ?q= and select filters
document.addEventListener('DOMContentLoaded', () => {
  const isProps = document.body.dataset.page === 'properties';
  const isIndex = document.body.dataset.page === 'home';

  if (isIndex) {
    const form = document.getElementById('homeSearchForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = new URLSearchParams({ q: form.querySelector('input[name="q"]').value || '' });
        window.location.href = `properties.html?${q.toString()}`;
      });
    }
  }

  if (isProps) {
    const params = new URLSearchParams(location.search);
    const q = (params.get('q') || '').toLowerCase();

    const searchInput = document.getElementById('q');
    if (searchInput) searchInput.value = params.get('q') || '';

    const cards = Array.from(document.querySelectorAll('[data-prop]'));
    const typeSel = document.getElementById('type');
    const citySel = document.getElementById('city');
    const minInp = document.getElementById('min');
    const maxInp = document.getElementById('max');
    const bedsSel = document.getElementById('beds');
    const applyBtn = document.getElementById('apply');
    const resetBtn = document.getElementById('reset');

    function showAll(){ cards.forEach(c => c.classList.remove('hidden')); }
    function apply(){
      const type = typeSel.value;
      const city = citySel.value;
      const min = Number(minInp.value || 0);
      const max = Number(maxInp.value || Number.MAX_SAFE_INTEGER);
      const beds = Number(bedsSel.value || 0);
      cards.forEach(c => {
        const text = (c.dataset.text || '').toLowerCase();
        const price = Number(c.dataset.price || 0);
        const cbeds = Number(c.dataset.beds || 0);
        const ctype = c.dataset.type;
        const ccity = c.dataset.city;
        let ok = true;
        if (q && !text.includes(q)) ok = false;
        if (type && ctype !== type) ok = false;
        if (city && ccity !== city) ok = false;
        if (price < min || price > max) ok = false;
        if (beds && cbeds < beds) ok = false;
        c.classList.toggle('hidden', !ok);
      });
    }
    function reset(){
      [typeSel, citySel, bedsSel].forEach(s => s.value = '');
      [minInp, maxInp].forEach(i => i.value = '');
      showAll(); apply();
      history.replaceState({}, '', 'properties.html');
    }
    applyBtn?.addEventListener('click', apply);
    resetBtn?.addEventListener('click', reset);

    // populate city options
    const cities = Array.from(new Set(cards.map(c => c.dataset.city))).sort();
    const citySelect = document.getElementById('city');
    cities.forEach(c => {
      const o = document.createElement('option'); o.value = c; o.textContent = c; citySelect.appendChild(o);
    });

    // initial apply from q
    apply();
  }
});
