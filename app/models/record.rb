class Record < ActiveRecord::Base


  belongs_to :user, :class_name => "User", :foreign_key => "owner_id"
  #belongs_to :user, :class_name => "User", :foreign_key => "payer_id"
  #belongs_to :user, :class_name => "User", :foreign_key => "recorder_id"
    

end
