/**
 * SearchFilter компонент
 * Номын жагсаалтыг шүүх, эрэмбэлэх удирдлагын компонент
 * - Хайлтын талбар
 * - Үнээр эрэмбэлэх сонголт
 * - Ангиллаар шүүх сонголт
 * - URL параметрүүдтэй синхрончлогдоно
 */

class SearchFilter extends HTMLElement {
 
    constructor() {
        // Компонент үүсэх үед shadow DOM -г идэвхжүүлж, эхний төлөвийг үүсгэнэ
        super();
        this.attachShadow({ mode: 'open' });
    }

    updateInput(id, value) {
        // Энэ функц нь shadow DOM дээрх input элементийн утгыг шинэчилж, dataset-д хадгална
        if (this.shadowRoot) {
            const element = this.shadowRoot.getElementById(id);
            if (element) {
                element.value = value;
                this.dataset[id] = value;
            }
        }
    }

    // URL параметрүүдээс анхны утгуудыг унших
    connectedCallback() {
        // Компонент DOM-д холбогдох үед дуудагдах ба display-ийн бүтцийг үүсгэж, анхны утгуудыг URL-с уншина
        this.render();
        this.addEventListeners();
        
        // Initialize from URL params
        const params = new URLSearchParams(window.location.search);
        this.dataset.search = params.get('search') || '';
        this.dataset.sort = params.get('sort') || 'price_asc';
        this.dataset.category = params.get('category') || 'all';
        this.updateInputs();
    }

    // Шинж чанар өөрчлөгдөх үед дуудагдах
    attributeChangedCallback(name, oldValue, newValue) {
        // Ажиглагдсан шинж чанарын утга өөрчлөгдөх үед энэ функц дуудагдана
        if (oldValue === newValue) return;
        
        const attr = name.replace('data-', '');
        if (attr === 'search') this.searchValue = newValue;
        else if (attr === 'sort') this.sortValue = newValue;
        else if (attr === 'category') this.updateInput('category', newValue);
    }

    // Оролтын утгуудыг шинэчлэх
    updateInputs() {
        // Хэрэглэгчийн dataset-д суурилан input болон select-ийн утгуудыг шинэчилнэ
        if (!this.shadowRoot) return;
        
        const searchInput = this.shadowRoot.getElementById('search');
        const sortSelect = this.shadowRoot.getElementById('sort');
        const categorySelect = this.shadowRoot.getElementById('category');

        if (searchInput) searchInput.value = this.dataset.search || '';
        if (sortSelect) sortSelect.value = this.dataset.sort || 'price_asc';
        if (categorySelect) categorySelect.value = this.dataset.category || 'all';
    }

    // Үйл явдал сонсогчдыг тохируулах
    addEventListeners() {
        // Оролтын талбар, товч, сонголтууд дээр listener-үүдийг нэмэх
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

    // Шүүлтүүр өөрчлөгдөх үед дуудагдах
    emitFilterChange() {
        // Шүүлтүүрийн утгуудыг аван URL-г шинэчилж filter-change эвентыг дуудагчид мэдэгдэнэ
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

    // Компонентыг дүрслэх
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .controls {
                    background: var(--search-bg);
                    color: var(--text-color);
                    box-shadow: 0 2px 4px var(--book-card-shadow);
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
                    background: var(--card-bg);
                    color: var(--text-color);
                    border: 1px solid var(--border-color);
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                input::placeholder {
                    color: var(--text-muted);
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
                    color: var(--text-color);
                    display: block;
                    margin-bottom: 5px;
                }
            </style>
            <div class="controls">
                <div>
                    <label for="search">Хайх:</label>
                    <div class="search-group">
                        <input type="text" id="search" 
                               value="${this.dataset.search || ''}" 
                               placeholder="Гарчиг/Зохиолчоор хайх...">
                        <button id="searchButton">Хайх</button>
                    </div>
                </div>
                <div>
                    <label for="sort">Эрэмбэлэх:</label>
                    <select id="sort">
                        <option value="price_asc" ${this.dataset.sort === 'price_asc' ? 'selected' : ''}>
                            Үнэ (Багаас их)
                        </option>
                        <option value="price_desc" ${this.dataset.sort === 'price_desc' ? 'selected' : ''}>
                            Үнэ (Ихээс бага)
                        </option>
                    </select>
                </div>
                <div>
                    <label for="category">Category:</label>
                    <select id="category">
                        <option value="all" ${this.dataset.category === 'all' ? 'selected' : ''}>
                            Бүгд
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

    // Шүүлтүүрүүдийг дахин тохируулах
    resetFilters() {
        // Бүх шүүлтүүрийг анхны төлөвт оруулж, үр дүнг дахин ачаална
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
