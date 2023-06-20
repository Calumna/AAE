package com.example.messageriebroker.controllers;

import com.example.messageriebroker.models.User;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@RestController
public class AuthentificationController {
    @CrossOrigin(origins = "*")
    @PostMapping("/signUp")
    public ResponseEntity<Boolean> signUp(@RequestBody JsonNode informations) {
        JsonNode username = informations.get("username");
        JsonNode password = informations.get("password");

        Boolean validUsername = true;

        if (username.isNull() || password.isNull()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        JedisPool jedisPool = new JedisPool(new JedisPoolConfig(), "localhost", 6379);

        try (Jedis jedis = jedisPool.getResource()) {
            if (jedis.get(username.asText()) != null)
                validUsername = false;
            else {
                jedis.set(username.asText(), password.asText());
                new User(username.asText());
            }

            jedisPool.close();
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(validUsername);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/deleteUsername")
    public ResponseEntity deleteUsername(@RequestBody JsonNode informations) {
        JsonNode username = informations.get("username");

        if (username.isNull()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        JedisPool jedisPool = new JedisPool(new JedisPoolConfig(), "localhost", 6379);

        try (Jedis jedis = jedisPool.getResource()) {
            if (jedis.get(username.asText()) == null)
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(null);
            else {
                jedis.del(username.asText());
                User.deleteSubscriber(username.asText());
            }

            jedisPool.close();
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/signIn")
    public ResponseEntity<Boolean> signIn(@RequestBody JsonNode informations) {
        JsonNode username = informations.get("username");
        JsonNode password = informations.get("password");

        Boolean correctPassword = false;

        if (username.isNull() || password.isNull()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        JedisPool jedisPool = new JedisPool(new JedisPoolConfig(), "localhost", 6379);

        try (Jedis jedis = jedisPool.getResource()) {
            String value = jedis.get(username.asText());

            if (value != null && value.equals(password.asText())) {
                correctPassword = true;
                if (User.getSubscriberByUsername(username.asText()) == null) {
                    new User(username.asText());
                }
            }

            jedisPool.close();
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(correctPassword);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/signOut")
    public ResponseEntity<Boolean> signOut(@RequestBody JsonNode informations) {
        JsonNode username = informations.get("username");

        Boolean usernameExists = true;

        if (username.isNull() ) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        if(User.getSubscriberByUsername(username.asText()) == null)
            usernameExists = false;

        else{
            User.deleteSubscriber(username.asText());
        }


        return ResponseEntity
                .status(HttpStatus.OK)
                .body(usernameExists);
    }
}
