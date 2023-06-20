import React, {useEffect, useState} from "react";
import SockJS from 'sockjs-client';
import {Route, Routes} from "react-router-dom";
import App from "./App";
import Topic from "./components/chat/topic";
import AddTopic from "./components/chat/add-topic";

const Routing = () => {
    const [username, setUsername] = useState("");
    const [userTopics, setUserTopics] = useState<string[]>([]);

    useEffect(() => {
        if (username !== "") {
            const socket = new SockJS('http://localhost:8080/messagerie-websocket'); // Remplacez l'URL par celle de votre serveur WebSocket

            socket.onopen = function () {
                console.log('Connexion WebSocket établie.');
            };

            socket.onmessage = function (e) {
                const message = e.data;
                console.log('Message reçu du serveur :', message);
            };

            socket.onclose = function () {
                console.log('Connexion WebSocket fermée.');
            };

            return () => {
                socket.close(); // Fermez la connexion WebSocket lors du démontage du composant
            };
        }
    }, [username]);


    return (
        <Routes>
            <Route path="/" element={<App username={username} setUsername={setUsername} userTopics={userTopics} setUserTopics={setUserTopics}/>}>
                <Route path="topics">
                    <Route path=":topicId" element={<Topic/>}/>
                    <Route path="addTopic" element={<AddTopic userTopics={userTopics} setUserTopics={setUserTopics}/>}/>
                </Route>
            </Route>
        </Routes>
    )
}

export default Routing;