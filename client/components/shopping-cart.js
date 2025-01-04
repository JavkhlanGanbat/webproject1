class ShoppingCart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.items = this.loadItems();
    }

    loadItems() {
        const savedItems = localStorage.getItem('cartItems');
        return savedItems ? JSON.parse(savedItems) : [];
    }

    saveItems() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    connectedCallback() {
        window.addEventListener('add-to-cart', (e) => this.addItem(e.detail));
        this.render();
    }

    findItemIndex(newItem) {
        return this.items.findIndex(item => item.id === newItem.id);
    }

    addItem(item) {
        const existingIndex = this.findItemIndex(item);
        if (existingIndex !== -1) {
            // Increment quantity if item exists
            this.items[existingIndex].quantity = (this.items[existingIndex].quantity || 1) + 1;
        } else {
            // Add new item with quantity 1
            item.quantity = 1;
            this.items.push(item);
        }
        this.saveItems();
        this.render();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.saveItems();
        this.render();
    }

    decreaseQuantity(index) {
        if (this.items[index].quantity > 1) {
            this.items[index].quantity--;
        } else {
            this.items.splice(index, 1);
        }
        this.saveItems();
        this.render();
    }

    render() {
        const total = this.items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
        
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
            <div class="cart">
                <h2>Сагс</h2>
                ${this.items.length === 0 ? 
                    '<p>Таны сагс хоосон байна</p>' : 
                    this.items.map((item, index) => `
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
                                        onclick="this.getRootNode().host.decreaseQuantity(${index})">
                                        ×
                                    </button>`
                                }
                            </div>
                        </div>
                    `).join('')}
                <div class="total">
                    Нийт үнэ: ₮${total.toFixed(2)}
                </div>
            </div>
        `;
    }
}

customElements.define('shopping-cart', ShoppingCart);
