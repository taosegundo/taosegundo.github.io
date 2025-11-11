/* Theme toggle and small helpers */
(function () {
	const year = document.getElementById('year');
	if (year) year.textContent = String(new Date().getFullYear());

	const toggle = document.getElementById('themeToggle');
	if (toggle) {
		toggle.addEventListener('click', () => {
			const root = document.documentElement;
			const isDark = root.classList.toggle('dark');
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		});
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
			<li class="p-4 rounded-lg border border-slate-200 dark:border-slate-800">
				<div class="font-medium">${escapeHtml(p.title || '')}</div>
				<p class="text-sm text-slate-600 dark:text-slate-300 mt-1">${escapeHtml(p.description || '')}</p>
				<div class="mt-2 flex gap-2 flex-wrap">
					${(p.tags || []).map((t) => `<span class="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">${escapeHtml(t)}</span>`).join('')}
				</div>
				<div class="mt-3 flex gap-3">
					${p.link ? `<a class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline" href="${encodeURI(p.link)}" target="_blank" rel="noopener">Live</a>` : ''}
					${p.repo ? `<a class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline" href="${encodeURI(p.repo)}" target="_blank" rel="noopener">Code</a>` : ''}
				</div>
			</li>`
		)
		.join('');
}

function renderProjectsGrid(projects) {
	const grid = document.getElementById('projectsGrid');
	if (!grid || !Array.isArray(projects)) return;
	grid.innerHTML = projects
		.map(
			(p) => `
			<article class="w-full mb-12">
				<div class="w-full max-w-[2000px] mx-auto rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-slate-800/50">
					<div class="flex flex-col lg:flex-row">
						${p.image ? `
						<div class="w-full lg:w-2/3">
							<img class="w-full h-80 lg:h-[500px] object-cover" src="${encodeURI(p.image)}" alt="${escapeHtml(p.title || 'Project image')}" />
						</div>
						` : ''}
						<div class="w-full lg:w-1/3 p-8 lg:p-10 bg-white dark:bg-slate-900">
							<div class="flex flex-col h-full">
								<div class="mb-6">
									<h2 class="text-2xl font-bold text-slate-800 dark:text-white">${escapeHtml(p.title || '')}</h2>
									${p.subtitle ? `<p class="text-indigo-600 dark:text-indigo-400 font-medium mt-1">${escapeHtml(p.subtitle)}</p>` : ''}
									${p.date || p.location ? `
									<div class="mt-3 text-sm text-slate-500 dark:text-slate-400">
										${p.date ? `<span class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
									</svg>${escapeHtml(p.date)}</span>` : ''}
										${p.date && p.location ? '<span class="mx-2">•</span>' : ''}
										${p.location ? `<span class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
									</svg>${escapeHtml(p.location)}</span>` : ''}
									</div>
									` : ''}
								</div>
								
								<div class="flex-grow">
									<p class="text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(p.description || '').replace(/\n/g, '<br>')}</p>
								</div>

								<div class="mt-6">
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
						</div>
					</div>
				</div>
			</article>`
		)
		.join('');
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


