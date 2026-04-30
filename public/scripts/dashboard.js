// Dashboard client logic. All data comes from a trusted local JSON file we author.
// HTML composition uses template strings, escaped with esc() for any string interpolation.
// We render via Range.createContextualFragment to avoid direct innerHTML on dynamic targets.
(function () {
  const dataEl = document.getElementById('dashboard-data');
  if (!dataEl) return;
  const data = JSON.parse(dataEl.textContent);
  const { projects, agents, categories } = data;
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));
  const agentMap = Object.fromEntries(agents.map((a) => [a.id, a]));

  const esc = (s) =>
    String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  function setHTML(el, html) {
    while (el.firstChild) el.removeChild(el.firstChild);
    const range = document.createRange();
    range.selectNodeContents(el);
    const frag = range.createContextualFragment(html);
    el.appendChild(frag);
  }

  // ─── 뷰 전환 ───
  const VIEWS = ['constellation', 'kanban', 'grid', 'timeline'];
  function setView(view) {
    if (!VIEWS.includes(view)) view = 'constellation';
    document.querySelectorAll('.dashboard-view').forEach((el) => {
      el.classList.toggle('hidden', el.getAttribute('data-view') !== view);
    });
    document.querySelectorAll('.view-tab').forEach((btn) => {
      const isActive = btn.getAttribute('data-view-tab') === view;
      btn.classList.toggle('bg-indigo-500', isActive);
      btn.classList.toggle('border-indigo-500', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('text-white/70', !isActive);
    });
    const url = new URL(window.location.href);
    if (view === 'constellation') url.searchParams.delete('view');
    else url.searchParams.set('view', view);
    history.replaceState(null, '', url);
  }
  document.querySelectorAll('.view-tab').forEach((btn) => {
    btn.addEventListener('click', () => setView(btn.getAttribute('data-view-tab')));
  });
  const initialView = new URLSearchParams(location.search).get('view') || 'constellation';
  setView(initialView);

  // ─── 모달 ───
  const modal = document.getElementById('detail-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = modal.querySelector('.modal-backdrop');

  function statusBadge(status) {
    const colors = {
      완성: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      진행중: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
      검토중: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      계획: 'bg-white/10 text-white/60 border-white/20',
    };
    const cls = colors[status] || colors['계획'];
    return `<span class="text-[10px] font-black tracking-wider px-2 py-1 rounded-full border ${cls}">${esc(status)}</span>`;
  }

  function progressBar(progress, color) {
    return `<div class="h-2 bg-white/10 rounded-full overflow-hidden"><div class="h-full rounded-full" style="width:${progress}%; background:${color};"></div></div>`;
  }

  function dDay(deadline) {
    if (!deadline) return null;
    const target = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return 'D-Day';
    return `D+${Math.abs(diff)}`;
  }

  function renderAgentModal(agent) {
    const cat = catMap[agent.category];
    const flowHtml = agent.flow.length
      ? agent.flow
          .map(
            (f, i) => `
        <div class="flex items-center gap-2">
          <div class="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-bold text-white/80">${esc(f)}</div>
          ${i < agent.flow.length - 1 ? '<span class="text-white/30">→</span>' : ''}
        </div>`
          )
          .join('')
      : '<div class="text-xs text-white/40">흐름 정보 없음</div>';

    const linkedAgentsHtml = agent.linked_agents.length
      ? agent.linked_agents
          .map((id) => {
            const a = agentMap[id];
            if (!a) return '';
            return `<button data-jump-agent="${esc(id)}" class="text-xs px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 hover:border-white/30 text-white/80">↗ ${esc(a.name)}</button>`;
          })
          .join('')
      : '<span class="text-xs text-white/40">없음</span>';

    return `
      <div class="space-y-5">
        <div>
          <div class="flex items-center gap-2 mb-3 flex-wrap">
            <span class="text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded" style="background:${cat.color}30; color:${cat.accent}">${esc(cat.name)}</span>
            ${statusBadge(agent.status)}
            <span class="text-[10px] font-black tracking-wider px-2 py-1 rounded bg-white/10 text-white/60">AGENT</span>
          </div>
          <h2 class="text-2xl font-black text-white tracking-tight">${esc(agent.name)}</h2>
          <p class="text-sm text-white/60 mt-2 leading-relaxed">${esc(agent.description)}</p>
        </div>

        <div>
          <div class="text-[10px] font-black tracking-widest uppercase text-white/40 mb-2">동작 흐름</div>
          <div class="flex items-center gap-2 flex-wrap">${flowHtml}</div>
        </div>

        ${
          agent.command_example
            ? `
          <div class="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4">
            <div class="text-[10px] font-black tracking-widest uppercase text-indigo-300 mb-1.5">자비스에게 시키기</div>
            <div class="text-base font-bold text-white">"${esc(agent.command_example)}"</div>
            ${agent.ability ? `<div class="text-xs text-white/50 mt-1.5">→ ${esc(agent.ability)}</div>` : ''}
          </div>`
            : ''
        }

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div class="text-[10px] font-black tracking-widest uppercase text-white/40">실행 빈도</div>
            <div class="text-sm font-bold text-white mt-1">${esc(agent.frequency || '—')}</div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div class="text-[10px] font-black tracking-widest uppercase text-white/40">이번 달 호출</div>
            <div class="text-sm font-bold text-white mt-1">${agent.call_count_month}회</div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div class="text-[10px] font-black tracking-widest uppercase text-white/40">완성일</div>
            <div class="text-sm font-bold text-white mt-1">${esc(agent.completed_at || '—')}</div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div class="text-[10px] font-black tracking-widest uppercase text-white/40">최근 업데이트</div>
            <div class="text-sm font-bold text-white mt-1">${esc(agent.updated_at)}</div>
          </div>
        </div>

        <div>
          <div class="text-[10px] font-black tracking-widest uppercase text-white/40 mb-2">사용 도구</div>
          <div class="flex flex-wrap gap-1.5">
            ${agent.tools.map((t) => `<span class="text-xs px-2 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-white/70">${esc(t)}</span>`).join('')}
          </div>
        </div>

        <div>
          <div class="text-[10px] font-black tracking-widest uppercase text-white/40 mb-2">연결된 에이전트</div>
          <div class="flex flex-wrap gap-1.5">${linkedAgentsHtml}</div>
        </div>

        <div class="flex items-center gap-2 pt-2 border-t border-white/10">
          <button class="h-10 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition">코드 보기</button>
          <button class="h-10 px-4 rounded-xl border border-white/15 hover:border-white/40 text-white/80 font-bold text-sm transition">개선/수정</button>
        </div>
      </div>
    `;
  }

  function renderProjectModal(project) {
    const cat = catMap[project.category];
    const dd = dDay(project.deadline);
    const linkedAgents = project.agents.map((id) => agentMap[id]).filter(Boolean);

    return `
      <div class="space-y-5">
        <div>
          <div class="flex items-center gap-2 mb-3 flex-wrap">
            <span class="text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded" style="background:${cat.color}30; color:${cat.accent}">${esc(cat.name)}</span>
            ${statusBadge(project.status)}
            <span class="text-[10px] font-black tracking-wider px-2 py-1 rounded bg-white/10 text-white/60">PROJECT</span>
          </div>
          <h2 class="text-2xl font-black text-white tracking-tight">${esc(project.name)}</h2>
          <p class="text-sm text-white/60 mt-2 leading-relaxed">${esc(project.description)}</p>
        </div>

        ${
          project.deadline
            ? `
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div class="text-[10px] font-black tracking-widest uppercase text-white/40">목표 마감</div>
              <div class="text-base font-black text-white mt-1">${esc(project.deadline)}</div>
              <div class="text-[10px] text-white/40 mt-0.5">${esc(project.deadline_label || '')}</div>
            </div>
            <div class="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
              <div class="text-[10px] font-black tracking-widest uppercase text-amber-300">D-Day</div>
              <div class="text-2xl font-black text-amber-200 mt-1">${esc(dd)}</div>
            </div>
            <div class="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4">
              <div class="text-[10px] font-black tracking-widest uppercase text-indigo-300">진척률</div>
              <div class="text-2xl font-black text-indigo-200 mt-1">${project.progress}%</div>
            </div>
          </div>`
            : ''
        }

        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="text-[10px] font-black tracking-widest uppercase text-white/40">전체 진척</div>
            <div class="text-xs font-bold text-white">${project.progress}%</div>
          </div>
          ${progressBar(project.progress, cat.accent)}
        </div>

        ${
          linkedAgents.length
            ? `
          <div>
            <div class="text-[10px] font-black tracking-widest uppercase text-white/40 mb-2">사용 에이전트</div>
            <div class="space-y-1.5">
              ${linkedAgents
                .map(
                  (a) => `
                <button data-jump-agent="${esc(a.id)}" class="w-full text-left flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/30 px-3 py-2.5 transition">
                  <span class="text-sm font-bold text-white">${esc(a.name)}</span>
                  ${statusBadge(a.status)}
                </button>`
                )
                .join('')}
            </div>
          </div>`
            : ''
        }

        ${
          project.next_action
            ? `
          <div class="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
            <div class="text-[10px] font-black tracking-widest uppercase text-emerald-300 mb-1.5">다음 액션</div>
            <div class="text-sm font-bold text-white leading-relaxed">${esc(project.next_action)}</div>
          </div>`
            : ''
        }

        <div class="flex items-center gap-2 pt-2 border-t border-white/10">
          <button class="h-10 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition">다음 액션 진행</button>
          <button class="h-10 px-4 rounded-xl border border-white/15 hover:border-white/40 text-white/80 font-bold text-sm transition">워크로그 보기</button>
          ${project.github_repo ? `<a href="${esc(project.github_repo)}" target="_blank" rel="noopener noreferrer" class="h-10 px-4 rounded-xl border border-white/15 hover:border-white/40 text-white/80 font-bold text-sm transition inline-flex items-center">GitHub ↗</a>` : ''}
        </div>
      </div>
    `;
  }

  function attachModalJumps() {
    modalBody.querySelectorAll('[data-jump-agent]').forEach((btn) => {
      btn.addEventListener('click', () => openModal('agent', btn.getAttribute('data-jump-agent')));
    });
  }

  function openModal(type, id) {
    const item = type === 'agent' ? agentMap[id] : projectMap[id];
    if (!item) return;
    setHTML(modalBody, type === 'agent' ? renderAgentModal(item) : renderProjectModal(item));
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    const newPath = type === 'agent' ? `/dashboard/agents/${id}` : `/dashboard/projects/${id}`;
    if (location.pathname !== newPath) {
      history.pushState({ modal: true }, '', newPath + location.search);
    }
    attachModalJumps();
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    if (location.pathname.startsWith('/dashboard/agents/') || location.pathname.startsWith('/dashboard/projects/')) {
      history.pushState({}, '', '/dashboard' + location.search);
    }
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  // 아이템 클릭 → 모달
  function bindItemClicks(root) {
    (root || document).querySelectorAll('[data-item-id]').forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        openModal(btn.getAttribute('data-item-type'), btn.getAttribute('data-item-id'));
      });
    });
  }
  bindItemClicks();

  // URL 직접 진입
  const path = location.pathname;
  const agentMatch = path.match(/^\/dashboard\/agents\/(.+)$/);
  const projectMatch = path.match(/^\/dashboard\/projects\/(.+)$/);
  if (agentMatch) openModal('agent', decodeURIComponent(agentMatch[1]));
  else if (projectMatch) openModal('project', decodeURIComponent(projectMatch[1]));

  // 카테고리 헤더 클릭 → 카테고리 필터
  document.querySelectorAll('[data-filter-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('filter-category').value = btn.getAttribute('data-filter-category');
      applyFilters();
    });
  });

  // ─── 필터 ───
  function applyFilters() {
    const fCat = document.getElementById('filter-category').value;
    const fStatus = document.getElementById('filter-status').value;
    const fType = document.getElementById('filter-type').value;
    document.querySelectorAll('[data-item-id]').forEach((el) => {
      const cat = el.getAttribute('data-category') || '';
      const status = el.getAttribute('data-status') || '';
      const type = el.getAttribute('data-item-type');
      let show = true;
      if (fCat && cat !== fCat) show = false;
      if (fStatus && status !== fStatus) show = false;
      if (fType && type !== fType) show = false;
      el.classList.toggle('hidden', !show);
    });
  }
  ['filter-category', 'filter-status', 'filter-type'].forEach((id) => {
    document.getElementById(id).addEventListener('change', applyFilters);
  });

  // ─── 정렬 ───
  function applySort() {
    const sort = document.getElementById('sort-by').value;
    const containers = [
      ...document.querySelectorAll('.kanban-column'),
      ...document.querySelectorAll('.constellation-cluster > .space-y-2'),
      ...document.querySelectorAll('.grid-list'),
    ];
    containers.forEach((container) => {
      const items = Array.from(container.querySelectorAll('[data-item-id]'));
      items.sort((a, b) => {
        const aId = a.getAttribute('data-item-id');
        const bId = b.getAttribute('data-item-id');
        const aType = a.getAttribute('data-item-type');
        const bType = b.getAttribute('data-item-type');
        const aItem = aType === 'agent' ? agentMap[aId] : projectMap[aId];
        const bItem = bType === 'agent' ? agentMap[bId] : projectMap[bId];
        if (!aItem || !bItem) return 0;
        switch (sort) {
          case 'progress-desc':
            return bItem.progress - aItem.progress;
          case 'progress-asc':
            return aItem.progress - bItem.progress;
          case 'updated':
            return new Date(bItem.updated_at) - new Date(aItem.updated_at);
          case 'deadline': {
            const aD = aItem.deadline ? new Date(aItem.deadline).getTime() : Infinity;
            const bD = bItem.deadline ? new Date(bItem.deadline).getTime() : Infinity;
            return aD - bD;
          }
          case 'alpha':
            return aItem.name.localeCompare(bItem.name);
          default:
            return 0;
        }
      });
      items.forEach((it) => container.appendChild(it));
    });
  }
  document.getElementById('sort-by').addEventListener('change', applySort);

  // ─── 타임라인 렌더 ───
  function renderTimeline() {
    const all = [
      ...projects.map((p) => ({ ...p, __type: 'project' })),
      ...agents.map((a) => ({ ...a, __type: 'agent' })),
    ];
    const grouped = {};
    all.forEach((item) => {
      const date = item.updated_at;
      if (!date) return;
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    const dates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
    const todayStr = new Date().toISOString().slice(0, 10);
    const container = document.getElementById('timeline-list');
    const html = dates
      .map((date) => {
        const isToday = date === todayStr;
        return `
          <div>
            <div class="flex items-baseline gap-3 mb-3 pb-2 border-b border-white/10">
              <div class="text-base font-black text-white">${esc(date)}</div>
              ${isToday ? '<div class="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">TODAY</div>' : ''}
            </div>
            <div class="space-y-2 pl-4 border-l border-white/10">
              ${grouped[date]
                .map((item) => {
                  const cat = catMap[item.category];
                  return `
                    <button data-item-type="${esc(item.__type)}" data-item-id="${esc(item.id)}" data-category="${esc(item.category)}" data-status="${esc(item.status)}" class="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/[0.04] transition">
                      <span class="w-2 h-2 rounded-full -ml-5 shrink-0" style="background:${cat.accent}"></span>
                      <span class="text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded shrink-0" style="background:${cat.color}40; color:${cat.accent}">${esc(cat.name)}</span>
                      ${item.__type === 'project' ? '<span class="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-white/60 shrink-0">PROJ</span>' : ''}
                      <span class="text-sm font-bold text-white/90 truncate flex-1">${esc(item.name)}</span>
                      <span class="text-[10px] font-bold text-white/50 shrink-0">${esc(item.status)}${item.status === '진행중' ? ` · ${item.progress}%` : ''}</span>
                    </button>`;
                })
                .join('')}
            </div>
          </div>`;
      })
      .join('');
    setHTML(container, html);
    bindItemClicks(container);
  }
  renderTimeline();

  // popstate
  window.addEventListener('popstate', () => {
    const path = location.pathname;
    const agentMatch = path.match(/^\/dashboard\/agents\/(.+)$/);
    const projectMatch = path.match(/^\/dashboard\/projects\/(.+)$/);
    if (agentMatch) {
      const a = agentMap[decodeURIComponent(agentMatch[1])];
      if (a) {
        setHTML(modalBody, renderAgentModal(a));
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        attachModalJumps();
      }
    } else if (projectMatch) {
      const p = projectMap[decodeURIComponent(projectMatch[1])];
      if (p) {
        setHTML(modalBody, renderProjectModal(p));
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        attachModalJumps();
      }
    } else {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  });
})();
