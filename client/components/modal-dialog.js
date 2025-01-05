/**
 * ModalDialog компонент
 * - Модал цонх харуулах
 * - Агуулга оруулах slot-уудтай
 * - Хаах товчтой
 * - Анимацитай гарч ирэх
 */

// Модал цонхны загвар тодорхойлох
const modalTemplate = document.createElement('template');
modalTemplate.innerHTML = `
    <style>
        :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            background: white;
            padding: 0;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow: hidden;
            position: relative;
            animation: modalIn 0.3s ease-out;
            box-sizing: border-box;
        }
        .modal-content::-webkit-scrollbar {
            width: 8px;
        }
        .modal-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        .modal-content::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        .modal-content::-webkit-scrollbar-thumb:hover {
            background: #666;
        }
        @keyframes modalIn {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        @media (min-width: 768px) {
            .modal-content {
                min-width: 500px;
            }
        }
    </style>
    <div class="modal-content">
        <div class="modal-body">
            <slot name="body"></slot>
        </div>
        <div class="modal-footer">
            <slot name="footer"></slot>
        </div>
    </div>
`;

class ModalDialog extends HTMLElement {
    // Shadow DOM холбох
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // Компонент DOM-д холбогдох үед загвар нэмэх
    connectedCallback() {
        this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));
        this.setupCloseButton();
    }

    // Хаах товчны үйл ажиллагаа тохируулах
    setupCloseButton() {
        this.shadowRoot
            .getElementById('modal-close')
            .addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('modal-close'));
            });
    }
}

customElements.define('modal-dialog', ModalDialog);
