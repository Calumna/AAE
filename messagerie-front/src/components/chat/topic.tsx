import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {MessageData} from "../../types";
import {getMessages} from "./topics";
import Message from "./message";
import { List } from "@mui/material";



const Topic = () => {
    let { topicId } = useParams();
    const [messages, setMessages] = useState<MessageData[]>([]);

    useEffect(() => {
        if (topicId !== undefined) {
            setMessages(getMessages(topicId));
        }
    }, [messages, topicId]);

    return (
        <div>
            { (messages !== null && messages.length > 0) && (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {messages.map((message: MessageData) => (
                        <Message message={message}/>
                    ))}
                </List>
            )}
        </div>
    )
}

export default Topic;