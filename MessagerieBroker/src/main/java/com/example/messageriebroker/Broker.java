package com.example.messageriebroker;

import com.example.messageriebroker.models.Message;
import com.example.messageriebroker.models.User;
import com.example.messageriebroker.models.Topic;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public final class  Broker {
    private static Broker brokerInstance;
    private Broker(){

    }
    public static Broker getInstance(){
        if(null == brokerInstance){
            brokerInstance = new Broker();
        }
        return brokerInstance;
    }

    private Map<String, Set<User>> subscribers = new HashMap<>();

    public boolean deregister(String topic, User user) {
        final Set<User> subs = this.subscribers.get(topic);
        user.removeTopic(topic);
        return subs.remove(user);
    }

    public boolean register(String topic, User user) {
        boolean returnVal;
        if (subscribers.containsKey(topic)) {
            returnVal = subscribers.get(topic).add(user);
        } else {
            JedisPool jedisPool = new JedisPool(new JedisPoolConfig(), "localhost", 6379);

            try (Jedis jedis = jedisPool.getResource()) {
                if(!jedis.zrange("topics", 0, -1).contains(topic)) {
                    jedis.zadd("topics", 0, topic);
                    new Topic(topic);
                }
                jedisPool.close();
            }

            Set<User> sub = new HashSet<>();
            returnVal = sub.add(user);
            subscribers.put(topic, sub);
        }
        user.addTopic(topic);
        return returnVal;
    }

    public void sendMessage(String topic, User user, Message message){
        Topic topicInstance = Topic.getTopicByName(topic);
        topicInstance.sendMessage(message);

        final Set<User> sub = this.subscribers.get(topic);
        if(sub != null) {
            sub.parallelStream().forEach(s -> {
                if (s != user) {
                    try {
                        s.update(topic, message);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }
}