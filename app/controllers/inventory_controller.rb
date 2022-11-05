class InventoryController < ApplicationController
    def index
        inventory = Inventory.all

        render json: InventorySerializer.new(inventory).serialized_json
    end

    def show
        raise ActionController::RoutingError.new('Not Found'), status: 404
    end

    def create
        raise ActionController::RoutingError.new('Not Found'), status: 404
    end

    def update
        raise ActionController::RoutingError.new('Not Found'), status: 404
    end

    def destroy
        raise ActionController::RoutingError.new('Not Found'), status: 404
    end

    private

    def inventory_params
        params.require(:inventory).permit(:foodName, :quantity)
    end
end