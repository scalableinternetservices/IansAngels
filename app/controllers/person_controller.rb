class PersonController < ApplicationController
    def index
        people = Person.all
        render json: PersonSerializer.new(people, options).serialized_json
    end

    def show
        person = Person.find_by(id: params[:id])
        menu = Menu.all

        #can add options to serializer parameters to let a user see his current order as well
        personJSON = PersonSerializer.new(person, options).serialized_json
        menuJSON = MenuSerializer.new(menu).serialized_json

        render json: personJSON + "\n\n" + menuJSON
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

    def person_params
        params.require(:person).permit(:username, :password, :email, :position, :completedOrders => [[]])
    end

    def options
        @options ||= {include: %i[orders]}
    end
end