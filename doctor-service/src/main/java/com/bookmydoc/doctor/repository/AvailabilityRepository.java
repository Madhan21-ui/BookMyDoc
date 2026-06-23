package com.bookmydoc.doctor.repository;

import com.bookmydoc.doctor.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilityRepository
                extends JpaRepository<Availability, Long> {

        List<Availability> findByDoctorId(
                        Long doctorId);

        List<Availability> findByDoctorIdAndDate(
                        Long doctorId,
                        String date);

        Availability findByDoctorIdAndDateAndSlotTime(
                        Long doctorId,
                        String date,
                        String slotTime);
}