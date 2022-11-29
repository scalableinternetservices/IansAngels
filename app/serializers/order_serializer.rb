class OrderSerializer
  include FastJsonapi::ObjectSerializer
  attributes :readyForKitchen, :ETA, :itemNames, :person
end
