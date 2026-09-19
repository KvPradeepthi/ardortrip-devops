package com.ardortrip.dto;

import com.ardortrip.model.Flight;
import com.ardortrip.model.FlightClass;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FlightResponse {
    private Long id;
    private String flightNumber;
    private String airline;
    private String departureAirportCode;
    private String departureCity;
    private String arrivalAirportCode;
    private String arrivalCity;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal price;
    private int availableSeats;
    private int totalSeats;
    private FlightClass flightClass;

    public FlightResponse(Flight flight) {
        this.id = flight.getId();
        this.flightNumber = flight.getFlightNumber();
        this.airline = flight.getAirline();
        this.departureAirportCode = flight.getDepartureAirport().getCode();
        this.departureCity = flight.getDepartureAirport().getCity();
        this.arrivalAirportCode = flight.getArrivalAirport().getCode();
        this.arrivalCity = flight.getArrivalAirport().getCity();
        this.departureTime = flight.getDepartureTime();
        this.arrivalTime = flight.getArrivalTime();
        this.price = flight.getPrice();
        this.availableSeats = flight.getAvailableSeats();
        this.totalSeats = flight.getTotalSeats();
        this.flightClass = flight.getFlightClass();
    }

    public Long getId() { return id; }
    public String getFlightNumber() { return flightNumber; }
    public String getAirline() { return airline; }
    public String getDepartureAirportCode() { return departureAirportCode; }
    public String getDepartureCity() { return departureCity; }
    public String getArrivalAirportCode() { return arrivalAirportCode; }
    public String getArrivalCity() { return arrivalCity; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public BigDecimal getPrice() { return price; }
    public int getAvailableSeats() { return availableSeats; }
    public int getTotalSeats() { return totalSeats; }
    public FlightClass getFlightClass() { return flightClass; }
}
