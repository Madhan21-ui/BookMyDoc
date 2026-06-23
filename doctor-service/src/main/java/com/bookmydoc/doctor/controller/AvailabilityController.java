package com.bookmydoc.doctor.controller;

import com.bookmydoc.doctor.entity.Availability;
import com.bookmydoc.doctor.repository.AvailabilityRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/availability")
public class AvailabilityController {

    private final AvailabilityRepository availabilityRepository;

    public AvailabilityController(
            AvailabilityRepository availabilityRepository) {

        this.availabilityRepository = availabilityRepository;
    }

    // Create Slot

    @PostMapping
    public Availability createAvailability(
            @RequestBody Availability availability) {

        return availabilityRepository.save(
                availability);
    }

    // Get All Slots

    @GetMapping
    public List<Availability> getAllAvailability() {

        return availabilityRepository.findAll();
    }

    // Get Slots By Doctor

    @GetMapping("/doctor/{doctorId}")
    public List<Availability> getSlotsByDoctor(
            @PathVariable Long doctorId) {

        return availabilityRepository
                .findByDoctorId(
                        doctorId);
    }

    // Get Available Slots By Doctor And Date

    @GetMapping("/doctor/{doctorId}/{date}")
    public List<Availability> getSlotsByDoctorAndDate(
            @PathVariable Long doctorId,
            @PathVariable String date) {

        return availabilityRepository
                .findByDoctorIdAndDate(
                        doctorId,
                        date)
                .stream()
                .filter(
                        Availability::getAvailable)
                .toList();
    }

    // Delete Slot

    @DeleteMapping("/{id}")
    public String deleteSlot(
            @PathVariable Long id) {

        availabilityRepository
                .deleteById(id);

        return "Availability Slot Deleted";
    }

    @PutMapping("/book-slot")
    public Availability bookSlot(
            @RequestParam Long doctorId,
            @RequestParam String date,
            @RequestParam String slotTime) {

        Availability slot = availabilityRepository
                .findByDoctorIdAndDateAndSlotTime(
                        doctorId,
                        date,
                        slotTime);

        if (slot == null) {
            return null;
        }

        slot.setAvailable(false);

        return availabilityRepository.save(slot);
    }
}