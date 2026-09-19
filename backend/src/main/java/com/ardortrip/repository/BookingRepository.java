package com.ardortrip.repository;

import com.ardortrip.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByPnr(String pnr);
    List<Booking> findByUserUsernameOrderByBookingDateDesc(String username);
    List<Booking> findAllByOrderByBookingDateDesc();
}
