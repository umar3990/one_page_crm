Rails.application.routes.draw do
  get '/calculator', to: 'calculator#index'
  post '/calculator/calculation', to: 'calculator#calculation'

  root "calculator#index"
end
