import { BookService } from '../js/bookService.js';
import './modal-dialog.js';

const managerTemplate = document.createElement('template');
managerTemplate.innerHTML = `
    <style>
        .book-manager {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
            color: var(--text-color);
        }
        .error {
            color: #ff3333;
            padding: 10px;
            margin: 10px 0;
            background: var(--card-bg);
            border: 1px solid #ff3333;
            border-radius: 4px;
        }
        .book-grid {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 20px;
        }
        .book-item {
            background: var(--card-bg);
            color: var(--text-color);
            padding: 12px 16px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            box-shadow: 0 2px 4px var(--book-card-shadow);
            display: grid;
            grid-template-columns: minmax(200px, 2fr) minmax(80px, 1fr) minmax(100px, 1fr) 140px;
            align-items: center;
            gap: 16px;
            transition: all 0.2s ease;
        }
        .book-item:hover {
            box-shadow: 0 4px 8px var(--book-card-shadow);
            transform: translateY(-1px);
        }
        .book-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
        }
        .book-info h3 {
            margin: 0;
            font-size: 1rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .book-info p {
            margin: 0;
            font-size: 0.9rem;
            color: var(--text-muted);
        }
        .actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }
        .actions button {
            padding: 6px 12px;
            font-size: 0.9rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 60px;
        }
        .edit-btn {
            background: var(--primary-color);
            color: white;
            opacity: 0.9;
        }
        .edit-btn:hover {
            opacity: 1;
        }
        .delete-btn {
            background: #dc3545;
            color: white;
            opacity: 0.9;
        }
        .delete-btn:hover {
            opacity: 1;
        }
        @media (max-width: 768px) {
            .book-item {
                grid-template-columns: 1fr auto;
                grid-template-rows: auto auto;
                gap: 8px;
                padding: 12px;
            }
            .book-info {
                grid-column: 1 / -1;
            }
            .actions {
                grid-column: 1 / -1;
                justify-content: flex-start;
            }
        }
        @media (max-width: 480px) {
            .book-manager {
                padding: 10px;
            }
            .actions button {
                flex: 1;
                padding: 8px;
            }
        }
        .add-btn {
            background: var(--secondary-color);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
        }
        .cancel-btn {
            background: #ffc107;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
        }
        .cancel-btn:hover {
            background: #e0a800;
        }
        .add-form {
            background: white;
            width: 100%;
            height: 70vh;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        }
        .form-header {
            padding: 20px;
            background: var(--card-bg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0;
        }
        .form-content {
            padding: 20px;
            background: var(--card-bg);
            overflow-y: auto;
            overflow-x: hidden;
            flex: 1;
        }
        .form-content::-webkit-scrollbar {
            width: 8px;
        }
        .form-content::-webkit-scrollbar-track {
            background: var(--bg-color);
        }
        .form-content::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }
        .form-content::-webkit-scrollbar-thumb:hover {
            background: var(--text-muted);
        }
        .form-actions {
            padding: 15px 20px;
            background: var(--card-bg);
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 10px;
            margin: 0;
        }
        .form-group {
            margin-bottom: 15px;
            box-sizing: border-box;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
        }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 8px;
            background: var(--bg-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            box-sizing: border-box;
        }
        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
        }

    </style>
    <div class="book-manager">
        <h2>Админ хуудас</h2>
        <button class="add-btn" onclick="this.getRootNode().host.toggleForm()">
            Ном нэмэх
        </button>
        
        <slot name="error"></slot>
        <slot name="modal"></slot>
        <div class="book-grid">
            <slot name="books"></slot>
        </div>
    </div>

    <template id="book-item-template">
        <div class="book-item">
            <div class="book-info">
                <h3><slot name="title"></slot></h3>
                <p><slot name="author"></slot></p>
            </div>
            <div><slot name="price"></slot></div>
            <div><slot name="category"></slot></div>
            <div class="actions">
                <button class="edit-btn">Засах</button>
                <button class="delete-btn">Устгах</button>
            </div>
        </div>
    </template>

    <template id="book-form-template">
        <form class="add-form">
            <div class="form-content">
                <slot name="form-fields"></slot>
            </div>
            <div class="form-actions">
                <slot name="form-actions"></slot>
            </div>
        </form>
    </template>
`;

