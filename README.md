# Real Estate Management (minimal demo): group 5
# Bo Phone Myat Ko (Bobo) 
# Jasia Ernest
# Nhien Pham (Hazel)

Run frontend:
    go to Frontend folder in terminal
    First time: 
        npm install 
        npm run dev

    Other times:
        npm run dev

Run backend:
    First time: 
        make postgreSQL database and name it real-estate-management
        sql code is in Backend/real-estate-management.sql
        go to .env file and add your postgre username and password into DB_USER and DB_PASSWORD
        go to Backend folder in terminal
        node .\server.js

    Other times: 
        go to Backend folder in terminal
        node .\server.js