package com.ardortrip.config;

import com.ardortrip.model.Airport;
import com.ardortrip.model.Flight;
import com.ardortrip.repository.AirportRepository;
import com.ardortrip.repository.FlightRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
class DatabaseSeederTest {

    @Autowired
    private DatabaseSeeder databaseSeeder;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Test
    @DisplayName("Should verify initial seeding creates exactly 8 airports and 6 flights")
    void testInitialSeedingOccurred() {
        assertEquals(8, airportRepository.count(), "Expected 8 initial airports to be seeded");
        assertEquals(6, flightRepository.count(), "Expected 6 initial flights to be seeded");

        Set<String> expectedAirportCodes = Set.of("DEL", "BOM", "BLR", "HND", "NRT", "SIN", "SFO", "LHR");
        Set<String> actualAirportCodes = airportRepository.findAll().stream()
                .map(Airport::getCode)
                .collect(Collectors.toSet());
        assertEquals(expectedAirportCodes, actualAirportCodes, "All 8 documented airport codes must exist");

        Set<String> expectedFlightNumbers = Set.of("AT-101", "AT-102", "AT-201", "AT-202", "AT-301", "AT-401");
        Set<String> actualFlightNumbers = flightRepository.findAll().stream()
                .map(Flight::getFlightNumber)
                .collect(Collectors.toSet());
        assertEquals(expectedFlightNumbers, actualFlightNumbers, "All 6 documented flight numbers must exist");
    }

    @Test
    @DisplayName("Should guarantee idempotency when run() is executed repeatedly")
    void testIdempotencyOnSubsequentRuns() {
        long initialAirportCount = airportRepository.count();
        long initialFlightCount = flightRepository.count();

        // Simulate subsequent application restarts or repeated runner invocations
        databaseSeeder.run();
        assertEquals(initialAirportCount, airportRepository.count(), "Subsequent run must not duplicate airports");
        assertEquals(initialFlightCount, flightRepository.count(), "Subsequent run must not duplicate flights");

        databaseSeeder.run("restart", "check");
        assertEquals(initialAirportCount, airportRepository.count(), "Third run must not duplicate airports");
        assertEquals(initialFlightCount, flightRepository.count(), "Third run must not duplicate flights");
    }
}
