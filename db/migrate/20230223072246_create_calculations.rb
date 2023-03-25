class CreateCalculations < ActiveRecord::Migration[7.0]
  def change
    create_table :calculations do |t|
      t.integer :a
      t.integer :b
      t.string :operator
      t.integer :result
      t.integer :query_count

      t.timestamps
    end
  end
end
