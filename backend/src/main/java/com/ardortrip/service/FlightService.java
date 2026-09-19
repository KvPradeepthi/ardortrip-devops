package com.ardortrip.service;

import com.ardortrip.dto.FlightResponse;
import com.ardortrip.model.Flight;
import com.ardortrip.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public List<FlightResponse> getAllFlights() {
        return flightRepository.findAll()
                .stream()
                .map(FlightResponse::new)
                .collect(Collectors.toList());
    }

    public FlightResponse getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
        return new FlightResponse(flight);
    }

    public List<FlightResponse> searchFlights(String origin, String destination, String dateStr) {
        List<Flight> flights;
        if (origin != null && destination != null) {
            if (dateStr != null && !dateStr.isBlank()) {
                LocalDate date = LocalDate.parse(dateStr);
                LocalDateTime start = date.atStartOfDay();
                LocalDateTime end = date.atTime(LocalTime.MAX);
                flights = flightRepository.searchFlights(origin.toUpperCase(), destination.toUpperCase(), start, end);
            } else {
                flights = flightRepository.findByOriginAndDestination(origin.toUpperCase(), destination.toUpperCase());
            }
        } else {
            flights = flightRepository.findAll();
        }

        return flights.stream().map(FlightResponse::new).collect(Collectors.toList());
    }
}
