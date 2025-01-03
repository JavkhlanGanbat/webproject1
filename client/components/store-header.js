import { ThemeStore } from '../services/state/ThemeStore.js';

class StoreHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        ThemeStore.subscribe(() => this.updateThemeButton());
        ThemeStore.init();
        this.render();
    }

    toggleTheme() {
        ThemeStore.toggle();
    }

    updateThemeButton() {
        const themeToggle = this.shadowRoot.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = ThemeStore.current === 'light' ? '🌙' : '☀️';
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background: var(--primary-color);
                    color: white;
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                h1 {
                    margin: 0;
                }
                #themeToggle {
                    background: transparent;
                    border: 2px solid white;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: transform 0.2s;
                }
                #themeToggle:hover {
                    transform: scale(1.1);
                }
            </style>
            <header>
                <h1>My Bookstore</h1>
                <button id="themeToggle" onclick="this.getRootNode().host.toggleTheme()">
                    🌙
                </button>
            </header>
        `;
    }
}

customElements.define('store-header', StoreHeader);
