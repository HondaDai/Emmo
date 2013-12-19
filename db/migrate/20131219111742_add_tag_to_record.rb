class AddTagToRecord < ActiveRecord::Migration
  def change
    add_column :records, :tag, :integer
  end
end