class BookManager extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            books: [],
            showForm: false,
            editingBook: null, // New state for tracking editing book
            error: null
        };
        this.handleModalClose = this.handleModalClose.bind(this);
    }

    async connectedCallback() {
        await this.fetchBooks();
        this.render();
    }

    async fetchBooks() {
        const { books } = await BookService.getBooks();
        this.state.books = books;
        this.render();
    }

    async addBook(book) {
        // Implement add book logic
        await this.fetchBooks();
    }

    async editBook(bookId) {
        try {
            const book = await BookService.getBookById(bookId);
            this.state.editingBook = book;
            this.state.showForm = true;
            this.render();
        } catch (error) {
            this.state.error = `Error loading book: ${error.message}`;
            this.render();
        }
    }

    async deleteBook(bookId) {
        // Implement delete book logic
        await this.fetchBooks();
    }

    toggleForm() {
        this.state.showForm = !this.state.showForm;
        if (!this.state.showForm) {
            this.state.editingBook = null;
        }
        this.render();
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        try {
            const bookData = {
                title: formData.get('title'),
                author: formData.get('author'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                isbn: formData.get('isbn'),
                publish_date: formData.get('publish_date'),
                publisher: formData.get('publisher'),
                language: formData.get('language'),
                pages: parseInt(formData.get('pages')) || null,
                format: formData.get('format'),
                description: formData.get('description'),
                cover_image: formData.get('cover_image'),
                rating: parseFloat(formData.get('rating')) || null,
                reviews: parseInt(formData.get('reviews')) || 0,
                in_stock: formData.get('in_stock') === 'true'
            };

            if (this.state.editingBook) {
                await BookService.updateBook(this.state.editingBook.id, bookData);
                console.log('Book updated successfully');
            } else {
                await BookService.addBook(bookData);
                console.log('Book added successfully');
            }

            this.state.showForm = false;
            this.state.editingBook = null;
            this.state.error = null;
            await this.fetchBooks();
        } catch (error) {
            console.error('Form submission error:', error);
            this.state.error = error.message;
        }
        this.render();
    }

    async handleDeleteBook(bookId) {
        if (!confirm('Are you sure you want to delete this book?')) {
            return;
        }

        try {
            await BookService.deleteBook(bookId);
            await this.fetchBooks();
        } catch (error) {
            this.state.error = error.message;
            this.render();
        }
    }

    handleModalClose() {
        this.state.showForm = false;
        this.state.editingBook = null;
        this.render();
    }

    getFormTemplate(book) {
        return `
            <form class="add-form" onsubmit="this.getRootNode().host.handleFormSubmit(event)">
                <div class="form-content">
                    <div class="form-group">
                        <label for="title">Гарчиг *</label>
                        <input type="text" name="title" required 
                            value="${book?.title || ''}">
                    </div>
                    <div class="form-group">
                        <label for="author">Зохиолч *</label>
                        <input type="text" name="author" required 
                            value="${book?.author || ''}">
                    </div>
                    <div class="form-group">
                        <label for="price">Үнэ *</label>
                        <input type="number" name="price" step="0.01" required 
                            value="${book?.price || ''}">
                    </div>
                    <div class="form-group">
                        <label for="category">Ангилал *</label>
                        <select name="category" required>
                            ${['fiction', 'non-fiction', 'science', 'technology']
                                .map(cat => `<option value="${cat}" 
                                    ${book?.category === cat ? 'selected' : ''}>
                                    ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="isbn">ISBN *</label>
                        <input type="text" name="isbn" required 
                            value="${book?.isbn || ''}">
                    </div>
                    <div class="form-group">
                        <label for="publish_date">Хэвлэгдсэн огноо</label>
                        <input type="date" name="publish_date" 
                            value="${book?.publish_date || ''}">
                    </div>
                    <div class="form-group">
                        <label for="publisher">Хэвлэх газар</label>
                        <input type="text" name="publisher" 
                            value="${book?.publisher || ''}">
                    </div>
                    <div class="form-group">
                        <label for="language">Хэл</label>
                        <input type="text" name="language" 
                            value="${book?.language || ''}">
                    </div>
                    <div class="form-group">
                        <label for="pages">Хуудас</label>
                        <input type="number" name="pages" min="1" 
                            value="${book?.pages || ''}">
                    </div>
                    <div class="form-group">
                        <label for="format">Формат</label>
                        <select name="format">
                            ${['hardcover', 'paperback', 'ebook', 'audiobook']
                                .map(format => `<option value="${format}" 
                                    ${book?.format === format ? 'selected' : ''}>
                                    ${format.charAt(0).toUpperCase() + format.slice(1)}
                                </option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="description">Тодорхойлолт</label>
                        <textarea name="description">${book?.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="cover_image">Зураг URL</label>
                        <input type="url" name="cover_image" 
                            value="${book?.cover_image || ''}">
                    </div>
                    <div class="form-group">
                        <label for="rating">Үнэлгээ (0-5)</label>
                        <input type="number" name="rating" min="0" max="5" step="0.1" 
                            value="${book?.rating || ''}">
                    </div>
                    <div class="form-group">
                        <label for="reviews">Нийт үнэлсэн</label>
                        <input type="number" name="reviews" min="0" 
                            value="${book?.reviews || ''}">
                    </div>
                    <div class="form-group">
                        <label for="in_stock">Нөөцөд байгаа эсэх</label>
                        <select name="in_stock">
                            <option value="true" ${book?.in_stock === true ? 'selected' : ''}>Yes</option>
                            <option value="false" ${book?.in_stock === false ? 'selected' : ''}>No</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="add-btn">
                        ${book ? 'Хадгалах' : 'Нэмэх'}
                    </button>
                    <button type="button" onclick="this.getRootNode().host.toggleForm()" 
                        class="cancel-btn">Болих</button>
                </div>
            </form>
        `;
    }

    getBookItemTemplate(book) {
        return `
            <div class="book-item" data-id="${book.id}">
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                </div>
                <div>₮${book.price}</div>
                <div>${book.category}</div>
                <div class="actions">
                    <button class="edit-btn">Засах</button>
                    <button class="delete-btn">Устгах</button>
                </div>
            </div>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(managerTemplate.content.cloneNode(true));

        if (this.state.error) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = this.state.error;
            this.shadowRoot.querySelector('slot[name="error"]').appendChild(errorDiv);
        }

        const bookGrid = this.shadowRoot.querySelector('.book-grid');
        bookGrid.innerHTML = this.state.books.map(book => 
            this.getBookItemTemplate(book)
        ).join('');

        if (this.state.showForm) {
            const modalWrapper = this.shadowRoot.querySelector('slot[name="modal"]');
            modalWrapper.innerHTML = `
                <modal-dialog>
                    <div slot="body">
                        ${this.getFormTemplate(this.state.editingBook)}
                    </div>
                </modal-dialog>
            `;
        }

        // Use event delegation for book actions
        bookGrid.addEventListener('click', (e) => {
            const bookItem = e.target.closest('.book-item');
            if (!bookItem) return;
            
            const bookId = bookItem.dataset.id;
            if (e.target.matches('.edit-btn')) {
                this.editBook(bookId);
            } else if (e.target.matches('.delete-btn')) {
                this.handleDeleteBook(bookId);
            }
        });

        // Add event listener for modal close
        const modal = this.shadowRoot.querySelector('modal-dialog');
        if (modal) {
            modal.addEventListener('modal-close', this.handleModalClose);
        }
    }
}

customElements.define('book-manager', BookManager);
