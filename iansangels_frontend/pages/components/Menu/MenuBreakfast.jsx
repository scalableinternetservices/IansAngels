import { motion } from "framer-motion";

const MenuBreakfast = ({ breakfast, items }) => {
  const itemContainer = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      {breakfast &&
        items
          .filter((item) => item.attributes.category === "breakfast")
          .map((item, i) => (
            <motion.div
              className="menu-items"
              key={item.id}
              variants={itemContainer}
              transition={{ delay: i * 0.2 }}
            >
              {/* <img src={imgLunchMenu} alt="s burger" /> */}
              <img src={item.attributes.imageURL} alt="food burger" />

              {/* <img src={require(item.image)} alt="s burger" /> */}

              {/* {dish1} */}

              {/* <imgLunchMenu/> */}
              <motion.div className="item-content">
                <motion.div className="item-title-box">
                  <motion.h5 className="item-title">{item.attributes.itemName}</motion.h5>
                  <motion.h5 className="item-price">${item.attributes.price}</motion.h5>
                </motion.div>
                <motion.p className="item-desc">{item.attributes.description}</motion.p>
                <motion.div>
                  <a
                    onClick={() => console.log(item.title)}
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

export default MenuBreakfast;
