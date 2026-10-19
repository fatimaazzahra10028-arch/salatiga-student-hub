// ===== STORAGE AMAN (tidak crash di private mode atau jika localStorage diblokir) =====
const store = {
    get(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch (err) {
            return fallback;
        }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* abaikan */ }
    },
    remove(key) {
        try { localStorage.removeItem(key); } catch (err) { /* abaikan */ }
    }
};

const CONTACT_ENDPOINT = 'https://formspree.io/f/myeklpog';

const BOOKMARK_KEY = 'studenthub_bookmarks';
const CUSTOM_PLACES_KEY = 'studenthub_custom_places';

const FALLBACK_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='300'><rect width='100%25' height='100%25' fill='%23e2e8f0'/><text x='50%25' y='50%25' fill='%2394a3b8' font-family='sans-serif' font-size='20' text-anchor='middle'>Gambar tidak tersedia</text></svg>";
const IMG_FALLBACK_ATTR = `onerror="this.onerror=null;this.src=FALLBACK_IMG"`;

let bookmarks = store.get(BOOKMARK_KEY, []);
if (!Array.isArray(bookmarks)) bookmarks = [];

(function loadCustomPlaces() {
    const saved = store.get(CUSTOM_PLACES_KEY, []);
    if (!Array.isArray(saved)) return;
    const valid = saved.filter(p => p && typeof p.title === 'string' && p.id != null);
    if (typeof directoryData !== 'undefined') {
        directoryData.unshift(...valid);
    }
})();

// Jika tempat belum punya foto asli, tampilkan ikon kategori (bukan foto stok yang menyesatkan)
const CATEGORY_ICON = { kost: 'fa-bed', cafe: 'fa-mug-hot', print: 'fa-print' };

function placeholderHtml(item, size) {
    const icon = CATEGORY_ICON[item.category] || 'fa-location-dot';
    const box = size === 'thumb' ? 'w-12 h-12 rounded-xl shrink-0 text-lg' : (size === 'modal' ? 'w-full h-full text-6xl' : 'w-full h-full text-5xl');
    return `<div role="img" aria-label="${esc(item.title)}" class="${box} bg-gradient-to-br from-emerald-500/15 to-emerald-700/25 dark:from-emerald-500/10 dark:to-emerald-800/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><i class="fa-solid ${icon}"></i></div>`;
}

// Memuat skrip embed Instagram sekali saja, lalu memprosesnya setiap modal dibuka
function loadInstagramEmbed() {
    if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
        return;
    }
    if (document.getElementById('instagram-embed-script')) return;
    const script = document.createElement('script');
    script.id = 'instagram-embed-script';
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.onload = () => window.instgrm && window.instgrm.Embeds.process();
    document.body.appendChild(script);
}

function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function findItem(id) {
    if (typeof directoryData === 'undefined') return bookmarks.find(b => b.id === id);
    return directoryData.find(d => d.id === id) || bookmarks.find(b => b.id === id);
}

function getContactAction(contact) {
    let digits = String(contact || '081227481708').replace(/[^0-9]/g, '');
    if (digits.startsWith('0')) digits = '62' + digits.slice(1);
    if (digits.startsWith('628')) {
        return { href: `https://wa.me/${digits}`, label: 'Hubungi via WhatsApp', icon: 'fa-brands fa-whatsapp' };
    }
    return { href: `tel:+${digits}`, label: 'Telepon Pengelola', icon: 'fa-solid fa-phone' };
}

function updateStats() {
    const total = document.getElementById('statTotal');
    if (total && typeof directoryData !== 'undefined') total.textContent = directoryData.length;
}

function closeMobileMenu() {
    document.getElementById('mobileMenu')?.classList.add('hidden');
}

let activeCategory = 'all';
let activeCampus = 'all';
let currentSort = 'default';

async function loadComponents() {
    const componentElements = Array.from(document.querySelectorAll('[data-component]'));

    const results = await Promise.all(componentElements.map(async (el) => {
        const file = el.getAttribute('data-component');
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        } catch (err) {
            console.error(`Gagal memuat komponen ${file}:`, err);
            return null;
        }
    }));

    let failed = 0;
    componentElements.forEach((el, i) => {
        if (results[i] === null) {
            failed++;
            el.remove();
        } else {
            el.outerHTML = results[i];
        }
    });

    if (failed > 0) showLoadError();
}

