export class CartService {
    static getItems() {
        const savedItems = localStorage.getItem('cartItems');
        return savedItems ? JSON.parse(savedItems) : [];
    }

    static saveItems(items) {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }

    static updateQuantity(items, itemId, delta) {
        const index = items.findIndex(item => item.id === itemId);
        if (index === -1) return items;

        const newItems = [...items];
        const newQuantity = (newItems[index].quantity || 1) + delta;

        if (newQuantity <= 0) {
            newItems.splice(index, 1);
        } else {
            newItems[index].quantity = newQuantity;
        }

        this.saveItems(newItems);
        return newItems;
    }
}
