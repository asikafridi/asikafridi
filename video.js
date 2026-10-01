// Video page (v2) — gallery, featured stage, cinema player modal, toolkit.
// Video data below is the single source of truth: add or edit entries here
// and the hero stats, filter counts, cards and "Up next" list update.
document.addEventListener('DOMContentLoaded', function () {

    // Video data
    const videoData = [
        {
            id: 'idol',
            title: 'My Idol: Hazrat Umar Ibn al-Khattab(RA)',
            description: 'A heartfelt tribute to my idol, Hazrat Umar Ibn al-Khattab (RA), this video reflects the values that inspire me—justice, integrity, courage, and unwavering leadership. Through this showcase, I share how his life and principles continue to shape my character, mindset, and aspirations both personally and professionally.',
            duration: '3:34',
            date: 'December 2025',
            thumbnail: 'images/Idol_Cover.jpg',
            videoId: '17DyGcv52ayyl1Zq5X-TG4W1kR9fnXx16',
            category: 'creative',
            likes: 42,
            views: 128
        },
        {
            id: 'documentary',
            title: 'Environment & Sustainability in Bangladesh',
            description: 'A documentary exploring environmental challenges and sustainability efforts in Bangladesh. This project showcases my skills in video editing, voice over/narration, resource collection, script writing, and video shooting.',
            duration: '7:26',
            date: '28th November, 2025',
            thumbnail: 'images/Documentary Cover.jpg',
            videoId: '19yeXo2GBwot6ybTTARJLGGRylH5qFUZf',
            category: 'documentary',
            likes: 38,
            views: 156
        },
        {
            id: 'sample',
            title: 'Editing Sample',
            description: 'Demonstration of my video editing skills and techniques, showcasing attention to detail and creative approach. This sample highlights various editing techniques including transitions, color grading, and audio mixing.',
            duration: '1:50',
            date: 'February 2024',
            thumbnail: 'images/Metro_Life.jpg',
            videoId: '10G859vHzEXYcJXwu88ENCUKyrAz1Wrom',
            category: 'sample',
            likes: 29,
            views: 89
        },
        {
            id: 'creative',
            title: 'Creative Work',
            description: 'Creative video projects showcasing storytelling abilities and innovative approaches to visual content. This collection demonstrates my ability to create engaging visual narratives through creative editing techniques.',
            duration: '0:18',
            date: 'July 2024',
            thumbnail: 'images/Creative_Work.jpg',
            videoId: '11FndmQwFpI9WNnrXZQPipBHBsOZC3GgZ',
            category: 'creative',
            likes: 31,
            views: 102
        }
    ];

    // ---------- helpers ----------
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const seconds = d => String(d).split(':').map(n => parseInt(n, 10) || 0).reduce((a, n) => a * 60 + n, 0);

    // ---------- elements ----------
    const grid = $('#gallery-grid');
    const modal = $('#videoPlayerModal');
    const panel = $('.vx-panel', modal);
    const closeBtn = $('.modal-close', modal);
    const player = $('#modal-video-player');
    const poster = $('#videoThumbnailModal');
    const posterImg = $('#modal-video-thumb');
    const bigPlay = $('#vxBigPlay');
    const nextList = $('#vxNextList');
    const toast = $('#vxToast');
    const seg = $('#vxSeg');
    const segThumb = $('.vx-seg-thumb', seg);
    const segBtns = $$('.vx-seg-btn');
    const viewBtns = $$('.view-btn');

    let filter = 'all';
    let view = 'grid';
    let current = null;
    let lastFocus = null;

    // ---------- hero: featured stage ----------
    const featured = videoData[0];
    const stage = $('#vxStage');
    if (featured && stage) {
        $('#vxStageImg').src = featured.thumbnail;
        $('#vxStageImg').alt = featured.title;
        $('#vxStageTitle').textContent = featured.title;
        $('#vxStageMeta').textContent = featured.duration + ' · ' + cap(featured.category) + ' film';
        const open = () => openPlayer(featured.id);
        stage.addEventListener('click', open);
        stage.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        const pf = $('#vxPlayFeatured');
        if (pf) pf.addEventListener('click', open);

        if (finePointer && !reduce) {
            stage.addEventListener('pointermove', e => {
                const r = stage.getBoundingClientRect();
                stage.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2) + 'deg');
                stage.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 6).toFixed(2) + 'deg');
            });
            stage.addEventListener('pointerleave', () => { stage.style.setProperty('--rx', '0deg'); stage.style.setProperty('--ry', '0deg'); });
        }

        // running timecode (only while on screen)
        const tc = $('#vxTimecode');
        let tcOn = true;
        if ('IntersectionObserver' in window) new IntersectionObserver(es => { tcOn = es[0].isIntersecting; }).observe(stage);
        if (tc && !reduce) {
            const t0 = performance.now();
            setInterval(() => {
                if (!tcOn || document.hidden) return;
                const t = (performance.now() - t0) / 1000;
                const p = n => String(n).padStart(2, '0');
                tc.textContent = `${p(Math.floor(t / 3600) % 100)}:${p(Math.floor(t / 60) % 60)}:${p(Math.floor(t) % 60)}:${p(Math.floor((t % 1) * 25))}`;
            }, 80);
        }
    }

    // ---------- hero stats (count-up, computed from the data) ----------
    (function initStats() {
        const wrap = $('#reelStats');
        if (!wrap) return;
        const totalMin = Math.max(1, Math.round(videoData.reduce((s, v) => s + seconds(v.duration), 0) / 60));
        const targets = { statVideos: videoData.length, statMinutes: totalMin, statGenres: new Set(videoData.map(v => v.category)).size };
        let done = false;
        const run = () => {
            if (done) return; done = true;
            Object.keys(targets).forEach(id => {
                const el = document.getElementById(id); if (!el) return;
                const suffix = el.dataset.suffix || '', start = performance.now(), dur = 1100;
                const tick = now => {
                    const p = Math.min((now - start) / dur, 1);
                    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * targets[id]) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            });
            $$('.vx-stat', wrap).forEach((c, i) => setTimeout(() => c.classList.add('is-visible'), i * 130));
        };
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.3 });
            io.observe(wrap);
        } else run();
    })();

    // ---------- filter counts + sliding thumb ----------
    $$('[data-count]').forEach(b => {
        const k = b.dataset.count;
        b.textContent = k === 'all' ? videoData.length : videoData.filter(v => v.category === k).length;
    });

    function moveThumb() {
        const on = segBtns.find(b => b.classList.contains('active'));
        if (!on || !segThumb) return;
        segThumb.style.setProperty('--x', on.offsetLeft + 'px');
        segThumb.style.setProperty('--w', on.offsetWidth + 'px');
        // keep the active tab visible inside the scroller on small screens
        const left = on.offsetLeft - (seg.clientWidth - on.offsetWidth) / 2;
        seg.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
    }

    // ---------- gallery ----------
    function cardHTML(v, i) {
        return `
        <article class="vx-card vx-glass" data-id="${esc(v.id)}" data-category="${esc(v.category)}" style="--i:${i}" tabindex="0" aria-label="Play ${esc(v.title)}">
            <div class="vx-card-media">
                <img src="${esc(v.thumbnail)}" alt="${esc(v.title)} thumbnail" loading="lazy">
                <span class="vx-card-play"><i class="fas fa-play"></i></span>
                <span class="vx-dur"><i class="far fa-clock"></i> ${esc(v.duration)}</span>
            </div>
            <div class="vx-card-body">
                <div class="vx-card-meta">
                    <span class="vx-chip" data-cat="${esc(v.category)}">${esc(cap(v.category))}</span>
                    <span>${esc(v.date)}</span>
                </div>
                <h3>${esc(v.title)}</h3>
                <p>${esc(v.description)}</p>
                <div class="vx-card-foot">
                    <span class="vx-watch watch-btn"><i class="fas fa-play"></i> Watch now</span>
                    <i class="fas fa-arrow-right vx-arrow"></i>
                </div>
            </div>
        </article>`;
    }

    let cardObserver = null;
    function render() {
        const list = videoData.filter(v => filter === 'all' || v.category === filter);
        grid.dataset.filter = filter;
        grid.dataset.view = view;
        grid.innerHTML = list.length ? list.map(cardHTML).join('') : '<div class="vx-empty">No videos in this category yet.</div>';
        const countEl = $('#vxCount');
        if (countEl) countEl.textContent = String(list.length).padStart(2, '0') + (list.length === 1 ? ' cut' : ' cuts');

        const cards = $$('.vx-card', grid);
        if (cardObserver) cardObserver.disconnect();
        const reveal = c => {
            c.classList.add('is-in');
            c.addEventListener('animationend', () => c.classList.add('is-done'), { once: true });
            if (reduce) c.classList.add('is-done');
        };
        if ('IntersectionObserver' in window && !reduce) {
            cardObserver = new IntersectionObserver(es => es.forEach(e => {
                if (e.isIntersecting) { reveal(e.target); cardObserver.unobserve(e.target); }
            }), { threshold: 0.12 });
            cards.forEach(c => cardObserver.observe(c));
        } else cards.forEach(reveal);
    }

    // card interactions (delegated)
    grid.addEventListener('click', e => {
        const card = e.target.closest('.vx-card');
        if (card) openPlayer(card.dataset.id);
    });
    grid.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('vx-card')) { e.preventDefault(); openPlayer(e.target.dataset.id); }
    });
    if (finePointer && !reduce) {
        grid.addEventListener('pointermove', e => {
            const card = e.target.closest('.vx-card.is-done');
            if (!card) return;
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
            card.style.setProperty('--ry', ((px - 0.5) * 5).toFixed(2) + 'deg');
            card.style.setProperty('--rx', ((0.5 - py) * 4).toFixed(2) + 'deg');
            card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
            card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        });
        grid.addEventListener('pointerout', e => {
            const card = e.target.closest('.vx-card');
            if (card && !card.contains(e.relatedTarget)) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
        });
    }

    segBtns.forEach(b => b.addEventListener('click', () => {
        if (b.dataset.filter === filter) return;
        segBtns.forEach(x => { const on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
        filter = b.dataset.filter;
        moveThumb();
        render();
    }));
    viewBtns.forEach(b => b.addEventListener('click', () => {
        viewBtns.forEach(x => x.classList.toggle('active', x === b));
        view = b.dataset.view;
        render();
    }));
    window.addEventListener('resize', moveThumb);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveThumb);

    // ---------- toolkit rings ----------
    const rings = $$('.vx-ring-card');
    const fillRing = c => { const r = $('.vx-ring', c); if (r) r.style.setProperty('--p', c.dataset.level || 0); };
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fillRing(e.target); io.unobserve(e.target); } }), { threshold: 0.4 });
        rings.forEach(c => io.observe(c));
    } else rings.forEach(fillRing);

    // ---------- player ----------
    function say(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(say.t);
        say.t = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    function fillUpNext() {
        nextList.innerHTML = videoData.filter(v => v.id !== current.id).map(v => `
            <button type="button" class="vx-next-item" data-id="${esc(v.id)}">
                <img src="${esc(v.thumbnail)}" alt="" loading="lazy">
                <span><b>${esc(v.title)}</b>${esc(v.duration)} · ${esc(cap(v.category))}</span>
            </button>`).join('');
    }

    function load(v) {
        current = v;
        $('#modal-video-title').textContent = v.title;
        $('#modal-description').textContent = v.description;
        $('#modal-cat').textContent = cap(v.category);
        $('#modal-cat').dataset.cat = v.category;
        $('#modal-duration').innerHTML = '<i class="far fa-clock"></i> ' + esc(v.duration);
        $('#modal-date').innerHTML = '<i class="far fa-calendar"></i> ' + esc(v.date);
        posterImg.src = v.thumbnail;
        posterImg.alt = v.title;
        poster.classList.remove('hidden');
        player.src = 'https://drive.google.com/file/d/' + v.videoId + '/preview';
        fillUpNext();
    }

    function openPlayer(id) {
        const v = videoData.find(x => x.id === id);
        if (!v) return;
        lastFocus = document.activeElement;
        load(v);
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => bigPlay.focus({ preventScroll: true }), 80);
    }

    function closePlayer() {
        if (!modal.classList.contains('active')) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
        setTimeout(() => { if (!modal.classList.contains('active')) player.src = 'about:blank'; }, 400);
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    function step(dir) {
        if (!current) return;
        const i = videoData.findIndex(v => v.id === current.id);
        load(videoData[(i + dir + videoData.length) % videoData.length]);
    }

    bigPlay.addEventListener('click', () => poster.classList.add('hidden'));
    poster.addEventListener('click', e => { if (e.target === poster || e.target === posterImg) poster.classList.add('hidden'); });
    closeBtn.addEventListener('click', closePlayer);
    $('.modal-overlay', modal).addEventListener('click', closePlayer);
    $('#vxPrev').addEventListener('click', () => step(-1));
    $('#vxNext').addEventListener('click', () => step(1));
    nextList.addEventListener('click', e => {
        const b = e.target.closest('.vx-next-item');
        if (b) { const v = videoData.find(x => x.id === b.dataset.id); if (v) load(v); }
    });

    $('#fullscreenBtn').addEventListener('click', () => {
        const el = $('#vxScreen');
        poster.classList.add('hidden');
        if (!document.fullscreenElement) {
            (el.requestFullscreen || el.webkitRequestFullscreen || function () { say('Fullscreen is not supported here'); }).call(el);
        } else if (document.exitFullscreen) document.exitFullscreen();
    });

    $('#vxShare').addEventListener('click', async () => {
        const url = location.href.split('#')[0];
        try {
            if (navigator.share) { await navigator.share({ title: current.title, url }); return; }
            await navigator.clipboard.writeText(url);
            say('Link copied to clipboard');
        } catch (err) { if (err && err.name !== 'AbortError') say('Could not share — copy the address bar link'); }
    });

    document.addEventListener('keydown', e => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closePlayer();
        else if (e.key === 'ArrowRight' && !e.target.closest('iframe')) step(1);
        else if (e.key === 'ArrowLeft' && !e.target.closest('iframe')) step(-1);
        else if (e.key === 'Tab') {   // keep focus inside the dialog
            const f = $$('button, [href], [tabindex]:not([tabindex="-1"])', panel).filter(x => x.offsetParent !== null);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    // swipe the sheet down to dismiss (mobile)
    let sy = null;
    panel.addEventListener('touchstart', e => { sy = panel.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
    panel.addEventListener('touchend', e => {
        if (sy != null && e.changedTouches[0].clientY - sy > 110) closePlayer();
        sy = null;
    }, { passive: true });

    // ---------- init ----------
    render();
    moveThumb();
});
