def set_application_paths(app)
  set :deploy_to, "/opt/#{app}"
  set :staging_path, "/tmp/#{app}"
  set :local_path, Dir.pwd
  set :release_path, "#{deploy_to}/releases/#{Time.now.strftime("%Y%m%d%H%M")}"
end

def set_common_environment
  env :db_host, "localhost"
  env :db_name, "dailyritual"
  env :db_user, "dailyritual"
end

set :app, "dailyritual"
set_application_paths(app)
set :user, "dailyritual"

role :root_user, :user => "root"
role :dailyritual_user, :user => "dailyritual"

destination :vagrant do
  set :domain, "dailyritual-vagrant"
  set_common_environment
  env :rack_env, "production"
  env :port, 7200
end

destination :staging do
  set :app, "dailyritual_staging"
  set_application_paths(app)
  set :domain, "173.255.223.11"
  set_common_environment
  env :rack_env, "staging"
  env :db_name, "dailyritual_staging"
  env :db_user, "dailyritual_staging"
  env :port, 7100
  env :unicorn_workers, 2
  env :s3_bucket, "staging.dailyritual.org"
end

destination :prod do
  set :domain, "173.255.223.11"
  set_common_environment
  env :rack_env, "production"
  env :db_name, "dailyritual"
  env :db_user, "dailyritual"
  env :port, 7200
  env :unicorn_workers, 10
  env :s3_bucket, "dailyritual.org"
end

# Load secure credentials
if ENV.has_key?("DAILYRITUAL_CREDENTIALS") && File.exist?(ENV["DAILYRITUAL_CREDENTIALS"])
  load ENV["DAILYRITUAL_CREDENTIALS"]
else
  puts "Unable to locate the file $DAILYRITUAL_CREDENTIALS. You need this to deploy."
  exit 1
end
