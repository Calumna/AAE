package com.example.messageriebroker;

import java.util.ArrayList;

public class Topic {
    private String name;
    private ArrayList<Message> messages = new ArrayList<>();
    private static ArrayList<Topic> topics = new ArrayList<>();

    public Topic(String name){
        this.name = name;
        topics.add(this);
    }

    public String getName(){
        return name;
    }

    public void sendMessage(Message message){
        messages.add(message);
    }

    public ArrayList<Message> getMessages(){
        return messages;
    }

    public static ArrayList<Topic> getTopics(){
        return topics;
    }

    public static Topic getTopicByName(String name){
        for(Topic topic : topics){
            if(topic.name.equals(name))
                return topic;
        }
        return null;
    }
}
