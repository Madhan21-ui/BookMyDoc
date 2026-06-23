package com.bookmydoc.doctor.controller;

import com.bookmydoc.doctor.entity.Doctor;
import com.bookmydoc.doctor.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @PostMapping("/login")
    public Doctor loginDoctor(
            @RequestBody Doctor loginDoctor) {

        System.out.println("Email: " + loginDoctor.getEmail());
        System.out.println("Password: " + loginDoctor.getPassword());

        Doctor doctor = doctorRepository
                .findByEmail(loginDoctor.getEmail())
                .orElse(null);

        System.out.println("Doctor Found: " + doctor);

        if (doctor == null) {
            return null;
        }

        if (!doctor.getPassword()
                .equals(loginDoctor.getPassword())) {
            return null;
        }

        return doctor;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @GetMapping("/{id}")
    public Doctor getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Doctor updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor doctor) {

        Doctor existing = doctorRepository
                .findById(id)
                .orElseThrow();

        existing.setName(
                doctor.getName());

        existing.setEmail(
                doctor.getEmail());

        existing.setSpecialization(
                doctor.getSpecialization());

        existing.setExperience(
                doctor.getExperience());

        existing.setHospitalName(
                doctor.getHospitalName());

        existing.setLocation(
                doctor.getLocation());

        existing.setAvailability(
                doctor.getAvailability());

        return doctorRepository.save(
                existing);
    }

    @DeleteMapping("/{id}")
    public String deleteDoctor(@PathVariable Long id) {
        doctorRepository.deleteById(id);
        return "Doctor Deleted Successfully";
    }
}