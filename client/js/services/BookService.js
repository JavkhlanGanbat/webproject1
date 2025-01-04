export class BookService {
    static async getBooks(params = {}) {
        return this._fetch('/api/books', params);
    }

    static async getBookById(id) {
        return this._fetch(`/api/books/${id}`);
    }

    static async addBook(bookData) {
        return this._fetch('/api/books', null, {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
    }

    static async updateBook(id, bookData) {
        return this._fetch(`/api/books/${id}`, null, {
            method: 'PUT',
            body: JSON.stringify(bookData)
        });
    }

    static async deleteBook(id) {
        return this._fetch(`/api/books/${id}`, null, { method: 'DELETE' });
    }

    static async _fetch(endpoint, params = null, options = {}) {
        const url = new URL(endpoint, window.location.origin);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value) url.searchParams.set(key, value);
            });
        }

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            throw new Error(`API request failed: ${error.message}`);
        }
    }
}
