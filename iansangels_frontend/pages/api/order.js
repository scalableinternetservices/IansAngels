// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

    if (req.method === 'POST') {
        // Process a POST request
        var opts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: req.body,
        }; 
        
        var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
        var endpoint = "/POS/orders";
        fetch(rails_url+endpoint, opts)
            .then(response => {
                console.log(response.json());
                //res = response;
                res.status(response.status).json({ order: "submitted"});
            })

    } else if (req.method === 'PATCH') {
        // Process a PATCH request
        delete req.body['ETA'];
        var opts = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: req.body,
        };

        var rails_url = "http://localhost:3001";
        var endpoint = "/POS/orders";
        fetch(rails_url+endpoint, opts)
            .then(response => {
                console.log(response.json());
                res.status(response.status).json({ order: "updated"});
            })

    } else if (req.method === 'DELETE') {
        // Process a DELETE request
        const opts = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: req.body,
        };
  
        var rails_url = "http://localhost:3001";
        var endpoint = "/POS/orders";
        fetch(rails_url+endpoint, opts)
            .then(response => {
                console.log(response.json());
                res.status(response.status).json({ order: "deleted"});
            })

    } else {
        // Handle any other HTTP method (GET)
        var rails_url = "http://localhost:3001"; //might need to use 0.0.0.0 instead of localhost on elastic beanstalk
        var endpoint = "/POS/menu";
        fetch(rails_url+endpoint) //fetch with no options does a get request to that endpoint
            .then(response => 
                response.json().then(data => {
                    var order_data = (data["data"]);
                    res.status(200).json({ data: order_data });
            }))
        //res.status(200).json({ message: 'Hello' })
    }
}
  