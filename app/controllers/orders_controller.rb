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

        #need to make sure that there are enough ingredients to use for the order
        ordersToDelete = Array.new

        for item in order.itemNames
            curOrder = Menu.find_by(itemName: item)
            
            for ingredient in curOrder.ingredients
                quantityAndFoodName = ingredient.split(':', -1)
                quantityAndFoodName[0].strip!
                quantityAndFoodName[1].strip!
                qty = quantityAndFoodName[0].to_i
                food = quantityAndFoodName[1]

                inventoryItem = Inventory.find_by(foodName: food)
                inventoryFood = inventoryItem.foodName
                inventoryAmount = inventoryItem.quantity
                if inventoryAmount - qty >= 0
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
                    ordersToDelete.push(item)
                    break
                end
            end
        end

        for item in ordersToDelete
            order.itemNames.delete(item)
        end

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

        print "BELOW WILL BE UPDATE\n\n"
        print current
        print "\n"
        print update
        print "\n\nABOVE WILL BE UPDATE\n\n"

        ordersToDelete = Hash.new

        for (key, value) in update
            curItem = Menu.find_by(itemName: key)
            
            for ingredient in curItem.ingredients
                quantityAndFoodName = ingredient.split(':', -1)
                quantityAndFoodName[0].strip!
                quantityAndFoodName[1].strip!
                qty = quantityAndFoodName[0].to_i
                food = quantityAndFoodName[1]

                inventoryItem = Inventory.find_by(foodName: food)
                inventoryFood = inventoryItem.foodName
                inventoryAmount = inventoryItem.quantity

                #if item was removed from current order, need to restore ingredients in inventory
                if value == 0
                    puts "\n\nNO CHANGE, SKIPPING\n\n"
                    next
                elsif value <= 0
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
                else
                    if inventoryAmount - (value * qty) >= 0
                        #can order
                        inventoryItem.quantity -= (value * qty)
    
                        puts "\nCHECK VALUE BELOW\n"
                        puts inventoryItem.foodName
                        puts inventoryItem.quantity
                        puts "CHECK VALUE ABOVE\n"
    
                        if inventoryItem.update(inventory_params)
                            print "successfully updated " + inventoryItem.foodName
                        else
                            print "did not successfully update " + inventoryItem.foodName
                        end
                    elsif inventoryAmount - qty >= 0
                        #can order a limited amount of that certain item
                        amountAvailable = (inventoryItem.quantity / qty).to_i
                        inventoryItem.quantity -= (amountAvailable * qty)
    
                        puts "\nCHECK VALUE BELOW\n"
                        puts inventoryItem.foodName
                        puts inventoryItem.quantity
                        puts "CHECK VALUE ABOVE\n"

                        ordersToDelete[key] = value - amountAvailable
    
                        if inventoryItem.update(inventory_params)
                            print "successfully updated " + inventoryItem.foodName
                        else
                            print "did not successfully update " + inventoryItem.foodName
                        end

                        print "Sorry, there are not enough ingredients at the moment to order the amount of this item you requested"
                    else
                        #can't order
                        print "Sorry, there are not enough ingredients at the moment to order this item"
                        ordersToDelete[key] = value
                        break
                    end
                end
            end
        end

        for (key, value) in ordersToDelete
            for i in 0...value do
                order.itemNames.delete(key)
            end
        end

        if order.update(order_params)
            render json: OrderSerializer.new(order).serialized_json
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    def destroy
        #only destroy an order when it is completed, maybe can add an option to cancel later
        personData = Person.find_by(username: params[:username])

        order = Order.find_by(person_id: personData.id)

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
        params.require(:order).permit(:ETA, :person_id, :itemNames => [])
    end

    def person_params
        params.permit(:username, :password, :email, :position, :completedOrders => [[]])
    end

    def inventory_params
        params.permit(:foodName, :quantity)
    end
end