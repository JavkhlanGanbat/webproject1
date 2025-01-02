import { BookService } from './services/BookService.js';

export class Router {
    static init() {
        window.addEventListener('popstate', () => this.handleRoute());
        this.handleRoute();
    }

    static async handleRoute() {
        const path = window.location.pathname;
        const params = new URLSearchParams(window.location.search);
        
        if (path.includes('book-detail.html')) {
            const bookId = params.get('id');
            if (bookId) {
                const book = await BookService.getBookById(bookId);
                if (book) {
                    const detailElement = document.querySelector('book-detail');
                    if (detailElement) {
                        detailElement.setBookData(book);
                    }
                }
            }
        }
    }

    static navigateToBook(bookId) {
        window.location.href = `/client/book-detail.html?id=${bookId}`;
    }
}
