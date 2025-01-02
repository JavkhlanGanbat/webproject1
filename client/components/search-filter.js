class SearchFilter extends HTMLElement {
    static get observedAttributes() {
        return ['data-search', 'data-sort', 'data-category'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        
        // Initialize from URL params
        const params = new URLSearchParams(window.location.search);
        this.dataset.search = params.get('search') || '';
        this.dataset.sort = params.get('sort') || 'price_asc';
        this.dataset.category = params.get('category') || 'all';
        this.updateInputs();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot && oldValue !== newValue) {
            this.updateInputs();
        }
    }

    updateInputs() {
        if (!this.shadowRoot) return;
        
        const searchInput = this.shadowRoot.getElementById('search');
        const sortSelect = this.shadowRoot.getElementById('sort');
        const categorySelect = this.shadowRoot.getElementById('category');

        if (searchInput) searchInput.value = this.dataset.search || '';
        if (sortSelect) sortSelect.value = this.dataset.sort || 'price_asc';
        if (categorySelect) categorySelect.value = this.dataset.category || 'all';
    }

    addEventListeners() {
        const searchInput = this.shadowRoot.getElementById('search');
        const searchButton = this.shadowRoot.getElementById('searchButton');
        const sortSelect = this.shadowRoot.getElementById('sort');
        const categorySelect = this.shadowRoot.getElementById('category');

        // Handle search button click
        searchButton.addEventListener('click', () => this.emitFilterChange());
        
        // Handle enter key in search input
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.emitFilterChange();
            }
        });

        // Handle immediate changes for dropdowns
        sortSelect.addEventListener('change', () => this.emitFilterChange());
        categorySelect.addEventListener('change', () => this.emitFilterChange());
    }

    emitFilterChange() {
        const searchInput = this.shadowRoot.getElementById('search');
        const sortSelect = this.shadowRoot.getElementById('sort');
        const categorySelect = this.shadowRoot.getElementById('category');

        if (!searchInput || !sortSelect || !categorySelect) return;

        // Update URL with new parameters
        const params = new URLSearchParams(window.location.search);
        params.set('search', searchInput.value);
        params.set('sort', sortSelect.value);
        params.set('category', categorySelect.value);
        params.set('page', '1'); // Reset to first page on filter change

        // Update URL without reload
        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);

        // Dispatch filter change event
        this.dispatchEvent(new CustomEvent('filter-change', {
            bubbles: true,
            composed: true,
            detail: {
                search: searchInput.value,
                sort: sortSelect.value,
                category: categorySelect.value
            }
        }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .controls {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    display: grid;
                    gap: 10px;
                }
                .search-group {
                    display: flex;
                    gap: 8px;
                }
                input, select {
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                #search {
                    flex-grow: 1;
                }
                #searchButton {
                    padding: 8px 16px;
                    background: var(--primary-color, #007bff);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                #searchButton:hover {
                    background: var(--primary-color-dark, #0056b3);
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                }
            </style>
            <div class="controls">
                <div>
                    <label for="search">Search Books:</label>
                    <div class="search-group">
                        <input type="text" id="search" 
                               value="${this.dataset.search || ''}" 
                               placeholder="Search by title or author...">
                        <button id="searchButton">Search</button>
                    </div>
                </div>
                <div>
                    <label for="sort">Sort By:</label>
                    <select id="sort">
                        <option value="price_asc" ${this.dataset.sort === 'price_asc' ? 'selected' : ''}>
                            Price (Low to High)
                        </option>
                        <option value="price_desc" ${this.dataset.sort === 'price_desc' ? 'selected' : ''}>
                            Price (High to Low)
                        </option>
                    </select>
                </div>
                <div>
                    <label for="category">Category:</label>
                    <select id="category">
                        <option value="all" ${this.dataset.category === 'all' ? 'selected' : ''}>
                            All Categories
                        </option>
                        <option value="Fiction" ${this.dataset.category === 'Fiction' ? 'selected' : ''}>
                            Fiction
                        </option>
                        <option value="Science Fiction" ${this.dataset.category === 'Science Fiction' ? 'selected' : ''}>
                            Science Fiction
                        </option>
                        <option value="Romance" ${this.dataset.category === 'Romance' ? 'selected' : ''}>
                            Romance
                        </option>
                        <option value="Non-Fiction" ${this.dataset.category === 'Non-Fiction' ? 'selected' : ''}>
                            Non-Fiction
                        </option>
                    </select>
                </div>
            </div>
        `;
        
        this.addEventListeners();
    }

    resetFilters() {
        if (!this.shadowRoot) return;
        
        const searchInput = this.shadowRoot.getElementById('search');
        const sortSelect = this.shadowRoot.getElementById('sort');
        const categorySelect = this.shadowRoot.getElementById('category');

        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'price_asc';  // Changed default
        if (categorySelect) categorySelect.value = 'all';

        this.emitFilterChange();
    }
}

customElements.define('search-filter', SearchFilter);
