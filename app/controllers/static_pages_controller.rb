class StaticPagesController < ApplicationController
  def home
    if not signed_in?
      redirect_to root_path
    end
  end

  def help
  end

  def about

  end
end
