import { BookService } from '../js/services/BookService.js';

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
                    grid-template-columns: minmax(400px, 1fr) 2fr;
                    background: var(--card-bg);
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 40px;
                    justify-content: center;
                    gap: 60px;
                }
                .image-section {
                    top: 40px;
                    height: fit-content;
                }

                .book-image {
                    width: 100%;
                    height: auto;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }

                .info-section {
                    color: var(--text-color);
                    padding-right: 40px;
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
                    font-size: 2.5em;
                    margin: 0 0 10px 0;
                    color: var(--text-color);
                    line-height: 1.2;
                }

                .book-author {
                    font-size: 1.4em;
                    color: var(--secondary-color);
                    margin-bottom: 30px;
                }

                .book-price {
                    font-size: 2em;
                    color: var(--primary-color);
                    font-weight: bold;
                    margin: 30px 0;
                }

                .book-description {
                    font-size: 1.1em;
                    line-height: 1.8;
                    margin: 30px 0;
                    color: var(--text-color);
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin: 30px 0;
                    background: var(--bg-color);
                    padding: 20px;
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
                    background: var(--primary-color);
                    color: white;
                    flex: 1;
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
            </style>
            <div class="error-container">
                <h2 class="error-title">Book not found</h2>
                <p>Sorry, we couldn't find the book you're looking for.</p>
                <button class="back-button" onclick="window.history.back()">
                    Return to Book List
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
                    grid-template-columns: minmax(400px, 1fr) 2fr;
                    background: var(--card-bg);
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 40px;
                    justify-content: center;
                    gap: 60px;
                }
                .image-section {
                    top: 40px;
                    height: fit-content;
                }

                .book-image {
                    width: 100%;
                    height: auto;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }

                .info-section {
                    color: var(--text-color);
                    padding-right: 40px;
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
                    font-size: 2.5em;
                    margin: 0 0 10px 0;
                    color: var(--text-color);
                    line-height: 1.2;
                }

                .book-author {
                    font-size: 1.4em;
                    color: var(--secondary-color);
                    margin-bottom: 30px;
                }

                .book-price {
                    font-size: 2em;
                    color: var(--primary-color);
                    font-weight: bold;
                    margin: 30px 0;
                }

                .book-description {
                    font-size: 1.1em;
                    line-height: 1.8;
                    margin: 30px 0;
                    color: var(--text-color);
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin: 30px 0;
                    background: var(--bg-color);
                    padding: 20px;
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
                    background: var(--primary-color);
                    color: white;
                    flex: 1;
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
            </style>
            <div class="detail-container">
                <div class="image-section">
                    <img src="${book.coverImage}" alt="${book.title}" class="book-image">
                </div>
                <div class="info-section">
                    <span class="book-category">${book.category}</span>
                    <h1 class="book-title">${book.title}</h1>
                    <div class="book-author">by ${book.author}</div>
                    <div class="book-price">$${book.price}</div>
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
                            Add to Cart
                        </button>
                        <button class="action-button back-button" 
                                onclick="window.history.back()">
                            Back to Books
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