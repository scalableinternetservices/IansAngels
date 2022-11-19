class PersonSerializer
  include FastJsonapi::ObjectSerializer
  attributes :username, :password, :email, :position, :completedOrders

  has_many :orders
end
