require 'json'

class InventoryController < ApplicationController
    def index
        inventory = Inventory.all
        #menu = Menu.all
        #orders = Order.all

        #menuJSON = MenuSerializer.new(menu).serialized_json
        #ordersJSON = OrderSerializer.new(orders).serialized_json
        #inventoryJSON = InventorySerializer.new(inventory).serialized_json

        #total = menuJSON + ordersJSON + inventoryJSON

        # this is Erwan's code from main
        # inventory = InventorySerializer.new(inventory).serialized_json

        inventory = Rails.cache.fetch(:inventory, expires_in: 60.minutes) do
            print "I am another executing this block"
            InventorySerializer.new(Inventory.all).serialized_json
        end

        render json: inventory
    end

    def show
        inventory = Inventory.find_by(id: params[:id])
        render json: InventorySerializer.new(inventory).serialized_json
    end

    def create
        if Inventory.find_by(foodName: params[:foodName]) != nil
            print "this inventory item already exists in the database, update its value instead"
            return
        end

        inventory = Inventory.new(inventory_params)

        if inventory.save
            render json: InventorySerializer.new(inventory).serialized_json
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    def sales
        people = Person.all
        totalMoney = 0.00
        mostPopularOrderCount = 0
        mostPopularOrder = ""
        completedOrdersTotal = Hash.new
        inventoryUsedTotal = Hash.new
        for person in people
             for order in person.completedOrders
                for menuItem in order
                    isOrder = Menu.find_by(itemName: menuItem)

                    if isOrder != nil
                        totalMoney += isOrder.price
                        if completedOrdersTotal.has_key?(isOrder.itemName)
                            completedOrdersTotal[isOrder.itemName] += 1;
                            if completedOrdersTotal[isOrder.itemName] > mostPopularOrderCount
                                mostPopularOrderCount = completedOrdersTotal[isOrder.itemName]
                                mostPopularOrder = isOrder.itemName
                            end
                        else
                            completedOrdersTotal[isOrder.itemName] = 1;
                        end

                        for ingredient in isOrder.ingredients
                            quantityAndFoodName = ingredient.split(':', -1)
                            quantityAndFoodName[0].strip!
                            quantityAndFoodName[1].strip!
                            qty = quantityAndFoodName[0].to_i
                            food = quantityAndFoodName[1]
                            print qty, food
                            if inventoryUsedTotal.has_key?(food)
                                inventoryUsedTotal[food] += qty;
                            else
                                inventoryUsedTotal[food] = qty;
                            end
                        end
                    else
                        print "this order is not part of the menu"
                    end
                end  
             end
        end
        
        #print statements to console for debugging, will just comment them out for now
        # puts "\nCHECK VALUE BELOW\n"
        # puts totalMoneyHash
        # puts "CHECK VALUE ABOVE\n"

        # puts "\nCHECK VALUE BELOW\n"
        # puts completedOrdersTotal
        # puts "CHECK VALUE ABOVE\n"

        # puts "\nCHECK VALUE BELOW\n"
        # puts inventoryUsedTotal
        # puts "CHECK VALUE ABOVE\n"

        # puts "\nCHECK VALUE BELOW\n"
        # puts mostPopularOrderHash
        
        # puts "CHECK VALUE ABOVE\n"
        sales = Hash.new
        sales["totalMoney"] = totalMoney.round(2)
        sales["mostPopularItem"] = mostPopularOrder
        sales["mostPopularItemCount"] = mostPopularOrderCount

        ordersArray = Array.new

        completedOrdersTotal.each do |key, value|
             arrayElement = Hash.new
             arrayElement["order"] = key
             arrayElement["amount"] = value
             ordersArray.push(arrayElement)
        end

        inventoryArray = Array.new

        inventoryUsedTotal.each do |key, value|
            arrayElement = Hash.new
            arrayElement["ingredient"] = key
            arrayElement["amount"] = value
            inventoryArray.push(arrayElement)
       end

        sales["totalOrders"] = ordersArray
        sales["totalIngredients"] = inventoryArray
        render json: sales
    end

    def update
        inventory = Inventory.find_by(foodName: params[:foodName])

        if inventory.update(inventory_params)
            render json: InventorySerializer.new(inventory).serialized_json
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    def destroy
        inventory = Inventory.find_by(foodName: params[:foodName])

        if inventory.destroy
            head :no_content
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    private

    def inventory_params
        params.require(:inventory).permit(:foodName, :quantity)
    end

    def menu_params
        params.permit(:canOrder, :price, :itemName, :description, :category, :imageURL, :ingredients => [])
    end
end