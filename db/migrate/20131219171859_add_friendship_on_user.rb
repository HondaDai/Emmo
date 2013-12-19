class AddFriendshipOnUser < ActiveRecord::Migration
  def change

    add_column :users, :friend_id, :integer
  end
end
