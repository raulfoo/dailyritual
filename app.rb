require "bundler/setup"
require "pathological"
require "sinatra/base"
require "sinatra/reloader"
require "sinatra/content_for2"
require "rack-flash"
require "json"



class DailyRitual < Sinatra::Base
  enable :sessions
  set :session_secret, "abcdefghijklmnop"
  set :views, "views"
  set :public_folder, "public"
  set :protection, :except => :frame_options
  
  use Rack::Flash

  helpers Sinatra::ContentFor2

  configure :development do
    register Sinatra::Reloader
    also_reload "lib/*"
    also_reload "models/*"

  end
  
  before do
  
  end
  
  configure do
    set :root, File.expand_path(File.dirname(__FILE__))
  end

  def initialize(pinion)
    @pinion = pinion    
    super
  end
  

  get "/" do
    erb :index
  end
  
  
  

  def production?() ENV["RACK_ENV"] == "production" end
  

end
