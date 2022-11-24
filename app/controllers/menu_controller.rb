class MenuController < ApplicationController
    def index
        maybeMenu = Menu.where(:canOrder => false)

        for menuItem in maybeMenu
            canOrderNow = true
            for ingredient in menuItem.ingredients
                quantityAndFoodName = ingredient.split(':', -1)
                quantityAndFoodName[0].strip!
                quantityAndFoodName[1].strip!
                qty = quantityAndFoodName[0].to_i
                food = quantityAndFoodName[1]

                inventoryItem = Inventory.find_by(foodName: food)
                inventoryFood = inventoryItem.foodName
                inventoryAmount = inventoryItem.quantity

                if inventoryAmount < qty
                    print "This item still does not have enough ingredients to be ordered again!"
                    canOrderNow = false
                end
            end

            if canOrderNow
                menuItem.canOrder = true

                if menuItem.update(menu_params)
                    print "This item can now be ordered again!"
                else
                    print "Something went wrong in adding this item back to the menu"
                end
            end
        end

        menu = Menu.where(:canOrder => true)

        render json: MenuSerializer.new(menu).serialized_json
    end

    def show
        menu = Menu.find_by(id: params[:id])
        render json: MenuSerializer.new(menu).serialized_json
    end

    def create
        if Menu.find_by(itemName: params[:itemName]) != nil
            print "this menu item already exists in the database, update its value instead"
            return
        end

        menu = Menu.new(menu_params)

        if menu.save
            render json: MenuSerializer.new(menu).serialized_json
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    def update
        menu = Menu.find_by(itemName: params[:itemName])

        if menu.update(menu_params)
            render json: MenuSerializer.new(menu).serialized_json
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    def destroy
        menu = Menu.find_by(itemName: params[:itemName])

        if menu.destroy
            head :no_content
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    private

    def menu_params
        params.permit(:canOrder, :price, :itemName, :description, :category, :imageURL, :ingredients => [])
    end
end