package com.ardortrip.service;

import com.ardortrip.dto.BookingRequest;
import com.ardortrip.dto.BookingResponse;
import com.ardortrip.model.*;
import com.ardortrip.repository.BookingRepository;
import com.ardortrip.repository.FlightRepository;
import com.ardortrip.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookingService bookingService;

    private Flight testFlight;

    @BeforeEach
    void setUp() {
        Airport origin = new Airport("DEL", "Delhi Airport", "New Delhi", "India");
        Airport dest = new Airport("BLR", "Bangalore Airport", "Bengaluru", "India");

        testFlight = new Flight();
        testFlight.setId(1L);
        testFlight.setFlightNumber("AT-101");
        testFlight.setAirline("Ardor Airways");
        testFlight.setDepartureAirport(origin);
        testFlight.setArrivalAirport(dest);
        testFlight.setDepartureTime(LocalDateTime.now().plusDays(1));
        testFlight.setArrivalTime(LocalDateTime.now().plusDays(1).plusHours(2));
        testFlight.setPrice(BigDecimal.valueOf(120.00));
        testFlight.setAvailableSeats(10);
        testFlight.setTotalSeats(100);
        testFlight.setFlightClass(FlightClass.ECONOMY);
    }

    @Test
    void testCreateBookingSuccess() {
        BookingRequest request = new BookingRequest();
        request.setFlightId(1L);
        request.setSeatNumber("14A");
        request.setPassengerName("John Doe");
        request.setPassengerEmail("john@example.com");
        request.setPaymentMethod("CREDIT_CARD");

        when(flightRepository.findById(1L)).thenReturn(Optional.of(testFlight));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.createBooking(request);

        assertNotNull(response);
        assertNotNull(response.getPnr());
        assertTrue(response.getPnr().startsWith("AT"));
        assertEquals("AT-101", response.getFlightNumber());
        assertEquals("14A", response.getSeatNumber());
        assertEquals(BookingStatus.CONFIRMED, response.getStatus());
        assertEquals(9, testFlight.getAvailableSeats()); // Available seat decremented
        assertNotNull(response.getTransactionId());
    }

    @Test
    void testCreateBookingNoSeatsAvailableThrowsException() {
        testFlight.setAvailableSeats(0);
        BookingRequest request = new BookingRequest();
        request.setFlightId(1L);

        when(flightRepository.findById(1L)).thenReturn(Optional.of(testFlight));

        assertThrows(RuntimeException.class, () -> bookingService.createBooking(request));
    }
}
