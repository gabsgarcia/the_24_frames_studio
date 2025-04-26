Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  resources :videos

  # Add direct uploads route if not already present
  direct :rails_blob_url do |blob|
    if Rails.env.development?
      route_for(:rails_service_blob, blob.signed_id, blob.filename)
    else
      # In production, route through our CDN if configured
      # or use standard service URL
      route_for(:rails_service_blob, blob.signed_id, blob.filename)
    end
  end
  
  direct :rails_representation_url do |representation|
    signed_blob_id = representation.blob.signed_id
    variation_key = representation.variation.key
    filename = representation.blob.filename
    route_for(:rails_blob_representation, signed_blob_id, variation_key, filename)
  end
  # get "videos", to: "videos#index", as: :videos
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  # get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
