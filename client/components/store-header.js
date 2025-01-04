class StoreHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupTheme();
    }

    setupTheme() {
        // Check system preference first
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeToggle = this.shadowRoot.getElementById('themeToggle');
        themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
            }
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeToggle = this.shadowRoot.getElementById('themeToggle');
        themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background: var(--primary-color);
                    color: var(--header-text);
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
                .button-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
            </style>
            <header>
                <h1>Номын дэлгүүр</h1>
                <div class="button-container">
                    <admin-button></admin-button>
                    <button id="themeToggle" onclick="this.getRootNode().host.toggleTheme()">
                        🌙
                    </button>
                </div>
            </header>
        `;
    }
}

customElements.define('store-header', StoreHeader);
