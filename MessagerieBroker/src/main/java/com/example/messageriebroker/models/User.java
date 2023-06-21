package com.example.messageriebroker.models;

import com.example.messageriebroker.controllers.MessageController;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;

public class User {
    private String username;
    private static ArrayList<User> listOfClients = new ArrayList<>();
    private ArrayList<String> topicSubscribed = new ArrayList<>();

    public User(String username){
        this.username = username;
        listOfClients.add(this);
    }

    public String getUsername(){
        return username;
    }

    public void update(String topic, Message message) throws IOException, InterruptedException {
        System.out.println(message.toJson());
        String url = "http://localhost:8080/newMessage/" + username;
        String body = message.toJson();
        HttpClient httpClient = HttpClient.newHttpClient();
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        //MessageController.getInstance().newMessage(message);
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

    public static ArrayList<User> getListOfClients(){
        return listOfClients;
    }

    public static User getSubscriberByUsername(String username){
        for(User user : listOfClients){
            if(user.username.equals(username))
                return user;
        }
        return null;
    }

    public static void deleteSubscriber(String username){
        User subToRemove = null;
        for(User user : listOfClients){
            if(user.username.equals(username))
                subToRemove = user;
        }
        listOfClients.remove(subToRemove);
    }
}