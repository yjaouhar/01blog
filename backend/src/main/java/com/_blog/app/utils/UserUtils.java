package com._blog.app.utils;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com._blog.app.entities.UserAccount;
import com._blog.app.model.JwtUserPrincipal;
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
        String username = (user.getLastName() + user.getFirstName()).substring(0, 4);
        if (userRepo.existsByUsername(username)) {
            Random rand = new Random();
            int uniq = rand.nextInt(100) + 1;
            username = username + uniq;
        }
        return username;
    }

    public static JwtUserPrincipal getPrincipal() {
        return (JwtUserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static boolean validBirthday(String birthday) {
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
        return age >= 10;
    }

    public static String generatCookie(String key, String value, Duration duration) {
        return ResponseCookie.from(key, value).
                httpOnly(true).
                secure(false).
                path("/").
                maxAge(duration).
                sameSite("Lax")
                .build().toString();

    }

    public static String removeCookies(String key) {
        return ResponseCookie.from(key, "").path("/").maxAge(0)
                .build().toString();

    }

    public static boolean haveAccess(UserAccount profile, UserAccount user) {
        return profile.getId().equals(user.getId());
    }
}
