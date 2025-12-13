package com._blog.app.utils;

import java.time.LocalDate;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com._blog.app.entities.UserAccount;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
// @AllArgsConstructor
@Component
public class UserUtils {

    @Autowired
    private UserRepo userRepo;

    public UserAccount findUserByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "user not found"));
    }

    public UserAccount findUserById(UUID id) {
        return userRepo.findById(id)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "user not found"));
    }

    public String generatUsername(UserAccount user) {
        String username = (user.getLastName() + user.getFirstName()).substring(0, 8);
        if (userRepo.existsByUsername(username)) {
            Random rand = new Random();
            int uniq = rand.nextInt(100) + 1;
            username = username + uniq;
        }
        return username;
    }

    // const birthDate  = new Date(input);
    // const currentDate  = new Date()
    // let age = currentDate.getFullYear() - birthDate.getFullYear();
    // const hasHadBirthdayThisYear 
    //         = currentDate.getMonth() > birthDate.getMonth()
    //         || (currentDate.getMonth() == = birthDate.getMonth()
    //         && currentDate.getDate() >= birthDate.getDate());
    // if (!hasHadBirthdayThisYear) {
    //   age--;
    // }
    // return age >= 10;
    public boolean validBirthday(String birthday) {
        LocalDate birthDate = LocalDate.parse(birthday);
        LocalDate currentDate = LocalDate.now();

        if (birthDate.isAfter(currentDate)) {
            return false;
        }

        int age = currentDate.getYear() - birthDate.getYear();

        boolean hasHadBirthdayThisYear
                = currentDate.getMonthValue() > birthDate.getMonthValue()
                || (currentDate.getMonthValue() == birthDate.getMonthValue()
                && currentDate.getDayOfMonth() >= birthDate.getDayOfMonth());

        if (!hasHadBirthdayThisYear) {
            age--;
        }
        System.out.println(":---------> " + age);
        return age >= 10;
    }
}
