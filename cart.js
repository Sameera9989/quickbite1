import { create } from 'zustand'

const useCart = create((set, get) => ({
  items: [], // {item, qty, restaurant}
  restaurant: null,
  add: (menuItem, restaurant) => set((state) => {
    const items = [...state.items]
    const idx = items.findIndex((i) => i.item._id === menuItem._id)
    if (state.restaurant && state.restaurant._id !== restaurant._id) {
      // reset cart if switching restaurant
      return { items: [{ item: menuItem, qty: 1 }], restaurant }
    }
    if (idx >= 0) { items[idx].qty += 1 } else { items.push({ item: menuItem, qty: 1 }) }
    return { items, restaurant: restaurant || state.restaurant }
  }),
  remove: (id) => set((state) => ({ items: state.items.filter((i) => i.item._id !== id) })),
  inc: (id) => set((state) => ({ items: state.items.map((i) => i.item._id === id ? { ...i, qty: i.qty + 1 } : i) })),
  dec: (id) => set((state) => ({ items: state.items.map((i) => i.item._id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i) })),
  clear: () => set({ items: [], restaurant: null }),
  total: () => get().items.reduce((s, i) => s + i.item.price * i.qty, 0)
}))

export default useCart
