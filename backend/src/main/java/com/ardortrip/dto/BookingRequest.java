package com.ardortrip.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingRequest {
    @NotNull
    private Long flightId;

    @NotBlank
    private String seatNumber;

    @NotBlank
    private String passengerName;

    @NotBlank
    @Email
    private String passengerEmail;

    private String passengerPassport;

    @NotBlank
    private String paymentMethod; // e.g. "CREDIT_CARD"

    private String cardNumber; // Mocked card details

    public BookingRequest() {}

    public Long getFlightId() { return flightId; }
    public void setFlightId(Long flightId) { this.flightId = flightId; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public String getPassengerEmail() { return passengerEmail; }
    public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }
    public String getPassengerPassport() { return passengerPassport; }
    public void setPassengerPassport(String passengerPassport) { this.passengerPassport = passengerPassport; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
}
