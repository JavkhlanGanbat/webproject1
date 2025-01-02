class PaginationControl extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['current-page', 'total-pages', 'items-per-page'];
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.matches('.page-button')) {
                const page = parseInt(e.target.dataset.page);
                this.dispatchEvent(new CustomEvent('page-change', {
                    bubbles: true,
                    composed: true,
                    detail: { page }
                }));
            }
        });
    }

    render() {
        const currentPage = parseInt(this.getAttribute('current-page')) || 1;
        const totalPages = parseInt(this.getAttribute('total-pages')) || 1;
        const itemsPerPage = parseInt(this.getAttribute('items-per-page')) || 10;

        this.shadowRoot.innerHTML = `
            <style>
                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    padding: 20px;
                }
                .page-button {
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .page-button:hover {
                    background: #f0f0f0;
                }
                .page-button.active {
                    background: var(--primary-color, #007bff);
                    color: white;
                    border-color: var(--primary-color, #007bff);
                }
                .page-button:disabled {
                    background: #eee;
                    cursor: not-allowed;
                }
            </style>
            <div class="pagination">
                <button class="page-button" 
                    data-page="${currentPage - 1}"
                    ${currentPage <= 1 ? 'disabled' : ''}>
                    Previous
                </button>
                ${this.generatePageButtons(currentPage, totalPages)}
                <button class="page-button"
                    data-page="${currentPage + 1}"
                    ${currentPage >= totalPages ? 'disabled' : ''}>
                    Next
                </button>
            </div>
        `;
    }

    generatePageButtons(current, total) {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = Math.min(total, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(`
                <button class="page-button ${i === current ? 'active' : ''}"
                    data-page="${i}">
                    ${i}
                </button>
            `);
        }
        return pages.join('');
    }
}

customElements.define('pagination-control', PaginationControl);
