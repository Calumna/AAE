import React, {useState} from "react";
import {getTopics} from "./topics";
import {
    Autocomplete,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField
} from "@mui/material";
import {AddCircleOutline} from "@mui/icons-material";
import { Navigate } from "react-router-dom";

const AddTopic = () => {
    const topics = getTopics();
    const [topicToAdd, setTopicToAdd] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [addNewTopic, setAddNewTopic] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const onChangeTopicToAdd = (event: React.SyntheticEvent, value: string, reason: string) => {
        setTopicToAdd(value);
    }

    const handleAddTopic = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (topicToAdd !== '') {
            if (!topics.includes(topicToAdd)) {
                setOpenDialog(true);
            } else {
                setAddNewTopic(true);
            }
            if (addNewTopic) {
                // Register topic
                setRedirect(true);
            }
        }
    }

    const handleConfirmation = () => {
        setAddNewTopic(true);
        setOpenDialog(false);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            {redirect && <Navigate to={`/topics/${topicToAdd}`} /> }
            <Grid
                component='form'
                container
                direction="row"
                spacing={3}
                alignItems="center"
                sx={{
                    paddingTop:'20px'
                }}
            >
                <Grid item xs={10}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-topics"
                        renderInput={(params) => <TextField {...params} label="Topic" />}
                        freeSolo
                        options={topics}
                        onInputChange={onChangeTopicToAdd}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutline/>}
                        size="large"
                        onClick={handleAddTopic}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Add a new topic ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This topic does not exist.
                        Do you wish to create this new topic :
                        <span style={{fontWeight: 'bold'}}> {topicToAdd} </span> ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}> No </Button>
                    <Button onClick={handleConfirmation} autoFocus> Yes </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddTopic;