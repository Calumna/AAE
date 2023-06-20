import React, {useEffect, useState} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {MessageData} from "../../types";
import Message from "./message";
import { Fab, Grid, List, TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

const Topic = () => {
    let { topicId } = useParams();
    const username = useOutletContext<string>();

    const [messages, setMessages] = useState<MessageData[]>([]);
    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const [currentTopic, setCurrentTopic] = useState("");

    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageToSend, setMessageToSend] = useState<string>('');
    const [newMessageToSend, setNewMessageToSend] = useState<MessageData>();

    const onChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessageToSend(event.target.value);
    }

    useEffect(()=> {
        if (topicId !== currentTopic) {
            setCurrentTopic(topicId as string);
            setMessagesLoaded(false);
        }

      if(!messagesLoaded && window.location.pathname.endsWith(topicId as string)){
          const requestOptions = {
              method: 'GET',
              headers: {'Content-Type': 'application/json'}
          };
          fetch('http://localhost:8080/getLastMessages/' + topicId, requestOptions).then(response => response.json())
              .then(
                  (result) => {
                      setMessages(result);
                      setMessagesLoaded(true);
                  }
              );
      }
    }, [topicId, messagesLoaded, currentTopic])

    useEffect(()=>{
        if(sendingMessage){
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username:username, topic: topicId, date:newMessageToSend?.date, content:newMessageToSend?.content})
            };
            fetch('http://localhost:8080/sendMessage', requestOptions);
        }
    })

    const handleSend = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (messageToSend !== '') {
            const newMessage: MessageData = {
                username: username,
                date: Date().toLocaleString(),
                content: messageToSend
            }
            setNewMessageToSend(newMessage);
            setSendingMessage(true);
            setMessages([
                ...messages,
                newMessage
            ]);
            setMessageToSend('');
        }
    }

    return (
        <div style={{height: '100%', position: 'relative'}}>
            { (messages !== null && messages.length > 0) && (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {messages.map((message: MessageData) => (
                        <Message message={message}/>
                    ))}
                </List>
            )}
            <Grid
                container
                direction="row"
                spacing={3}
                alignItems="center"
                 sx={{
                     padding: '20px',
                     bottom: '0',
                     right: '0',
                     position: 'absolute'
            }}>
                <Grid item xs={11}>
                    <TextField
                        type="text"
                        id="outlined-basic-email"
                        placeholder="Type your message here"
                        value={messageToSend}
                        onChange={onChangeMessage}
                        fullWidth
                        multiline
                        maxRows={4}/>
                </Grid>
                <Grid item xs={1}>
                    <Fab onClick={handleSend} color="primary" aria-label="add"><SendIcon /></Fab>
                </Grid>
            </Grid>
        </div>
    )
}

export default Topic;