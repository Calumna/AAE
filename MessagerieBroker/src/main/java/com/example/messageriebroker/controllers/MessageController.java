package com.example.messageriebroker.controllers;

import com.example.messageriebroker.Broker;
import com.example.messageriebroker.models.Message;
import com.example.messageriebroker.models.User;
import com.example.messageriebroker.models.Topic;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.ArrayList;

@RestController
@Controller
public class MessageController {
    private static MessageController messageControllerInstance;

    @Autowired
    public SimpMessageSendingOperations messagingTemplate;

    public static MessageController getInstance() {
        if (null == messageControllerInstance) {
            messageControllerInstance = new MessageController();
        }
        return messageControllerInstance;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/getTopics")
    public ResponseEntity<ArrayList<String>> getTopicsSubscribed(@RequestParam(required = false) String username) {
        if (username != null && User.getSubscriberByUsername(username) == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        ArrayList<String> topics = new ArrayList<>();

        if (username == null) {
            for (Topic t : Topic.getTopics()) {
                topics.add(t.getName());
            }
        } else {
            topics = User.getSubscriberByUsername(username).getTopicSubscribed();
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
        
        if (username.isNull() || topic.isNull() || User.getSubscriberByUsername(username.asText()) == null) {
            System.out.println("fuck you");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        Broker.getInstance().register(topic.asText(), User.getSubscriberByUsername(username.asText()));

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/deregister")
    public ResponseEntity deregister(@RequestBody JsonNode deregister) {
        JsonNode username = deregister.get("username");
        JsonNode topic = deregister.get("topic");

        if (username.isNull() || topic.isNull() || User.getSubscriberByUsername(username.asText()) == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        Broker.getInstance().deregister(topic.asText(), User.getSubscriberByUsername(username.asText()));

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/getLastMessages/{topic}")
    public ResponseEntity<ArrayList<Message>> getLastMessages(@PathVariable String topic) {
        if (topic.equals("")) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        for(Message m : Topic.getTopicByName(topic).getMessages()){
            System.out.println(m.toJson());
        }
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Topic.getTopicByName(topic).getMessages());
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/sendMessage")
    public ResponseEntity sendMessage(@RequestBody JsonNode message) {
        JsonNode topic = message.get("topic");
        JsonNode date = message.get("date");
        JsonNode content = message.get("content");
        JsonNode username = message.get("username");

        Message m = new Message(username.asText(), topic.asText(), date.asText(), content.asText());

        if (topic.isNull() || message.isNull() || User.getSubscriberByUsername(username.asText()) == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        JedisPool jedisPool = new JedisPool(new JedisPoolConfig(), "localhost", 6379);

        try (Jedis jedis = jedisPool.getResource()) {
            Broker.getInstance().sendMessage(topic.asText(), User.getSubscriberByUsername(username.asText()), m);
            jedis.zadd(topic.asText(), 0, m.toJson());

            jedisPool.close();
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(null);
    }

    public void newMessage(Message message){
        System.out.println("ici");
        messagingTemplate.convertAndSend("/topîc", message.toJson());
    }
}
