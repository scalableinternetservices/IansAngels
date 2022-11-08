class CreateOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :orders do |t|
      t.integer :ETA
      t.string :itemNames, array: true, default: []
      t.belongs_to :person, null: false, foreign_key: true

      t.timestamps
    end
  end
end
