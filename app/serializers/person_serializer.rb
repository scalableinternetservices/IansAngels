class PersonSerializer
  include FastJsonapi::ObjectSerializer
  attributes :username, :password, :email, :position

  has_many :orders
end
