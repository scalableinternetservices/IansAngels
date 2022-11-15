class InventoryController < ApplicationController
    def index

        # Since the inventory may not often change, it might be useful
        # to cache by day
        time = Time.new
        time = time.strftime("%Y-%m-%d")
        puts(time)
        inventory = Rails.cache.fetch(time) do
            print "I am another executing this block"
            Inventory.all
        end
        #menu = Menu.all
        #orders = Order.all

        #menuJSON = MenuSerializer.new(menu).serialized_json
        #ordersJSON = OrderSerializer.new(orders).serialized_json
        #inventoryJSON = InventorySerializer.new(inventory).serialized_json

        #total = menuJSON + ordersJSON + inventoryJSON
        inventory = InventorySerializer.new(inventory).serialized_json
        render json: inventory
    end

    # The print is for illustrative purposes
    # If we have already quiered for specific id, the inside of the block
    # will not execute (id is cached)

    # When entering block (not cached) Completed 200 OK in 109ms Views: 0.1ms | ActiveRecord: 15.6ms | Allocations: 34265)
    # When skipping block (cached) Completed 200 OK in 2ms (Views: 0.2ms | ActiveRecord: 0.0ms | Allocations: 385)
    def show
        inventory = Rails.cache.fetch(params[:id], expires_in: 10.minutes) do
            print "I am executing this block"
            Inventory.find_by(id: params[:id])
        end
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