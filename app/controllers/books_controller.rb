class BooksController < ApplicationController


  def create
    #@record = Record.new(record_params)
    render :json => Record.new

    if false and @record.save
      # Handle a successful save.
    else
      #@errors = @record.error_messages
      #render 'index'
    end
  end

  private 

    def record_params
      params.require(:record).permit(:time, :money, :recoder, :payer, :owner, :note)
    end


end
