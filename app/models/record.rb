class Record < ActiveRecord::Base


  belongs_to :owner, :class_name => "User", :foreign_key => "owner_id"
  belongs_to :payer, :class_name => "User", :foreign_key => "payer_id"
  belongs_to :recorder, :class_name => "User", :foreign_key => "recorder_id"
    

  def attr_name attribute
    attribute
  end

  def error_messages
    [] unless self.errors.any?
    
    msgs = []
    self.errors.messages.each do |attribute, messages|
      messages.each do |m|
        msgs.push( "#{self.attr_name(attribute)} #{m}" )
      end
    end
    msgs
  end

end
