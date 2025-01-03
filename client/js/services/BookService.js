export class BookService {
    static async getBooks(page = 1, filters = {}) {
        const params = new URLSearchParams();
        
        // Set query parameters
        params.set('page', page);
        params.set('limit', filters.itemsPerPage || 10);
        
        // Only add parameters if they have values
        if (filters.search?.trim()) params.set('search', filters.search.trim());
        if (filters.category && filters.category !== 'all') params.set('category', filters.category);
        if (filters.sort) params.set('sort', filters.sort);

        try {
            const response = await fetch(`/api/books?${params}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            // Log for debugging
            console.log('Server response:', data);
            
            return data;
        } catch (error) {
            console.error('Error fetching books:', error);
            return { books: [], total: 0, totalPages: 0 };
        }
    }

    static async getBookById(id) {
        try {
            const response = await fetch(`/api/books/${id}`);
            if (!response.ok) {
                throw new Error('Book not found');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching book details:', error);
            return null;
        }
    }

    static async addBook(bookData) {
        try {
            console.log('Sending book data:', bookData); // Add logging
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add book');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding book:', error);
            throw error;
        }
    }

    static async updateBook(id, bookData) {
        try {
            const response = await fetch(`/api/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData)
            });
            if (!response.ok) throw new Error('Failed to update book');
            return await response.json();
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    }

    static async deleteBook(id) {
        try {
            const response = await fetch(`/api/books/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete book');
            return await response.json();
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }
}
