require 'json'

class OrdersController < ApplicationController
    def index
        orders = Order.all

        render json: OrderSerializer.new(orders).serialized_json
    end

    def show
        order = Order.find_by(id: params[:id])
        render json: OrderSerializer.new(order).serialized_json
    end

    def create
        personData = Person.find_by(username: params[:username])

        if personData == nil
            print "no user exists under this username, please create an account or try a different username"
            return
        end

        currentOrder = Order.find_by(person: personData)

        if currentOrder != nil
            print "you already have a current order scheduled, please just update your current order!"
            return
        end

        order = Order.new(order_params)
        order.person = personData

        if order.itemNames.length() > 10
            order.itemNames = order.itemNames[0..9]
            print "sorry, you cannot create more than 10 orders at a time"
        end

        #need to make sure that there are enough ingredients to use for the order
        ordersToAdd = Array.new

        for item in order.itemNames
            curItem = Menu.find_by(itemName: item)

            maxAmountOrder = 2 << 63

            for ingredient in curItem.ingredients
                quantityAndFoodName = ingredient.split(':', -1)
                quantityAndFoodName[0].strip!
                quantityAndFoodName[1].strip!
                qty = quantityAndFoodName[0].to_i
                food = quantityAndFoodName[1]

                inventoryItem = Inventory.find_by(foodName: food)
                inventoryFood = inventoryItem.foodName
                inventoryAmount = inventoryItem.quantity

                maxAmountOrder = [maxAmountOrder, (inventoryAmount / qty).to_i].min
            end

            if maxAmountOrder <= 0
                order.itemNames.delete_at(order.itemNames.index(item))
            end
            
            for ingredient in curItem.ingredients
                quantityAndFoodName = ingredient.split(':', -1)
                quantityAndFoodName[0].strip!
                quantityAndFoodName[1].strip!
                qty = quantityAndFoodName[0].to_i
                food = quantityAndFoodName[1]

                inventoryItem = Inventory.find_by(foodName: food)
                inventoryFood = inventoryItem.foodName
                inventoryAmount = inventoryItem.quantity

                if maxAmountOrder > 0
                    #can order
                    inventoryItem.quantity -= qty

                    puts "\nCHECK VALUE BELOW\n"
                    puts inventoryItem.foodName
                    puts inventoryItem.quantity
                    puts "CHECK VALUE ABOVE\n"

                    if inventoryItem.update(inventory_params)
                        print "successfully updated " + inventoryItem.foodName
                    else
                        print "did not successfully update " + inventoryItem.foodName
                    end
                else
                    #can't order
                    print "Sorry, there are not enough ingredients at the moment to order this item"
                    curItem.canOrder = false

                    if curItem.update(menu_params)
                        print curItem.itemName + " cannot be ordered as of now"
                    else
                        print "something went wrong in updating the order status of " + curItem.itemName
                    end
                end
            end
        end

        while order.itemNames.length() != 10
            order.itemNames.append("")
        end

        order.readyForKitchen = false

        if order.save
            render json: OrderSerializer.new(order).serialized_json
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    def update
        personData = Person.find_by(username: params[:username])

        if personData == nil
            print "no user exists under this username, please create an account or try a different username"
            return
        end

        order = Order.find_by(person_id: personData.id)

        if order == nil
            print "This user does not have a current order placed, please create an order!"
            return
        end

        current = Hash.new
        update = Hash.new

        for item in order.itemNames
            if current.has_key?(item)
                current[item] += 1
            else
                current[item] = 1
            end
        end

        if request.request_parameters["itemNames"] != nil
            if request.request_parameters["itemNames"].length() > 10
                request.request_parameters["itemNames"] = request.request_parameters["itemNames"][0..9]
            end

            for item in request.request_parameters["itemNames"]
                if update.has_key?(item)
                    update[item] += 1
                else
                    update[item] = 1
                end
            end

            #here, trying to make take the diffence of the two hashes to update the inventory
            for (key, value) in update
                if current.has_key?(key) && update.has_key?(key)
                    update[key] -= current[key]
                end
            end

            for (key, value) in current
                if !update.has_key?(key)
                    update[key] = -value
                end
            end
        end

        #need to sort to let the dropped orders restock the inventory First
        #before adding in extra orders
        #update.sort_by {|_key, value| value}.to_h
        update = update.to_a.sort_by(&:last).to_h

        print "BELOW WILL BE UPDATE\n\n"
        print current
        print "\n"
        print update
        print "\n\nABOVE WILL BE UPDATE\n\n"

        ordersToAdd = Hash.new

        for (key, value) in update
            curItem = Menu.find_by(itemName: key)

            #maxAmountOrder is the maximum amount of a menu item you can currently order
            #given the ingredients in the inventory and the amount of ingredients needed to make the order
            maxAmountOrder = 2 << 63

            if value < 0
                for i in 0...-value
                    order.itemNames.delete_at(order.itemNames.index(key))
                end
            end
            
            for ingredient in curItem.ingredients
                quantityAndFoodName = ingredient.split(':', -1)
                quantityAndFoodName[0].strip!
                quantityAndFoodName[1].strip!
                qty = quantityAndFoodName[0].to_i
                food = quantityAndFoodName[1]

                inventoryItem = Inventory.find_by(foodName: food)
                inventoryFood = inventoryItem.foodName
                inventoryAmount = inventoryItem.quantity

                if value < 0
                    inventoryItem.quantity += -value * qty

                    puts "\nCHECK VALUE BELOW\n"
                    puts inventoryItem.foodName
                    puts inventoryItem.quantity
                    puts "CHECK VALUE ABOVE\n"

                    if inventoryItem.update(inventory_params)
                        print "successfully updated " + inventoryItem.foodName
                    else
                        print "did not successfully update " + inventoryItem.foodName
                    end
                end

                maxAmountOrder = [maxAmountOrder, (inventoryAmount / qty).to_i].min
            end

            #if item was removed from current order, need to restore ingredients in inventory
            #this is not affected by the ingredient stuff you were worried about
            for ingredient in curItem.ingredients
                quantityAndFoodName = ingredient.split(':', -1)
                quantityAndFoodName[0].strip!
                quantityAndFoodName[1].strip!
                qty = quantityAndFoodName[0].to_i
                food = quantityAndFoodName[1]

                inventoryItem = Inventory.find_by(foodName: food)
                inventoryFood = inventoryItem.foodName
                inventoryAmount = inventoryItem.quantity

                if value <= 0
                    puts "\n\nNO CHANGE, SKIPPING\n\n"
                    next
                #here, the amount of updated orders is a net positive, you do care about removing ingredients.
                #so make sure to only order a max of maxAmountOrder calculated from earlier
                else
                    if maxAmountOrder - value >= 0
                        #can order
                        inventoryItem.quantity -= (value * qty)

                        puts "\nCHECK VALUE BELOW\n"
                        puts inventoryItem.foodName
                        puts inventoryItem.quantity
                        puts "CHECK VALUE ABOVE\n"

                        ordersToAdd[key] = value

                        if inventoryItem.update(inventory_params)
                            print "successfully updated " + inventoryItem.foodName
                        else
                            print "did not successfully update " + inventoryItem.foodName
                        end
                    elsif value > maxAmountOrder && maxAmountOrder > 0
                        #can order a limited amount of that certain item
                        inventoryItem.quantity -= (maxAmountOrder * qty)

                        puts "\nCHECK VALUE BELOW\n"
                        puts inventoryItem.foodName
                        puts inventoryItem.quantity
                        puts "CHECK VALUE ABOVE\n"
                        
                        ordersToAdd[key] = maxAmountOrder

                        print "AMOUNT AVAILABLE\n\n"
                        print (maxAmountOrder)
                        print "\n\nAMOUNT AVAILABLE"

                        if inventoryItem.update(inventory_params)
                            print "successfully updated " + inventoryItem.foodName
                        else
                            print "did not successfully update " + inventoryItem.foodName
                        end

                        curItem.canOrder = false

                        if curItem.update(menu_params)
                            print curItem.itemName + " cannot be ordered as of now"
                        else
                            print "something went wrong in updating the order status of " + curItem.itemName
                        end

                        print "Sorry, there are not enough ingredients at the moment to order the amount of this item you requested. We ordered as many of the desired items as possible"
                    else
                        #can't order
                        print "Sorry, there are not enough ingredients at the moment to order this item"
                        curItem.canOrder = false

                        if curItem.update(menu_params)
                            print curItem.itemName + " cannot be ordered as of now"
                        else
                            print "something went wrong in updating the order status of " + curItem.itemName
                        end
                    end
                end
            end
        end

        print "BEFORE\n\n"
        print order.itemNames
        print "\n\nBEFORE"

        print ordersToAdd

        for (key, value) in ordersToAdd
            for i in 0...value do
                order.itemNames.append(key)
            end
        end
        
        print "AFTER\n\n"
        print order.itemNames
        print "\n\nAFTER"

        if request.request_parameters["ETA"] != nil
            order.ETA = request.request_parameters["ETA"]
        end

        if request.request_parameters["readyForKitchen"] != nil
            order.readyForKitchen = request.request_parameters["readyForKitchen"]
        end

        if order.save
            render json: OrderSerializer.new(order).serialized_json
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    def cancel
        personData = Person.find_by(username: params[:username])

        if personData == nil
            print "no user exists under this username, please create an account or try a different username"
            return
        end

        order = Order.find_by(person_id: personData.id)

        if order == nil
            print "This user does not have a current order placed, please create an order!"
            return
        end

        if order.readyForKitchen == true
            print "this order is already in the kitchen and unfortunately cannot be cancelled!"
            return
        end

        currentItems = Hash.new

        for item in order.itemNames
            if currentItems.has_key?(item)
                currentItems[item] += 1
            else
                currentItems[item] = 1
            end
        end

        for (key, value) in currentItems
            curItem = Menu.find_by(itemName: key)
            if curItem != nil
                for ingredient in curItem.ingredients
                    quantityAndFoodName = ingredient.split(':', -1)
                    quantityAndFoodName[0].strip!
                    quantityAndFoodName[1].strip!
                    qty = quantityAndFoodName[0].to_i
                    food = quantityAndFoodName[1]

                    inventoryItem = Inventory.find_by(foodName: food)
                    inventoryFood = inventoryItem.foodName
                    inventoryAmount = inventoryItem.quantity

                    inventoryItem.quantity += value * qty

                    puts "\nCHECK VALUE BELOW\n"
                    puts inventoryItem.foodName
                    puts inventoryItem.quantity
                    puts "CHECK VALUE ABOVE\n"

                    if inventoryItem.update(inventory_params)
                        print "successfully canceled the order " + inventoryItem.foodName
                    else
                        print "did not successfully cancel the order " + inventoryItem.foodName
                    end
                end
            end
        end

        if order.destroy
            head :no_content
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    def destroy
        #only destroy an order when it is completed, maybe can add an option to cancel later
        personData = Person.find_by(username: params[:username])

        order = Order.find_by(person_id: personData.id)

        start = order.itemNames.length()

        for i in start..10 do
            order.itemNames.append("")
        end

        personData.completedOrders.append(order.itemNames)
        
        if personData.update(person_params)
            print "added to completed orders"
        else
            print "unable to add to completed orders"
        end

        if order.destroy
            head :no_content
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    private

    def order_params
        params.require(:order).permit(:readyForKitchen, :ETA, :person_id, :itemNames => [])
    end

    def person_params
        params.permit(:username, :password, :email, :position, :completedOrders => [[]])
    end

    def inventory_params
        params.permit(:foodName, :quantity)
    end

    def menu_params
        params.permit(:canOrder, :price, :itemName, :description, :category, :imageURL, :ingredients => [])
    end
end