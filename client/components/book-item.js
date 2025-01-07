/**
 * BookItem компонент
 * Энэхүү компонент нь нэг номын мэдээллийг харуулах карт юм.
 * - Номын үндсэн мэдээлэл (зураг, гарчиг, үнэ)
 * - Таалагдсан номын жагсаалтад нэмэх
 * - Сагсанд нэмэх
 * - Дэлгэрэнгүй мэдээлэл харах зэрэг үйлдлүүдийг агуулна
 */
import { LikesStorage } from '../js/likesStorage.js';
import { Router } from '../js/router.js';

class BookItem extends HTMLElement {

    constructor() {
        super();
        // Shadow DOM ашиглан компонентын дотоод бүтцийг тусгаарлана
        this.attachShadow({ mode: 'open' });
    }

    // Шинж чанар өөрчлөгдөх үед дуудагдах функц
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'data-price') this.price = newValue;
        if (name === 'data-title') this.title = newValue;
        if (name === 'data-author') this.author = newValue;
        if (name === 'data-isbn') this.isbn = newValue;
    }

    // Компонент DOM-д холбогдох үед дуудагдах функц
    connectedCallback() {
        this.render();
    }

    // Таалагдсан номын жагсаалтад нэмэх/хасах
    toggleLike() {
        const isLiked = LikesStorage.toggleLike(this.dataset.id);
        this.render();
        this.dispatchEvent(new CustomEvent('like-changed', {
            bubbles: true,
            composed: true,
            detail: { bookId: this.dataset.id, isLiked }
        }));
    }

    // Компонентыг дүрслэх функц
    render() {
        const { title, price, author, id, category, image } = this.dataset;
        const isLiked = LikesStorage.isLiked(id);
        if (isLiked) {
            this.setAttribute('liked', '');
        } else {
            this.removeAttribute('liked');
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host([liked]) .book-card {
                    border: 2px solid red;
                }
                .book-card {
                    background: var(--book-card-bg);
                    border: 1px solid var(--border-color);
                    box-shadow: 0 4px 8px var(--book-card-shadow);
                    margin-bottom: 10px;
                    border-radius: 8px;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                    height: min(420px, 90vh);
                    min-height: fit-content;
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
                    background: var(--book-card-bg);
                    color: var(--text-color);
                    padding: 15px;
                    flex-direction: column;
                    flex: 1;  /* This ensures the background fills the remaining space */
                }

                .category-tag {
                    background: var(--search-bg);
                    color: var(--text-muted);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    display: inline-block;
                    margin-bottom: 8px;
                }

                h3 {
                    margin: 0 0 8px 0;
                    font-size: 1.1em;
                    color: var(--text-heading);
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.3;
                    height: 2.6em;
                }

                .author {
                    margin: 4px 0;
                    color: var(--text-muted);
                    font-size: 0.9em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .price {
                    font-size: 1.2em;
                    color: var(--price-color);
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
                    <p class="author">${author}</p>
                    <p class="price">₮${price}</p>
                    <div class="book-actions">
                        <button class="cart-button" onclick="this.getRootNode().host.addToCart()">
                            🛒
                        </button>
                        <button class="info-button" onclick="this.getRootNode().host.showDetails()">
                            Харах
                        </button>
                        <button class="like-btn" onclick="this.getRootNode().host.toggleLike()">
                            ${isLiked ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Компонент харагдах хэсэгт байгаа эсэхийг шалгах
    isInViewport() {
        const rect = this.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Сагсанд нэмэх үйлдэл
    addToCart() {
        this.dispatchEvent(new CustomEvent('add-to-cart', {
            bubbles: true,
            composed: true,
            detail: {
                id: this.dataset.id,
                title: this.title,
                price: this.price
            }
        }));
    }

    // Дэлгэрэнгүй мэдээлэл харуулах
    showDetails() {
        Router.navigateToBook(this.dataset.id);
    }
}

customElements.define('book-item', BookItem);
