package com.example.messageriebroker;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.*;

@SpringBootApplication
@RestController
public class MessagerieBrokerApplication {

    public static void main(String[] args) {
        JedisPool jedisPool = new JedisPool(new JedisPoolConfig(), "localhost", 6379);

        try (Jedis jedis = jedisPool.getResource()) {
            Set<String> keys = jedis.zrange("topics", 0, -1);

            for (String key : keys) {
                System.out.print(key + " : ");
                Topic topic = new Topic(key);
                for (String message : jedis.zrange(key, 0, -1)) {
                    System.out.print(message + "; ");
                    topic.sendMessage(message);
                }
                System.out.println();
            }

            jedisPool.close();
        }

        SpringApplication.run(MessagerieBrokerApplication.class, args);
    }

}
