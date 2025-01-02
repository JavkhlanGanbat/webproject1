export class CartItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['title', 'price', 'index'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('title');
        const price = this.getAttribute('price');
        const index = this.getAttribute('index');

        this.shadowRoot.innerHTML = `
            <div class="cart-item">
                <span>${title}</span>
                <div>
                    <span>$${price}</span>
                    <button class="remove-btn" data-index="${index}">×</button>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.remove-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('remove-item', {
                bubbles: true,
                composed: true,
                detail: { index: Number(index) }
            }));
        });
    }
}

customElements.define('cart-item', CartItem);
