import React, {useState} from "react";
import {Route, Routes} from "react-router-dom";
import App from "./App";
import Topic from "./components/chat/topic";
import AddTopic from "./components/chat/add-topic";

const Routing = () => {
    const [username, setUsername] = useState("");
    const [userTopics, setUserTopics] = useState<string[]>([]);

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