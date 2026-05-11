/**
 * Go Go Gaia - Custom JavaScript
 * Modern interactive features for the women's health app website
 */

document.addEventListener('DOMContentLoaded', function() {
    // =========================================
    // INTERSECTION OBSERVER - Scroll Animations
    // =========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once revealed (one-time animation)
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with .reveal class (skip hero - it animates via CSS)
    document.querySelectorAll('.reveal:not(.hero-container .reveal)').forEach(el => {
        revealObserver.observe(el);
    });

    // =========================================
    // ANIMATED COUNTERS
    // =========================================
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        counterObserver.observe(el);
    });

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500; // ms
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // =========================================
    // STICKY MOBILE CTA
    // =========================================
    const stickyCta = document.querySelector('.sticky-mobile-cta');
    if (stickyCta) {
        let lastScrollY = 0;
        const heroHeight = document.querySelector('.hero-container')?.offsetHeight || 500;

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            // Show after scrolling past hero
            if (scrollY > heroHeight) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
            lastScrollY = scrollY;
        }, { passive: true });
    }

    // =========================================
    // SCROLL-LINKED STORY (How It Works)
    // =========================================
    const scrollStory = document.querySelector('.scroll-story');
    if (scrollStory) {
        const steps = scrollStory.querySelectorAll('.story-step');
        const screens = scrollStory.querySelectorAll('.phone-screen');

        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepNum = entry.target.getAttribute('data-step');

                    // Activate the content card
                    steps.forEach(s => s.classList.remove('active'));
                    entry.target.classList.add('active');

                    // Crossfade to the matching phone screenshot
                    screens.forEach(s => {
                        s.classList.remove('active');
                        s.style.position = 'absolute';
                    });
                    const activeScreen = scrollStory.querySelector(
                        `.phone-screen[data-step="${stepNum}"]`
                    );
                    if (activeScreen) {
                        activeScreen.classList.add('active');
                        activeScreen.style.position = 'relative';
                    }
                }
            });
        }, {
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0.1
        });

        steps.forEach(step => stepObserver.observe(step));
    }


    // =========================================
    // FAQ SHOW MORE / SHOW LESS TOGGLE
    // =========================================
    const moreFaqItems = document.getElementById('moreFaqItems');
    const faqToggleBtn = document.querySelector('.faq-show-more-btn');

    if (moreFaqItems && faqToggleBtn) {
        moreFaqItems.addEventListener('shown.bs.collapse', () => {
            faqToggleBtn.querySelector('.faq-show-more-text').classList.add('d-none');
            faqToggleBtn.querySelector('.faq-show-less-text').classList.remove('d-none');
        });
        moreFaqItems.addEventListener('hidden.bs.collapse', () => {
            faqToggleBtn.querySelector('.faq-show-more-text').classList.remove('d-none');
            faqToggleBtn.querySelector('.faq-show-less-text').classList.add('d-none');
        });
    }

    // =========================================
    // SMOOTH SCROLLING + NAV
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    document.querySelector('.navbar-toggler').click();
                }

                // Activate linked tab if applicable
                const tabId = this.getAttribute('data-tab');
                if (tabId) {
                    setTimeout(() => {
                        const tabButton = document.getElementById(tabId);
                        if (tabButton) {
                            const tab = new bootstrap.Tab(tabButton);
                            tab.show();
                        }
                    }, 400);
                }
            }
        });
    });

    // Active nav item on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // =========================================
    // HERO CONNECTION WEB — living ecosystem
    // =========================================
    (function initConnectionWeb() {
        const canvas = document.getElementById('heroConnectionWeb');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        // Health category nodes — 3 rings: life stages, body, lifestyle
        const nodeLabels = [
            // Inner ring — life stages & core pillars
            { label: 'Cycle',         color: '#FF6B98', ring: 0 },
            { label: 'Fertility',     color: '#E84393', ring: 0 },
            { label: 'IVF',           color: '#B07CED', ring: 0 },
            { label: 'Pregnancy',     color: '#FF8FA3', ring: 0 },
            { label: 'Postpartum',    color: '#FF6B98', ring: 0 },
            { label: 'PCOS',          color: '#B07CED', ring: 0 },
            { label: 'Perimenopause', color: '#A78BFA', ring: 0 },
            { label: 'Menopause',     color: '#FF8FA3', ring: 0 },
            // Middle ring — body & biometrics
            { label: 'Hormones',      color: '#B07CED', ring: 1 },
            { label: 'Ovulation',     color: '#E84393', ring: 1 },
            { label: 'BBT',           color: '#FF8FA3', ring: 1 },
            { label: 'Mood',          color: '#8259DC', ring: 1 },
            { label: 'Sleep',         color: '#6B5CE7', ring: 1 },
            { label: 'Symptoms',      color: '#A78BFA', ring: 1 },
            { label: 'Cramps',        color: '#E84393', ring: 1 },
            { label: 'Acne',          color: '#FF6B98', ring: 1 },
            { label: 'Libido',        color: '#B07CED', ring: 1 },
            { label: 'Heart Rate',    color: '#E84393', ring: 1 },
            { label: 'HRV',           color: '#FF6B98', ring: 1 },
            { label: 'Temperature',   color: '#FF8FA3', ring: 1 },
            { label: 'Weight',        color: '#8259DC', ring: 1 },
            { label: 'Blood Tests',   color: '#7C4DDB', ring: 1 },
            { label: 'Urine Strips',  color: '#B07CED', ring: 1 },
            // Outer ring — lifestyle & daily tracking
            { label: 'Workouts',      color: '#1E5631', ring: 2 },
            { label: 'Steps',         color: '#1E5631', ring: 2 },
            { label: 'Macros',        color: '#E84393', ring: 2 },
            { label: 'Habits',        color: '#7C4DDB', ring: 2 },
            { label: 'Medications',   color: '#B07CED', ring: 2 },
            { label: 'Supplements',   color: '#7C4DDB', ring: 2 },
            { label: 'Energy',        color: '#1E5631', ring: 2 },
            { label: 'Hydration',     color: '#6B5CE7', ring: 2 },
            { label: 'Stress',        color: '#A78BFA', ring: 2 },
        ];

        let nodes = [];
        let edges = [];
        let animFrame;
        let mouseX = -1000, mouseY = -1000; // off-canvas initially
        let scrollOffset = 0;

        function resize() {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initNodes(rect.width, rect.height);
        }

        function initNodes(w, h) {
            nodes = [];
            const cx = w / 2;
            const cy = h / 2;
            // Use min dimension so the layout is always a true circle
            const baseRadius = Math.min(w, h) * 0.46;

            // Group nodes by ring
            const rings = [[], [], []];
            nodeLabels.forEach((info, i) => rings[info.ring].push({ ...info, idx: i }));

            // Evenly spaced rings for 32 nodes
            const ringRadii = [0.24, 0.54, 0.84];

            nodeLabels.forEach((info, i) => {
                const ring = rings[info.ring];
                const idxInRing = ring.findIndex(n => n.idx === i);
                const countInRing = ring.length;

                // Even spacing with organic scatter on inner ring
                const evenAngle = (idxInRing / countInRing) * Math.PI * 2 + info.ring * 0.55;
                const angleJitter = info.ring === 0 ? (Math.random() - 0.5) * 0.6 : 0;
                const radiusJitter = info.ring === 0 ? (Math.random() - 0.5) * 0.12 : 0;
                const baseAngle = evenAngle + angleJitter;
                const r = baseRadius * (ringRadii[info.ring] + radiusJitter);

                const bx = cx + Math.cos(baseAngle) * r;
                const by = cy + Math.sin(baseAngle) * r;

                // Bigger nodes for inner ring, smaller for outer
                const nodeRadius = info.ring === 0 ? 5.5 + Math.random() * 1.5
                                 : info.ring === 1 ? 4 + Math.random() * 1.5
                                 : 3.5 + Math.random() * 1;

                nodes.push({
                    x: bx,
                    y: by,
                    baseX: bx,
                    baseY: by,
                    radius: nodeRadius,
                    label: info.label,
                    color: info.color,
                    ring: info.ring,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.15 + Math.random() * 0.15,
                    driftX: 2 + Math.random() * 4,
                    driftY: 2 + Math.random() * 3,
                    attractX: 0,
                    attractY: 0,
                });
            });

            // Build edges
            edges = [];
            const edgeSet = new Set(); // track "i-j" to avoid duplicates
            function addEdge(i, j, dist) {
                const key = Math.min(i, j) + '-' + Math.max(i, j);
                if (edgeSet.has(key)) return;
                edgeSet.add(key);
                edges.push({
                    a: i, b: j, dist: dist,
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.4 + Math.random() * 0.8,
                    curveOffset: (Math.random() - 0.5) * 40,
                });
            }

            // 1) Guarantee same-ring neighbor connections (forms the circular boundary)
            [0, 1, 2].forEach(ringIdx => {
                const ringNodes = [];
                nodes.forEach((n, i) => { if (n.ring === ringIdx) ringNodes.push(i); });
                // Sort by angle from center so neighbors are adjacent around the circle
                ringNodes.sort((a, b) => {
                    const angA = Math.atan2(nodes[a].baseY - cy, nodes[a].baseX - cx);
                    const angB = Math.atan2(nodes[b].baseY - cy, nodes[b].baseX - cx);
                    return angA - angB;
                });
                for (let k = 0; k < ringNodes.length; k++) {
                    const curr = ringNodes[k];
                    const next = ringNodes[(k + 1) % ringNodes.length];
                    const dx = nodes[curr].baseX - nodes[next].baseX;
                    const dy = nodes[curr].baseY - nodes[next].baseY;
                    addEdge(curr, next, Math.sqrt(dx * dx + dy * dy));
                }
            });

            // 2) Distance-based cross-ring connections
            const maxDist = Math.min(w, h) * 0.5;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].baseX - nodes[j].baseX;
                    const dy = nodes[i].baseY - nodes[j].baseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const crossRing = Math.abs(nodes[i].ring - nodes[j].ring) === 1;
                    const threshold = crossRing ? maxDist * 1.1 : maxDist;
                    if (dist < threshold) {
                        addEdge(i, j, dist);
                    }
                }
            }
        }

        function draw(time) {
            const t = time * 0.001;
            const w = parseFloat(canvas.style.width) || canvas.width;
            const h = parseFloat(canvas.style.height) || canvas.height;
            ctx.clearRect(0, 0, w, h);

            // --- Central warm glow — soft sphere atmosphere ---
            const cx = w / 2, cy = h / 2;
            const glowR = Math.min(w, h) * 0.4;
            const breathe = 1 + 0.04 * Math.sin(t * 0.6);
            const centralGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR * breathe);
            centralGlow.addColorStop(0, 'rgba(255, 143, 163, 0.14)');
            centralGlow.addColorStop(0.3, 'rgba(229, 207, 252, 0.08)');
            centralGlow.addColorStop(0.6, 'rgba(130, 89, 220, 0.03)');
            centralGlow.addColorStop(1, 'rgba(130, 89, 220, 0)');
            ctx.fillStyle = centralGlow;
            ctx.fillRect(0, 0, w, h);

            // --- Subtle scroll parallax offset ---
            const parallaxX = scrollOffset * 0.015;
            const parallaxY = scrollOffset * 0.008;

            // --- Update node positions ---
            nodes.forEach(n => {
                // Natural drift
                const driftX = Math.sin(t * n.speed + n.phase) * n.driftX;
                const driftY = Math.cos(t * n.speed * 0.8 + n.phase) * n.driftY;

                // Mouse attraction (desktop only)
                if (!isMobile) {
                    const toMouseX = mouseX - (n.baseX + driftX);
                    const toMouseY = mouseY - (n.baseY + driftY);
                    const distToMouse = Math.sqrt(toMouseX * toMouseX + toMouseY * toMouseY);
                    const attractRadius = 120;

                    if (distToMouse < attractRadius && distToMouse > 0) {
                        const strength = (1 - distToMouse / attractRadius) * 18;
                        n.attractX += (toMouseX / distToMouse * strength - n.attractX) * 0.08;
                        n.attractY += (toMouseY / distToMouse * strength - n.attractY) * 0.08;
                    } else {
                        // Smoothly return to base
                        n.attractX *= 0.92;
                        n.attractY *= 0.92;
                    }
                }

                n.x = n.baseX + driftX + n.attractX + parallaxX;
                n.y = n.baseY + driftY + n.attractY + parallaxY;
            });

            // --- Draw curved edges (vine-like) ---
            edges.forEach(e => {
                const a = nodes[e.a];
                const b = nodes[e.b];
                const pulse = 0.1 + 0.15 * Math.sin(t * e.pulseSpeed + e.pulsePhase);

                // Control point for quadratic curve — perpendicular offset
                const midX = (a.x + b.x) / 2;
                const midY = (a.y + b.y) / 2;
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                // Perpendicular direction
                const px = -dy / len;
                const py = dx / len;
                const cpX = midX + px * e.curveOffset;
                const cpY = midY + py * e.curveOffset;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.quadraticCurveTo(cpX, cpY, b.x, b.y);
                ctx.strokeStyle = 'rgba(130, 89, 220, ' + pulse.toFixed(3) + ')';
                ctx.lineWidth = 1.2;
                ctx.stroke();
            });

            // --- Draw nodes — sort so closest to cursor renders on top ---
            const sortedNodes = nodes.slice().sort((a, b) => {
                const dA = (a.x - mouseX) * (a.x - mouseX) + (a.y - mouseY) * (a.y - mouseY);
                const dB = (b.x - mouseX) * (b.x - mouseX) + (b.y - mouseY) * (b.y - mouseY);
                return dB - dA; // farthest first, closest last (on top)
            });

            sortedNodes.forEach(n => {
                // Distance to cursor for proximity boost
                const dMouse = Math.sqrt((n.x - mouseX) * (n.x - mouseX) + (n.y - mouseY) * (n.y - mouseY));
                const isNear = !isMobile && dMouse < 100;
                const proximityScale = isNear ? 1 + (1 - dMouse / 100) * 0.15 : 1;

                // Outer glow
                const gs = (n.radius + 8 + Math.sin(t * n.speed + n.phase) * 2) * proximityScale;
                const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, gs);
                glow.addColorStop(0, n.color + '35');
                glow.addColorStop(1, n.color + '00');
                ctx.beginPath();
                ctx.arc(n.x, n.y, gs, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();

                // Solid dot
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius * proximityScale, 0, Math.PI * 2);
                ctx.fillStyle = n.color;
                ctx.fill();

                // Label — pill background for readability
                const baseFontSize = n.ring === 0 ? 13 : n.ring === 1 ? 11 : 10.5;
                const fontSize = baseFontSize * proximityScale;
                const labelAlpha = isNear ? 1 : (n.ring === 0 ? 1 : n.ring === 1 ? 0.9 : 0.8);
                ctx.font = '600 ' + fontSize.toFixed(1) + 'px Quicksand, sans-serif';
                ctx.textAlign = 'center';
                const labelY = n.y - n.radius * proximityScale - 12;
                const textW = ctx.measureText(n.label).width;
                const padX = 7, padY = 4;
                const pillW = textW + padX * 2;
                const pillH = fontSize + padY * 2;
                const pillX = n.x - pillW / 2;
                const pillY = labelY - fontSize + 1 - padY;
                const pillR = pillH / 2;

                // Pill background — more opaque when near cursor
                const pillAlpha = isNear ? 0.95 : labelAlpha * 0.85;
                ctx.globalAlpha = pillAlpha;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
                ctx.beginPath();
                ctx.roundRect(pillX, pillY, pillW, pillH, pillR);
                ctx.fill();

                // Label text
                ctx.globalAlpha = labelAlpha;
                ctx.fillStyle = n.color;
                ctx.fillText(n.label, n.x, labelY);
                ctx.globalAlpha = 1;
            });

            animFrame = requestAnimationFrame(draw);
        }

        // --- Mouse tracking (desktop only) ---
        if (!isMobile) {
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouseX = e.clientX - rect.left;
                mouseY = e.clientY - rect.top;
            });
            canvas.addEventListener('mouseleave', () => {
                mouseX = -1000;
                mouseY = -1000;
            });
        }

        // --- Scroll parallax ---
        window.addEventListener('scroll', () => {
            scrollOffset = window.pageYOffset;
        }, { passive: true });

        // Only run when hero is visible (perf)
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animFrame) animFrame = requestAnimationFrame(draw);
                } else {
                    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
                }
            });
        }, { threshold: 0 });

        heroObserver.observe(container);

        window.addEventListener('resize', () => { resize(); }, { passive: true });
        resize();
        animFrame = requestAnimationFrame(draw);
    })();

    // =========================================
    // CONNECTIONS CONNECTOME (radial chord diagram)
    // =========================================
    (function initConnectome() {
        const svg = document.getElementById('kg-svg');
        const tooltip = document.getElementById('kg-tooltip');
        const container = document.getElementById('kg-graph');
        if (!svg || !tooltip || !container) return;

        const SVG_NS = 'http://www.w3.org/2000/svg';

        // ---- Brand palette ----
        const COLOR = {
            condition:   { fill: '#8259DC', stroke: '#5B23C6', label: '#5B23C6', hot: '#5B23C6' },
            symptom:     { fill: '#E84393', stroke: '#BD2F76', label: '#A01F5C', hot: '#BD2F76' },
            arcCondLbl:  'rgba(130, 89, 220, 0.5)',
            arcSymLbl:   'rgba(232, 67, 147, 0.5)',
            tickCond:    'rgba(130, 89, 220, 0.3)',
            tickSym:     'rgba(232, 67, 147, 0.3)',
            comorbIdle:  'rgba(130, 89, 220, 0.2)',
            comorbHot:   'rgba(91, 35, 198, 0.75)',
            comorbDim:   'rgba(130, 89, 220, 0.04)',
            sympIdle:    'rgba(232, 67, 147, 0.09)',
            sympHot:     'rgba(232, 67, 147, 0.55)',
            sympDim:     'rgba(232, 67, 147, 0.03)',
            centerText:  '#5B23C6',
            centerHint:  '#888',
        };

        // ---- LAYOUT ----
        const cx = 700, cy = 450, radius = 320;

        // ---- DATA ----
        const nodes = [
            // Conditions (purple) — left arc
            { id: 'pcos',       label: 'PCOS',           type: 'condition', angle: 200 },
            { id: 'endo',       label: 'Endometriosis',  type: 'condition', angle: 225 },
            { id: 'pmdd',       label: 'PMDD',           type: 'condition', angle: 170 },
            { id: 'fertility',  label: 'Fertility',      type: 'condition', angle: 250 },
            { id: 'peri',       label: 'Perimenopause',  type: 'condition', angle: 275 },
            { id: 'thyroid',    label: "Hashimoto's",    type: 'condition', angle: 148 },
            { id: 'fibroids',   label: 'Fibroids',       type: 'condition', angle: 300 },
            { id: 'adeno',      label: 'Adenomyosis',    type: 'condition', angle: 320 },
            { id: 'autoimmune', label: 'Autoimmune',     type: 'condition', angle: 130 },
            // Symptoms (pink) — right arc
            { id: 'fatigue',       label: 'Fatigue',          type: 'symptom', angle: 20 },
            { id: 'mood',          label: 'Mood changes',     type: 'symptom', angle: 40 },
            { id: 'irregular',     label: 'Irregular periods',type: 'symptom', angle: 58 },
            { id: 'infertility_s', label: 'Infertility',      type: 'symptom', angle: 76 },
            { id: 'bloating',      label: 'Bloating / GI',    type: 'symptom', angle: 94 },
            { id: 'pain',          label: 'Pelvic pain',      type: 'symptom', angle: 112 },
            { id: 'hmb',           label: 'Heavy bleeding',   type: 'symptom', angle: 2 },
            { id: 'brainfog',      label: 'Brain fog',        type: 'symptom', angle: 350 },
            { id: 'sleep',         label: 'Sleep disruption', type: 'symptom', angle: 335 },
        ];

        const comorbidities = [
            { from: 'pcos',     to: 'fertility',   label: '70-80% anovulatory infertility',    w: 5 },
            { from: 'pcos',     to: 'thyroid',     label: "3x Hashimoto's risk",               w: 3.5 },
            { from: 'endo',     to: 'fertility',   label: '30-50% infertility',                w: 4 },
            { from: 'endo',     to: 'adeno',       label: '20-40% co-occurrence',              w: 3.5 },
            { from: 'endo',     to: 'autoimmune',  label: '42% autoimmune comorbidity',        w: 3 },
            { from: 'endo',     to: 'fibroids',    label: '12-26% co-occurrence',              w: 2.5 },
            { from: 'peri',     to: 'autoimmune',  label: '40% of POI have autoimmune',        w: 3 },
            { from: 'pcos',     to: 'endo',        label: '7-20% co-occurrence',               w: 2 },
            { from: 'fibroids', to: 'adeno',       label: '20-35% co-occurrence',              w: 3 },
            { from: 'pcos',     to: 'pmdd',        label: 'Shared mood pathways',              w: 2 },
            { from: 'peri',     to: 'fibroids',    label: 'Shared HMB pathway',                w: 2 },
            { from: 'endo',     to: 'peri',        label: '7.5x surgical menopause',           w: 2.5 },
        ];

        const symptomLinks = [
            // Fatigue — 8
            { from: 'pcos', to: 'fatigue', w: 2 }, { from: 'endo', to: 'fatigue', w: 2 },
            { from: 'fertility', to: 'fatigue', w: 1.5 }, { from: 'peri', to: 'fatigue', w: 2 },
            { from: 'pmdd', to: 'fatigue', w: 1.5 }, { from: 'fibroids', to: 'fatigue', w: 1.5 },
            { from: 'adeno', to: 'fatigue', w: 1.5 }, { from: 'autoimmune', to: 'fatigue', w: 2 },
            // Mood — 6
            { from: 'pcos', to: 'mood', w: 2 }, { from: 'endo', to: 'mood', w: 1.5 },
            { from: 'fertility', to: 'mood', w: 1.5 }, { from: 'peri', to: 'mood', w: 2 },
            { from: 'pmdd', to: 'mood', w: 3 }, { from: 'autoimmune', to: 'mood', w: 1.5 },
            // Irregular — 6
            { from: 'pcos', to: 'irregular', w: 3 }, { from: 'endo', to: 'irregular', w: 2 },
            { from: 'fertility', to: 'irregular', w: 2 }, { from: 'peri', to: 'irregular', w: 3 },
            { from: 'fibroids', to: 'irregular', w: 1.5 }, { from: 'adeno', to: 'irregular', w: 1.5 },
            // Infertility — 7
            { from: 'pcos', to: 'infertility_s', w: 3 }, { from: 'endo', to: 'infertility_s', w: 2.5 },
            { from: 'fertility', to: 'infertility_s', w: 3 }, { from: 'peri', to: 'infertility_s', w: 1.5 },
            { from: 'fibroids', to: 'infertility_s', w: 1.5 }, { from: 'adeno', to: 'infertility_s', w: 2 },
            { from: 'autoimmune', to: 'infertility_s', w: 1.5 },
            // Bloating — 6
            { from: 'pcos', to: 'bloating', w: 2 }, { from: 'endo', to: 'bloating', w: 2.5 },
            { from: 'peri', to: 'bloating', w: 1.5 }, { from: 'fibroids', to: 'bloating', w: 1.5 },
            { from: 'adeno', to: 'bloating', w: 1.5 }, { from: 'autoimmune', to: 'bloating', w: 1.5 },
            // Pelvic pain — 4
            { from: 'endo', to: 'pain', w: 3.5 }, { from: 'fibroids', to: 'pain', w: 2.5 },
            { from: 'adeno', to: 'pain', w: 3 }, { from: 'pcos', to: 'pain', w: 1 },
            // Heavy bleeding — 4
            { from: 'endo', to: 'hmb', w: 2.5 }, { from: 'peri', to: 'hmb', w: 2.5 },
            { from: 'fibroids', to: 'hmb', w: 3 }, { from: 'adeno', to: 'hmb', w: 3 },
            // Brain fog — 3
            { from: 'pcos', to: 'brainfog', w: 1.5 }, { from: 'peri', to: 'brainfog', w: 2.5 },
            { from: 'autoimmune', to: 'brainfog', w: 2 },
            // Sleep — 3
            { from: 'pcos', to: 'sleep', w: 1.5 }, { from: 'peri', to: 'sleep', w: 3 },
            { from: 'pmdd', to: 'sleep', w: 2 },
        ];

        // ---- GEOMETRY HELPERS ----
        function pos(angle, r) {
            const rad = (angle - 90) * Math.PI / 180;
            return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
        }
        function chordPath(a1, a2, r) {
            const p1 = pos(a1, r), p2 = pos(a2, r);
            const pull = 0.15;
            const cpx = cx + (((p1.x + p2.x) / 2) - cx) * pull;
            const cpy = cy + (((p1.y + p2.y) / 2) - cy) * pull;
            return `M ${p1.x} ${p1.y} Q ${cpx} ${cpy} ${p2.x} ${p2.y}`;
        }
        function getNode(id) { return nodes.find(n => n.id === id); }
        function create(tag) { return document.createElementNS(SVG_NS, tag); }

        // ---- ARC LABELS ----
        function arcLabel(text, angle, r, color, size) {
            const p = pos(angle, r);
            const t = create('text');
            t.setAttribute('x', p.x); t.setAttribute('y', p.y);
            t.setAttribute('text-anchor', 'middle');
            t.setAttribute('dominant-baseline', 'middle');
            t.setAttribute('font-family', 'Open Sans, sans-serif');
            t.setAttribute('font-size', size || '11');
            t.setAttribute('font-weight', '700');
            t.setAttribute('letter-spacing', '2.5');
            t.setAttribute('fill', color);
            t.textContent = text;
            svg.appendChild(t);
        }
        arcLabel('CONDITIONS', 225, radius + 62, COLOR.arcCondLbl);
        arcLabel('SYMPTOMS',   45,  radius + 62, COLOR.arcSymLbl);

        // ---- SYMPTOM CHORDS (pink) ----
        const symptomChordEls = [];
        symptomLinks.forEach(link => {
            const from = getNode(link.from), to = getNode(link.to);
            if (!from || !to) return;
            const path = create('path');
            path.setAttribute('d', chordPath(from.angle, to.angle, radius));
            path.setAttribute('stroke', COLOR.sympIdle);
            path.setAttribute('stroke-width', Math.max(0.5, link.w * 0.5));
            path.setAttribute('fill', 'none');
            path.classList.add('kg-s-chord');
            path.dataset.from = link.from;
            path.dataset.to = link.to;
            svg.appendChild(path);
            symptomChordEls.push(path);
        });

        // ---- COMORBIDITY CHORDS (purple) ----
        const comorbChordEls = [];
        comorbidities.forEach(link => {
            const from = getNode(link.from), to = getNode(link.to);
            if (!from || !to) return;
            const path = create('path');
            path.setAttribute('d', chordPath(from.angle, to.angle, radius));
            path.setAttribute('stroke', COLOR.comorbIdle);
            path.setAttribute('stroke-width', Math.max(1, link.w * 0.7));
            path.setAttribute('fill', 'none');
            path.classList.add('kg-c-chord');
            path.dataset.from = link.from;
            path.dataset.to = link.to;
            svg.appendChild(path);
            comorbChordEls.push({ el: path, link });
        });

        // ---- NODES ----
        const nodeEls = {};
        nodes.forEach(n => {
            const p = pos(n.angle, radius);
            const g = create('g');
            g.style.cursor = 'pointer';
            g.dataset.id = n.id;
            g.dataset.type = n.type;

            const isCond = n.type === 'condition';
            const palette = isCond ? COLOR.condition : COLOR.symptom;
            const r = isCond ? 26 : 22;

            const circle = create('circle');
            circle.setAttribute('cx', p.x); circle.setAttribute('cy', p.y);
            circle.setAttribute('r', r);
            circle.setAttribute('fill', palette.fill);
            circle.setAttribute('stroke', palette.stroke);
            circle.setAttribute('stroke-width', isCond ? '2.5' : '1.5');
            g.appendChild(circle);

            // Tick line from circle outward toward label
            const tickStart = pos(n.angle, radius + r + 2);
            const tickEnd = pos(n.angle, radius + (isCond ? 58 : 50));
            const tick = create('line');
            tick.setAttribute('x1', tickStart.x); tick.setAttribute('y1', tickStart.y);
            tick.setAttribute('x2', tickEnd.x); tick.setAttribute('y2', tickEnd.y);
            tick.setAttribute('stroke', isCond ? COLOR.tickCond : COLOR.tickSym);
            tick.setAttribute('stroke-width', '1');
            g.appendChild(tick);

            // Anchor side follows the node's x relative to center so text
            // always extends outward, away from the circle.
            const labelR = radius + (isCond ? 78 : 68);
            const lp = pos(n.angle, labelR);
            const sinA = Math.sin(n.angle * Math.PI / 180);
            const adjustedAnchor = Math.abs(sinA) < 0.08
                ? 'middle'
                : (sinA > 0 ? 'start' : 'end');

            const label = create('text');
            label.setAttribute('x', lp.x); label.setAttribute('y', lp.y);
            label.setAttribute('text-anchor', adjustedAnchor);
            label.setAttribute('dominant-baseline', 'middle');
            label.setAttribute('font-family', 'Open Sans, sans-serif');
            label.setAttribute('font-size', isCond ? '13' : '12');
            label.setAttribute('font-weight', isCond ? '600' : '500');
            label.setAttribute('fill', palette.label);
            label.textContent = n.label;
            g.appendChild(label);

            svg.appendChild(g);
            nodeEls[n.id] = { g, circle, label, r, node: n, palette };

            // ---- HOVER ----
            g.addEventListener('mouseenter', (e) => {
                circle.setAttribute('r', r + 4);
                circle.setAttribute('fill', palette.hot);

                if (isCond) {
                    comorbChordEls.forEach(({ el, link }) => {
                        if (link.from === n.id || link.to === n.id) {
                            el.setAttribute('stroke', COLOR.comorbHot);
                            el.setAttribute('stroke-width', Math.max(2, link.w));
                        } else {
                            el.setAttribute('stroke', COLOR.comorbDim);
                        }
                    });
                    svg.querySelectorAll('.kg-s-chord').forEach(el => {
                        if (el.dataset.from === n.id || el.dataset.to === n.id) {
                            el.setAttribute('stroke', COLOR.sympHot);
                            el.setAttribute('stroke-width', '2');
                        } else {
                            el.setAttribute('stroke', COLOR.sympDim);
                        }
                    });
                    const connectedConds = comorbidities
                        .filter(l => l.from === n.id || l.to === n.id)
                        .map(l => l.from === n.id ? l.to : l.from);
                    const connectedSyms = symptomLinks
                        .filter(l => l.from === n.id)
                        .map(l => l.to);
                    Object.values(nodeEls).forEach(ne => {
                        if (ne.node.id === n.id) return;
                        const isConnected = connectedConds.includes(ne.node.id) || connectedSyms.includes(ne.node.id);
                        if (!isConnected) {
                            ne.circle.setAttribute('opacity', '0.2');
                            ne.label.setAttribute('opacity', '0.2');
                        }
                    });

                    const cLinks = comorbidities.filter(l => l.from === n.id || l.to === n.id);
                    const sLinks = symptomLinks.filter(l => l.from === n.id);
                    let tip = `<strong>${n.label}</strong>`;
                    if (cLinks.length) {
                        tip += `<br/><br/><span style="color:#E5CFFC;font-size:10px;letter-spacing:1px;">COMORBIDITIES</span>`;
                        cLinks.forEach(l => { tip += `<br/>${l.label}`; });
                    }
                    tip += `<br/><br/><span style="color:#FBDAE8;font-size:10px;letter-spacing:1px;">SHARED SYMPTOMS</span>`;
                    tip += `<br/>${sLinks.length} symptoms overlap with other conditions`;
                    showTip(e, tip);
                } else {
                    const connectedConds = symptomLinks.filter(l => l.to === n.id).map(l => l.from);
                    svg.querySelectorAll('.kg-s-chord').forEach(el => {
                        if (el.dataset.to === n.id) {
                            el.setAttribute('stroke', COLOR.sympHot);
                            el.setAttribute('stroke-width', '2.5');
                        } else {
                            el.setAttribute('stroke', COLOR.sympDim);
                        }
                    });
                    comorbChordEls.forEach(({ el }) => el.setAttribute('stroke', COLOR.comorbDim));
                    Object.values(nodeEls).forEach(ne => {
                        if (ne.node.id === n.id) return;
                        if (!connectedConds.includes(ne.node.id)) {
                            ne.circle.setAttribute('opacity', '0.2');
                            ne.label.setAttribute('opacity', '0.2');
                        }
                    });
                    const condNames = connectedConds.map(id => getNode(id).label);
                    showTip(e, `<strong>${n.label}</strong><br/><br/>Shared across ${connectedConds.length} conditions:<br/>${condNames.join(', ')}`);
                }
            });

            g.addEventListener('mouseleave', () => {
                circle.setAttribute('r', r);
                circle.setAttribute('fill', palette.fill);
                comorbChordEls.forEach(({ el, link }) => {
                    el.setAttribute('stroke', COLOR.comorbIdle);
                    el.setAttribute('stroke-width', Math.max(1, link.w * 0.7));
                });
                svg.querySelectorAll('.kg-s-chord').forEach(el => {
                    const link = symptomLinks.find(l => l.from === el.dataset.from && l.to === el.dataset.to);
                    el.setAttribute('stroke', COLOR.sympIdle);
                    el.setAttribute('stroke-width', link ? Math.max(0.5, link.w * 0.5) : '0.5');
                });
                Object.values(nodeEls).forEach(ne => {
                    ne.circle.setAttribute('opacity', '1');
                    ne.label.setAttribute('opacity', '1');
                });
                hideTip();
            });
        });

        // ---- CENTER HINT ----
        const centerHint = create('text');
        centerHint.setAttribute('x', cx); centerHint.setAttribute('y', cy);
        centerHint.setAttribute('text-anchor', 'middle');
        centerHint.setAttribute('dominant-baseline', 'middle');
        centerHint.setAttribute('font-family', 'Open Sans, sans-serif');
        centerHint.setAttribute('font-size', '12');
        centerHint.setAttribute('font-weight', '400');
        centerHint.setAttribute('fill', COLOR.centerHint);
        centerHint.textContent = 'Hover a node to explore connections';
        svg.appendChild(centerHint);

        // ---- TOOLTIP ----
        function showTip(e, html) {
            tooltip.innerHTML = html;
            tooltip.classList.add('show');
            positionTip(e);
        }
        function positionTip(e) {
            const rect = container.getBoundingClientRect();
            let x = e.clientX - rect.left + 14;
            let y = e.clientY - rect.top - 10;
            if (x + 280 > rect.width) x -= 300;
            if (y + 140 > rect.height) y -= 120;
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        }
        function hideTip() { tooltip.classList.remove('show'); }

        container.addEventListener('mousemove', (e) => {
            if (tooltip.classList.contains('show')) positionTip(e);
        });

        // Analytics: first hover on a condition
        if (typeof gtag === 'function') {
            let logged = false;
            svg.querySelectorAll('g[data-type="condition"]').forEach(g => {
                g.addEventListener('mouseenter', () => {
                    if (logged) return;
                    logged = true;
                    gtag('event', 'connectome_engage', {
                        event_category: 'engagement',
                        event_label: g.dataset.id,
                    });
                });
            });
        }
    })();

});
