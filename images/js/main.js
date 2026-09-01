document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const layoutContainer = document.getElementById('layoutContainer');
    const heroSection = document.getElementById('heroSection');
    const mainContent = document.querySelector('.main-content');

    const placeTitle = document.querySelector('.place-title');
    const placeDescription = document.querySelector('.place-description');

    let currentActiveTitle = placeTitle.textContent;

    let isPermanentlySticky = false;

    const checkAndBuildMobileLayout = () => {
        if (window.innerWidth <= 768) {
            const allSections = document.querySelectorAll('.content-section');
            allSections.forEach(section => {
                if (!section.querySelector('.mobile-title-container')) {
                    const title = section.getAttribute('data-title');
                    const desc = section.getAttribute('data-desc');

                    if (title && desc) {
                        const titleContainer = document.createElement('div');
                        titleContainer.className = 'mobile-title-container';
                        titleContainer.innerHTML = `<h2 class="place-title">${title}</h2>`;

                        const descContainer = document.createElement('div');
                        descContainer.className = 'mobile-desc-container';
                        descContainer.innerHTML = `<p class="place-description">${desc}</p>`;

                        const splitGrid = section.querySelector('.split-grid');
                        const panels = splitGrid.querySelectorAll('.img-panel');

                        if (panels.length >= 2) {
                            splitGrid.insertBefore(titleContainer, panels[0]);

                            splitGrid.insertBefore(descContainer, panels[1]);
                        } else {
                            section.appendChild(titleContainer);
                            section.appendChild(descContainer);
                        }
                    }
                }
            });
        } else {
            const mobileTitles = document.querySelectorAll('.mobile-title-container');
            const mobileDescs = document.querySelectorAll('.mobile-desc-container');

            mobileTitles.forEach(el => el.remove());
            mobileDescs.forEach(el => el.remove());
        }
    };

    checkAndBuildMobileLayout();
    window.addEventListener('resize', checkAndBuildMobileLayout);

    if (menuToggle && menuClose) {
        menuToggle.addEventListener('click', () => {
            layoutContainer.classList.add('menu-open');
        });

        menuClose.addEventListener('click', () => {
            layoutContainer.classList.remove('menu-open');
            if (mainContent.scrollTop === 0) {
                isPermanentlySticky = false;
            }
        });
    }

    const sectionOptions = {
        root: mainContent.clientHeight ? mainContent : null,
        threshold: 0.4
    };

    const sequences = document.querySelectorAll('.slide-sequence');
    let currentSeqIndex = 0;

    const runSlideshowTimeline = () => {
        if (sequences.length === 0 || window.innerWidth <= 768) return;

        const currentSequence = sequences[currentSeqIndex];

        const nextSeqIndex = (currentSeqIndex + 1) % sequences.length;
        const nextSequence = sequences[nextSeqIndex];

        const displayDuration = currentSequence.classList.contains('type-single') ? 3500 : 2500;

        setTimeout(() => {
            if (window.innerWidth <= 768) return;

            nextSequence.classList.add('next-preview');

            currentSequence.classList.add('shift');

            setTimeout(() => {
                if (window.innerWidth <= 768) return;

                currentSequence.classList.remove('active', 'shift');

                nextSequence.classList.remove('next-preview');
                nextSequence.classList.add('active');

                currentSeqIndex = nextSeqIndex;

                runSlideshowTimeline();

            }, 1400);

        }, displayDuration);
    };

    if (window.innerWidth > 768) {
        runSlideshowTimeline();
    }

    const sectionObserver = new IntersectionObserver((entries) => {
        if (window.innerWidth > 768) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const nextTitle = entry.target.getAttribute('data-title');
                    const nextDesc = entry.target.getAttribute('data-desc');

                    if (nextTitle && nextTitle !== currentActiveTitle) {
                        currentActiveTitle = nextTitle;

                        const fadeOutKeyframes = [
                            { opacity: 1, transform: 'translateY(0px)' },
                            { opacity: 0, transform: 'translateY(-15px)' }
                        ];

                        const fadeOutTiming = {
                            duration: 300,
                            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                            fill: 'forwards'
                        };

                        const titleAnimation = placeTitle.animate(fadeOutKeyframes, fadeOutTiming);
                        placeDescription.animate(fadeOutKeyframes, fadeOutTiming);

                        titleAnimation.onfinish = () => {
                            placeTitle.textContent = nextTitle;
                            placeDescription.textContent = nextDesc;

                            const fadeInKeyframes = [
                                { opacity: 0, transform: 'translateY(15px)' },
                                { opacity: 1, transform: 'translateY(0px)' }
                            ];

                            const fadeInTiming = {
                                duration: 450,
                                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                                fill: 'forwards'
                            };

                            placeTitle.animate(fadeInKeyframes, fadeInTiming);
                            placeDescription.animate(fadeInKeyframes, fadeInTiming);
                        };
                    }
                }
            });
        }
    }, sectionOptions);

    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => sectionObserver.observe(section));

    const heroObserver = new IntersectionObserver((entries) => {
        if (window.innerWidth > 768) {
            entries.forEach(entry => {
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    layoutContainer.classList.remove('menu-open');
                    layoutContainer.classList.add('sticky-permanent');
                    isPermanentlySticky = true;
                } else if (entry.isIntersecting && isPermanentlySticky) {
                    layoutContainer.classList.remove('sticky-permanent');
                    layoutContainer.classList.add('menu-open');
                }
            });
        }
    }, { root: mainContent.clientHeight ? mainContent : null, threshold: 0, rootMargin: "-1px 0px 0px 0px" });

    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    const sidebarFooter = document.querySelector('.sidebar-footer');
    if (sidebarFooter) {
        sidebarFooter.style.cursor = 'pointer';
        sidebarFooter.addEventListener('click', () => {
            if (window.innerWidth > 768) {
                if (isPermanentlySticky) {
                    layoutContainer.classList.remove('sticky-permanent');
                    layoutContainer.classList.add('menu-open');
                }

                mainContent.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});