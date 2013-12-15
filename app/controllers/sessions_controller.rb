class SessionsController < ApplicationController

  layout "layouts/pure", :only => [:create, :new]

  

  def new

  end


  def create 
    user = User.find_by_email(params[:session][:email].downcase)
    if user and user.authenticate(params[:session][:password]) then
      redirect_to home_path
    else
      @errors = ["信箱或密碼可能錯了！"]
      render 'new'
    end
  end


end
