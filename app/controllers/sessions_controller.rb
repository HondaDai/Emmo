class SessionsController < ApplicationController

  layout "layouts/pure", :only => [:create, :new]

  

  def new
    if signed_in?
      redirect_to home_path
    end
  end


  def create 
    user = User.find_by_email(params[:session][:email].downcase)
    if user and user.authenticate(params[:session][:password]) then
      sign_in user
      redirect_to home_path
    else
      @errors = ["信箱或密碼可能錯了！"]
      render 'new'
    end
  end

  def destroy
    sign_out
    redirect_to root_path
  end


end
