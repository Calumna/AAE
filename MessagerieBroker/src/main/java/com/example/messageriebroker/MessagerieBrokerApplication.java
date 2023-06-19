package com.example.messageriebroker;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
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
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode messageJson = mapper.readTree(message);
                    Message m = new Message(messageJson.get("username").asText(), key, messageJson.get("date").asText(), messageJson.get("content").asText());
                    topic.sendMessage(m);
                }
                System.out.println();
            }

            jedisPool.close();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        SpringApplication.run(MessagerieBrokerApplication.class, args);
    }

}
