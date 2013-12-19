class User < ActiveRecord::Base


  before_create :create_remember_token
  
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  validates :name, 
    presence: true, 
    length: { maximum: 20 }
  validates :email, 
    presence: true, 
    format: { with: VALID_EMAIL_REGEX },
    uniqueness: { case_sensitive: false }
  #validates :password_digest

  has_many :own_records, :class_name => "Record", :foreign_key => "owner_id"
  has_many :pay_records, :class_name => "Record", :foreign_key => "payer_id"
  has_many :rec_records, :class_name => "Record", :foreign_key => "recorder_id"



  has_secure_password

  def attr_name attribute
    case attribute
    when :name
      "暱稱"
    when :email
      "信箱"
    when :password
      "密碼"
    end
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

  # Returns the Gravatar (http://gravatar.com/) for the given user.
  #def gravatar_for(user)
  #  gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
  #  gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}"
  #  image_tag(gravatar_url, alt: user.name, class: "gravatar")
  #end

  def gravatar_url
    gravatar_id = Digest::MD5::hexdigest(email.downcase)
    "https://secure.gravatar.com/avatar/#{gravatar_id}"
  end



  def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  private
    def create_remember_token
      self.remember_token = User.encrypt(User.new_remember_token)
    end

end
