/**
 * BookService класс
 * API-тай харилцах үндсэн сервис
 * - Номын жагсаалт авах
 * - Нэг номын мэдээлэл авах
 * - Шинэ ном нэмэх
 * - Номын мэдээлэл засах
 * - Ном устгах зэрэг үйлдлүүдийг хийнэ
 */

export class BookService {
    // Номын жагсаалт авах
    static async getBooks(params = {}) {
        return this._fetch('/api/books', params);
    }

    // Нэг номын дэлгэрэнгүй мэдээлэл авах
    static async getBookById(id) {
        return this._fetch(`/api/books/${id}`);
    }

    // Шинэ ном нэмэх
    static async addBook(bookData) {
        return this._fetch('/api/books', null, {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
    }

    // Номын мэдээлэл шинэчлэх
    static async updateBook(id, bookData) {
        return this._fetch(`/api/books/${id}`, null, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
    }

    // Ном устгах
    static async deleteBook(id) {
        return this._fetch(`/api/books/${id}`, null, { method: 'DELETE' });
    }

    // Үндсэн fetch функц - бүх хүсэлтүүдэд ашиглагдана
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
