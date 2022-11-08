class MenuController < ApplicationController
    def index
        menu = Menu.all

        render json: MenuSerializer.new(menu).serialized_json
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

    def menu_params
        params.require(:menu).permit(:canOrder, :price, :itemName, :description, :category, :imageURL, :ingredients)
    end
end