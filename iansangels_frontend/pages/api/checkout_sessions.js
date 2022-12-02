const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import NextCors from 'nextjs-cors';

export default async function handler(req, res) {

  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  

  });


  
  const cart = JSON.parse(req.body.cart);
  console.log("CART: "+cart);

  const redirectURL = req.body.redirectURL;
  console.log("Success URL: "+ redirectURL);

  // if (req.method === 'POST') {
  //   try {
  //     // Create Checkout Sessions from body params.
  //     console.log("creating checkout session with stripe: " + stripe)
  //     const session = await stripe.checkout.sessions.create({
  //       line_items: [
  //         {
  //           // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
  //           price_data: {
  //             currency: 'usd',
  //             product_data: { // Same as with price_data, we're creating a Product inline here, alternatively pass the ID of an existing Product using line_items.price_data.product
  //                 name: 'Shoes'
  //             },
  //             unit_amount: 1000 // 10 US$
  //         },
  //           quantity: 1,
  //         },
  //       ],
  //       mode: 'payment',
  //       success_url: redirectURL + '?status=success',
  //       cancel_url: redirectURL + '?status=cancel',
  //     });
  //     console.log("Session Url: " + session.url);
  //     // res.redirect(303, session.url);
      
  //   } catch (err) {
  //     res.status(err.statusCode || 500).json(err.message);
  //   }
  // } else {
  //   // res.setHeader('Allow', 'POST');
  //   res.status(405).end('Method Not Allowed');
  // }
  const transformItem = (cart) => {
    let cartArr = [];
    cart.map( item => {
      cartArr.push({
        price_data: {
          currency: 'usd',
          product_data: {
            images: [item.imgURL],
            name: item.title,
          },
          unit_amount: item.price * 100,
        },
        description: item.description,
        quantity: 1,
      })
    })
    return cartArr;
  }


  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: transformItem(cart),
    mode: 'payment',
    // success_url: req.body.redirectURL,
    // cancel_url: "localhost:3000/client/client",
    success_url: redirectURL,
    cancel_url: "http://localhost:3000/client/client",
    
  });



  res.json({ id: session.id });
}