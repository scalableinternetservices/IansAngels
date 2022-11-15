class MenuController < ApplicationController
    def index
        menu = Menu.all

        render json: MenuSerializer.new(menu).serialized_json
    end

    def show
        #menu = Menu.find_by(id: params[:id])
        menu = Rails.cache.fetch(params[:id], expires_in: 10.minutes) do
            print "I am executing this block"
            Menu.find_by(id: params[:id])
        end
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
        params.require(:menu).permit(:canOrder, :price, :itemName, :description, :category, :imageURL, :ingredients => [])
    end
end