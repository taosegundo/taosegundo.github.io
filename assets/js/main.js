/* Theme toggle, mobile menu and small helpers */
(function () {
	// Set current year in footer
	const year = document.getElementById('year');
	if (year) year.textContent = String(new Date().getFullYear());

	// Mobile menu toggle
	const mobileMenuButton = document.getElementById('mobileMenuButton');
	const mobileMenu = document.getElementById('mobileMenu');
	
	if (mobileMenuButton && mobileMenu) {
		mobileMenuButton.addEventListener('click', (e) => {
			e.stopPropagation();
			mobileMenu.classList.toggle('hidden');
			document.body.style.overflow = mobileMenu.classList.contains('hidden') ? '' : 'hidden';
		});

		// Close menu when clicking outside
		document.addEventListener('click', (e) => {
			if (!mobileMenu.classList.contains('hidden') && 
				!mobileMenu.contains(e.target) && 
				e.target !== mobileMenuButton && 
				!mobileMenuButton.contains(e.target)) {
				mobileMenu.classList.add('hidden');
				document.body.style.overflow = '';
			}
		});

		// Close menu when a link is clicked
		mobileMenu.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				mobileMenu.classList.add('hidden');
				document.body.style.overflow = '';
			});
		});
	}

	// Theme toggle function
	const toggleTheme = () => {
		const root = document.documentElement;
		const isDark = root.classList.toggle('dark');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	};

	// Desktop theme toggle
	const desktopToggle = document.getElementById('themeToggle');
	if (desktopToggle) {
		desktopToggle.addEventListener('click', toggleTheme);
	}

	// Mobile theme toggle
	const mobileToggle = document.getElementById('mobileThemeToggle');
	if (mobileToggle) {
		mobileToggle.addEventListener('click', toggleTheme);
	}

	// Show resume link if exists
	const resumeLink = document.getElementById('resumeLink');
	if (resumeLink) {
		fetch('/resume/resume.pdf?v=' + Date.now(), { method: 'HEAD', cache: 'no-store' }).then((res) => {
			if (res.ok) resumeLink.classList.remove('hidden');
		});
	}
})();

// Load projects for index and projects pages
(async function () {
	try {
		const res = await fetch('/data/projects.json', { cache: 'no-store' });
		if (!res.ok) return;
		const projects = await res.json();
		renderFeatured(projects);
		renderProjectsGrid(projects);
		renderTags(projects);
	} catch {}
})();

function renderFeatured(projects) {
	const el = document.getElementById('featuredList');
	if (!el || !Array.isArray(projects)) return;
	const featured = projects.slice(0, 3);
	el.innerHTML = featured
		.map(
			(p) => `
			<li class="p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md dark:hover:shadow-slate-800/50 transition-shadow">
				<h3 class="text-lg font-semibold text-slate-900 dark:text-white">${escapeHtml(p.title || '')}</h3>
				<div class="mt-3 flex flex-wrap gap-2">
					${(p.tags || []).slice(0, 4).map((t) => `
						<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
						${escapeHtml(t)}
					</span>
					`).join('')}
				</div>
				<div class="mt-6">
					<a href="#projects" class="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline group">
						Learn more
						<svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
						</svg>
					</a>
				</div>
			</li>`
		)
		.join('');
}

