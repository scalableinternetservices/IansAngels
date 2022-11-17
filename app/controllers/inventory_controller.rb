class InventoryController < ApplicationController
    def index
        inventory = Inventory.all
        #menu = Menu.all
        #orders = Order.all

        #menuJSON = MenuSerializer.new(menu).serialized_json
        #ordersJSON = OrderSerializer.new(orders).serialized_json
        #inventoryJSON = InventorySerializer.new(inventory).serialized_json

        #total = menuJSON + ordersJSON + inventoryJSON
        inventory = InventorySerializer.new(inventory).serialized_json

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
                        else
                            completedOrdersTotal[isOrder.itemName] = 1;
                        end

                        for ingredient in isOrder.ingredients
                            #have to parse ingredient string because it currently is like "1 : 8 oz steak"
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
        #total money made (grab price of each of completed orders)
        #total of each order (from completed orders of each user then)
        #total of each inventory item used (grab ingredients from each menu item)
        #return everything as serialized JSON
        totalMoneyHash = Hash.new
        totalMoneyHash["money"] = totalMoney
        puts "\nCHECK VALUE BELOW\n"
        #need to set precision on totalMoney
        puts totalMoneyHash
        puts "CHECK VALUE ABOVE\n"

        puts "\nCHECK VALUE BELOW\n"
        puts completedOrdersTotal
        puts "CHECK VALUE ABOVE\n"

        puts "\nCHECK VALUE BELOW\n"
        puts inventoryUsedTotal
        puts "CHECK VALUE ABOVE\n"
        #data seems to be accurate, now need to figure out how to send it
        #moneyData = InventorySerializer.new(totalMoney).serialized_json
        #ordersData = InventorySerializer.new(completedOrdersTotal).serialized_json
        #inventoryData = InventorySerializer.new(inventoryUsedTotal).serialized_json
        #render json: moneyData + "\n\n" + ordersData + "\n\n" + inventoryData
        inventory = Inventory.all
        render json: InventorySerializer.new(inventory).serialized_json
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