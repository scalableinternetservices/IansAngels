Rails.application.routes.draw do
  root 'root#index'

  get 'kitchen', to: 'orders#index'
  get 'client', to: 'menu#index'
  get 'POS', to: 'inventory#index'
end
