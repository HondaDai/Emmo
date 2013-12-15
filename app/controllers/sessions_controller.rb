class SessionsController < ApplicationController

  layout "layouts/pure", :only => [:login, :new]

  def login
    
  end

  def new
    @user = User.new
  end


end
