class AdminButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    navigateToAdmin() {
        window.location.href = '/admin.html';  // Updated path to point to root level
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .admin-button {
                    background: transparent;
                    border: 2px solid white;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-right: 10px;
                    transition: all 0.2s ease;
                }
                .admin-button:hover {
                    background: white;
                    color: var(--primary-color);
                }
            </style>
            <button class="admin-button" onclick="this.getRootNode().host.navigateToAdmin()">
                Admin
            </button>
        `;
    }
}

customElements.define('admin-button', AdminButton);
