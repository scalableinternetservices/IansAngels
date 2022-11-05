class OrdersController < ApplicationController
    def index
        orders = Order.all

        render json: OrderSerializer.new(orders).serialized_json
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

    def order_params
        params.require(:order).permit(:ETA, :itemNames, :person_id)
    end
end