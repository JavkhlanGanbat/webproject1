import { BookService } from '../js/services/BookService.js';

class BookManager extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            books: [],
            showAddForm: false,
            error: null
        };
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
                    display: grid;
                    gap: 20px;
                    margin-top: 20px;
                }
                .book-item {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .actions button {
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    margin-left: 10px;
                    transition: all 0.2s;
                }
                .edit-btn {
                    background: #007bff;
                    color: white;
                }
                .delete-btn {
                    background: #dc3545;
                    color: white;
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
                .add-form {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-top: 20px;
                }
                .form-group {
                    margin-bottom: 15px;
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
                }
                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
            </style>
            <div class="book-manager">
                <h2>Manage Books</h2>
                <button class="add-btn" onclick="this.getRootNode().host.toggleAddForm()">
                    ${this.state.showAddForm ? 'Cancel' : 'Add New Book'}
                </button>
                
                ${this.state.error ? `
                    <div class="error">${this.state.error}</div>
                ` : ''}

                ${this.state.showAddForm ? `
                    <form class="add-form" onsubmit="this.getRootNode().host.handleAddBook(event)">
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
                        <div class="form-actions">
                            <button type="submit" class="add-btn">Add Book</button>
                            <button type="button" onclick="this.getRootNode().host.toggleAddForm()" class="delete-btn">Cancel</button>
                        </div>
                    </form>
                ` : ''}

                <div class="book-grid">
                    ${this.state.books.map(book => `
                        <div class="book-item">
                            <div class="book-info">
                                <h3>${book.title}</h3>
                                <p>by ${book.author}</p>
                                <p>$${book.price}</p>
                            </div>
                            <div class="actions">
                                <button class="edit-btn" onclick="this.getRootNode().host.editBook(${book.id})">Edit</button>
                                <button class="delete-btn" onclick="this.getRootNode().host.handleDeleteBook(${book.id})">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

customElements.define('book-manager', BookManager);
