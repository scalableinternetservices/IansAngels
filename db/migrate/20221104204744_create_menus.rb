class CreateMenus < ActiveRecord::Migration[7.0]
  def change
    create_table :menus do |t|
      t.boolean :canOrder
      t.float :price
      t.string :itemName
      t.string :ingredients, array: true, default: []

      t.timestamps
    end
  end
end
