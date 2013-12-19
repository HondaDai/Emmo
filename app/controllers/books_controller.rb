class BooksController < ApplicationController


  def create
    #@record = Record.new(record_params)

    return render :json => {:error => "Illegal authorization"} unless signed_in?

    render :json => Record.new(record_params)

    if false and @record.save
      # Handle a successful save.
    else
      #@errors = @record.error_messages
      #render 'index'
    end

    render :json => {msg: "ok"}
  end

  def new
    
  end

  private 

    def record_params
      begin 
        params.require(:record).permit(:time, :money, :recoder, :payer, :owner, :note)
      rescue
        nil
      end
    end


end
