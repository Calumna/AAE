package com.example.messageriebroker;

import org.springframework.stereotype.Controller;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;

public class Subscriber {
    private String username;
    private static ArrayList<Subscriber> listOfClients = new ArrayList<>();
    private ArrayList<String> topicSubscribed = new ArrayList<>();

    public Subscriber(String username){
        this.username = username;
        listOfClients.add(this);
    }

    public void update(String topic, Message message) {
        System.out.println(message.toJson());

        /*String url = "http://localhost:8080/newMessage/user/queue/specific-user";
        String body = String.format("{\"topic\": \"%s\", \"date\":\"%s\", \"content\":\"%s\", \"username\":\"%s\"}",
                topic, message.getDate(), message.getContent(), username);

        HttpClient httpClient = HttpClient.newHttpClient();
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());*/

        MessageController.getInstance().newMessage(message);
    }

    public void addTopic(String topic){
        topicSubscribed.add(topic);
    }

    public void removeTopic(String topic){
        topicSubscribed.remove(topic);
    }

    public ArrayList<String> getTopicSubscribed(){
        return topicSubscribed;
    }

    public static ArrayList<Subscriber> getListOfClients(){
        return listOfClients;
    }

    public static Subscriber getSubscriberByUsername(String username){
        for(Subscriber subscriber : listOfClients){
            if(subscriber.username.equals(username))
                return subscriber;
        }
        return null;
    }

    public static void deleteSubscriber(String username){
        Subscriber subToRemove = null;
        for(Subscriber subscriber : listOfClients){
            if(subscriber.username.equals(username))
                subToRemove = subscriber;
        }
        listOfClients.remove(subToRemove);
    }
}