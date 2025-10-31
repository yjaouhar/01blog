package com._blog.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public  class Authentication {
    @GetMapping("/register")
    public void register() {
    System.err.println("Register endpoint hit");
   }
}