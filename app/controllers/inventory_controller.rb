class InventoryController < ApplicationController
    def index
        inventory = Inventory.all
        #menu = Menu.all
        #orders = Order.all

        #menuJSON = MenuSerializer.new(menu).serialized_json
        #ordersJSON = OrderSerializer.new(orders).serialized_json
        #inventoryJSON = InventorySerializer.new(inventory).serialized_json

        #total = menuJSON + ordersJSON + inventoryJSON

        render json: inventory
    end

    def show
        inventory = Inventory.find_by(id: params[:id])
        render json: InventorySerializer.new(inventory).serialized_json
    end

    def create
        inventory = Inventory.new(inventory_params)

        if inventory.save
            render json: InventorySerializer.new(inventory).serialized_json
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
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
end