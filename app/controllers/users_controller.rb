class UsersController < ApplicationController

  layout "layouts/pure", :only => [:login, :register]


  def login
  end

  def register
    @user = User.new
  end
end
