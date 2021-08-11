import { createContext } from "react";

export const CartContext = createContext({
  isFoodAdded: false,
  cartItems: false,
  setCart: () => {},
  addQuantity: () => {},
  removeQuantity: () => {},
});
