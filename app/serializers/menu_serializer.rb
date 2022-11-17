class MenuSerializer
  include FastJsonapi::ObjectSerializer
  attributes :canOrder, :price, :itemName, :description, :category, :imageURL, :ingredients
end
