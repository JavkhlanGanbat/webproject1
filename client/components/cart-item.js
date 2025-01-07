export class CartItem extends HTMLElement {
    #title = '';
    #price = '';
    #index = '';
    #quantity = 1;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // Properties with getters and setters
    get title() { return this.#title; }
    set title(value) {
        this.#title = value;
        this.setAttribute('title', value);
        this.updateContent();
    }

    get price() { return this.#price; }
    set price(value) {
        this.#price = value;
        this.setAttribute('price', value);
        this.updateContent();
    }

    get quantity() { return this.#quantity; }
    set quantity(value) {
        this.#quantity = Number(value);
        this.setAttribute('quantity', value);
        this.updateContent();
    }

    static get observedAttributes() {
        return ['title', 'price', 'index', 'quantity'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch(name) {
            case 'title': this.#title = newValue; break;
            case 'price': this.#price = newValue; break;
            case 'index': this.#index = newValue; break;
            case 'quantity': this.#quantity = Number(newValue); break;
        }
        this.updateContent();
    }

    updateContent() {
        if (!this.shadowRoot) return;
        const content = this.shadowRoot.querySelector('.cart-item');
        if (content) {
            content.querySelector('.item-title').textContent = this.#title;
            content.querySelector('.item-price').textContent = 
                `₮${(Number(this.#price) * this.#quantity).toFixed(2)}`;
            content.querySelector('.item-quantity').textContent = 
                `${this.#quantity}x`;
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .cart-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid var(--border-color, #eee);
                }
                .item-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .item-title {
                    font-weight: bold;
                }
                .controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .quantity-badge {
                    background: #f0f0f0;
                    padding: 2px 6px;
                    border-radius: 12px;
                    font-size: 0.9em;
                }
                .remove-btn, .decrease-btn {
                    background: var(--danger-color, #dc3545);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .decrease-btn {
                    background: var(--secondary-color, #6c757d);
                }
            </style>
            <div class="cart-item">
                <div class="item-info">
                    <span class="item-title">${this.#title}</span>
                    <span class="item-price">₮${(Number(this.#price) * this.#quantity).toFixed(2)}</span>
                </div>
                <div class="controls">
                    <span class="quantity-badge item-quantity">${this.#quantity}x</span>
                    ${this.#quantity > 1 ? 
                        `<button class="decrease-btn">−</button>` :
                        `<button class="remove-btn">×</button>`
                    }
                </div>
            </div>
        `;

        const btn = this.shadowRoot.querySelector(this.#quantity > 1 ? '.decrease-btn' : '.remove-btn');
        btn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent(this.#quantity > 1 ? 'decrease-quantity' : 'remove-item', {
                bubbles: true,
                composed: true,
                detail: { index: Number(this.#index) }
            }));
        });
    }
}

customElements.define('cart-item', CartItem);
