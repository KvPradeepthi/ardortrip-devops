-- Seed Airports
MERGE INTO airports (code, name, city, country) KEY(code) VALUES ('DEL', 'Indira Gandhi International Airport', 'New Delhi', 'India');
MERGE INTO airports (code, name, city, country) KEY(code) VALUES ('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India');
MERGE INTO airports (code, name, city, country) KEY(code) VALUES ('BLR', 'Kempegowda International Airport', 'Bengaluru', 'India');
MERGE INTO airports (code, name, city, country) KEY(code) VALUES ('HND', 'Tokyo Haneda Airport', 'Tokyo', 'Japan');
MERGE INTO airports (code, name, city, country) KEY(code) VALUES ('NRT', 'Narita International Airport', 'Tokyo', 'Japan');
MERGE INTO airports (code, name, city, country) KEY(code) VALUES ('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore');
MERGE INTO airports (code, name, city, country) KEY(code) VALUES ('SFO', 'San Francisco International Airport', 'San Francisco', 'USA');

-- Seed Sample Flights
MERGE INTO flights (flight_number, airline, departure_airport_code, arrival_airport_code, departure_time, arrival_time, price, available_seats, total_seats, flight_class) 
KEY(flight_number) 
VALUES ('AT-101', 'Ardor Airways', 'DEL', 'BLR', '2026-10-20 06:00:00', '2026-10-20 08:45:00', 120.00, 150, 180, 'ECONOMY');

MERGE INTO flights (flight_number, airline, departure_airport_code, arrival_airport_code, departure_time, arrival_time, price, available_seats, total_seats, flight_class) 
KEY(flight_number) 
VALUES ('AT-102', 'Ardor Airways', 'BLR', 'DEL', '2026-10-21 18:30:00', '2026-10-21 21:15:00', 125.00, 140, 180, 'ECONOMY');

MERGE INTO flights (flight_number, airline, departure_airport_code, arrival_airport_code, departure_time, arrival_time, price, available_seats, total_seats, flight_class) 
KEY(flight_number) 
VALUES ('AT-201', 'Ardor Airways', 'DEL', 'HND', '2026-10-25 01:15:00', '2026-10-25 12:45:00', 580.00, 210, 250, 'ECONOMY');

MERGE INTO flights (flight_number, airline, departure_airport_code, arrival_airport_code, departure_time, arrival_time, price, available_seats, total_seats, flight_class) 
KEY(flight_number) 
VALUES ('AT-202', 'Ardor Airways', 'HND', 'DEL', '2026-10-30 14:00:00', '2026-10-30 19:30:00', 610.00, 195, 250, 'BUSINESS');

MERGE INTO flights (flight_number, airline, departure_airport_code, arrival_airport_code, departure_time, arrival_time, price, available_seats, total_seats, flight_class) 
KEY(flight_number) 
VALUES ('AT-301', 'Ardor Airways', 'BLR', 'SIN', '2026-11-01 08:00:00', '2026-11-01 14:30:00', 250.00, 160, 200, 'ECONOMY');

MERGE INTO flights (flight_number, airline, departure_airport_code, arrival_airport_code, departure_time, arrival_time, price, available_seats, total_seats, flight_class) 
KEY(flight_number) 
VALUES ('AT-401', 'Ardor Airways', 'BOM', 'SFO', '2026-11-05 04:00:00', '2026-11-05 18:30:00', 950.00, 180, 220, 'ECONOMY');
