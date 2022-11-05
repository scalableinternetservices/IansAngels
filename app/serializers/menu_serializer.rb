class MenuSerializer
  include FastJsonapi::ObjectSerializer
  attributes :canOrder, :price, :itemName, :ingredients
end
