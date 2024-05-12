# StockAPI

## Overview

`StockAPI` is a comprehensive solution for managing inventory, sales, and purchases. It allows you to create, update, and track product stocks efficiently, ensuring seamless integration with sales and purchase processes.

## Features

- **Product Management**: Add, update, and manage products in the inventory.
- **Sales Handling**: Process and record sales, automatically updating product quantities.
- **Purchase Handling**: Record purchases and update inventory levels.
- **User Authentication**: Secure user authentication for accessing the API.
- **Error Handling**: Robust error handling for managing insufficient stock levels and invalid requests.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/stockApi.git
   cd stockApi

### ERD:

![ERD](./erdStockAPI.png)

### Folder/File Structure:

```
    .env
    .gitignore
    index.js
    package.json
    readme.md
    src/
        config/
            dbConnection.js
            swagger.json
        controllers/
            auth.js
            brand.js
            category.js
            firm.js
            product.js
            purchase.js
            sale.js
            token.js
            user.js
        helpers/
            passwordEncrypt.js
            sendMail.js
        middlewares/
            authentication.js
            errorHandler.js
            findSearchSortPage.js
            logger.js
            permissions.js
            upload.js
        models/
            brand.js
            category.js
            firm.js
            product.js
            purchase.js
            sale.js
            token.js
            user.js
        routes/
            auth.js
            brand.js
            category.js
            document.js
            firm.js
            index.js
            product.js
            purchase.js
            sale.js
            token.js
            user.js
```



<!-- /* ------------------------------------------------------- *
{
    "username": "admin",
    "password": "aA*123456",
    "email": "admin@site.com",
    "firstName": "admin",
    "lastName": "admin",
    "isActive": true,
    "isStaff": true,
    "isAdmin": true
}

/* ------------------------------------------------------- */ -->
