import { BookService } from '../js/services/BookService.js';
import './modal-dialog.js';

class BookManager extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            books: [],
            showAddForm: false,
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

    async editBook(book) {
        // Implement edit book logic
        await this.fetchBooks();
    }

    async deleteBook(bookId) {
        // Implement delete book logic
        await this.fetchBooks();
    }

    toggleAddForm() {
        this.state.showAddForm = !this.state.showAddForm;
        this.render();
    }

    async handleAddBook(event) {
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

            await BookService.addBook(bookData);
            this.state.showAddForm = false;
            this.state.error = null;
            await this.fetchBooks();
        } catch (error) {
            this.state.error = error.message;
            this.render();
        }
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
        this.state.showAddForm = false;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .book-manager {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .error {
                    color: red;
                    padding: 10px;
                    margin: 10px 0;
                    background: #ffe6e6;
                    border-radius: 4px;
                }
                .book-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-top: 20px;
                }
                .book-item {
                    background: white;
                    padding: 12px 16px;
                    border-radius: 6px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    display: grid;
                    grid-template-columns: minmax(200px, 2fr) minmax(80px, 1fr) minmax(100px, 1fr) 140px;
                    align-items: center;
                    gap: 16px;
                    transition: all 0.2s ease;
                }
                .book-item:hover {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
                    color: #666;
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
                    background: #e8f4ff;
                    color: #0066cc;
                }
                .edit-btn:hover {
                    background: #0066cc;
                    color: white;
                }
                .delete-btn {
                    background: #ffe8e8;
                    color: #cc0000;
                }
                .delete-btn:hover {
                    background: #cc0000;
                    color: white;
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
                    background: #28a745;
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
                    transition: all 0.2s ease;
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
                    background: white;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 0;
                }
                .form-content {
                    padding: 20px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    flex: 1;
                }
                .form-content::-webkit-scrollbar {
                    width: 8px;
                }
                .form-content::-webkit-scrollbar-track {
                    background: transparent;
                }
                .form-content::-webkit-scrollbar-thumb {
                    background: #ddd;
                    border-radius: 4px;
                }
                .form-content::-webkit-scrollbar-thumb:hover {
                    background: #bbb;
                }
                .form-actions {
                    padding: 15px 20px;
                    background: white;
                    border-top: 1px solid #eee;
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
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                .close-btn {
                    background: transparent;
                    border: none;
                    font-size: 1.5rem;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #666;
                }
                .close-btn:hover {
                    background: #f0f0f0;
                    color: #333;
                }
            </style>
            <div class="book-manager">
                <h2>Manage Books</h2>
                <button class="add-btn" onclick="this.getRootNode().host.toggleAddForm()">
                    Add New Book
                </button>
                
                ${this.state.error ? `
                    <div class="error">${this.state.error}</div>
                ` : ''}

                ${this.state.showAddForm ? `
                    <modal-dialog>
                        <form class="add-form" onsubmit="this.getRootNode().host.handleAddBook(event)">
                            <div class="form-header">
                                <h3>Add New Book</h3>
                                <button type="button" class="close-btn" 
                                    onclick="this.getRootNode().host.handleModalClose()">×</button>
                            </div>
                            <div class="form-content">
                                <div class="form-group">
                                    <label for="title">Title *</label>
                                    <input type="text" name="title" required>
                                </div>
                                <div class="form-group">
                                    <label for="author">Author *</label>
                                    <input type="text" name="author" required>
                                </div>
                                <div class="form-group">
                                    <label for="price">Price *</label>
                                    <input type="number" name="price" step="0.01" required>
                                </div>
                                <div class="form-group">
                                    <label for="category">Category *</label>
                                    <select name="category" required>
                                        <option value="fiction">Fiction</option>
                                        <option value="non-fiction">Non-Fiction</option>
                                        <option value="science">Science</option>
                                        <option value="technology">Technology</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="isbn">ISBN *</label>
                                    <input type="text" name="isbn" required>
                                </div>
                                <div class="form-group">
                                    <label for="publish_date">Publish Date</label>
                                    <input type="date" name="publish_date">
                                </div>
                                <div class="form-group">
                                    <label for="publisher">Publisher</label>
                                    <input type="text" name="publisher">
                                </div>
                                <div class="form-group">
                                    <label for="language">Language</label>
                                    <input type="text" name="language">
                                </div>
                                <div class="form-group">
                                    <label for="pages">Pages</label>
                                    <input type="number" name="pages" min="1">
                                </div>
                                <div class="form-group">
                                    <label for="format">Format</label>
                                    <select name="format">
                                        <option value="hardcover">Hardcover</option>
                                        <option value="paperback">Paperback</option>
                                        <option value="ebook">E-Book</option>
                                        <option value="audiobook">Audiobook</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <textarea name="description"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="cover_image">Cover Image URL</label>
                                    <input type="url" name="cover_image">
                                </div>
                                <div class="form-group">
                                    <label for="rating">Rating (0-5)</label>
                                    <input type="number" name="rating" min="0" max="5" step="0.1">
                                </div>
                                <div class="form-group">
                                    <label for="reviews">Number of Reviews</label>
                                    <input type="number" name="reviews" min="0">
                                </div>
                                <div class="form-group">
                                    <label for="in_stock">In Stock</label>
                                    <select name="in_stock">
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="add-btn">Add Book</button>
                                <button type="button" onclick="this.getRootNode().host.toggleAddForm()" class="cancel-btn">Cancel</button>
                            </div>
                        </form>
                    </modal-dialog>
                ` : ''}

                <div class="book-grid">
                    ${this.state.books.map(book => `
                        <div class="book-item">
                            <div class="book-info">
                                <h3>${book.title}</h3>
                                <p>by ${book.author}</p>
                            </div>
                            <div>$${book.price}</div>
                            <div>${book.category}</div>
                            <div class="actions">
                                <button class="edit-btn" onclick="this.getRootNode().host.editBook(${book.id})">Edit</button>
                                <button class="delete-btn" onclick="this.getRootNode().host.handleDeleteBook(${book.id})">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add event listener for modal close
        const modal = this.shadowRoot.querySelector('modal-dialog');
        if (modal) {
            modal.addEventListener('modal-close', this.handleModalClose);
        }
    }
}

customElements.define('book-manager', BookManager);
