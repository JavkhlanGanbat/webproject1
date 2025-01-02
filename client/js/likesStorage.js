export const LikesStorage = {
    getLikes() {
        const likes = localStorage.getItem('bookLikes');
        return likes ? JSON.parse(likes) : {};
    },

    toggleLike(bookId) {
        const likes = this.getLikes();
        likes[bookId] = !likes[bookId];
        localStorage.setItem('bookLikes', JSON.stringify(likes));
        return likes[bookId];
    },

    isLiked(bookId) {
        return this.getLikes()[bookId] || false;
    }
};
