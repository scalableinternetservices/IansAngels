class OrderSerializer
  include FastJsonapi::ObjectSerializer
  attributes :ETA, :itemNames, :person
end
