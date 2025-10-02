EcoBazaarX
1. Project Title
   EcoBazaarX – An Eco-Friendly E-Commerce Platform

2. Abstract and Summary
  EcoBazaarX is a web-based platform that promotes sustainable shopping by providing an eco-friendly e-commerce experience. It allows customers to browse, purchase, and track products with carbon footprint data,      while enabling sellers and admins to manage their operations efficiently. The platform emphasizes sustainability, transparency, and role-based access control.

3. Problem Statement
  Modern e-commerce platforms focus primarily on price and convenience, often ignoring the environmental impact of products. EcoBazaarX addresses this by integrating carbon footprint tracking and eco-ratings       into the shopping experience, allowing customers to make environmentally conscious purchasing decisions while helping sellers and admins monitor sustainability metrics.

4. Modules
  Authentication Module :-
    Secure registration and login for Customers, Sellers, and Admins.
    Role-based access control to dashboards and actions.
  Role-Based Dashboard Module :-
      Customer Dashboard: Browse eco-products, add to cart, checkout, view past orders, and track eco-shopping score.
      Seller Dashboard: Manage products, track orders, input carbon footprint data, and analyze sales/eco-ratings.
      Admin Dashboard: Manage users (approve/block/delete), monitor sellers, oversee products, view carbon footprint analytics, and configure system settings.
  Payment and Checkout Module
      Customers can add products to cart, view cart items, and checkout.
      Tracks total carbon impact of purchased items.
5. Technologies Used
    Frontend:
    React.js (Vite)  
    React Router
    Recharts (for analytics charts)
    CSS/Custom Styling
    Backend:
    Node.js & Express.js
    MongoDB & Mongoose
    Other Tools:
    LocalStorage (for static data & testing)
    React Icons

6. Usage
    Landing Page :-
        Provides an overview of the EcoBazaarX platform.
        Navigation to login or signup page.
    Authentication :-
      Register as Customer, Seller, or Admin.
      Login redirects to the respective dashboard based on role.
    Dashboards :-
      Customer: Browse eco-products, add to cart, checkout, view orders, and earn eco-badges.
      Seller: Manage product listings, input carbon footprint, view sales analytics, and manage orders.
      Admin: Approve/block users and sellers, monitor products, view carbon analytics, and manage categories.

7. API Endpoints
    Authentication:
      POST /api/auth/register – Register user (Customer/Seller/Admin)
      POST /api/auth/login – Login and get role-based token
    Users (Admin):
     GET /api/users – Get all users
     PUT /api/users/:id – Update user role or status
     DELETE /api/users/:id – Delete a user
    Products:
     GET /api/products – Get all products
     POST /api/products – Add product (Seller/Admin)
     PUT /api/products/:id – Update product
     DELETE /api/products/:id – Delete product
   Orders (Seller/Customer):
      POST /api/orders – Place order
      GET /api/orders – Get orders by role
      PUT /api/orders/:id – Update order status
   Analytics:
     GET /api/analytics/carbon – Get carbon footprint summary
     GET /api/analytics/sales – Get sales analytics
8. License
This project is under the MIT License.
