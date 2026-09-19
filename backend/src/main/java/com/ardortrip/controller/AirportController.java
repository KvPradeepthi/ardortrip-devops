package com.ardortrip.controller;

import com.ardortrip.model.Airport;
import com.ardortrip.repository.AirportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
public class AirportController {

    private final AirportRepository airportRepository;

    public AirportController(AirportRepository airportRepository) {
        this.airportRepository = airportRepository;
    }

    @GetMapping
    public ResponseEntity<List<Airport>> getAirports() {
        return ResponseEntity.ok(airportRepository.findAll());
    }
}
