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
}
