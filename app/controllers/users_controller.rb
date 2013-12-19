class UsersController < ApplicationController

  layout "layouts/pure", :only => [:new, :create, :show_create]


  

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      # Handle a successful save.
    else
      @errors = @user.error_messages
      render 'new'
    end
  end

  def show_create
    @user = User.new name: "test User"
    render 'create'
  end

  private
    def user_params
      params.require(:user).permit(:name, :email, :password,
                                   :password_confirmation)
    end
end
