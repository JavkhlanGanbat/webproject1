import { LikesStorage } from '../js/likesStorage.js';
import { Router } from '../js/router.js';

class BookItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    toggleLike() {
        const bookId = this.dataset.id;
        const isLiked = LikesStorage.toggleLike(bookId);
        this.render();
        
        // Dispatch event for any interested components
        this.dispatchEvent(new CustomEvent('like-changed', {
            bubbles: true,
            composed: true,
            detail: { bookId, isLiked }
        }));
    }

    render() {
        const { title, price, author, id, category, image } = this.dataset;
        const isLiked = LikesStorage.isLiked(id);

        this.shadowRoot.innerHTML = `
            <style>
                .book-card {
                    border: 1px solid #ddd;
                    margin-bottom: 10px;
                    border-radius: 8px;
                    overflow: hidden;
                    background: white;
                    transition: transform 0.2s, box-shadow 0.2s;
                    height: 420px;
                    display: flex;
                    flex-direction: column;
                }

                .book-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                .book-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    display: block;
                }

                .book-info {
                    padding: 15px;
                    flex-direction: column;
                }

                .category-tag {
                    background: #e9ecef;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    display: inline-block;
                    margin-bottom: 8px;
                }

                h3 {
                    margin: 0 0 8px 0;
                    font-size: 1.1em;
                    color: #333;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.3;
                    height: 2.6em;
                }

                .author {
                    margin: 4px 0;
                    color: #666;
                    font-size: 0.9em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .price {
                    font-size: 1.2em;
                    color: #2c3e50;
                    font-weight: bold;
                    margin: 8px 0;
                }

                .book-actions {
                    display: grid;
                    grid-template-columns: 1fr auto auto;
                    gap: 8px;
                    margin: 0 auto;
                }

                .cart-button {
                    background: var(--secondary-color, #4CAF50);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.1s;
                }
                .cart-button:hover {
                    background: var(--secondary-color-dark, #388E3C);
                    transform: translateY(-1px);
                }
                .cart-button:active {
                    transform: translateY(0);
                }
                .like-btn {
                    background: none;
                    border: none;
                    font-size: 1.5em;
                    cursor: pointer;
                    padding: 5px;
                    color: ${isLiked ? 'red' : 'gray'};
                    transition: transform 0.1s;
                }
                .like-btn:hover {
                    transform: scale(1.1);
                }
                .info-button {
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>
            <div class="book-card">
                <img 
                    src="${image}" 
                    alt="${title}" 
                    class="book-image"
                    loading="lazy"
                    fetchpriority="${this.isInViewport() ? 'high' : 'low'}"
                >
                <div class="book-info">
                    <span class="category-tag">${category}</span>
                    <h3>${title}</h3>
                    <p class="author">By ${author}</p>
                    <p class="price">$${price}</p>
                    <div class="book-actions">
                        <button class="cart-button" onclick="this.getRootNode().host.addToCart()">
                            Add to Cart
                        </button>
                        <button class="info-button" onclick="this.getRootNode().host.showDetails()">
                            Info
                        </button>
                        <button class="like-btn" onclick="this.getRootNode().host.toggleLike()">
                            ${isLiked ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    isInViewport() {
        const rect = this.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    addToCart() {
        const event = new CustomEvent('add-to-cart', {
            bubbles: true,
            composed: true,
            detail: {
                id: this.dataset.id,
                title: this.dataset.title,
                price: this.dataset.price
            }
        });
        this.dispatchEvent(event);
    }

    showDetails() {
        Router.navigateToBook(this.dataset.id);
    }
}

customElements.define('book-item', BookItem);