function showLoadError() {
    const box = document.createElement('div');
    box.className = 'max-w-2xl mx-auto my-16 p-6 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 text-sm leading-relaxed';
    box.innerHTML = `
        <strong>Halaman belum bisa dimuat sepenuhnya.</strong><br>
        Website ini memuat komponen lewat <code>fetch()</code>, pastikan dijalankan menggunakan web server lokal (Live Server).
    `;
    document.body.prepend(box);
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Tunggu seluruh komponen HTML selesai dimuat ke DOM
    await loadComponents();

    // 2. Inisialisasi tema, kartu, dan alur maba
    initTheme();
    renderCards();
    updateStats();
    initAlur();
    initFakultas();
    updateBookmarkBadge();
    initEventListeners();
    initActiveNav();

    // 3. Jalankan AOS HANYA SETELAH komponen HTML sudah ada di layar
    if (window.AOS) {
        AOS.init({
            duration: 400,
            once: true,
            disable: window.innerWidth < 768
        });
        AOS.refresh(); // Refresh posisi elemen
    }
});

// ===== SCROLL SPY & NAVIGASI AKTIF =====
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function setActiveLink() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href')?.replace('#', '');
            if (href === currentSectionId) {
                link.classList.add('text-emerald-600', 'dark:text-emerald-400', 'after:w-full');
            } else {
                link.classList.remove('text-emerald-600', 'dark:text-emerald-400', 'after:w-full');
            }
        });

        mobileLinks.forEach(link => {
            const href = link.getAttribute('href')?.replace('#', '');
            if (href === currentSectionId) {
                link.classList.add('bg-emerald-50', 'dark:bg-slate-800', 'text-emerald-600', 'dark:text-emerald-400');
            } else {
                link.classList.remove('bg-emerald-50', 'dark:bg-slate-800', 'text-emerald-600', 'dark:text-emerald-400');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    const bgClass = isSuccess ? 'bg-slate-900/95 dark:bg-slate-800/95 text-white border-emerald-500' : 'bg-slate-900/95 dark:bg-slate-800/95 text-white border-amber-500';
    const iconClass = isSuccess ? 'fa-circle-check text-emerald-400' : 'fa-circle-info text-amber-400';

    toast.className = `toast-animate pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border-l-4 ${bgClass} text-xs sm:text-sm font-bold min-w-[240px] backdrop-blur-md transition-all duration-300`;
    toast.innerHTML = `
        <i class="fa-solid ${iconClass} text-lg"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(1rem)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function handleSortChange(sortValue) {
    currentSort = sortValue;
    filterData(document.getElementById('searchInput')?.value.toLowerCase() || '');
}

function renderCards(data = (typeof directoryData !== 'undefined' ? directoryData : [])) {
    const grid = document.getElementById('cardsGrid');
    const empty = document.getElementById('emptyResult');
    if (!grid || !empty) return;
    
    if (data.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    
    empty.classList.add('hidden');

    grid.innerHTML = data.map(item => {
        const isBookmarked = bookmarks.some(b => b.id === item.id);

        return `
            <div onclick="openModal(${item.id})" class="shrink-0 w-[260px] sm:w-auto snap-align-start bg-white/70 dark:bg-slate-800/60 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col group cursor-pointer backdrop-blur-md hover:-translate-y-1">
                <div class="relative h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                    ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" ${IMG_FALLBACK_ATTR} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">` : placeholderHtml(item, 'card')}
                    
                    <div class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                        ${esc(item.badge)}
                    </div>

                    <button id="card-bm-${item.id}" onclick="event.stopPropagation(); toggleBookmark(${item.id})" aria-label="Simpan ke favorit" class="absolute top-3 right-3 w-8 h-8 rounded-full ${isBookmarked ? 'bg-amber-500 text-white' : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200'} backdrop-blur-md flex items-center justify-center hover:scale-110 transition-all shadow-sm">
                        <i class="fa-solid fa-bookmark text-xs"></i>
                    </button>
                </div>

                <div class="p-4 flex flex-col flex-grow">
                    <h3 class="font-extrabold text-sm text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-emerald-500 transition-colors">${esc(item.title)}</h3>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1 line-clamp-1">
                        <i class="fa-solid fa-location-dot text-emerald-500"></i> ${esc(item.location)}
                    </p>
                    <div class="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-2">
                        <span class="text-xs font-extrabold text-slate-900 dark:text-white">${esc(item.price)}</span>
                        <span class="px-3 py-1.5 bg-slate-100 dark:bg-slate-700/80 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-lg transition-all">
                            Detail
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function initEventListeners() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('#bookmarkToggleBtn')) openBookmarkDrawer();
        if (e.target.closest('#closeDrawerBtn')) closeBookmarkDrawer();
        if (e.target.closest('#mobileMenuBtn')) document.getElementById('mobileMenu')?.classList.toggle('hidden');
        if (e.target.closest('#mobileMenu a')) closeMobileMenu();
        if (e.target.closest('#themeToggleBtn')) toggleTheme();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const drawer = document.getElementById('bookmarkDrawer');
        const detail = document.getElementById('detailModal');

        if (drawer && !drawer.classList.contains('hidden')) closeBookmarkDrawer();
        else if (detail && !detail.classList.contains('hidden')) closeModal();
    });

    window.addEventListener('scroll', () => {
        const btn = document.getElementById('backToTopBtn');
        if (!btn) return;
        if (window.scrollY > 400) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterData(e.target.value.toLowerCase());
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
                b.classList.add('bg-white/80', 'dark:bg-slate-800/80', 'text-slate-700', 'dark:text-slate-300');
            });
            btn.classList.remove('bg-white/80', 'dark:bg-slate-800/80', 'text-slate-700', 'dark:text-slate-300');
            btn.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
            
            activeCategory = btn.dataset.category;
            filterData(document.getElementById('searchInput')?.value.toLowerCase() || '');
        });
    });

    // FAQ Accordion
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('.fa-chevron-down');
            
            content.classList.toggle('hidden');
            if (icon) icon.classList.toggle('rotate-180');
            toggle.setAttribute('aria-expanded', String(!content.classList.contains('hidden')));
        });
    });

    document.getElementById('contactForm')?.addEventListener('submit', handleContactSubmit);
}

