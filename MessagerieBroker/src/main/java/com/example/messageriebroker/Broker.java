package com.example.messageriebroker;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.io.IOException;
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

    private Map<String, Set<Subscriber>> subscribers = new HashMap<>();

    public boolean deregister(String topic, Subscriber subscriber) {
        final Set<Subscriber> subs = this.subscribers.get(topic);
        subscriber.removeTopic(topic);
        return subs.remove(subscriber);
    }

    public boolean register(String topic, Subscriber subscriber) {
        boolean returnVal;
        if (subscribers.containsKey(topic)) {
            returnVal = subscribers.get(topic).add(subscriber);
        } else {
            JedisPool jedisPool = new JedisPool(new JedisPoolConfig(), "localhost", 6379);

            try (Jedis jedis = jedisPool.getResource()) {
                if(!jedis.zrange("topics", 0, -1).contains(topic)) {
                    jedis.zadd("topics", 0, topic);
                    new Topic(topic);
                }
                jedisPool.close();
            }

            Set<Subscriber> sub = new HashSet<>();
            returnVal = sub.add(subscriber);
            subscribers.put(topic, sub);
        }
        subscriber.addTopic(topic);
        return returnVal;
    }

    public void sendMessage(String topic, Subscriber subscriber, String message){
        Topic topicInstance = Topic.getTopicByName(topic);
        topicInstance.sendMessage(message);

        final Set<Subscriber> sub = this.subscribers.get(topic);
        if(sub != null) {
            sub.parallelStream().forEach(s -> {
                if (s != subscriber) {
                    try {
                        s.update(topic, message);
                    } catch (IOException | InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }
}