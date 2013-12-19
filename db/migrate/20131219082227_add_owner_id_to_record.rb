class AddOwnerIdToRecord < ActiveRecord::Migration
  def change
    add_column :records, :owner_id, :integer
    
  end
end