async function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (!CONTACT_ENDPOINT) {
        showToast('Mode demo: pesan belum dikirim ke server. Isi CONTACT_ENDPOINT untuk mengaktifkan pengiriman.', 'info');
        form.reset();
        return;
    }

    const button = form.querySelector('button[type="submit"]');
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Mengirim...';

    try {
        const response = await fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: document.getElementById('formName').value.trim(),
                email: document.getElementById('formEmail').value.trim(),
                message: document.getElementById('formMessage').value.trim()
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        showToast('Pesan berhasil terkirim. Terima kasih!');
        form.reset();
    } catch (err) {
        console.error('Gagal mengirim form kontak:', err);
        showToast('Gagal mengirim pesan. Coba beberapa saat lagi.', 'info');
    } finally {
        button.disabled = false;
        button.textContent = originalLabel;
    }
}

function filterData(query = '') {
    if (typeof directoryData === 'undefined') return;
    let filtered = [...directoryData];
    
    if (activeCategory !== 'all') {
        filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (activeCampus !== 'all') {
        filtered = filtered.filter(item => item.campusTag === activeCampus);
    }
    
    if (query.trim() !== '') {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.location.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            (item.badge || '').toLowerCase().includes(query) ||
            (item.facilities || []).join(' ').toLowerCase().includes(query)
        );
    }

    if (currentSort === 'distance-asc') {
        filtered.sort((a, b) => (a.jarakKm ?? Infinity) - (b.jarakKm ?? Infinity));
    }
    
    renderCards(filtered);
}

function toggleBookmark(id) {
    const item = findItem(id);
    if (!item) return;

    const index = bookmarks.findIndex(b => b.id === id);
    let isNowBookmarked = false;
    
    if (index > -1) {
        bookmarks.splice(index, 1);
        isNowBookmarked = false;
        showToast('Dihapus dari simpanan', 'info');
    } else {
        bookmarks.push(item);
        isNowBookmarked = true;
        showToast('Berhasil disimpan ke favorit!');
    }
    
    store.set(BOOKMARK_KEY, bookmarks);
    updateBookmarkBadge();
    renderBookmarkList();

    const detailBtn = document.getElementById(`detail-bm-${id}`);
    if (detailBtn) {
        detailBtn.className = isNowBookmarked 
            ? "p-2.5 rounded-xl bg-amber-500 text-white transition-all hover:scale-105" 
            : "p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all hover:scale-105";
    }

    const cardBtn = document.getElementById(`card-bm-${id}`);
    if (cardBtn) {
        cardBtn.className = isNowBookmarked 
            ? "absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-500 text-white backdrop-blur-md flex items-center justify-center hover:scale-110 transition-all shadow-sm" 
            : "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-all shadow-sm";
    }
}

