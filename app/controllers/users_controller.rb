class UsersController < ApplicationController

  layout "layouts/pure", :only => [:login, :new, :create]


  def login
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    puts params[:user]

    if @user.save
      # Handle a successful save.
    else
      render 'new'
    end
  end

  private
    def user_params
      params.require(:user).permit(:name, :email, :password,
                                   :password_confirmation)
    end
end
