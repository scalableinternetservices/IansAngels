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

        order = Order.new(order_params)
        order.person = personData

        if order.save
            render json: OrderSerializer.new(order).serialized_json
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    def update
        personData = Person.find_by(username: params[:username])

        order = Order.find_by(person_id: personData.id)

        if order.update(order_params)
            render json: OrderSerializer.new(order).serialized_json
        else
            raise ActionController::RoutingError.new('Not Found'), status: 404
        end
    end

    def destroy
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
end