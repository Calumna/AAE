package com.example.messageriebroker;

import com.example.messageriebroker.controllers.MessageController;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WebSocketHandler extends TextWebSocketHandler {
    private static WebSocketHandler webSocketHandler;

    public static WebSocketHandler getInstance() {
        if (null == webSocketHandler) {
            webSocketHandler = new WebSocketHandler();
        }
        return webSocketHandler;
    }

    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    private String getUsernameFromSession(WebSocketSession session) {
        return (String) session.getAttributes().get("username");
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(getUsernameFromSession(session), session);
    }


    public void sendMessageToUser(String username, String message) throws IOException {
        System.out.println(username);
        WebSocketSession session = sessions.get(username);
        if (session != null && session.isOpen()) {
            session.sendMessage(new TextMessage(message));
        }
    }
}
