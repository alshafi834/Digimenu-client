import { useEffect, useState, useCallback } from "react";

export const useCart = () => {
  const [foodAdded, setFoodAdded] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [restId, setRestId] = useState();
  let totalPrice = 0;

  const setCart = useCallback((item, id) => {
    setFoodAdded(true);
    setRestId(id);
    item.qPrice = item.qPrice ? item.qPrice : item.foodPrice;
    totalPrice = item.qPrice
      ? totalPrice + item.qPrice
      : totalPrice + item.foodPrice;
    setCartItems([...cartItems, cartItems.push(item)]);
    console.log(cartItems);
    console.log(totalPrice);
    localStorage.setItem(
      "cartData",
      JSON.stringify({
        isFoodAdded: foodAdded,
        cartItems: cartItems,
        totalPrice: totalPrice,
        restId: id,
      })
    );
  }, []);

  const addQuantity = useCallback((citem, index) => {
    console.log(citem);
    console.log(index);
    citem.quantity = citem.quantity + 1;
    totalPrice = totalPrice + citem.foodPrice;
    citem.qPrice = citem.foodPrice * citem.quantity;
    //cartItems[index] = citem;
    setCartItems([...cartItems, (cartItems[index] = citem)]);
    //setCartItems(cartItems);
    const storedData = JSON.parse(localStorage.getItem("cartData"));
    localStorage.setItem(
      "cartData",
      JSON.stringify({
        isFoodAdded: foodAdded,
        cartItems: cartItems,
        totalPrice: totalPrice,
        restId: storedData.restId,
      })
    );
    console.log(cartItems);
  }, []);

  const removeQuantity = useCallback((citem, index) => {
    console.log(citem);
    console.log(index);
    citem.quantity = citem.quantity - 1;
    totalPrice = totalPrice - citem.foodPrice;
    citem.qPrice = citem.foodPrice * citem.quantity;
    //cartItems[index] = citem;
    if (citem.quantity === 0) {
      setCartItems([...cartItems, cartItems.splice(index, 1)]);
    } else {
      setCartItems([...cartItems, (cartItems[index] = citem)]);
    }

    //setCartItems(cartItems);
    const storedData = JSON.parse(localStorage.getItem("cartData"));
    localStorage.setItem(
      "cartData",
      JSON.stringify({
        isFoodAdded: foodAdded,
        cartItems: cartItems,
        totalPrice: totalPrice,
        restId: storedData.restId,
      })
    );
    console.log(cartItems);
  }, []);

  useEffect(() => {
    console.log("hahahaha");
    const storedData = JSON.parse(localStorage.getItem("cartData"));
    if (storedData && storedData.isFoodAdded) {
      storedData.cartItems.forEach(function (arrayItem) {
        setCart(arrayItem, storedData.restId);
      });
      /* setCart(
        storedData.cartItems
      ); */
    }
  }, [setCart]);

  return { foodAdded, cartItems, restId, setCart, addQuantity, removeQuantity };
};
