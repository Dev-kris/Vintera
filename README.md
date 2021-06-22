# Vintera
This project is a minimum viable product website for an ecomerce company.
The website required a homepage, multi-product page, single-product page, shopping cart with checkout, and an order confirmation page.
No frameworks were allowed so the frontend site is built with vanilla JS.
The backend was provided and is handled by an Express server and MongoDB.

### API
Each product is added dynamically through an API fetch, allowing for flexability in product offering without modifying the html.

### Storage
Per request, cart storage is handled by LocalStorage and SessionStorage, though in production cookies would be used instead. 
Cart storage remains indefinently (up to browser settings) and is cleared upon order confirmation. 

### Bootstrap 5
Bootsrap's newest release recently left Alpha build and entered open Beta, version V5.0.0-Beta2, which is what this project uses.
Notable features are the removal of jQuery dependancy and the introduction of Bootstrap's own icon set. 

## Project Installation

Ensure NODE is installed on machine.
In command prompt or terminal navigate to the project folder.
enter ' node server start' to start the server.
Load index.html

## Troubleshooting

If cart fails to load, make sure localstorage was not populated prior to page loading. 
This is only an issue if using a live-server and localhost address.
If this problem occurs it can be fixed by typing in the browser console localStorage.clear()

