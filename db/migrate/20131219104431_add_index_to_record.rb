class AddIndexToRecord < ActiveRecord::Migration
  def change
    add_index :records, [:owner_id, :time], unique: true
    add_index :records, [:owner_id, :money], unique: true
    add_index :records, [:owner_id, :recorder_id], unique: true
    add_index :records, [:owner_id, :payer_id], unique: true

  end
end
