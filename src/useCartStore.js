import { create } from 'zustand';

const useCartStore = create((set) => ({
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    triggerUpdate: false, 
    setTrigger: () => set((state) => ({ triggerUpdate: !state.triggerUpdate })),
    setCart: (newCart) => {
        localStorage.setItem('cart', JSON.stringify(newCart));
        set({ cart: newCart, triggerUpdate: false }); // Reset trigger after update
    }
}));

export default useCartStore;