# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#

people = Person.create([
    {
        username: "Erwan",
        password: "password",
        email: "Erwan_app@gmail.com",
        position: "client"
    },
    {
        username: "Rhys",
        password: "password",
        email: "Rhys_app@gmail.com",
        position: "Manager"
    },
    {
        username: "Max",
        password: "password",
        email: "Max_app@gmail.com",
        position: "Cook"
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
        ingredients: ["1 : 8 oz steak", "3 : potatoes"]
    },
    {
        canOrder: true,
        price: 33.99,
        itemName: "scrambled cage free eggs and 8 oz steak",
        ingredients: ["1 : 8 oz steak", "5 : cage free egg"]
    },
    {
        canOrder: true,
        price: 5.99,
        itemName: "Cookies and milk",
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
