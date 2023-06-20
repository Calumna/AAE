package com.example.messageriebroker.models;

import java.util.Date;

public class Message {
    private String username;
    private String topic;
    private String date;
    private String content;

    public Message(String username, String topic, String date, String content){
        this.username = username;
        this.topic = topic;
        this.date = date;
        this.content = content;
    }

    public String toJson(){
        return String.format("{\"username\":\"%s\", \"topic\":\"%s\", \"date\":\"%s\", \"content\":\"%s\"}", username, topic, date, content);
    }

}
