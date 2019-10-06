class UserLogin < Mutations::Command
  required do
    string :email, matches: /^.+@.+$/
    string :password
  end

  def execute
    JsonWebToken.encode(user_id: user.id) if user
  end

  private

  def user
    user = User.find_by_email(inputs[:email])
    return user if user&.authenticate(inputs[:password])

    add_error :user_authentication, :invalid_credentials, 'Invalid credentials'
    nil
  end
end
