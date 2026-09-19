package com.ardortrip.service;

import com.ardortrip.dto.BookingRequest;
import com.ardortrip.dto.BookingResponse;
import com.ardortrip.model.*;
import com.ardortrip.repository.BookingRepository;
import com.ardortrip.repository.FlightRepository;
import com.ardortrip.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          FlightRepository flightRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found: " + request.getFlightId()));

        if (flight.getAvailableSeats() <= 0) {
            throw new RuntimeException("Flight has no available seats remaining");
        }

        // Decrement available seat count
        flight.setAvailableSeats(flight.getAvailableSeats() - 1);
        flightRepository.save(flight);

        // Generate clean 6-character PNR code
        String pnr = "AT" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Booking booking = new Booking();
        booking.setPnr(pnr);
        booking.setFlight(flight);
        booking.setSeatNumber(request.getSeatNumber());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setTotalAmount(flight.getPrice());
        booking.setBookingDate(LocalDateTime.now());

        // Attach user if logged in
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            userRepository.findByUsername(auth.getName()).ifPresent(booking::setUser);
        }

        // Add Passenger
        Passenger passenger = new Passenger(booking, request.getPassengerName(), request.getPassengerEmail(), request.getPassengerPassport());
        booking.getPassengers().add(passenger);

        // Simulated Mock Payment Confirmation
        String txnId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Payment payment = new Payment(booking, flight.getPrice(), request.getPaymentMethod(), txnId, PaymentStatus.SUCCESS);
        booking.setPayment(payment);

        Booking savedBooking = bookingRepository.save(booking);
        return new BookingResponse(savedBooking);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByPnr(String pnr) {
        Booking booking = bookingRepository.findByPnr(pnr.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Booking not found for PNR: " + pnr));
        return new BookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(String username) {
        return bookingRepository.findByUserUsernameOrderByBookingDateDesc(username)
                .stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDesc()
                .stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse cancelBooking(String pnr) {
        Booking booking = bookingRepository.findByPnr(pnr.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Booking not found for PNR: " + pnr));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        // Release seat back to flight
        Flight flight = booking.getFlight();
        flight.setAvailableSeats(flight.getAvailableSeats() + 1);
        flightRepository.save(flight);

        Booking updated = bookingRepository.save(booking);
        return new BookingResponse(updated);
    }
}
