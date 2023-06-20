import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {MessageData} from "../../types";
import {getMessages} from "./topics";
import Message from "./message";
import {Divider, Fab, FormControl, Grid, List, TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

const Topic = () => {
    let { topicId } = useParams();
    const [messages, setMessages] = useState<MessageData[]>([]);

    const [messageToSend, setMessageToSend] = useState<string>('');
    const onChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessageToSend(event.target.value);
    }

    const handleSend = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (messageToSend !== '') {
            const newMessage: MessageData = {
                userName: 'toto',
                date: Date().toLocaleString(),
                text: messageToSend
            }
            setMessages([
                ...messages,
                newMessage
            ]);
            setMessageToSend('');
        }
    }

    useEffect(() => {
        if (topicId !== undefined) {
            setMessages(getMessages(topicId));
        }
    }, [topicId]);

    return (
        <div>
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
                     position: 'fixed'
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