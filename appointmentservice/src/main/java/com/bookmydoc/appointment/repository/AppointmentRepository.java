package com.bookmydoc.appointment.repository;

import com.bookmydoc.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserEmail(
            String userEmail);

    List<Appointment> findByDoctorId(
            Long doctorId);
}