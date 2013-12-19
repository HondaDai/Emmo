class CreateRecords < ActiveRecord::Migration
  def change
    create_table :records do |t|
      t.datetime :time
      t.text :note
      t.decimal :money

      t.timestamps
    end
  end
end
