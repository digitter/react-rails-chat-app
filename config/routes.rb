Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :conversations, only: %i[index create]
  resources :messages, only: %i[create]

  mount ActionCable.server => '/cable'
end
