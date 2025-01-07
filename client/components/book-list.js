/**
 * BookList компонент
 * Энэхүү компонент нь номын жагсаалтыг харуулах үндсэн компонент юм.
 * - Номын жагсаалтыг серверээс татаж авах
 * - Хуудаслалт хийх
 * - Шүүлтүүр хийх
 * - Эрэмбэлэх зэрэг үндсэн үйлдлүүдийг гүйцэтгэнэ
 */
import { BookService } from '../js/BookService.js';

class BookList extends HTMLElement {
    constructor() {
        super();
        // Компонент үүсэх үед shadow DOM болон state-г бэлтгэнэ
        // Shadow DOM ашиглан компонентын дотоод бүтцийг тусгаарлана
        this.attachShadow({ mode: 'open' });
        // Анхны төлөвийг тохируулах
        this.state = this.getInitialState();
    }

    // Анхны төлөвийг URL-с уншиж авах
    getInitialState() {
        // URL params-оос эхлэх төлөвийг уншиж, буцаана
        const params = new URLSearchParams(window.location.search);
        return {
            page: parseInt(params.get('page')) || 1,        // Идэвхтэй хуудас
            itemsPerPage: 10,                              // Нэг хуудсанд харуулах номын тоо
            filters: {
                search: params.get('search') || '',        // Хайлтын утга
                sort: params.get('sort') || 'price_asc',   // Эрэмбэлэх утга
                category: params.get('category') || 'all'   // Ангилал
            },
            books: [],          // Номын жагсаалт
            totalPages: 0,      // Нийт хуудасны тоо
            error: null         // Алдааны мэдээлэл
        };
    }

    // Компонент DOM-д холбогдох үед дуудагдах функц
    async connectedCallback() {
        // Компонент DOM-т холбогдох үед дуудна. Энд номын жагсаалтыг эхлэн татаж, event listener-үүдийг тогтооно
        this.state = this.getInitialState();
        await this.fetchBooks();
        this.setupEventListeners();
    }

    // DOM-с салгах үед цэвэрлэгч функц
    disconnectedCallback() {
        // Cleanup for back/forward cache
        this.shadowRoot.removeEventListener('filter-change', this.handleFilterChange);
        this.shadowRoot.removeEventListener('page-change', this.handlePageChange);
    }

    // Үйл явдал сонсогчдыг тохируулах
    setupEventListeners() {
        // Шүүлтүүр болон хуудсын өөрчлөлтийн event listener-үүдийг нэмнэ
        // Шүүлтүүр өөрчлөгдөх үед
        this.shadowRoot.addEventListener('filter-change', (e) => this.handleFilterChange(e.detail));
        // Хуудас сонгох үед
        this.shadowRoot.addEventListener('page-change', (e) => this.handlePageChange(e.detail.page));
    }

    // Шүүлтүүр өөрчлөгдөх үед дуудагдах функц
    async handleFilterChange(filters) {
        // Шүүлтүүрийн утгуудыг state-д хадгалж, номын жагсаалтыг сэргээж татна
        this.state = {
            ...this.state,
            page: 1,
            filters: { ...filters }
        };
        await this.fetchBooks();
    }

    // Хуудас өөрчлөгдөх үед дуудагдах функц
    async handlePageChange(page) {
        // Хуудасны дугаар өөрчлөгдөх үед URL-д шинэчлэх ба номыг дахин татна
        // Update URL with new page number
        const params = new URLSearchParams(window.location.search);
        params.set('page', page);
        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
        
        this.state.page = page;
        await this.fetchBooks();
    }

    // Серверээс номын жагсаалт татах
    async fetchBooks() {
        // BookService-ээс номын мэдээлэл татах ба state-ийн утгаа шинэчилнэ
        try {
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
                error: null
            };
        } catch (error) {
            this.state.error = 'Failed to load books';
        } finally {
            this.render();
        }
    }

    // Номын товч мэдээллийг боловсруулах
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

    // Компонентыг дүрслэх функц
    render() {
        // Номын жагсаалт болон бусад UI элементүүдийг дүрслэх
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
                .error { color: red; padding: 20px; text-align: center; }
            </style>
            ${this.state.error ? `<div class="error">${this.state.error}</div>` : ''}
            <div>
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

    // Зургуудыг урьдчилан ачаалах
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

    // Идэвхтэй шүүлтүүр байгаа эсэхийг шалгах
    hasActiveFilters() {
        // Одоогоор идэвхтэй шүүлтүүр байгаа эсэхийг шалгаж true/false буцаана
        return this.state.filters.search.trim() !== '' || 
               this.state.filters.category !== 'all';
    }

    // Бүх шүүлтүүрийг цэвэрлэх
    clearFilters() {
        // Бүх шүүлтүүрийг reset хийж, search-filter компонентод мэдэгдэнэ
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
