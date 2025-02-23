# This configuration file will be evaluated by Puma.

# Set thread count
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

# Set environment
rails_env = ENV.fetch("RAILS_ENV") { "development" }
environment rails_env

# Configure workers for production
if rails_env == "production"
  worker_count = Integer(ENV.fetch("WEB_CONCURRENCY") { 1 })
  if worker_count > 1
    workers worker_count
    preload_app!
  end
end

# Set development worker timeout
worker_timeout 3600 if rails_env == "development"

# Set port and pidfile
port ENV.fetch("PORT") { 3000 }
pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

# Allow puma to be restarted by `bin/rails restart` command
plugin :tmp_restart
