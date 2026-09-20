package com.ardortrip.config;

import com.ardortrip.model.Airport;
import com.ardortrip.model.Flight;
import com.ardortrip.model.FlightClass;
import com.ardortrip.repository.AirportRepository;
import com.ardortrip.repository.FlightRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final AirportRepository airportRepository;
    private final FlightRepository flightRepository;

    public DatabaseSeeder(AirportRepository airportRepository, FlightRepository flightRepository) {
        this.airportRepository = airportRepository;
        this.flightRepository = flightRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedAirports();
        seedFlights();
    }

    public void seedAirports() {
        if (airportRepository.count() > 0) {
            log.info("Airports table already contains data ({} records). Skipping airport seeding.", airportRepository.count());
            return;
        }

        log.info("Seeding initial airport records...");
        List<Airport> initialAirports = List.of(
                new Airport("DEL", "Indira Gandhi International Airport", "New Delhi", "India"),
                new Airport("BOM", "Chhatrapati Shivaji Maharaj International Airport", "Mumbai", "India"),
                new Airport("BLR", "Kempegowda International Airport", "Bengaluru", "India"),
                new Airport("HND", "Tokyo Haneda Airport", "Tokyo", "Japan"),
                new Airport("NRT", "Narita International Airport", "Tokyo", "Japan"),
                new Airport("SIN", "Singapore Changi Airport", "Singapore", "Singapore"),
                new Airport("SFO", "San Francisco International Airport", "San Francisco", "USA"),
                new Airport("LHR", "London Heathrow Airport", "London", "United Kingdom")
        );

        airportRepository.saveAll(initialAirports);
        log.info("Successfully seeded {} airports.", initialAirports.size());
    }

    public void seedFlights() {
        if (flightRepository.count() > 0) {
            log.info("Flights table already contains data ({} records). Skipping flight seeding.", flightRepository.count());
            return;
        }

        log.info("Seeding initial flight records...");
        Map<String, Airport> airportMap = airportRepository.findAll().stream()
                .collect(Collectors.toMap(Airport::getCode, Function.identity()));

        if (airportMap.isEmpty()) {
            log.warn("Cannot seed flights: no airports available in database.");
            return;
        }

        List<Flight> initialFlights = List.of(
                createFlight("AT-101", "Ardor Airways", airportMap.get("DEL"), airportMap.get("BLR"),
                        LocalDateTime.parse("2026-10-20T06:00:00"), LocalDateTime.parse("2026-10-20T08:45:00"),
                        new BigDecimal("120.00"), 150, 180, FlightClass.ECONOMY),

                createFlight("AT-102", "Ardor Airways", airportMap.get("BLR"), airportMap.get("DEL"),
                        LocalDateTime.parse("2026-10-21T18:30:00"), LocalDateTime.parse("2026-10-21T21:15:00"),
                        new BigDecimal("125.00"), 140, 180, FlightClass.ECONOMY),

                createFlight("AT-201", "Ardor Airways", airportMap.get("DEL"), airportMap.get("HND"),
                        LocalDateTime.parse("2026-10-25T01:15:00"), LocalDateTime.parse("2026-10-25T12:45:00"),
                        new BigDecimal("580.00"), 210, 250, FlightClass.ECONOMY),

                createFlight("AT-202", "Ardor Airways", airportMap.get("HND"), airportMap.get("DEL"),
                        LocalDateTime.parse("2026-10-30T14:00:00"), LocalDateTime.parse("2026-10-30T19:30:00"),
                        new BigDecimal("610.00"), 195, 250, FlightClass.BUSINESS),

                createFlight("AT-301", "Ardor Airways", airportMap.get("BLR"), airportMap.get("SIN"),
                        LocalDateTime.parse("2026-11-01T08:00:00"), LocalDateTime.parse("2026-11-01T14:30:00"),
                        new BigDecimal("250.00"), 160, 200, FlightClass.ECONOMY),

                createFlight("AT-401", "Ardor Airways", airportMap.get("BOM"), airportMap.get("SFO"),
                        LocalDateTime.parse("2026-11-05T04:00:00"), LocalDateTime.parse("2026-11-05T18:30:00"),
                        new BigDecimal("950.00"), 180, 220, FlightClass.ECONOMY)
        );

        flightRepository.saveAll(initialFlights);
        log.info("Successfully seeded {} flights.", initialFlights.size());
    }

    private Flight createFlight(String flightNumber, String airline, Airport dep, Airport arr,
                                LocalDateTime depTime, LocalDateTime arrTime, BigDecimal price,
                                int availableSeats, int totalSeats, FlightClass flightClass) {
        Flight flight = new Flight();
        flight.setFlightNumber(flightNumber);
        flight.setAirline(airline);
        flight.setDepartureAirport(dep);
        flight.setArrivalAirport(arr);
        flight.setDepartureTime(depTime);
        flight.setArrivalTime(arrTime);
        flight.setPrice(price);
        flight.setAvailableSeats(availableSeats);
        flight.setTotalSeats(totalSeats);
        flight.setFlightClass(flightClass);
        return flight;
    }
}
