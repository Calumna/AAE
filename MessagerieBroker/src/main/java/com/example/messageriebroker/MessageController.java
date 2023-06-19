package com.example.messageriebroker;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.ArrayList;
import java.util.Set;

@RestController
@Controller
public class MessageController {
    @Autowired
    private SimpMessagingTemplate template;

    @CrossOrigin(origins = "*")
    @GetMapping("/getTopics")
    public ResponseEntity<ArrayList<String>> getTopicsSubscribed(@RequestBody JsonNode username) {
        JsonNode user = username.get("username");

        if (user != null && Subscriber.getSubscriberByUsername(user.asText()) == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        ArrayList<String> topics = new ArrayList<>();

        if (user == null) {
            for (Topic t : Topic.getTopics()) {
                topics.add(t.getName());
            }
        } else {
            topics = Subscriber.getSubscriberByUsername(user.asText()).getTopicSubscribed();
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(topics);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/register")
    public ResponseEntity register(@RequestBody JsonNode register) {
        JsonNode username = register.get("username");
        JsonNode topic = register.get("topic");

        if (username.isNull() || topic.isNull() || Subscriber.getSubscriberByUsername(username.asText()) == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        Broker.getInstance().register(topic.asText(), Subscriber.getSubscriberByUsername(username.asText()));

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/deregister")
    public ResponseEntity deregister(@RequestBody JsonNode deregister) {
        JsonNode username = deregister.get("username");
        JsonNode topic = deregister.get("topic");

        if (username.isNull() || topic.isNull() || Subscriber.getSubscriberByUsername(username.asText()) == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        Broker.getInstance().deregister(topic.asText(), Subscriber.getSubscriberByUsername(username.asText()));

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/getLastMessages")
    public ResponseEntity<ArrayList<String>> getLastMessages(@RequestBody JsonNode fil) {
        JsonNode topic = fil.get("topic");

        if (topic.isNull()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Topic.getTopicByName(topic.asText()).getMessages());
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/sendMessage")
    public ResponseEntity sendMessage(@RequestBody JsonNode message) {
        JsonNode topic = message.get("topic");
        JsonNode content = message.get("content");
        JsonNode username = message.get("username");

        if (topic.isNull() || message.isNull() || Subscriber.getSubscriberByUsername(username.asText()) == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        JedisPool jedisPool = new JedisPool(new JedisPoolConfig(), "localhost", 6379);

        try (Jedis jedis = jedisPool.getResource()) {
            Broker.getInstance().sendMessage(topic.asText(), Subscriber.getSubscriberByUsername(username.asText()), content.asText());
            jedis.zadd(topic.asText(), 0, content.asText());

            jedisPool.close();
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }
}
