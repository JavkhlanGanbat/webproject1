import { BookService } from '../js/bookService.js';

class BookDetail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.book = null;
    }

    async connectedCallback() {
        const params = new URLSearchParams(window.location.search);
        const bookId = params.get('id');
        await this.loadBook(bookId);
    }

    async loadBook(bookId) {
        try {
            if (!bookId) {
                this.renderError();
                return;
            }

            this.book = await BookService.getBookById(bookId);
            if (!this.book) {
                this.renderError();
                return;
            }

            // Dispatch event for page title update
            this.dispatchEvent(new CustomEvent('bookloaded', {
                bubbles: true,
                composed: true,
                detail: { title: this.book.title }
            }));

            this.render();
        } catch (error) {
            console.error('Error loading book:', error);
            this.renderError();
        }
    }

    setBookData(bookData) {
        this.book = bookData;
        this.render();
    }

    renderError() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .detail-container {
                    display: grid;
                    grid-template-columns: minmax(min(400px, 100%), 1fr) 2fr;
                    padding: clamp(1rem, 5vw, 2.5rem);
                    gap: clamp(1rem, 3vw, 3.75rem);
                }
                .image-section {
                    top: 40px;
                    height: fit-content;
                    aspect-ratio: 3/4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .book-image {
                    width: 100%;
                    height: 100%;
                    max-height: min(80vh, 600px);
                    min-height: 300px;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }

                .info-section {
                    color: var(--text-color);
                    padding-right: clamp(1rem, 3vw, 2.5rem);
                }

                .book-category {
                    display: inline-block;
                    padding: 8px 16px;
                    background: var(--secondary-color);
                    color: white;
                    border-radius: 20px;
                    font-size: 0.9em;
                    margin-bottom: 20px;
                }

                .book-title {
                    font-size: clamp(1.5rem, 4vw, 2.5rem);
                    margin: 0 0 10px 0;
                    color: var(--text-color);
                    line-height: 1.2;
                }

                .book-author {
                    font-size: clamp(1rem, 2vw, 1.4rem);
                    color: var(--secondary-color);
                    margin-bottom: 30px;
                }

                .book-price {
                    font-size: clamp(1.5rem, 3vw, 2rem);
                    color: var(--primary-color);
                    font-weight: bold;
                    margin: 30px 0;
                }

                .book-description {
                    font-size: clamp(0.875rem, 1.5vw, 1.1rem);
                    line-height: 1.8;
                    margin: 30px 0;
                    color: var(--text-color);
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: clamp(0.5rem, 2vw, 1.25rem);
                    margin: 30px 0;
                    background: var(--bg-color);
                    padding: clamp(0.75rem, 2vw, 1.25rem);
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                }

                .detail-item {
                    padding: 15px;
                    background: var(--card-bg);
                }

                .detail-label {
                    font-weight: bold;
                    color: var(--secondary-color);
                    display: block;
                    margin-bottom: 5px;
                    font-size: 0.9em;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .detail-value {
                    font-size: 1.1em;
                    color: var(--text-color);
                }

                .action-buttons {
                    display: flex;
                    gap: 15px;
                    margin-top: 40px;
                }

                .action-button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 0.9em;
                    transition: all 0.2s ease;
                }

                .action-button:hover {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                .add-to-cart {
                    background: var(--secondary-color);
                    color: white;
                    flex: 2;
                }

                .back-button {
                    background: var(--primary-color, #007bff); /* Default to primary color if variable not set */
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 0.9em;
                    transition: background 0.3s ease, transform 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .back-button:hover {
                    background: var(--primary-color-dark, #0056b3);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                }

                .back-button:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                @media (max-width: 1024px) {
                    .detail-container {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }

                    .image-section {
                        position: static;
                        max-width: 500px;
                        margin: 0 auto;
                    }

                    .info-section {
                        padding-right: 0;
                    }
                }

                @media (max-width: 768px) {
                    :host {
                        padding: 20px;
                    }

                    .detail-container {
                        padding: 20px;
                    }

                    .details-grid {
                        grid-template-columns: 1fr;
                    }

                    .book-title {
                        font-size: 2em;
                    } 
                }

                @media (orientation: landscape) and (max-width: 1024px) {
                    .image-section {
                        aspect-ratio: 4/3;
                        max-height: 70vh;
                    }
                    
                    .book-image {
                        max-height: 70vh;
                        width: auto;
                        max-width: 100%;
                    }
                }
            </style>
            <div class="error-container">
                <h2 class="error-title">404</h2>
                <p>Уучлаарай. Таны хайсан ном олдсонгүй.</p>
                <button class="back-button" onclick="window.history.back()">
                    Буцах
                </button>
            </div>
        `;
    }

    render() {
        if (!this.book) return;

        const book = {
            title: this.book.title,
            author: this.book.author,
            price: this.book.price,
            category: this.book.category,
            description: this.book.description || 'No description available.',
            isbn: this.book.isbn || 'N/A',
            publisher: this.book.publisher || 'N/A',
            publishDate: this.book.publish_date || 'N/A',
            pages: this.book.pages || 'N/A',
            language: this.book.language || 'N/A',
            format: this.book.format || 'Paperback',
            coverImage: this.book.cover_image
        };

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .detail-container {
                    display: grid;
                    grid-template-columns: minmax(min(400px, 100%), 1fr) 2fr;
                    padding: clamp(1rem, 3vw, 2.5rem);
                    gap: clamp(1rem, 5vw, 3.75rem);
                }
                .image-section {
                    top: 40px;
                    height: fit-content;
                    aspect-ratio: 3/4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .book-image {
                    width: 100%;
                    height: 100%;
                    max-height: min(80vh, 600px);
                    min-height: 500px;
                    object-fit: cover;
                    border-radius: 8px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }

                .info-section {
                    color: var(--text-color);
                    padding-right: clamp(1rem, 3vw, 2.5rem);
                }

                .book-category {
                    display: inline-block;
                    padding: 8px 16px;
                    background: var(--secondary-color);
                    color: white;
                    border-radius: 20px;
                    font-size: 0.9em;
                    margin-bottom: 20px;
                }

                .book-title {
                    font-size: clamp(1.5rem, 4vw, 2.5rem);
                    margin: 0 0 10px 0;
                    color: var(--text-color);
                    line-height: 1.2;
                }

                .book-author {
                    font-size: clamp(1rem, 2vw, 1.4rem);
                    color: var(--secondary-color);
                    margin-bottom: 30px;
                }

                .book-price {
                    font-size: clamp(1.5rem, 3vw, 2rem);
                    color: var(--primary-color);
                    font-weight: bold;
                    margin: 30px 0;
                }

                .book-description {
                    font-size: clamp(0.875rem, 1.5vw, 1.1rem);
                    line-height: 1.8;
                    margin: 30px 0;
                    color: var(--text-color);
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: clamp(0.5rem, 2vw, 1.25rem);
                    margin: 30px 0;
                    background: var(--bg-color);
                    padding: clamp(0.75rem, 2vw, 1.25rem);
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                }

                .detail-item {
                    padding: 15px;
                    background: var(--card-bg);
                }

                .detail-label {
                    font-weight: bold;
                    color: var(--secondary-color);
                    display: block;
                    margin-bottom: 5px;
                    font-size: 0.9em;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .detail-value {
                    font-size: 1.1em;
                    color: var(--text-color);
                }

                .action-buttons {
                    display: flex;
                    gap: 15px;
                    margin-top: 40px;
                }

                .action-button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 0.9em;
                    transition: all 0.2s ease;
                }

                .action-button:hover {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                .add-to-cart {
                    background: var(--secondary-color);
                    color: white;
                    flex: 2;
                }

                .back-button {
                    background: var(--primary-color, #007bff); /* Default to primary color if variable not set */
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 0.9em;
                    transition: background 0.3s ease, transform 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .back-button:hover {
                    background: var(--primary-color-dark, #0056b3);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                }

                .back-button:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                @media (max-width: 1024px) {
                    .detail-container {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }

                    .image-section {
                        position: static;
                        max-width: 500px;
                        margin: 0 auto;
                    }

                    .info-section {
                        padding-right: 0;
                    }
                }

                @media (max-width: 768px) {
                    :host {
                        padding: 20px;
                    }

                    .detail-container {
                        padding: 20px;
                    }

                    .details-grid {
                        grid-template-columns: 1fr;
                    }

                    .book-title {
                        font-size: 2em;
                    } 
                }

                @media (orientation: landscape) and (max-width: 1024px) {
                    .image-section {
                        aspect-ratio: 4/3;
                        max-height: 70vh;
                    }
                    
                    .book-image {
                        max-height: 70vh;
                        width: auto;
                        max-width: 100%;
                    }
                }
            </style>
    <div class="detail-container">
        <div class="image-section">
            <img src="${book.coverImage}" alt="${book.title}" class="book-image">
        </div>
        <div class="info-section">
            <span class="book-category">${book.category}</span>
            <h1 class="book-title">${book.title}</h1>
            <div class="book-author">Зохиогч: ${book.author}</div>
            <div class="book-price">Үнэ: ₮${book.price}</div>
            <p class="book-description">${book.description}</p>
            
            <div class="details-grid">
                ${Object.entries({
                    ISBN: book.isbn,
                    Published: book.publishDate,
                    Pages: book.pages,
                    Language: book.language,
                    Publisher: book.publisher,
                    Format: book.format
                }).map(([label, value]) => `
                    <div class="detail-item">
                        <span class="detail-label">${label}:</span>
                        <span class="detail-value">${value}</span>
                    </div>
                `).join('')}
            </div>

            <div class="action-buttons">
                <button class="action-button add-to-cart" 
                        onclick="this.getRootNode().host.addToCart()">
                    Сагслах
                </button>
                <button class="action-button back-button" 
                        onclick="window.history.back()">
                    Буцах
                </button>
            </div>
        </div>
    </div>
        `;
    }

    addToCart() {
        if (!this.book) return;
        
        const bookData = {
            id: this.book.id,
            title: this.book.title,
            price: this.book.price
        };

        this.dispatchEvent(new CustomEvent('add-to-cart', {
            bubbles: true,
            composed: true,
            detail: bookData
        }));
    }
}

customElements.define('book-detail', BookDetail);
