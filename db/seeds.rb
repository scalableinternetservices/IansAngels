# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#

people = Person.create([
    {
        username: "Erwan",
        password: "password",
        email: "Erwan_app@gmail.com",
        position: "client",
        completedOrders: []
    },
    {
        username: "Rhys",
        password: "password",
        email: "Rhys_app@gmail.com",
        position: "Manager",
        completedOrders: []
    },
    {
        username: "Max",
        password: "password",
        email: "Max_app@gmail.com",
        position: "Cook",
        completedOrders: []
    }
])

inventory = Inventory.create([
    {
        foodName: "8 oz steak",
        quantity: 50
    },
    {
        foodName: "potatoes",
        quantity: 100
    },
    {
        foodName: "1 cup milk",
        quantity: 90
    },
    {
        foodName: "cage free egg",
        quantity: 120
    },
    {
        foodName: "cookies",
        quantity: 150
    }
])

menu = Menu.create([
    {
        canOrder: true,
        price: 13.99,
        itemName: "mashed potatoes and 8 oz steak",
        description: "deliciious 8 oz steak with some soft mashed potatoes on the side",
        category: "lunch",
        imageURL: "https://i.pinimg.com/originals/aa/66/6b/aa666b7c903fef572fb00ecc3fb93ca0.jpg",
        ingredients: ["1 : 8 oz steak", "3 : potatoes"]
    },
    {
        canOrder: true,
        price: 33.99,
        itemName: "eggs and 8 oz steak",
        description: "deliciious 8 oz steak with some seasoned sunny side up eggs on the side",
        category: "dinner",
        imageURL: "https://i0.wp.com/thisistrouble.com/wp-content/uploads/2015/03/steakandeggs.jpg",
        ingredients: ["1 : 8 oz steak", "5 : cage free egg"]
    },
    {
        canOrder: true,
        price: 5.99,
        itemName: "Cookies and milk",
        description: "10 chocolate chip cookies served with 1 cup of organic whole milk",
        category: "breakfast",
        imageURL: "https://sites.miis.edu/graduatewritingcenter/files/2013/09/MilkandCookies.jpg",
        ingredients: ["2 : 1 cup milk", "10 : cookies"]
    }
])

orders = Order.create([
    {
        ETA: 10,
        person: people.first,
        itemNames: ["mashed potatoes and 8 oz steak"]
    },
    {
        ETA: 10,
        person: people.second,
        itemNames: ["scrambled cage free eggs and 8 oz steak", "Cookies and milk"]
    }
])

p "Created seed data for the db"
