import { SettingsApplicationsRounded } from "@mui/icons-material";
import { motion } from "framer-motion";
import Cart from "../ShoppingCart/Cart/Cart";
// import imgAllMenu from "/food_bg.jpg";

const MenuAll = ({ all, items, cart , setCartOpened}) => {
  const itemContainer = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      {all &&
        items.map((item, i) => (
          <motion.div
            className="menu-items"
            key={item.id}
            variants={itemContainer}
            transition={{ delay: i * 0.2 }}
          >
            <img src={item.attributes.imageURL} alt="food burger" />
          
            <motion.div className="item-content">
              <motion.div className="item-title-box">
                <motion.h5 className="item-title">{item.attributes.itemName}</motion.h5>
                <motion.h5 className="item-price">${item.attributes.price}</motion.h5>
              </motion.div>
              <motion.p className="item-desc">{item.attributes.description}</motion.p>
              <motion.div>
                <a
                  onClick={() => {
                    console.log(item.attributes.itemName);
                    cart.push({
                      title: item.attributes.itemName,
                      price: item.attributes.price
                    });
                    setCartOpened(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Add to cart -&gt;
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
    </>
  );
};

export default MenuAll;
