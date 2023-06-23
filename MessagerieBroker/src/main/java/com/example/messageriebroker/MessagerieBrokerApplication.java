package com.example.messageriebroker;

import com.example.messageriebroker.models.Message;
import com.example.messageriebroker.models.Topic;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
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
            //jedis.flushAll();
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
            }
            jedisPool.close();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        //ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        SpringApplication.run(MessagerieBrokerApplication.class, args);
    }

}
