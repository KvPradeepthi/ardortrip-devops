package com.ardortrip.repository;

import com.ardortrip.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight, Long> {
    Optional<Flight> findByFlightNumber(String flightNumber);

    @Query("SELECT f FROM Flight f WHERE f.departureAirport.code = :origin AND f.arrivalAirport.code = :dest")
    List<Flight> findByOriginAndDestination(@Param("origin") String origin, @Param("dest") String dest);

    @Query("SELECT f FROM Flight f WHERE f.departureAirport.code = :origin AND f.arrivalAirport.code = :dest AND f.departureTime >= :startTime AND f.departureTime <= :endTime")
    List<Flight> searchFlights(
            @Param("origin") String origin,
            @Param("dest") String dest,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
