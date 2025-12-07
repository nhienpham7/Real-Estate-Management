CREATE TABLE User_Information ( 
  User_id SERIAL PRIMARY KEY, 
  Email TEXT NOT NULL, 
  Name TEXT,
  Password TEXT NOT NULL,
  Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Address ( 
  Address_id SERIAL PRIMARY KEY, 
  Street VARCHAR(20), 
  City VARCHAR(20),
  State VARCHAR(20), 
  Postal_code VARCHAR(10), 
  User_id INT REFERENCES User_Information(User_id)
); 

CREATE TABLE Agent ( 
  Agent_id INT PRIMARY KEY REFERENCES User_Information(User_id), 
  Agency VARCHAR(20), 
  Job_title VARCHAR(20)
); 

CREATE TABLE Renter ( 
  Renter_id INT PRIMARY KEY REFERENCES User_Information(User_id),
  Budget INT CHECK (Budget > 0), 
  Desired_move_in_date DATE, 
  Preferred_location VARCHAR(20),
  Point INT DEFAULT 0
); 

CREATE TABLE Property ( 
  Property_id SERIAL PRIMARY KEY, 
  Description TEXT, 
  Price INT CHECK (Price > 0), 
  Availability VARCHAR(15), 
  Crimes_rate INT CHECK (Crimes_rate >= 0), 
  Nearby_school TEXT, 
  Agent_id INT NOT NULL REFERENCES Agent(Agent_id)
); 

CREATE TABLE Booking ( 
  Booking_id SERIAL PRIMARY KEY, 
  Start_date DATE, 
  End_date DATE, 
  Agent_id INT NOT NULL REFERENCES Agent(Agent_id), 
  Renter_id INT NOT NULL REFERENCES Renter(Renter_id),
  Property_id INT NOT NULL REFERENCES Property(Property_id)
); 

CREATE TABLE Credit_card ( 
  Credit_card_id SERIAL PRIMARY KEY, 
  Card_number VARCHAR(20) UNIQUE NOT NULL,
  Address_id INT NOT NULL REFERENCES Address(Address_id), 
  Booking_id INT REFERENCES Booking(Booking_id), 
  Renter_id INT REFERENCES Renter(Renter_id)
); 

CREATE TABLE House ( 
  Property_id INT PRIMARY KEY REFERENCES Property(Property_id), 
  Number_of_rooms INT, 
  Square_footage INT CHECK (Square_footage > 0)
); 

CREATE TABLE Apartment ( 
  Property_id INT PRIMARY KEY REFERENCES Property(Property_id), 
  Number_of_rooms INT, 
  Square_footage INT CHECK (Square_footage > 0), 
  Building_type TEXT
); 

CREATE TABLE Commercial_building ( 
  Property_id INT PRIMARY KEY REFERENCES Property(Property_id), 
  Number_of_rooms INT, 
  Type_of_business TEXT
); 

CREATE TABLE Look ( 
  Renter_id INT REFERENCES Renter(Renter_id), 
  Property_id INT REFERENCES Property(Property_id), 
  PRIMARY KEY (Renter_id, Property_id)
);