function renderProjectsGrid(projects) {
	const grid = document.getElementById('projectsGrid');
	if (!grid || !Array.isArray(projects)) return;

	grid.innerHTML = projects
		.map((p) => {
			// Check if project has media array or fallback to single image
			const hasMedia = Array.isArray(p.media) && p.media.length > 0;
			const mediaItems = hasMedia ? p.media : (p.image ? [{ type: 'image', src: p.image, alt: p.title || 'Project image' }] : []);

			// Generate media HTML
			let mediaHtml = '';
			if (mediaItems.length > 0) {
				mediaHtml = `
				<div class="w-full lg:w-1/2 xl:w-2/5 bg-slate-50 dark:bg-slate-800 relative group">
					<div class="carousel-container relative w-full h-full min-h-[400px] overflow-hidden">
						${mediaItems.map((item, index) => `
						<div class="carousel-item absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${index === 0 ? 'opacity-100' : 'opacity-0'}" data-index="${index}">
							${item.type === 'video' ? `
							<video class="w-full h-full object-contain" controls poster="${item.thumbnail || ''}">
								<source src="${item.src}" type="video/mp4">
								Your browser does not support the video tag.
							</video>
							` : `
							<img class="w-full h-full object-contain" src="${item.src}" alt="${escapeHtml(item.alt || '')}" />
							`}
						</div>
						`).join('')}
					</div>

					<!-- Navigation Arrows -->
					${mediaItems.length > 1 ? `
					<button class="carousel-nav absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-direction="prev">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<button class="carousel-nav absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-direction="next">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>

					<!-- Dots Navigation -->
					<div class="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
						${mediaItems.map((_, index) => `
							<button class="carousel-dot w-2 h-2 rounded-full bg-white/50 ${index === 0 ? 'bg-white' : ''}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
						`).join('')}
					</div>
				` : ''}
			</div>
			<div class="p-6 flex flex-col h-full lg:w-1/2 xl:w-3/5">
				<div class="flex-grow">
					<h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">${escapeHtml(p.title || '')}</h3>
					<p class="text-slate-600 dark:text-slate-300 mb-4">${escapeHtml(p.description || '')}</p>
				</div>

				<div class="flex flex-wrap gap-2 mb-4">
					${(p.tags || []).map((t) => `
						<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">
						${escapeHtml(t)}
					</span>
					`).join('')}
				</div>

				<div class="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
					${p.link ? `
					<a class="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline" 
					   href="${encodeURI(p.link)}" target="_blank" rel="noopener">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
						</svg>
						View Project
					</a>` : ''}

					${p.repo ? `
					<a class="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline" 
					   href="${encodeURI(p.repo)}" target="_blank" rel="noopener">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
						</svg>
						View Code
					</a>` : ''}
				</div>
			</div>
		`;
			}

			// Return the complete project card
			return `
			<article class="w-full mb-12 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-slate-800/50 bg-white dark:bg-slate-900">
				<div class="flex flex-col lg:flex-row">
					${mediaHtml}
				</div>
			</article>
			`;
		})
		.join('');

	// Initialize carousels after DOM is updated
	setTimeout(() => {
		document.querySelectorAll('.carousel-container').forEach(container => {
			const items = container.querySelectorAll('.carousel-item');
			if (items.length <= 1) return; // No need for carousel if only one item

			const dots = container.parentElement.querySelectorAll('.carousel-dot');
			const prevBtn = container.parentElement.querySelector('[data-direction="prev"]');
			const nextBtn = container.parentElement.querySelector('[data-direction="next"]');

			let currentIndex = 0;

			const showSlide = (index) => {
				// Handle out of bounds
				if (index < 0) index = items.length - 1;
				if (index >= items.length) index = 0;

				// Hide all items
				items.forEach(item => {
					item.classList.remove('opacity-100');
					item.classList.add('opacity-0');
				});
				
				// Show current item
				items[index].classList.remove('opacity-0');
				items[index].classList.add('opacity-100');

				// Update dots
				if (dots.length > 0) {
					dots.forEach(dot => {
						dot.classList.remove('bg-white');
						dot.classList.add('bg-white/50');
					});
					if (dots[index]) {
						dots[index].classList.remove('bg-white/50');
						dots[index].classList.add('bg-white');
					}
				}

				currentIndex = index;
			};

			// Navigation with dots
			dots.forEach((dot, index) => {
				dot.addEventListener('click', () => showSlide(index));
			});

			// Previous button
			if (prevBtn) {
				prevBtn.addEventListener('click', () => {
					showSlide(currentIndex - 1);
				});
			}

			// Next button
			if (nextBtn) {
				nextBtn.addEventListener('click', () => {
					showSlide(currentIndex + 1);
				});
			}

			// Keyboard navigation
			container.addEventListener('keydown', (e) => {
				if (e.key === 'ArrowLeft') {
					showSlide(currentIndex - 1);
					e.preventDefault();
				} else if (e.key === 'ArrowRight') {
					showSlide(currentIndex + 1);
					e.preventDefault();
				}
			});

			// Auto-advance slides (only if more than one slide)
			if (items.length > 1) {
				let slideInterval = setInterval(() => {
					if (!container.matches(':hover')) {
						showSlide((currentIndex + 1) % items.length);
					}
				}, 5000);

				// Pause auto-advance on hover
				container.addEventListener('mouseenter', () => {
					clearInterval(slideInterval);
				});

				container.addEventListener('mouseleave', () => {
					slideInterval = setInterval(() => {
						showSlide((currentIndex + 1) % items.length);
					}, 5000);
				});
			}

			// Make carousel focusable
			container.setAttribute('tabindex', '0');
		});
	}, 0);
}

function renderTags(projects) {
	const filters = document.getElementById('projectFilters');
	const grid = document.getElementById('projectsGrid');
	if (!filters || !grid || !Array.isArray(projects)) return;
	const tags = Array.from(new Set(projects.flatMap((p) => p.tags || [])));
	if (!tags.length) return;
	const allBtn = document.createElement('button');
	allBtn.className = 'btn-secondary text-sm';
	allBtn.textContent = 'All';
	allBtn.addEventListener('click', () => renderProjectsGrid(projects));
	filters.appendChild(allBtn);
	tags.forEach((t) => {
		const btn = document.createElement('button');
		btn.className = 'btn-secondary text-sm';
		btn.textContent = t;
		btn.addEventListener('click', () => {
			const filtered = projects.filter((p) => (p.tags || []).includes(t));
			renderProjectsGrid(filtered);
		});
		filters.appendChild(btn);
	});
}

function escapeHtml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}