function clearAllBookmarks() {
    if (bookmarks.length === 0) return;
    
    if (confirm('Apakah Anda yakin ingin menghapus semua simpanan favorit?')) {
        bookmarks = [];
        store.remove(BOOKMARK_KEY);
        updateBookmarkBadge();
        renderBookmarkList();
        filterData(document.getElementById('searchInput')?.value.toLowerCase() || '');
        showToast('Semua simpanan berhasil dihapus', 'info');
    }
}

function updateBookmarkBadge() {
    const badge = document.getElementById('bookmarkBadge');
    if (!badge) return;
    
    if (bookmarks.length > 0) {
        badge.textContent = bookmarks.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function openBookmarkDrawer() {
    renderBookmarkList();
    const drawer = document.getElementById('bookmarkDrawer');
    if (drawer) {
        drawer.classList.remove('hidden');
        setTimeout(() => {
            drawer.classList.remove('translate-x-full');
        }, 10);
    }
}

function closeBookmarkDrawer() {
    const drawer = document.getElementById('bookmarkDrawer');
    if (drawer) {
        drawer.classList.add('translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden');
        }, 300);
    }
}

function renderBookmarkList() {
    const list = document.getElementById('bookmarkList');
    const actionsHeader = document.getElementById('bookmarkHeaderActions');
    if (!list || !actionsHeader) return;

    if (bookmarks.length === 0) {
        actionsHeader.classList.add('hidden');
        list.innerHTML = `<p class="text-xs text-slate-400 text-center py-8">Belum ada item tersimpan.</p>`;
        return;
    }
    
    actionsHeader.classList.remove('hidden');
    
    list.innerHTML = bookmarks.map(item => `
        <div class="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500 transition-all group backdrop-blur-md">
            <div onclick="closeBookmarkDrawer(); openModal(${item.id});" class="flex items-center gap-3 flex-grow min-w-0 cursor-pointer">
                ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" ${IMG_FALLBACK_ATTR} class="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform">` : placeholderHtml(item, 'thumb')}
                <div class="flex-grow min-w-0">
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors">${esc(item.title)}</h4>
                    <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">${esc(item.price)}</p>
                </div>
            </div>

            <button onclick="toggleBookmark(${item.id})" class="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-700/50 transition-colors" title="Hapus dari simpanan" aria-label="Hapus dari simpanan">
                <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
        </div>
    `).join('');
}

// ===== MODAL FULLSCREEN DETAIL ITEM (DIRECTORI) =====
function openModal(id) {
    const item = findItem(id);
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('modalContent');
    if (!item || !modal || !content) return;

    const isBookmarked = bookmarks.some(b => b.id === item.id);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${item.mapQuery}`;
    const contactAction = getContactAction(item.contact);

    // Postingan Instagram ditampilkan lewat fitur sematkan (embed) resmi
    const igValid = item.instagram && /^https:\/\/www\.instagram\.com\/(p|reel)\/[\w-]+\/?$/.test(item.instagram.url);
    const igHtml = igValid ? `
            <div data-section="instagram">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Postingan Instagram</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">Ditampilkan lewat fitur sematkan resmi Instagram. Akun: <a href="https://www.instagram.com/${esc(item.instagram.account.replace('@', ''))}/" target="_blank" rel="noopener" class="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">${esc(item.instagram.account)}</a></p>
                <div class="max-w-[540px]">
                    <blockquote class="instagram-media" data-instgrm-permalink="${esc(item.instagram.url)}" data-instgrm-version="14" data-instgrm-captioned style="background:#FFF;border:0;border-radius:3px;margin:1px;max-width:540px;min-width:260px;padding:0;width:calc(100% - 2px)">
                        <a href="${esc(item.instagram.url)}" target="_blank" rel="noopener" class="block p-4 text-sm text-blue-600">Lihat postingan di Instagram</a>
                    </blockquote>
                </div>
            </div>` : '';

    content.innerHTML = `
        <div class="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
            <!-- Tombol Kembali di sebelah kiri -->
            <button onclick="closeModal()" aria-label="Kembali ke Directory" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all active:scale-95">
                <i class="fa-solid fa-arrow-left text-xs"></i>
                <span>Kembali ke Directory</span>
            </button>

            <!-- Tombol Bookmark di sebelah kanan -->
            <div class="flex items-center gap-2">
                <button id="detail-bm-${item.id}" onclick="toggleBookmark(${item.id})" aria-label="Simpan ke favorit" class="p-2.5 rounded-xl ${isBookmarked ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'} transition-all hover:scale-105">
                    <i class="fa-solid fa-bookmark text-sm"></i>
                </button>
            </div>
        </div>

        <div class="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
            <div class="relative h-60 sm:h-80 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
                ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" ${IMG_FALLBACK_ATTR} class="w-full h-full object-cover">` : placeholderHtml(item, 'modal')}
                <div class="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
                    ${esc(item.badge)}
                </div>
                ${item.image && item.source ? `<div class="absolute top-4 right-4 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md text-slate-700 dark:text-slate-200 text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-sm">Sumber foto: ${esc(item.source)}</div>` : ''}
            </div>

            <div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">${esc(item.title)}</h2>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                    <i class="fa-solid fa-location-dot text-emerald-500"></i> ${esc(item.location)}
                </p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span class="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Kisaran Biaya / Tarif</span>
                    <span class="text-xl font-extrabold text-slate-900 dark:text-white">${esc(item.price)}</span>
                </div>
                <a href="${googleMapsUrl}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-md active:scale-95">
                    <i class="fa-solid fa-diamond-turn-right text-xs"></i>
                    <span>Petunjuk Rute Google Maps</span>
                </a>
            </div>

            <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Deskripsi Tempat</h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${esc(item.description)}</p>
            </div>

            ${igHtml}

            <div data-section="fasilitas">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">Fasilitas Utama</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    ${(item.facilities || []).map(f => `
                        <div class="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200">
                            <i class="fa-solid fa-circle-check text-emerald-500"></i>
                            <span>${esc(f)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div data-contact-wrap class="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 pb-8">
                <a href="${contactAction.href}" target="_blank" rel="noopener" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95">
                    <i class="${contactAction.icon}"></i>
                    <span>${contactAction.label}</span>
                </a>
            </div>
        </div>
    `;

    if (!(item.facilities || []).length) content.querySelector('[data-section="fasilitas"]')?.remove();
    if (!item.contact) {
        const wrap = content.querySelector('[data-contact-wrap]');
        if (wrap) wrap.innerHTML = '<p class="text-xs text-center text-slate-500 dark:text-slate-400">Nomor kontak tidak ditampilkan di sini. Lihat di halaman Google Maps tempat ini.</p>';
    }

    modal.classList.remove('hidden');
    if (igValid) loadInstagramEmbed();
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    document.body.style.overflow = '';
}

// ===== PERPINDAHAN TAB PETA KAMPUS =====
function switchCampus(campusKey) {
    const mapFrame = document.getElementById('mapFrame');
    if (!mapFrame) return;

    const campusData = {
        'k3': {
            map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.390498331155!2d110.47357882695312!3d-7.309952399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a78633d53ebbf%3A0x18a4c33b6814677d!2sKampus%203%20Universitas%20Islam%20Negeri%20Salatiga!5e0!3m2!1sid!2sid!4v1792031714216!5m2!1sid!2sid',
            title: 'Kampus Terpadu (Kampus 3)',
            addr: 'Jalan Lingkar Salatiga Km. 2, Pulutan, Sidorejo, Kota Salatiga.'
        },
        'k1': {
            map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.228165462567!2d110.4992733!3d-7.328251200000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a795db2f4dd7b%3A0x9c9f098f7192f519!2sPascasarjana%20UIN%20Salatiga!5e0!3m2!1sid!2sid!4v1792031746893!5m2!1sid!2sid',
            title: 'Kampus 1 UIN Salatiga',
            addr: 'Jl. Tentara Pelajar No. 2, Kota Salatiga.'
        },
        'k2': {
            map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.173651893332!2d110.4905807!3d-7.334385999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a784c1d0ed7ab%3A0xe5c872fb90d4e569!2sJl.%20Nakula%20Sadewa%20V%20No.9%2C%20Dukuh%2C%20Kec.%20Sidomukti%2C%20Kota%20Salatiga%2C%20Jawa%20Tengah%2050722!5e0!3m2!1sid!2sid!4v1792031792465!5m2!1sid!2sid',
            title: 'Kampus 2 UIN Salatiga',
            addr: 'Jalan Nakula Sadewa V No. 9, Dukuh, Sidomukti, Kota Salatiga.'
        }
    };

    const target = campusData[campusKey];
    if (!target) return;

    mapFrame.src = target.map;

    const mTitle = document.getElementById('mobileCampusTitle');
    const mAddr = document.getElementById('mobileCampusAddr');
    if (mTitle) mTitle.textContent = target.title;
    if (mAddr) mAddr.textContent = target.addr;

    // Reset semua tombol tab ke style tidak aktif
    document.querySelectorAll('.campus-tab-btn, [id^="tab-"]').forEach(tab => {
        tab.className = "campus-tab-btn shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer";
        const icon = tab.querySelector('i');
        if (icon) icon.className = "fa-solid fa-location-dot text-slate-400";
    });

    // Set tombol tab yang dipilih menjadi aktif (Hijau dengan teks Putih jelas)
    const activeTab = document.getElementById(`tab-${campusKey}`);
    if (activeTab) {
        activeTab.className = "campus-tab-btn shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 text-white shadow-md transition-all cursor-pointer";
        const activeIcon = activeTab.querySelector('i');
        if (activeIcon) activeIcon.className = "fa-solid fa-location-dot text-white";
    }
}

function getSavedTheme() {
    try { return localStorage.getItem('theme'); } catch (err) { return null; }
}

function saveTheme(value) {
    try { localStorage.setItem('theme', value); } catch (err) { /* abaikan */ }
}

function initTheme() {
    const icon = document.getElementById('themeIcon');
    const savedTheme = getSavedTheme();
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        icon?.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.classList.remove('dark');
        icon?.classList.replace('fa-sun', 'fa-moon');
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        saveTheme('light');
        icon?.classList.replace('fa-sun', 'fa-moon');
    } else {
        html.classList.add('dark');
        saveTheme('dark');
        icon?.classList.replace('fa-moon', 'fa-sun');
    }
}

// ===== FITUR ALUR MABA: DASHBOARD PROGRES & FILTER STATUS =====
const ALUR_KEY = 'studenthub_alur';
let alurDone = store.get(ALUR_KEY, []);
if (!Array.isArray(alurDone)) alurDone = [];
let currentAlurFilter = 'all';

function setAlurFilter(filterType) {
    currentAlurFilter = filterType;

    document.querySelectorAll('.alur-filter-btn').forEach(btn => {
        btn.classList.remove('bg-emerald-600', 'text-white', 'shadow-sm');
        btn.classList.add('bg-transparent', 'text-slate-600', 'dark:text-slate-300');
    });

    const activeBtn = document.getElementById(`alur-filter-${filterType}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-transparent', 'text-slate-600', 'dark:text-slate-300');
        activeBtn.classList.add('bg-emerald-600', 'text-white', 'shadow-sm');
    }

    renderAlur();
}

