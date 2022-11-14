import { motion } from "framer-motion";
// import imgLunchMenu from "../img/undraw_Hamburger.svg";
// import {ReactComponent as imgLunchMenu} from "../img/undraw_Hamburger.svg";
// import {ReactComponent as imgLunchMenu} from "../../public/img/undraw_Hamburger.svg";
// import imgLunchMenu from "/undraw_Hamburger.svg";

// import dish1 from "../../public/img/dish1.jpg";

// import bg_image from "../../public/food_bg.jpg";

const MenuLunch = ({ lunch, items }) => {
  const itemContainer = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      {lunch &&
        items
          .filter((item) => item.category === "lunch")
          .map((item, i) => (
            <motion.div
              className="menu-items"
              key={item.id}
              variants={itemContainer}
              transition={{ delay: i * 0.2 }}
            >
              {/* <img src={imgLunchMenu} alt="s burger" /> */}
              <img src={item.imageSrc} alt="food burger" />

              {/* <img src={require(item.image)} alt="s burger" /> */}

              {/* {dish1} */}

              {/* <imgLunchMenu/> */}
              <motion.div className="item-content">
                <motion.div className="item-title-box">
                  <motion.h5 className="item-title">{item.title}</motion.h5>
                  <motion.h5 className="item-price">${item.price}</motion.h5>
                </motion.div>
                <motion.p className="item-desc">{item.desc}</motion.p>
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

export default MenuLunch;
