document.addEventListener('DOMContentLoaded', () => {
  // ========================================================================
  // 1. NAVIGATION (Mobile menu + Escape + Click Outside + ScrollSpy)
  // ========================================================================
  const burgerToggle = document.getElementById('burgerToggle');
  const porscheMenu = document.getElementById('porscheMenu');
  const navItems = document.querySelectorAll('.nav-item');

  function closeMobileMenu() {
    porscheMenu.classList.remove('open');
    burgerToggle.classList.remove('open');
    burgerToggle.setAttribute('aria-expanded', 'false');
  }

  burgerToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = porscheMenu.classList.toggle('open');
    burgerToggle.classList.toggle('open');
    burgerToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      closeMobileMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (porscheMenu.classList.contains('open') && !porscheMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && porscheMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ScrollSpy
  const sections = document.querySelectorAll('main section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => navObserver.observe(section));

  // ========================================================================
  // 2. SCROLL REVEAL & ANIMATED PERFORMANCE COUNTERS
  // ========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Number animation (510 KM, 3.4 s, 318 km/h, 9 000 RPM)
  const specsMetrics = document.getElementById('specsMetrics');
  let metricsAnimated = false;

  if (specsMetrics) {
    const metricsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsAnimated) {
          metricsAnimated = true;
          const counters = specsMetrics.querySelectorAll('.count-up');

          counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const decimals = parseInt(counter.dataset.decimals || '0', 10);
            const useSpace = counter.dataset.format === 'space';
            const duration = 1100;
            const startTime = performance.now();

            function updateCounter(now) {
              const progress = Math.min((now - startTime) / duration, 1);
              // Ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = target * eased;

              let formatted = current.toFixed(decimals);
              if (useSpace) {
                formatted = Math.round(current).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
              }
              counter.textContent = formatted;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              }
            }
            requestAnimationFrame(updateCounter);
          });
        }
      });
    }, { threshold: 0.3 });

    metricsObserver.observe(specsMetrics);
  }

  // ========================================================================
  // 3. SOUND MODULE: HOLD TO PLAY (Mouse, Touch, Keyboard)
  // ========================================================================
  const gt3Audio = document.getElementById('gt3Audio');
  const holdAudioBtn = document.getElementById('holdAudioBtn');
  const holdInstructions = document.getElementById('holdInstructions');
  let isPressing = false;

  function startHoldAudio(e) {
    if (e && e.cancelable && e.type === 'touchstart') e.preventDefault();
    if (isPressing) return;

    isPressing = true;
    holdAudioBtn.classList.add('is-holding');
    holdInstructions.textContent = 'Trwa odsłuch wydechu... Puść, aby zatrzymać';

    gt3Audio.currentTime = 0;
    gt3Audio.play().catch(() => {
      // Protection against autoplay
    });
  }

  function stopHoldAudio() {
    if (!isPressing) return;

    isPressing = false;
    holdAudioBtn.classList.remove('is-holding');
    holdInstructions.textContent = 'Naciśnij i przytrzymaj (mysz, dotyk lub Spacja)';

    gt3Audio.pause();
    gt3Audio.currentTime = 0;
  }

  if (holdAudioBtn && gt3Audio) {
    // Mouse
    holdAudioBtn.addEventListener('mousedown', startHoldAudio);
    window.addEventListener('mouseup', stopHoldAudio);
    holdAudioBtn.addEventListener('mouseleave', stopHoldAudio);

    // Touch
    holdAudioBtn.addEventListener('touchstart', startHoldAudio, { passive: false });
    window.addEventListener('touchend', stopHoldAudio);
    window.addEventListener('touchcancel', stopHoldAudio);

    // Keyboard
    holdAudioBtn.addEventListener('keydown', (e) => {
      if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) {
        e.preventDefault();
        startHoldAudio();
      }
    });
    holdAudioBtn.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        stopHoldAudio();
      }
    });
  }

  // ========================================================================
  // 4. INTERACTIVE AERODYNAMICS (AERO HOTSPOTS)
  // ========================================================================
  const hotspotPins = document.querySelectorAll('.aero-hotspot-pin');
  const aeroDossier = document.getElementById('aeroDossier');

  const aeroKicker = document.getElementById('aeroKicker');
  const aeroTitle = document.getElementById('aeroTitle');
  const aeroStat = document.getElementById('aeroStat');
  const aeroStatLabel = document.getElementById('aeroStatLabel');
  const aeroDesc = document.getElementById('aeroDesc');
  const aeroChip1 = document.getElementById('aeroChip1');
  const aeroChip2 = document.getElementById('aeroChip2');
  const aeroChip3 = document.getElementById('aeroChip3');

  const aeroDatabase = {
    naca: {
      kicker: "INNOWACJA #1 • POKRYWA PRZEDNIA",
      title: "Wloty Powietrza NACA",
      stat: "0%",
      statLabel: "Straty Aerodynamicznej",
      desc: "Zaprojektowane pierwotnie przez NASA wloty powietrza wtłaczają pęd powietrza bezpośrednio na tarcze hamulcowe, chłodząc je przy ekstremalnych dohamowaniach z prędkości 300 km/h bez powiększania oporu czołowego auta.",
      chip1: "Płaskie kanały opływowe",
      chip2: "-25% temp. układu hamulcowego",
      chip3: "Włókno węglowe z lakierem bezbarwnym"
    },
    suspension: {
      kicker: "INNOWACJA #2 • PRZEDNIA OŚ",
      title: "Podwójne Wahacze z 911 RSR",
      stat: "-40%",
      statLabel: "Nurkowanie Nadwozia",
      desc: "Po raz pierwszy w seryjnym 911 zastosowano wyścigowy układ podwójnych wahaczy poprzecznych prosto z torowego 911 RSR. Zapewnia to stały kąt pochylenia koła w zakręcie i całkowitą stabilność aerodynamiczną splittera przy ostrym hamowaniu.",
      chip1: "Konstrukcja bez tulei gumowych",
      chip2: "Przeguby kulowe Uniball",
      chip3: "Zintegrowane kanały powietrzne"
    },
    wing: {
      kicker: "INNOWACJA #3 • TYLNA OŚ",
      title: "Skrzydło typu „Łabędzia Szyja” (Swan-Neck)",
      stat: "+50%",
      statLabel: "Większy Docisk",
      desc: "Mocowanie skrzydła od góry eliminuje zakłócenia przepływu powietrza na kluczowej, dolnej powierzchni płata. Rozwiązanie to drastycznie zwiększa różnicę ciśnień, zapewniając kolosalny docisk bez konieczności zwiększania kąta natarcia.",
      chip1: "385 kg docisku przy 200 km/h",
      chip2: "4 poziomy regulacji torowej",
      chip3: "Płat z włókna węglowego (CFRP)"
    },
    diffuser: {
      kicker: "INNOWACJA #4 • PODWOZIE",
      title: "Zabudowane Dno i Tylny Dyfuzor",
      stat: "4x",
      statLabel: "Pionowe Płetwy Kierujące",
      desc: "Całkowicie gładkie panele podwozia kierują strumień spodu auta prosto w rozszerzający się tylny dyfuzor. Zjawisko zwężki Venturiego dosłownie przysysa 911 GT3 do nawierzchni toru przy prędkościach powyżej 180 km/h.",
      chip1: "Efekt przypowierzchniowy",
      chip2: "Zintegrowany z wylotami spalin",
      chip3: "Kanały chłodzenia przekładni PDK"
    }
  };

  hotspotPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const data = aeroDatabase[pin.dataset.spot];
      if (!data) return;

      hotspotPins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      aeroDossier.style.opacity = '0';

      setTimeout(() => {
        aeroKicker.textContent = data.kicker;
        aeroTitle.textContent = data.title;
        aeroStat.textContent = data.stat;
        aeroStatLabel.textContent = data.statLabel;
        aeroDesc.textContent = data.desc;
        aeroChip1.textContent = data.chip1;
        aeroChip2.textContent = data.chip2;
        aeroChip3.textContent = data.chip3;

        aeroDossier.style.opacity = '1';
      }, 200);
    });
  });

  // ========================================================================
  // 5. 3D MODEL CONFIGURATOR (PORSCHE_911_GT3_3D.GLB)
  // ========================================================================
  const gt3Viewer = document.getElementById('gt3Viewer');

  if (gt3Viewer) {
    // Loading bar
    gt3Viewer.addEventListener('progress', (event) => {
      const progressBar = gt3Viewer.querySelector('.model-progress-bar');
      const updatingBar = gt3Viewer.querySelector('.model-update-bar');
      if (!progressBar || !updatingBar) return;

      updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
      if (event.detail.totalProgress === 1) {
        progressBar.classList.add('hide');
      } else {
        progressBar.classList.remove('hide');
      }
    });

    function updateCameraDistance() {
      gt3Viewer.cameraOrbit = window.innerWidth <= 868
        ? '35deg 75deg 105%'
        : '35deg 75deg 78%';
    }

    gt3Viewer.addEventListener('load', () => {
      updateCameraDistance();

      if (!gt3Viewer.model) return;

      // Repair of interior and dashboard transparency/clarity
      ['Porsche_911GT39922_2025InteriorA_Material1', 'dash'].forEach(matName => {
        const mat = gt3Viewer.model.materials.find(m => m.name === matName);
        if (mat) {
          mat.setAlphaMode('OPAQUE');
          const [r, g, b] = mat.pbrMetallicRoughness.baseColorFactor;
          mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1.0]);
        }
      });

      const carPaint = gt3Viewer.model.materials.find(
        mat => mat.name === 'Porsche_911GT39922_2025Paint_Material1'
      );
      
      if (carPaint) {
        // Removes the green base texture, leaving a clean finish ready for painting
        if (carPaint.pbrMetallicRoughness.baseColorTexture) {
          carPaint.pbrMetallicRoughness.baseColorTexture.setTexture(null);
        }
        // Default paint at start: White (glossy finish)
        carPaint.pbrMetallicRoughness.setBaseColorFactor([0.95, 0.95, 0.95, 1.0]);
        carPaint.pbrMetallicRoughness.setRoughnessFactor(0.15);
      }

      // Selecting a paint with an active state
      const colorButtons = document.querySelectorAll('.color-btn');
      colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          colorButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const [r, g, b] = btn.dataset.color.split(',').map(Number);
          if (carPaint) {
            carPaint.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1.0]);
          }
        });
      });

      // Rims selection + Gold (Neodyme Gold) as default
      const rimButtons = document.querySelectorAll('.rim-btn');
      const rimMaterial = gt3Viewer.model.materials.find(mat => mat.name === 'Rim_Paint');

      const rimPresets = {
        gold:   { color: [0.76, 0.60, 0.30, 1.0], metallic: 0.85, roughness: 0.25 },
        silver: { color: [0.85, 0.85, 0.85, 1.0], metallic: 0.95, roughness: 0.15 },
        black:  { color: [0.03, 0.03, 0.03, 1.0], metallic: 0.4,  roughness: 0.35 },
        carbon: { color: [0.015, 0.015, 0.02, 1.0], metallic: 0.25, roughness: 0.18 }
      };

      function applyRimPreset(presetKey) {
        const preset = rimPresets[presetKey];
        if (rimMaterial && preset) {
          rimMaterial.pbrMetallicRoughness.setBaseColorFactor(preset.color);
          rimMaterial.pbrMetallicRoughness.setMetallicFactor(preset.metallic);
          rimMaterial.pbrMetallicRoughness.setRoughnessFactor(preset.roughness);
        }
      }

      // Set the gold rims immediately after loading the model
      applyRimPreset('gold');

      rimButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          rimButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          applyRimPreset(btn.dataset.rim);
        });
      });
    });

    // Responsive 3D camera adjustment upon window resizing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCameraDistance, 150);
    });
  }

  // ========================================================================
  // 6. INTERIOR: HORIZONTAL FILMSTRIP (DRAG + MOMENTUM + PROGRESS + ARROWS)
  // ========================================================================
  const filmstripTrack = document.getElementById('filmstripTrack');
  const filmstripPrev = document.getElementById('filmstripPrev');
  const filmstripNext = document.getElementById('filmstripNext');
  const filmstripProgress = document.getElementById('filmstripProgress');

  if (filmstripTrack) {
    function updateFilmstripProgress() {
      if (!filmstripProgress) return;
      const maxScroll = filmstripTrack.scrollWidth - filmstripTrack.clientWidth;
      if (maxScroll <= 0) {
        filmstripProgress.style.width = '100%';
        return;
      }
      const percent = (filmstripTrack.scrollLeft / maxScroll) * 100;
      filmstripProgress.style.width = `${Math.max(15, Math.min(100, percent))}%`;
    }

    filmstripTrack.addEventListener('scroll', updateFilmstripProgress, { passive: true });
    window.addEventListener('resize', updateFilmstripProgress);
    updateFilmstripProgress();

    let isDraggingStrip = false;
    let dragStartX = 0;
    let scrollStartLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let momentumId = null;

    function stopMomentum() {
      if (momentumId) {
        cancelAnimationFrame(momentumId);
        momentumId = null;
      }
    }

    function applyMomentum() {
      if (Math.abs(velocity) < 0.4) {
        momentumId = null;
        return;
      }
      filmstripTrack.scrollLeft += velocity;
      velocity *= 0.93; // Friction – closer to 1 means longer glide
      momentumId = requestAnimationFrame(applyMomentum);
    }

    // Arrow navigation
    filmstripNext?.addEventListener('click', () => {
      stopMomentum();
      filmstripTrack.scrollBy({ left: 480, behavior: 'smooth' });
    });

    filmstripPrev?.addEventListener('click', () => {
      stopMomentum();
      filmstripTrack.scrollBy({ left: -480, behavior: 'smooth' });
    });

    // Mouse grab & drag with smooth inertia
    filmstripTrack.addEventListener('mousedown', (e) => {
      e.preventDefault();
      stopMomentum();
      isDraggingStrip = true;
      filmstripTrack.classList.add('is-dragging');
      dragStartX = e.pageX - filmstripTrack.offsetLeft;
      lastX = e.pageX;
      scrollStartLeft = filmstripTrack.scrollLeft;
      velocity = 0;
    });

    filmstripTrack.addEventListener('mousemove', (e) => {
      if (!isDraggingStrip) return;
      const x = e.pageX - filmstripTrack.offsetLeft;
      const walk = (x - dragStartX) * 1.25;
      filmstripTrack.scrollLeft = scrollStartLeft - walk;

      // Calculating velocity for a smooth slider after release
      velocity = (lastX - e.pageX) * 1.1;
      lastX = e.pageX;
    });

    function releaseDrag() {
      if (!isDraggingStrip) return;
      isDraggingStrip = false;
      filmstripTrack.classList.remove('is-dragging');
      momentumId = requestAnimationFrame(applyMomentum);
    }

    window.addEventListener('mouseup', releaseDrag);
    window.addEventListener('blur', releaseDrag);
  }
});