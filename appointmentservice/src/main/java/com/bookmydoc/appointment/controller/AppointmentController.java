package com.bookmydoc.appointment.controller;
import com.bookmydoc.appointment.entity.Appointment;
import com.bookmydoc.appointment.repository.AppointmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    public AppointmentController(
            AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getAppointmentsByDoctorId(
            @PathVariable Long doctorId) {

        return appointmentRepository
                .findByDoctorId(doctorId);
    }

    @PostMapping
    public Appointment createAppointment(
            @RequestBody Appointment appointment) {

        System.out.println("Appointment Received:");
        System.out.println(appointment);

        return appointmentRepository.save(appointment);
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(
            @PathVariable Long id) {

        return appointmentRepository
                .findById(id)
                .orElse(null);
    }

    @GetMapping("/user/{email}")
    public List<Appointment> getAppointmentsByUserEmail(
            @PathVariable String email) {

        return appointmentRepository.findByUserEmail(email);
    }

    @PutMapping("/{id}/approve")
    public Appointment approveAppointment(
            @PathVariable Long id) {

        Appointment appointment = appointmentRepository
                .findById(id)
                .orElseThrow();

        appointment.setStatus(
                "APPROVED");

        return appointmentRepository
                .save(appointment);
    }

    @PutMapping("/{id}/reject")
    public Appointment rejectAppointment(
            @PathVariable Long id) {

        Appointment appointment = appointmentRepository
                .findById(id)
                .orElseThrow();

        appointment.setStatus(
                "REJECTED");

        return appointmentRepository
                .save(appointment);
    }

    @DeleteMapping("/{id}")
    public String deleteAppointment(
            @PathVariable Long id) {

        appointmentRepository.deleteById(id);

        return "Appointment Deleted Successfully";
    }
}
