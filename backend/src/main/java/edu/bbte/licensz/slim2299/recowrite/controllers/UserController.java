package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.UserDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.UserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserServiceInterface userService;

    @GetMapping()
    public List<UserDtoOut> getUser() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDtoOut getUserById(@PathVariable("id") long id) {
        return userService.findUserById(id);
    }
}
