class PersonController < ApplicationController
    def index
        people = Person.all
        render json: PersonSerializer.new(people).serialized_json
    end

    def show
        person = Person.find_by(id: params[:id])
        render json: PersonSerializer.new(person).serialized_json
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
        params.require(:person).permit(:username, :password, :email, :position)
    end
end