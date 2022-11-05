class InventorySerializer
  include FastJsonapi::ObjectSerializer
  attributes :foodName, :quantity
end
