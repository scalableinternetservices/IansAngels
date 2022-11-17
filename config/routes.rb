Rails.application.routes.draw do
  root 'root#index'

  #will not be needing all those routes but may be necessary to add more in the future

  get 'kitchen', to: 'orders#index'
  get 'client', to: 'menu#index'
  get 'POS/inventory', to: 'inventory#index'
  get 'POS/menu', to: 'menu#index'
  get 'POS/orders', to: 'orders#index'
  get 'person', to: 'person#index'

  #will now display the menu and only the specific user's orders and completed orders
  get 'person/:id', to: 'person#show'
  get 'POS/sales', to: 'inventory#sales'

  # show
  get 'kitchen/:id', to: 'orders#show'
  get 'client/:id', to: 'menu#show'
  get 'POS/inventory/:id', to: 'inventory#show'
  get 'POS/menu/:id', to: 'menu#show'
  get 'POS/orders/:id', to: 'orders#show'
  get 'person/:id', to: 'person#show'

  #all post requests tested by insomnia seem to work
  post 'kitchen', to: 'orders#create'
  post 'client', to: 'menu#create'
  post 'POS/inventory', to: 'inventory#create'
  post 'POS/menu', to: 'menu#create'
  post 'POS/orders', to: 'orders#create'

  #all patch requests tested by insomnia seem to work
  #when sending a patch request for an order, can simply use username of user instead of their ID
  patch 'kitchen', to: 'orders#update'
  patch 'client', to: 'menu#update'
  patch 'POS/inventory', to: 'inventory#update'
  patch 'POS/menu', to: 'menu#update'
  patch 'POS/orders', to: 'orders#update'

  #all delete requests tested by insomnia seem to work
  #when sending delete request for orders#destroy include username of person with order
  #when sending delete request for menu#destroy include itemName of food on the menu
  #when sending delete request for inventory#destroy include foodName of the item in the inventory
  delete 'kitchen', to: 'orders#destroy'
  delete 'client', to: 'menu#destroy'
  delete 'POS/inventory', to: 'inventory#destroy'
  delete 'POS/menu', to: 'menu#destroy'
  delete 'POS/orders', to: 'orders#destroy'
end
