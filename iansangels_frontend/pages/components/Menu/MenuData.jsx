const menuData = [
  {
    id: 1,
    title: "breakfast1",
    category: "breakfast",
    price: 15.99,
    desc: `aasdsfasdfdfadsfaasdf `,
    imageSrc: "/static/img/dish1.jpg"
  },
  {
    id: 2,
    title: "lunch1",
    category: "lunch",
    price: 13.99,
    desc: `asdasdasdasdasdasd `,
    imageSrc: "/static/img/dish2.jpg"
  },
  {
    id: 3,
    title: "lunch2",
    category: "shakes",
    price: 6.99,
    desc: `ombucha chillwave fanny pack 3 wolf moon street art photo booth before they sold out organic viral.`,
    imageSrc: "/static/img/dish3.jpg"
  },
  {
    id: 4,
    title: "country delight",
    category: "breakfast",
    price: 20.99,
    desc: `Shabby chic keffiyeh neutra snackwave pork belly shoreditch. Prism austin mlkshk truffaut, `,
    imageSrc: "/static/img/dish1.jpg"
  },
  {
    id: 5,
    title: "egg attack",
    category: "lunch",
    price: 22.99,
    desc: `franzen vegan pabst bicycle rights kickstarter pinterest meditation farm-to-table 90's pop-up `,
    imageSrc: "/static/img/dish1.jpg"
  },
  {
    id: 6,
    title: "oreo dream",
    category: "shakes",
    price: 18.99,
    desc: `Portland chicharrones ethical edison bulb, palo santo craft beer chia heirloom iPhone everyday`,
    imageSrc: "/static/img/dish1.jpg"
  },
  {
    id: 7,
    title: "bacon overflow",
    category: "breakfast",
    price: 8.99,
    desc: `carry jianbing normcore freegan. Viral single-origin coffee live-edge, pork belly cloud bread iceland put a bird `,
    imageSrc: "/static/img/dish1.jpg"
  },
  {
    id: 8,
    title: "american classic",
    category: "lunch",
    price: 12.99,
    desc: `on it tumblr kickstarter thundercats migas everyday carry squid palo santo leggings. Food truck truffaut  `,
    imageSrc: "/static/img/dish1.jpg"
  },
  {
    id: 9,
    title: "quarantine buddy",
    category: "shakes",
    price: 16.99,
    desc: `skateboard fam synth authentic semiotics. Live-edge lyft af, edison bulb yuccie crucifix microdosing.`,
    imageSrc: "/static/img/dish1.jpg"
  },
];

export default menuData;


// import { useState, useEffect } from 'react'
// // import * as ReactDOM from 'react-dom'
// import Link from 'next/link';




// export const menuData = () =>{

//   const [menuData_json, setMenuData] = useState([]);

//   useEffect(() => {
//     var rails_url = "http://localhost:3000";
//     var endpoint = "/client";
//     fetch(rails_url+endpoint)
//         .then(response => 
//             response.json().then(data => {
//               setMenuData(data["data"])
//               setLoading(false);
//         }))
//   }, [])




//   console.log(menuData_json);

//   return JSON.parse(menuData_json)

// }