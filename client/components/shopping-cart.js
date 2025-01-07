export class ShoppingCart extends HTMLElement {
    #items = [];
    #loading = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.#items = this.loadItems();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        window.addEventListener('add-to-cart', (e) => this.addItem(e.detail));
        window.addEventListener('storage', (e) => {
            if (e.key === 'cartItems') {
                this.#items = JSON.parse(e.newValue || '[]');
                this.render();
            }
        });
    }

    loadItems() {
        const savedItems = localStorage.getItem('cartItems');
        return savedItems ? JSON.parse(savedItems) : [];
    }

    saveItems() {
        localStorage.setItem('cartItems', JSON.stringify(this.#items));
    }

    get total() {
        return this.#items.reduce((sum, item) => 
            sum + (Number(item.price) * (item.quantity || 1)), 0
        );
    }

    async addItem(item) {
        this.#loading = true;
        this.render();

        try {
            const existingIndex = this.findItemIndex(item);
            if (existingIndex !== -1) {
                this.#items[existingIndex].quantity = 
                    (this.#items[existingIndex].quantity || 1) + 1;
            } else {
                this.#items.push({ ...item, quantity: 1 });
            }
            this.saveItems();
            this.dispatchEvent(new CustomEvent('cart-updated', {
                bubbles: true,
                composed: true,
                detail: { items: this.#items }
            }));
        } catch (error) {
            console.error('Failed to add item:', error);
        } finally {
            this.#loading = false;
            this.render();
        }
    }

    findItemIndex(newItem) {
        return this.#items.findIndex(item => item.id === newItem.id);
    }

    removeItem(index) {
        this.#items.splice(index, 1);
        this.saveItems();
        this.render();
    }

    decreaseQuantity(index) {
        if (this.#items[index].quantity > 1) {
            this.#items[index].quantity--;
        } else {
            this.#items.splice(index, 1);
        }
        this.saveItems();
        this.render();
    }

    render() {
        const total = this.#items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                .cart {
                    background: var(--cart-item-bg);
                    color: var(--text-color);
                    box-shadow: 0 2px 4px var(--book-card-shadow);
                    padding: 20px;
                    border-radius: 8px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .cart-item {
                    background: var(--cart-item-bg);
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                }
                .cart-item:hover {
                    background: var(--cart-hover-bg);
                }
                .quantity-controls {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .decrease-btn, .remove-btn {
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 0.9em;
                }
                .decrease-btn {
                    background: #6c757d;
                }
                .total {
                    margin-top: 20px;
                    font-weight: bold;
                    font-size: 1.2em;
                }
            </style>
            ${this.#loading ? '<div class="loading">Updating cart...</div>' : ''}
            <div class="cart">
                <h2>Сагс (${this.#items.length})</h2>
                ${this.renderItems()}
                ${this.renderTotal()}
            </div>
        `;
    }

    renderItems() {
        if (this.#items.length === 0) {
            return '<p>Таны сагс хоосон байна</p>';
        }
        return this.#items.map((item, index) => `
            <div class="cart-item">
                <span>${item.title}</span>
                <div class="quantity-controls">
                    <span>₮${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    <span>(${item.quantity || 1}x)</span>
                    ${item.quantity > 1 ? 
                        `<button class="decrease-btn" 
                            onclick="this.getRootNode().host.decreaseQuantity(${index})">
                            −
                        </button>` :
                        `<button class="remove-btn" 
                            onclick="this.getRootNode().host.removeItem(${index})">
                            ×
                        </button>`
                    }
                </div>
            </div>
        `).join('');
    }

    renderTotal() {
        return `
            <div class="total">
                Нийт үнэ: ₮${this.total.toFixed(2)}
            </div>
        `;
    }
}

customElements.define('shopping-cart', ShoppingCart);
