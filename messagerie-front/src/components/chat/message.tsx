import React from "react";
import Typography from '@mui/material/Typography';
import {MessageData} from "../../types";
import {Divider, ListItem, ListItemText} from "@mui/material";

const Message: React.FC<{message: MessageData}> = ({ message}) => {
    return (
        <>
            <ListItem alignItems="flex-start">
                <ListItemText
                    primary={message.content}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.secondary"
                            >
                                {message.username} - {message.date}
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider component="li" />
        </>
    )
}

export default Message;