function renderAlur() {
    if (typeof alurData === 'undefined') return;
    const list = document.getElementById('alurList');
    const emptyState = document.getElementById('alurEmptyState');
    if (!list) return;

    const total = alurData.length;
    const completedCount = alurData.filter(s => alurDone.includes(s.id)).length;
    const pendingCount = total - completedCount;

    // Update Counter Badge Filter
    const countAllEl = document.getElementById('countAll');
    const countPendingEl = document.getElementById('countPending');
    const countCompletedEl = document.getElementById('countCompleted');
    
    if (countAllEl) countAllEl.textContent = total;
    if (countPendingEl) countPendingEl.textContent = pendingCount;
    if (countCompletedEl) countCompletedEl.textContent = completedCount;

    // Update Hero Widget
    const heroWidgetStatus = document.getElementById('heroWidgetStatus');
    const heroWidgetTitle = document.getElementById('heroWidgetTitle');
    const nextStep = alurData.find(s => !alurDone.includes(s.id));

    if (heroWidgetStatus && heroWidgetTitle) {
        if (nextStep) {
            heroWidgetStatus.textContent = `Progres: ${completedCount}/${total} Selesai`;
            heroWidgetTitle.textContent = `Lanjut: ${nextStep.title}`;
        } else {
            heroWidgetStatus.textContent = 'Status: 100% Selesai';
            heroWidgetTitle.textContent = '🎉 Siap Kuliah di UIN Salatiga!';
        }
    }

    // Filter data yang akan ditampilkan
    let filteredData = alurData;
    if (currentAlurFilter === 'pending') {
        filteredData = alurData.filter(s => !alurDone.includes(s.id));
    } else if (currentAlurFilter === 'completed') {
        filteredData = alurData.filter(s => alurDone.includes(s.id));
    }

    if (filteredData.length === 0) {
        list.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');

        list.innerHTML = filteredData.map((step) => {
            const indexOriginal = alurData.findIndex(s => s.id === step.id) + 1;
            const done = alurDone.includes(step.id);

            return `
            <li class="flex gap-4 p-4 sm:p-5 rounded-2xl border ${done ? 'border-emerald-500/80 bg-emerald-50/80 dark:bg-emerald-950/30' : 'border-amber-300/80 dark:border-amber-800/80 bg-white/80 dark:bg-slate-800/70'} transition-all duration-300 backdrop-blur-md relative group">
                
                <!-- Indikator Checkbox / Nomor -->
                <button type="button" data-alur-id="${esc(step.id)}" aria-pressed="${done}" aria-label="Tandai langkah ${indexOriginal} selesai" class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${done ? 'bg-emerald-500 text-white shadow-md' : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60'} transition-transform active:scale-95">
                    ${done ? '<i class="fa-solid fa-check"></i>' : indexOriginal}
                </button>

                <div class="min-w-0 flex-grow">
                    <div class="flex items-start justify-between gap-2">
                        <h3 class="font-bold text-slate-900 dark:text-white ${done ? 'line-through opacity-70' : ''}">${esc(step.title)}</h3>
                        
                        <!-- Status Badge Warna Visual -->
                        <span class="shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-md ${done ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'}">
                            ${done ? 'Selesai' : 'Pending'}
                        </span>
                    </div>

                    <p class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                        <i class="fa-regular fa-calendar mr-1"></i>${esc(step.date)}${step.time ? ' &middot; ' + esc(step.time) : ''}${step.mode ? ' &middot; ' + esc(step.mode) : ''}
                    </p>

                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">${esc(step.summary)}</p>

                    ${(step.details || []).length ? `<ul class="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400 list-disc pl-4">${step.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}

                    ${(step.links || []).map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 mt-3 mr-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">${esc(l.label)} <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i></a>`).join('')}
                </div>
            </li>`;
        }).join('');
    }

    // Update Progress Bar & Percentage
    const text = document.getElementById('alurProgressText');
    const bar = document.getElementById('alurProgressBar');
    const percentEl = document.getElementById('alurProgressPercent');
    const percent = Math.round((completedCount / total) * 100);

    if (text) text.textContent = `${completedCount} dari ${total} langkah selesai`;
    if (bar) bar.style.width = `${percent}%`;
    if (percentEl) percentEl.textContent = `${percent}%`;
}

function initAlur() {
    renderAlur();
    document.getElementById('alurList')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-alur-id]');
        if (!btn) return;
        const id = btn.dataset.alurId;
        alurDone = alurDone.includes(id) ? alurDone.filter(x => x !== id) : [...alurDone, id];
        store.set(ALUR_KEY, alurDone);
        renderAlur();
    });
    document.getElementById('alurResetBtn')?.addEventListener('click', () => {
        alurDone = [];
        store.set(ALUR_KEY, alurDone);
        renderAlur();
    });
}

function renderFakultas(query = '') {
    if (typeof fakultasData === 'undefined') return;
    const grid = document.getElementById('fakultasGrid');
    const empty = document.getElementById('fakultasEmpty');
    if (!grid) return;
    const q = query.trim().toLowerCase();

    const cards = fakultasData.map(f => {
        const facultyMatch = f.name.toLowerCase().includes(q) || (f.kampus || '').toLowerCase().includes(q);
        const prodi = facultyMatch ? f.prodi : f.prodi.filter(p => p.toLowerCase().includes(q));
        if (prodi.length === 0) return '';
        return `
        <div role="button" tabindex="0" data-fak-id="${esc(f.id)}" aria-label="Lihat detail ${esc(f.name)}" class="cursor-pointer bg-white/70 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-500 p-5 shadow-sm backdrop-blur-md hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <h3 class="font-extrabold text-slate-900 dark:text-white mb-3 flex items-start gap-2"><i class="fa-solid ${esc(f.icon || 'fa-building-columns')} text-emerald-500 mt-1"></i><span>${esc(f.name)}${f.short ? ` <span class="text-xs font-bold text-slate-400">(${esc(f.short)})</span>` : ''}</span></h3>
            ${f.kampus ? `<span class="inline-flex items-start gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-3 hover:underline"><i class="fa-solid fa-location-dot mt-0.5"></i><span>${esc(f.kampus)}</span></span>` : ''}
            <ul class="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                ${prodi.map(p => `<li class="flex gap-2"><i class="fa-solid fa-graduation-cap text-emerald-500 mt-1 text-xs"></i><span>${esc(p)}</span></li>`).join('')}
            </ul>
            <p class="mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">Lihat detail <i class="fa-solid fa-arrow-right text-[10px]"></i></p>
        </div>`;
    }).join('');

    grid.innerHTML = cards;
    empty?.classList.toggle('hidden', cards !== '');
}

// ===== MODAL DETAIL FAKULTAS =====
function openFakultas(id) {
    const f = (typeof fakultasData !== 'undefined') ? fakultasData.find(x => x.id === id) : null;
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('modalContent');
    if (!f || !modal || !content) return;

    // Hanya tautan ke domain resmi UIN Salatiga yang ditampilkan
    const siteOk = f.website && /^https:\/\/([a-z0-9-]+\.)*uinsalatiga\.ac\.id\//.test(f.website);
    const websiteBtn = siteOk
        ? `<a href="${esc(f.website)}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl transition-all text-xs sm:text-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i><span>Buka situs resmi fakultas</span></a>`
        : `<a href="https://uinsalatiga.ac.id/" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-5 py-3 rounded-xl transition-all text-xs sm:text-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i><span>Situs resmi UIN Salatiga</span></a>`;
    const websiteNote = siteOk ? '' : '<p class="text-[11px] text-slate-500 dark:text-slate-400">Situs resmi khusus fakultas ini belum ditemukan, jadi tautan mengarah ke situs UIN Salatiga.</p>';

    content.innerHTML = `
        <div class="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
            <!-- Tombol Kembali di sebelah kiri -->
            <button onclick="closeModal()" aria-label="Kembali ke Fakultas" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all active:scale-95">
                <i class="fa-solid fa-arrow-left text-xs"></i>
                <span>Kembali ke Fakultas</span>
            </button>
        </div>

        <div class="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
            <div>
                <div class="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4"><i class="fa-solid ${esc(f.icon || 'fa-building-columns')}"></i></div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">${esc(f.name)}</h2>
                ${f.short ? `<p class="text-xs font-bold text-slate-400 mt-1">${esc(f.short)}</p>` : ''}
            </div>

            <div class="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/60 p-5 space-y-3">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Lokasi</h3>
                <p class="text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2"><i class="fa-solid fa-location-dot text-emerald-500 mt-1"></i><span>${esc(f.kampus)}</span></p>
                ${f.alamat ? `<p class="text-xs text-slate-500 dark:text-slate-400 pl-6">${esc(f.alamat)}</p>` : ''}
                ${f.telp ? `<p class="text-xs text-slate-500 dark:text-slate-400 pl-6"><i class="fa-solid fa-phone mr-1.5"></i>Telepon kampus: <a href="tel:+62298323706" class="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">${esc(f.telp)}</a></p>` : ''}
                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                    ${f.mapsUrl ? `<a href="${esc(f.mapsUrl)}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl transition-all text-xs sm:text-sm"><i class="fa-solid fa-map-location-dot"></i><span>Buka di Google Maps</span></a>` : ''}
                    ${websiteBtn}
                </div>
                ${websiteNote}
            </div>

            <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">Program Studi S1 (${f.prodi.length})</h3>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-200">
                    ${f.prodi.map(p => `<li class="flex gap-2 bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2.5"><i class="fa-solid fa-graduation-cap text-emerald-500 mt-1 text-xs"></i><span>${esc(p)}</span></li>`).join('')}
                </ul>
            </div>

            <p class="text-[11px] text-slate-400 leading-relaxed pb-8">
                Sumber: daftar prodi dari lampiran Pengumuman Rektor B-1047/Un.29/R/PP.00.1/07/2026; lokasi kampus dari informasi UIN Salatiga. Dicek 17 Oktober 2026. Lokasi gedung dapat berubah, tanyakan ke fakultas masing-masing.
            </p>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
}

function initFakultas() {
    renderFakultas();
    const grid = document.getElementById('fakultasGrid');
    grid?.addEventListener('click', (e) => {
        const card = e.target.closest('[data-fak-id]');
        if (card) openFakultas(card.dataset.fakId);
    });
    grid?.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const card = e.target.closest('[data-fak-id]');
        if (card) { e.preventDefault(); openFakultas(card.dataset.fakId); }
    });
    document.getElementById('fakultasSearch')?.addEventListener('input', (e) => renderFakultas(e.target.value));
}