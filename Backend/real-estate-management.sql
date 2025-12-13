CREATE TABLE User_Information ( 
  User_id SERIAL PRIMARY KEY, 
  Email TEXT, 
  Name TEXT
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

-- Base user information 
INSERT INTO User_Information (Email, Name)
VALUES 
('alice.agent@email.com', 'Alice Agent'),
('bob.renter@email.com', 'Bob Renter'),
('charles.agent@email.com', 'Charles Kim'),
('diana.agent@email.com', 'Diana Lopez'),
('eva.renter@email.com', 'Eva Martinez'),
('frank.renter@email.com', 'Frank Nguyen'),
('georgia.renter@email.com', 'Georgia Patel');

-- Agent and Renter 
INSERT INTO Agent (Agent_id, Agency, Job_title)
VALUES 
(1, 'Dream Realty', 'Senior Broker'),
(3, 'Metro Homes', 'Realtor'),
(4, 'Skyline Realty', 'Associate Broker');

INSERT INTO Renter (Renter_id, Budget, Desired_move_in_date, Preferred_location, Point)
VALUES 
(2, 2500, '2025-12-01', 'Downtown', 0),
(5, 3000, '2026-01-15', 'Suburbs', 10),
(6, 1500, '2025-11-20', 'Downtown', 5),
(7, 2200, '2026-02-01', 'Uptown', 3);

-- Address 
INSERT INTO Address (Street, City, State, Postal_code, User_id)
VALUES 
('123 Main St', 'Chicago', 'IL', '60616', 2),
('456 Oak St', 'Chicago', 'IL', '60607', 3),
('89 River Rd', 'Chicago', 'IL', '60611', 4),
('72 Lakeview Ave', 'Chicago', 'IL', '60605', 5),
('990 Sunset Blvd', 'Chicago', 'IL', '60614', 6),
('14 Maple Dr', 'Chicago', 'IL', '60616', 7);

-- Property 
INSERT INTO Property (Description, Price, Availability, Crimes_rate, Nearby_school, Agent_id)
VALUES 
('2-bedroom apartment near downtown', 1800, 'Available', 3, 'Roosevelt Elementary', 1),
('Small office space near mall', 2500, 'Available', 1, 'Lincoln High', 1),
('Modern 3-bedroom house with backyard', 3200, 'Available', 2, 'Jefferson Middle School', 3),
('Cozy studio apartment near university', 1200, 'Available', 4, 'City College', 4),
('Luxury penthouse with skyline view', 5000, 'Unavailable', 1, 'Roosevelt High', 1),
('Retail commercial space in busy plaza', 4000, 'Available', 3, 'Lincoln High', 3),
('2-bedroom condo near riverwalk', 2100, 'Available', 2, 'Grant Elementary', 4);

-- Property subtypes 
INSERT INTO Apartment (Property_id, Number_of_rooms, Square_footage, Building_type)
VALUES 
(1, 2, 900, 'High-Rise'),
(4, 1, 550, 'Mid-Rise'),
(5, 4, 1600, 'High-Rise'),
(7, 2, 900, 'Condo');

INSERT INTO House (Property_id, Number_of_rooms, Square_footage)
VALUES (3, 3, 1800);

INSERT INTO Commercial_building (Property_id, Number_of_rooms, Type_of_business)
VALUES 
(2, 4, 'Office'),
(6, 5, 'Retail Store');

-- Booking 
INSERT INTO Booking (Start_date, End_date, Agent_id, Renter_id, Property_id)
VALUES 
('2025-11-10', '2025-12-10', 1, 2, 1),
('2025-12-01', '2026-01-01', 3, 5, 3),
('2025-11-15', '2025-12-15', 4, 6, 4),
('2026-01-10', '2026-02-10', 1, 7, 5);

-- Credit Card 
INSERT INTO Credit_card (Card_number, Address_id, Booking_id, Renter_id)
VALUES 
('5555666677778888', 1, 1, 2),
('4444333322221111', 3, 2, 5),
('1234567812345678', 4, 3, 6),
('9999888877776666', 5, 4, 7);

-- Look (renter views a property) 
INSERT INTO Look (Renter_id, Property_id)
VALUES 
(2, 2),
(5, 5),
(6, 3),
(7, 4),
(7, 6),
(6, 2);

-- Additional Properties
INSERT INTO Property (Description, Price, Availability, Crimes_rate, Nearby_school, Agent_id)
VALUES
('Spacious 4-bedroom suburban home with garden', 3500, 'Available', 2, 'Maplewood Elementary', 3),
('Modern downtown loft with open floor design', 2700, 'Available', 3, 'City Arts High School', 1),
('Luxury villa with pool and private garage', 6200, 'Unavailable', 1, 'Horizon Academy', 4),
('Affordable 1-bedroom apartment in quiet area', 900, 'Available', 4, 'Greenfield College', 3),
('Newly renovated 2-bedroom condo near park', 1900, 'Available', 2, 'Lakeside Elementary', 4),
('High-tech smart home with solar panels', 4100, 'Available', 1, 'Innovation Charter School', 1),
('Rustic 3-bedroom cabin near forest', 2300, 'Available', 1, 'Riverbend School', 3),
('Penthouse apartment with rooftop access', 5200, 'Available', 2, 'Skyline High School', 4),
('Large commercial space for restaurant operation', 6500, 'Available', 3, 'Downtown Culinary Institute', 1),
('Warehouse suitable for logistics or storage', 4300, 'Available', 2, 'Industrial Tech Center', 3),
('Boutique retail shop on busy street', 3000, 'Available', 3, 'Roosevelt High', 4),
('3-bedroom townhouse with private parking', 2600, 'Available', 2, 'Elmwood Middle School', 3),
('Sunny studio apartment with balcony', 1200, 'Available', 3, 'Metro University', 1),
('Large estate with guest house and pond', 8500, 'Unavailable', 1, 'Westlake Preparatory', 4),
('Co-working office floor with conference rooms', 7300, 'Available', 2, 'Downtown Business Center', 1),
('2-bedroom riverside apartment with great views', 2100, 'Available', 1, 'Riverdale Primary', 3),
('Compact 1-bedroom apartment near train station', 1100, 'Available', 4, 'State College', 4),
('Elegant 5-bedroom mansion with marble interior', 12000, 'Available', 1, 'Hillside Academy', 1),
('Small office for startups or freelancers', 1800, 'Available', 2, 'Innovation Hub', 3),
('Commercial retail kiosk inside mall', 1500, 'Available', 2, 'Mall Business District', 4);

-- Houses (8, 10, 13, 15, 18, 20)
INSERT INTO House (Property_id, Number_of_rooms, Square_footage)
VALUES
(8, 4, 2200),
(11, 3, 1400),
(14, 5, 3200),
(17, 3, 1800),
(19, 5, 5200);

-- Apartments (9, 12, 13, 16, 17, 18)
INSERT INTO Apartment (Property_id, Number_of_rooms, Square_footage, Building_type)
VALUES
(9, 1, 750, 'Loft'),
(10, 2, 1000, 'Condo'),
(12, 1, 600, 'Studio'),
(16, 3, 1200, 'High-Rise'),
(18, 1, 500, 'Urban Micro-Unit'),
(20, 2, 780, 'Mall Loft');

-- Commercial Buildings (13, 14, 15, 20, 21)
INSERT INTO Commercial_building (Property_id, Number_of_rooms, Type_of_business)
VALUES
(13, 2, 'Restaurant Space'),
(14, 1, 'Warehouse'),
(15, 4, 'Retail Boutique'),
(21, 5, 'Startup Office'),
(22, 1, 'Mall Kiosk');

-- View all users and their roles
SELECT u.User_id, u.Name, a.Agency, r.Budget
FROM User_Information u
LEFT JOIN Agent a ON u.User_id = a.Agent_id
LEFT JOIN Renter r ON u.User_id = r.Renter_id;

-- Check property listings with agent names
SELECT p.Property_id, p.Description, p.Price, u.Name AS Agent_Name
FROM Property p
JOIN Agent a ON p.Agent_id = a.Agent_id
JOIN User_Information u ON a.Agent_id = u.User_id;