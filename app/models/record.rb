class Record < ActiveRecord::Base


  validates :owner, presence: true
  validates :payer, presence: true
  validates :recorder, presence: true
  validates :time, presence: true
  validates :note, presence: true
  validates :tag, presence: true
  


  validates :email, 
    presence: true, 
    format: { with: VALID_EMAIL_REGEX },
    uniqueness: { case_sensitive: false }

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
