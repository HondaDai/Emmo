class Friendships < ActiveRecord::Base



  def self.be_friends(user, friend)
    user.friends << friend
    friend.friends << user
  end

  def self.break_off(user, friend)
    Friendships.where(friend_id:friend, user_id:user).destroy_all
    Friendships.where(friend_id:user, user_id:friend).destroy_all
  end

end
