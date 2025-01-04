import { BookService } from '../js/BookService.js';

class BookList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = this.getInitialState();
    }

    getInitialState() {
        const params = new URLSearchParams(window.location.search);
        return {
            page: parseInt(params.get('page')) || 1,
            itemsPerPage: 10,
            filters: {
                search: params.get('search') || '',
                sort: params.get('sort') || 'price_asc',
                category: params.get('category') || 'all'
            },
            books: [],
            totalPages: 0,
            loading: false,
            error: null
        };
    }

    async connectedCallback() {
        this.state = this.getInitialState();
        await this.fetchBooks();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        // Cleanup for back/forward cache
        this.shadowRoot.removeEventListener('filter-change', this.handleFilterChange);
        this.shadowRoot.removeEventListener('page-change', this.handlePageChange);
    }

    setupEventListeners() {
        this.shadowRoot.addEventListener('filter-change', (e) => this.handleFilterChange(e.detail));
        this.shadowRoot.addEventListener('page-change', (e) => this.handlePageChange(e.detail.page));
    }

    async handleFilterChange(filters) {
        this.state = {
            ...this.state,
            page: 1,
            filters: { ...filters }
        };
        await this.fetchBooks();
    }

    async handlePageChange(page) {
        // Update URL with new page number
        const params = new URLSearchParams(window.location.search);
        params.set('page', page);
        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
        
        this.state.page = page;
        await this.fetchBooks();
    }

    async fetchBooks() {
        try {
            this.state.loading = true;
            this.render();

            const params = {
                page: this.state.page,
                limit: this.state.itemsPerPage,
                ...this.state.filters
            };

            const { books, totalPages } = await BookService.getBooks(params);
            
            this.state = {
                ...this.state,
                books,
                totalPages,
                loading: false,
                error: null
            };
        } catch (error) {
            this.state.error = 'Failed to load books';
            this.state.loading = false;
        } finally {
            this.render();
        }
    }

    getBookSummary(book) {
        return {
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            category: book.category,
            coverImage: book.coverImage
        };
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .book-grid {
                    display: grid;
                    width: 100%;
                    margin: 0 auto;
                }
                
                book-item {
                    max-width: 220px;
                    margin: 0 auto;
                    width: 100%;
                }

                /* Default (large screens) */
                @media (min-width: 1400px) {
                    .book-grid {
                        grid-template-columns: repeat(5, minmax(200px, 1fr));
                    }
                }
                /* Medium-large screens */
                @media (min-width: 1024px) and (max-width: 1399px) {
                    .book-grid {
                        grid-template-columns: repeat(3, minmax(200px, 1fr));
                    }
                }
                /* Medium screens */
                @media (min-width: 768px) and (max-width: 1023px) {
                    .book-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                /* Small screens */
                @media (max-width: 767px) {
                    .book-grid {
                        grid-template-columns: repeat(1, 1fr);
                    }
                }
                /* Extra-small screens */
                @media (max-width: 480px) {
                    .book-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .no-results {
                    text-align: center;
                    padding: 20px;
                    grid-column: 1 / -1;
                }
                .results-count {
                    padding: 10px 20px;
                    color: #666;
                    font-size: 0.9em;
                }
                .filters-active {
                    background: #e9ecef;
                    border-radius: 4px;
                    padding: 10px;
                    margin: 0 20px;
                }
                .clear-filters {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8em;
                    margin-left: 10px;
                }
                .loading { opacity: 0.5; }
                .error { color: red; padding: 20px; text-align: center; }
            </style>
            ${this.state.error ? `<div class="error">${this.state.error}</div>` : ''}
            <div class="${this.state.loading ? 'loading' : ''}">
                <search-filter
                    data-search="${this.state.filters.search}"
                    data-sort="${this.state.filters.sort}"
                    data-category="${this.state.filters.category}">
                </search-filter>
                <div class="results-count">
                    Нийт ${this.state.books.length} ном
                    ${this.hasActiveFilters() ? `
                        <button class="clear-filters" onclick="this.getRootNode().host.clearFilters()">
                            Шүүлтүүрийг цэвэрлэх
                        </button>
                    ` : ''}
                </div>
                <div class="book-grid">
                    ${this.state.books.length ? 
                        this.state.books.map(book => `
                            <book-item 
                                data-id="${book.id}"
                                data-title="${book.title}"
                                data-price="${book.price}"
                                data-author="${book.author}"
                                data-category="${book.category}"
                                data-image="${book.cover_image}">
                            </book-item>
                        `).join('')
                        : '<div class="no-results">Таны хайлтын дагуу ном олдсонгүй</div>'
                    }
                </div>
                <pagination-control
                    current-page="${this.state.page}"
                    total-pages="${this.state.totalPages}"
                    items-per-page="${this.state.itemsPerPage}">
                </pagination-control>
            </div>
        `;
    }

    preloadImages(books) {
        // Only preload first visible books
        const visibleBooks = books.slice(0, this.state.itemsPerPage);
        visibleBooks.forEach(book => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = book.coverImage;
            document.head.appendChild(link);
        });
    }

    hasActiveFilters() {
        return this.state.filters.search.trim() !== '' || 
               this.state.filters.category !== 'all';
    }

    clearFilters() {
        this.state.filters = {
            search: '',
            sort: 'none',
            category: 'all'
        };
        this.render();
        
        // Reset the search-filter component
        const searchFilter = this.shadowRoot.querySelector('search-filter');
        searchFilter.resetFilters();
    }
}

customElements.define('book-list', BookList);
