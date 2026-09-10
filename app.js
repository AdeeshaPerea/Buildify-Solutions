// ==========================================================================
// BUILDIFY SOLUTIONS - APPLICATION CORE JAVASCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // App State
  const state = {
    currentTab: 'store',
    activeStoreCategory: 'all',
    activeProjectCategory: 'all',
    activeLearnCategory: 'all',
    searchQuery: '',
    cart: JSON.parse(localStorage.getItem('buildify_cart')) || []
  };

  // DOM Elements
  const navLinks = document.querySelectorAll('.nav-link[data-tab]');
  const viewSections = document.querySelectorAll('.view-section');
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  const cartDrawerCloseBtn = document.getElementById('cartDrawerCloseBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartBadge = document.getElementById('cartBadge');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTaxEl = document.getElementById('cartTax');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContainer = document.getElementById('modalContainer');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const searchInput = document.getElementById('globalSearchInput');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');

  // ==========================================================================
  // NAVIGATION & TAB SWITCHING
  // ==========================================================================
  function switchTab(tabId, subCategory = null) {
    state.currentTab = tabId;

    // Update Nav Links
    navLinks.forEach(link => {
      if (link.dataset.tab === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Sections
    viewSections.forEach(section => {
      if (section.id === `section-${tabId}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Close mobile drawer if open
    if (mobileDrawer) {
      mobileDrawer.classList.remove('active');
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle subcategory filter if provided
    if (tabId === 'store') {
      if (subCategory) state.activeStoreCategory = subCategory;
      renderStore();
    } else if (tabId === 'projects') {
      if (subCategory) state.activeProjectCategory = subCategory;
      renderProjects();
    } else if (tabId === 'learn') {
      if (subCategory) state.activeLearnCategory = subCategory;
      renderLearn();
    } else if (tabId === 'about') {
      renderAbout();
    }
  }

  // Setup click listeners for main navigation & dropdown items
  document.querySelectorAll('[data-nav-target]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = el.getAttribute('data-nav-target');
      const category = el.getAttribute('data-nav-category');
      switchTab(tab, category);
    });
  });

  // Mobile menu toggle
  if (mobileNavToggle && mobileDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });
  }

  // ==========================================================================
  // STORE SECTION LOGIC
  // ==========================================================================
  function renderStore() {
    const filterContainer = document.getElementById('storeFilterBar');
    const productsGrid = document.getElementById('productsGrid');
    if (!filterContainer || !productsGrid) return;

    // Render filter buttons
    filterContainer.innerHTML = BUILDIFY_DATA.storeCategories.map(cat => `
      <button class="filter-btn ${state.activeStoreCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
        <i class="bi ${cat.icon}"></i>
        <span>${cat.name}</span>
      </button>
    `).join('');

    // Filter products
    const filteredProducts = BUILDIFY_DATA.products.filter(p => {
      const matchCategory = (state.activeStoreCategory === 'all' || p.category === state.activeStoreCategory);
      const matchSearch = !state.searchQuery || 
        p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <i class="bi bi-search" style="font-size: 2.5rem; color: var(--accent-cyan);"></i>
          <h3 style="margin-top: 1rem; color: var(--text-main);">No components found</h3>
          <p>Try searching for other terms like 'ESP32', 'Arduino', 'Sensor', or 'Relay'.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filteredProducts.map(p => `
      <div class="product-card" data-product-id="${p.id}">
        <div class="product-image-wrap">
          <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy" />
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <button class="product-quick-view-btn" data-view-product="${p.id}">
            <i class="bi bi-eye"></i> Quick View
          </button>
        </div>
        <div class="product-body">
          <div class="product-category">${p.category}</div>
          <h3 class="product-title">${p.name}</h3>
          <div class="product-rating">
            <i class="bi bi-star-fill"></i>
            <span>${p.rating}</span>
            <span class="product-reviews-count">(${p.reviewsCount} reviews)</span>
          </div>
          <p class="product-description">${p.description}</p>
          <div class="product-footer">
            <div class="price-wrap">
              <span class="price-current">$${p.price.toFixed(2)}</span>
              ${p.originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="add-to-cart-btn" data-add-cart="${p.id}">
              <i class="bi bi-cart-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach listeners
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeStoreCategory = btn.dataset.cat;
        renderStore();
      });
    });

    productsGrid.querySelectorAll('[data-view-product]').forEach(btn => {
      btn.addEventListener('click', () => {
        openProductModal(btn.dataset.viewProduct);
      });
    });

    productsGrid.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        addToCart(btn.dataset.addCart);
      });
    });
  }

  // ==========================================================================
  // PROJECTS SECTION LOGIC
  // ==========================================================================
  function renderProjects() {
    const filterContainer = document.getElementById('projectFilterBar');
    const projectsGrid = document.getElementById('projectsGrid');
    if (!filterContainer || !projectsGrid) return;

    // Render filter buttons
    filterContainer.innerHTML = BUILDIFY_DATA.projectsCategories.map(cat => `
      <button class="filter-btn ${state.activeProjectCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
        <span>${cat.name}</span>
      </button>
    `).join('');

    // Filter projects
    const filtered = BUILDIFY_DATA.projects.filter(p => {
      const matchCat = (state.activeProjectCategory === 'all' || p.category === state.activeProjectCategory);
      const matchSearch = !state.searchQuery || 
        p.title.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
        p.summary.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    projectsGrid.innerHTML = filtered.map(p => `
      <div class="project-card">
        <div class="project-image-wrap">
          <img src="${p.image}" alt="${p.title}" class="project-image" loading="lazy" />
          <span class="project-difficulty-badge diff-${p.difficulty}">${p.difficulty}</span>
        </div>
        <div class="project-body">
          <div class="project-meta">
            <span><i class="bi bi-clock"></i> ${p.time}</span>
            <span><i class="bi bi-star-fill" style="color: var(--accent-amber);"></i> ${p.rating}</span>
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-summary">${p.summary}</p>
          <div class="project-tags">
            ${p.tags.map(t => `<span class="tag-badge">#${t}</span>`).join('')}
          </div>
          <div class="project-card-footer">
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">
              ${p.bom ? `${p.bom.length} Components Required` : 'Custom Spec'}
            </span>
            <button class="view-project-btn" data-view-project="${p.id}">
              Explore BOM & Code <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach listeners
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeProjectCategory = btn.dataset.cat;
        renderProjects();
      });
    });

    projectsGrid.querySelectorAll('[data-view-project]').forEach(btn => {
      btn.addEventListener('click', () => {
        openProjectModal(btn.dataset.viewProject);
      });
    });
  }

  // ==========================================================================
  // LEARN & GUIDES SECTION LOGIC
  // ==========================================================================
  function renderLearn() {
    const filterContainer = document.getElementById('learnFilterBar');
    const learnGrid = document.getElementById('learnGrid');
    const ideasGrid = document.getElementById('ideasGrid');
    if (!filterContainer || !learnGrid) return;

    filterContainer.innerHTML = BUILDIFY_DATA.learnCategories.map(cat => `
      <button class="filter-btn ${state.activeLearnCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
        <span>${cat.name}</span>
      </button>
    `).join('');

    const filtered = BUILDIFY_DATA.learnContent.filter(item => {
      const matchCat = (state.activeLearnCategory === 'all' || item.category === state.activeLearnCategory);
      return matchCat;
    });

    learnGrid.innerHTML = filtered.map(item => `
      <div class="learn-card">
        <img src="${item.thumbnail}" alt="${item.title}" class="learn-thumb" loading="lazy" />
        <div class="learn-card-body">
          <div class="learn-card-meta">
            <span><i class="bi bi-person"></i> ${item.author}</span>
            <span><i class="bi bi-clock"></i> ${item.readTime}</span>
          </div>
          <h3 class="learn-card-title">${item.title}</h3>
          <p class="learn-card-desc">${item.summary}</p>
          <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-color);">
            <button class="btn btn-secondary" style="width: 100%; font-size: 0.85rem;" data-open-tutorial="${item.id}">
              <i class="bi bi-code-square"></i> Open Tutorial & Code
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Render Project Ideas
    if (ideasGrid) {
      ideasGrid.innerHTML = BUILDIFY_DATA.projectIdeas.map(idea => `
        <div class="idea-card">
          <div class="idea-domain">${idea.domain} • <span class="tag-badge diff-${idea.difficulty}">${idea.difficulty}</span></div>
          <h4 class="idea-title">${idea.title}</h4>
          <p class="idea-desc">${idea.description}</p>
          <div class="idea-components">
            ${idea.components.map(c => `<span class="tag-badge"><i class="bi bi-cpu"></i> ${c}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    // Attach listeners
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeLearnCategory = btn.dataset.cat;
        renderLearn();
      });
    });

    learnGrid.querySelectorAll('[data-open-tutorial]').forEach(btn => {
      btn.addEventListener('click', () => {
        openTutorialModal(btn.dataset.openTutorial);
      });
    });
  }

  // ==========================================================================
  // ABOUT & TEAM SECTION LOGIC
  // ==========================================================================
  function renderAbout() {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;

    teamGrid.innerHTML = BUILDIFY_DATA.company.team.map(member => `
      <div class="team-card">
        <img src="${member.avatar}" alt="${member.name}" class="team-avatar" />
        <h3 class="team-name">${member.name}</h3>
        <div class="team-role">${member.role}</div>
        <p class="team-bio">${member.bio}</p>
        <div style="margin-top: 1rem;">
          <span class="tag-badge" style="color: var(--accent-cyan); border-color: var(--border-glow);">${member.badge}</span>
        </div>
      </div>
    `).join('');
  }

  // ==========================================================================
  // MODALS SYSTEM
  // ==========================================================================
  function openModal(htmlContent) {
    if (!modalBackdrop || !modalContainer) return;
    modalContainer.innerHTML = htmlContent;
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hook up copy buttons
    modalContainer.querySelectorAll('[data-copy-code]').forEach(btn => {
      btn.addEventListener('click', () => {
        const codeText = btn.getAttribute('data-copy-code');
        navigator.clipboard.writeText(codeText).then(() => {
          showToast('Code copied to clipboard!', 'bi-clipboard-check');
        });
      });
    });
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Product Quick-View Modal
  function openProductModal(productId) {
    const p = BUILDIFY_DATA.products.find(item => item.id === productId);
    if (!p) return;

    const specsRows = Object.entries(p.specs).map(([key, val]) => `
      <tr>
        <td>${key}</td>
        <td style="color: var(--text-muted);">${val}</td>
      </tr>
    `).join('');

    const html = `
      <div class="modal-content-inner">
        <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem;">
          <div>
            <img src="${p.image}" alt="${p.name}" style="width: 100%; border-radius: var(--radius-md); border: 1px solid var(--border-color);" />
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(0, 240, 255, 0.04); border-radius: var(--radius-md); border: 1px solid var(--border-glow);">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">Pinout Overview</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">${p.pinoutSummary}</p>
            </div>
          </div>
          <div>
            <span class="product-category">${p.category}</span>
            <h2 style="font-size: 1.5rem; margin-top: 0.2rem; margin-bottom: 0.5rem;">${p.name}</h2>
            <div class="product-rating" style="margin-bottom: 1rem;">
              <i class="bi bi-star-fill"></i>
              <span>${p.rating}</span>
              <span class="product-reviews-count">(${p.reviewsCount} customer reviews)</span>
            </div>
            <div class="price-wrap" style="margin-bottom: 1.25rem;">
              <span class="price-current" style="font-size: 1.8rem;">$${p.price.toFixed(2)}</span>
              ${p.originalPrice ? `<span class="price-original" style="font-size: 1.1rem;">$${p.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">${p.description}</p>
            
            <h4 style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem;">Hardware Specifications</h4>
            <table class="tech-table">
              <tbody>${specsRows}</tbody>
            </table>

            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
              <button class="btn btn-primary" style="flex: 1;" onclick="window.BuildifyApp.addToCart('${p.id}');">
                <i class="bi bi-cart-plus"></i> Add to Cart ($${p.price.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    openModal(html);
  }

  // Project BOM & Code Modal
  function openProjectModal(projectId) {
    const proj = BUILDIFY_DATA.projects.find(p => p.id === projectId);
    if (!proj) return;

    const bomRows = (proj.bom || []).map(b => `
      <tr>
        <td>${b.name}</td>
        <td>${b.qty}x</td>
        <td style="font-family: var(--font-mono); color: var(--accent-cyan);">$${(b.cost * b.qty).toFixed(2)}</td>
      </tr>
    `).join('');

    const totalBomCost = (proj.bom || []).reduce((acc, curr) => acc + (curr.cost * curr.qty), 0);

    const html = `
      <div class="modal-content-inner">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <span class="tag-badge diff-${proj.difficulty}">${proj.difficulty}</span>
            <h2 style="font-size: 1.6rem; margin-top: 0.4rem;">${proj.title}</h2>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; color: var(--text-muted);">Est. Build Time</div>
            <div style="font-weight: 700; color: var(--accent-cyan);">${proj.time}</div>
          </div>
        </div>

        <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">${proj.summary}</p>

        <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="bi bi-list-check" style="color: var(--accent-cyan);"></i> Bill of Materials (BOM)
        </h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Quantity</th>
              <th>Estimated Cost</th>
            </tr>
          </thead>
          <tbody>${bomRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="font-weight: 700; text-align: right;">Total Kit Estimate:</td>
              <td style="font-weight: 800; color: var(--accent-cyan); font-family: var(--font-mono); font-size: 1.1rem;">
                $${totalBomCost.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div style="margin: 1.5rem 0;">
          <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="bi bi-stars" style="color: var(--accent-purple);"></i> Key Project Highlights
          </h3>
          <ul style="list-style: square; padding-left: 1.25rem; color: var(--text-muted); font-size: 0.9rem; line-height: 1.7;">
            ${(proj.features || []).map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        ${proj.codeSnippet ? `
          <div class="code-box-wrap">
            <div class="code-box-header">
              <span><i class="bi bi-file-code"></i> Main Firmware Preview</span>
              <button class="copy-code-btn" data-copy-code="${encodeURIComponent(proj.codeSnippet)}">
                <i class="bi bi-clipboard"></i> Copy Code
              </button>
            </div>
            <pre class="code-snippet">${escapeHtml(proj.codeSnippet)}</pre>
          </div>
        ` : ''}

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <button class="btn btn-primary" style="flex: 1;" onclick="window.BuildifyApp.orderCustomBuild('${proj.title}');">
            <i class="bi bi-tools"></i> Request Assembled Kit / Custom Build
          </button>
        </div>
      </div>
    `;
    openModal(html);
  }

  // Tutorial Modal
  function openTutorialModal(tutorialId) {
    const item = BUILDIFY_DATA.learnContent.find(t => t.id === tutorialId);
    if (!item) return;

    const pinRows = (item.pinoutGuide || []).map(pin => `
      <tr>
        <td style="font-family: var(--font-mono); color: var(--accent-cyan);">${pin.pin}</td>
        <td>${pin.function}</td>
        <td style="color: var(--text-muted);">${pin.note}</td>
      </tr>
    `).join('');

    const html = `
      <div class="modal-content-inner">
        <span class="product-category">${item.category} • ${item.level}</span>
        <h2 style="font-size: 1.6rem; margin-top: 0.4rem; margin-bottom: 0.5rem;">${item.title}</h2>
        <div style="font-size: 0.85rem; color: var(--text-subtle); margin-bottom: 1.5rem;">
          By ${item.author} • ${item.readTime}
        </div>

        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.9rem; text-transform: uppercase; color: var(--accent-cyan); margin-bottom: 0.5rem;">Required Hardware</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${item.hardware.map(h => `<span class="tag-badge"><i class="bi bi-check-circle-fill" style="color: var(--accent-emerald);"></i> ${h}</span>`).join('')}
          </div>
        </div>

        <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--text-main);">Pinout & Wiring Scheme</h4>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Pin Identifier</th>
              <th>Function</th>
              <th>Wiring Note</th>
            </tr>
          </thead>
          <tbody>${pinRows}</tbody>
        </table>

        <div style="margin-top: 1.5rem; color: var(--text-muted); line-height: 1.7; font-size: 0.95rem;">
          ${item.fullContent.replace(/```cpp([\s\S]*?)```/g, (match, code) => `
            <div class="code-box-wrap">
              <div class="code-box-header">
                <span><i class="bi bi-filetype-cpp"></i> C++ / Arduino Source</span>
                <button class="copy-code-btn" data-copy-code="${encodeURIComponent(code.trim())}">
                  <i class="bi bi-clipboard"></i> Copy Code
                </button>
              </div>
              <pre class="code-snippet">${escapeHtml(code.trim())}</pre>
            </div>
          `).replace(/### (.*?)\n/g, '<h3 style="color: var(--text-main); margin: 1.5rem 0 0.5rem; font-size: 1.15rem;">$1</h3>')
            .replace(/#### (.*?)\n/g, '<h4 style="color: var(--accent-cyan); margin: 1.25rem 0 0.4rem; font-size: 1rem;">$1</h4>')}
        </div>
      </div>
    `;
    openModal(html);
  }

  // ==========================================================================
  // SHOPPING CART LOGIC
  // ==========================================================================
  function addToCart(productId, qty = 1) {
    const prod = BUILDIFY_DATA.products.find(p => p.id === productId);
    if (!prod) return;

    const existingIndex = state.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      state.cart[existingIndex].qty += qty;
    } else {
      state.cart.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        qty: qty
      });
    }

    saveCart();
    renderCart();
    showToast(`Added "${prod.name}" to cart!`, 'bi-cart-check');
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
  }

  function updateCartQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      renderCart();
    }
  }

  function saveCart() {
    localStorage.setItem('buildify_cart', JSON.stringify(state.cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const totalCount = state.cart.reduce((acc, curr) => acc + curr.qty, 0);
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }
  }

  function renderCart() {
    if (!cartItemsContainer) return;

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <i class="bi bi-cart-x cart-empty-icon"></i>
          <h4>Your Cart is Empty</h4>
          <p style="font-size: 0.85rem; margin-top: 0.4rem;">Explore our store to add microcontrollers, sensors, and robotics modules.</p>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
      if (cartTaxEl) cartTaxEl.textContent = '$0.00';
      if (cartTotalEl) cartTotalEl.textContent = '$0.00';
      return;
    }

    cartItemsContainer.innerHTML = state.cart.map(item => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="cart-qty-ctrl">
          <button class="cart-qty-btn" onclick="window.BuildifyApp.updateCartQty('${item.id}', -1)">-</button>
          <span class="cart-qty-val">${item.qty}</span>
          <button class="cart-qty-btn" onclick="window.BuildifyApp.updateCartQty('${item.id}', 1)">+</button>
        </div>
        <button class="cart-item-remove-btn" onclick="window.BuildifyApp.removeFromCart('${item.id}')">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    `).join('');

    const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTaxEl) cartTaxEl.textContent = `$${tax.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  function toggleCart(open = true) {
    if (!cartDrawerBackdrop) return;
    if (open) {
      renderCart();
      cartDrawerBackdrop.classList.add('active');
    } else {
      cartDrawerBackdrop.classList.remove('active');
    }
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => toggleCart(true));
  if (cartDrawerCloseBtn) cartDrawerCloseBtn.addEventListener('click', () => toggleCart(false));
  if (cartDrawerBackdrop) {
    cartDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === cartDrawerBackdrop) toggleCart(false);
    });
  }

  // Checkout Simulation
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('Your cart is empty! Add products first.', 'bi-exclamation-circle');
        return;
      }
      toggleCart(false);
      const totalCost = state.cart.reduce((acc, i) => acc + (i.price * i.qty), 0) * 1.08;
      const html = `
        <div class="modal-content-inner" style="text-align: center; padding: 3rem 2rem;">
          <i class="bi bi-check-circle-fill" style="font-size: 4rem; color: var(--accent-emerald);"></i>
          <h2 style="margin-top: 1rem; font-size: 1.8rem;">Order Confirmed!</h2>
          <p style="color: var(--text-muted); margin-top: 0.5rem;">
            Thank you for ordering with Buildify Solutions. Your hardware components are being packed for dispatch.
          </p>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; margin: 2rem 0; text-align: left;">
            <div style="font-weight: 700; margin-bottom: 0.5rem; color: var(--accent-cyan);">Order Invoice #BF-${Math.floor(100000 + Math.random() * 900000)}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Total Paid: <strong style="color: #fff;">$${totalCost.toFixed(2)}</strong></div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Estimated Delivery: 2-3 Business Days</div>
          </div>
          <button class="btn btn-primary" onclick="window.BuildifyApp.closeModal(); window.BuildifyApp.clearCart();">
            Continue Shopping
          </button>
        </div>
      `;
      openModal(html);
    });
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  function showToast(message, iconClass = 'bi-info-circle') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="bi ${iconClass}" style="color: var(--accent-cyan); font-size: 1.1rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Helper Escape HTML
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Custom Build Order Form Trigger
  function orderCustomBuild(projectTitle) {
    closeModal();
    switchTab('about');
    setTimeout(() => {
      const subjectInput = document.getElementById('contactSubject');
      const msgInput = document.getElementById('contactMessage');
      if (subjectInput) subjectInput.value = `Custom Build Inquiry: ${projectTitle}`;
      if (msgInput) msgInput.value = `Hello Buildify Engineering Team,\n\nI would like to request a quote and consultation for the "${projectTitle}" setup. Please let me know lead times and assembly options.`;
      const contactSection = document.getElementById('contactFormWrap');
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been sent to our engineering team.', 'bi-send-check');
      contactForm.reset();
    });
  }

  // Global Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      if (state.currentTab === 'store') renderStore();
      if (state.currentTab === 'projects') renderProjects();
    });
  }

  // Expose global methods for inline HTML events
  window.BuildifyApp = {
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart: () => {
      state.cart = [];
      saveCart();
      renderCart();
    },
    openProductModal,
    openProjectModal,
    openTutorialModal,
    orderCustomBuild,
    closeModal,
    switchTab
  };

  // Initial Boot
  updateCartBadge();
  switchTab('store');
});
