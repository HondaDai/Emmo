class StaticPagesController < ApplicationController
  def home
    if not current_user
      redirect_to root_path
    end
  end

  def help
  end
end
