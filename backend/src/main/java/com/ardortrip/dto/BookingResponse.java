package com.ardortrip.dto;

import com.ardortrip.model.Booking;
import com.ardortrip.model.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {
    private String pnr;
    private String flightNumber;
    private String airline;
    private String route;
    private LocalDateTime departureTime;
    private String seatNumber;
    private String passengerName;
    private String passengerEmail;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private String transactionId;
    private LocalDateTime bookingDate;

    public BookingResponse(Booking booking) {
        this.pnr = booking.getPnr();
        this.flightNumber = booking.getFlight().getFlightNumber();
        this.airline = booking.getFlight().getAirline();
        this.route = booking.getFlight().getDepartureAirport().getCode() + " -> " + booking.getFlight().getArrivalAirport().getCode();
        this.departureTime = booking.getFlight().getDepartureTime();
        this.seatNumber = booking.getSeatNumber();
        if (!booking.getPassengers().isEmpty()) {
            this.passengerName = booking.getPassengers().get(0).getFullName();
            this.passengerEmail = booking.getPassengers().get(0).getEmail();
        }
        this.totalAmount = booking.getTotalAmount();
        this.status = booking.getStatus();
        if (booking.getPayment() != null) {
            this.transactionId = booking.getPayment().getTransactionId();
        }
        this.bookingDate = booking.getBookingDate();
    }

    public String getPnr() { return pnr; }
    public String getFlightNumber() { return flightNumber; }
    public String getAirline() { return airline; }
    public String getRoute() { return route; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public String getSeatNumber() { return seatNumber; }
    public String getPassengerName() { return passengerName; }
    public String getPassengerEmail() { return passengerEmail; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public BookingStatus getStatus() { return status; }
    public String getTransactionId() { return transactionId; }
    public LocalDateTime getBookingDate() { return bookingDate; }
}
