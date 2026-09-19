-- ==========================================================
-- ArdorTrip Airline Booking System: PostgreSQL Relational DDL
-- Aligned with YCC Relational Database & SQL Standards
-- ==========================================================

DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS passengers CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS flights CASCADE;
DROP TABLE IF EXISTS airports CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table (Authentication & RBAC)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- 2. Airports Table (Master Reference Data)
CREATE TABLE airports (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL
);

CREATE INDEX idx_airports_city ON airports(city);

-- 3. Flights Table (Inventory & Scheduling)
CREATE TABLE flights (
    id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL UNIQUE,
    airline VARCHAR(100) NOT NULL,
    departure_airport_code VARCHAR(10) NOT NULL REFERENCES airports(code) ON DELETE RESTRICT,
    arrival_airport_code VARCHAR(10) NOT NULL REFERENCES airports(code) ON DELETE RESTRICT,
    departure_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    arrival_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    flight_class VARCHAR(20) NOT NULL DEFAULT 'ECONOMY',
    CONSTRAINT chk_flight_seats CHECK (available_seats <= total_seats)
);

CREATE INDEX idx_flights_route ON flights(departure_airport_code, arrival_airport_code);
CREATE INDEX idx_flights_dept_time ON flights(departure_time);

-- 4. Bookings Table (Transaction & Reservation Management)
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    pnr VARCHAR(12) NOT NULL UNIQUE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    flight_id BIGINT NOT NULL REFERENCES flights(id) ON DELETE RESTRICT,
    seat_number VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    total_amount NUMERIC(10, 2) NOT NULL,
    booking_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_pnr ON bookings(pnr);
CREATE INDEX idx_bookings_user ON bookings(user_id);

-- 5. Passengers Table (Traveler Manifest)
CREATE TABLE passengers (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    passport_number VARCHAR(50)
);

CREATE INDEX idx_passengers_booking ON passengers(booking_id);

-- 6. Payments Table (Mock Payment Records & Audit)
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    payment_time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_txn ON payments(transaction_id);
