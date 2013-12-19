class AddOwnerIdToRecord < ActiveRecord::Migration
  def change
    add_column :records, :owner_id, :integer
    add_column :records, :payer_id, :integer
    add_column :records, :recorder_id, :integer
    
  end
end
