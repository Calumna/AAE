import React, {useEffect, useState} from "react";
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
import {useNavigate, useOutletContext} from "react-router-dom";

const AddTopic = () => {
    const [topicsLoaded, setTopicsLoaded] = useState<boolean>(false);
    const [topics, setTopics] = useState<string[]>([]);
    const [topicToAdd, setTopicToAdd] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [addNewTopic, setAddNewTopic] = useState<boolean>(false);
    const navigate = useNavigate();
    const username = useOutletContext<string>();

    useEffect(()=>{
        if(!topicsLoaded){
            getTopics().then(t => {
                setTopics(t);
                setTopicsLoaded(true);
            });
        }
    })


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
        }
    }

    useEffect(() => {
        if (addNewTopic) {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username:username, topic: topicToAdd})
            };
            fetch('http://localhost:8080/register', requestOptions)
                .then(
                    () => {
                        setTopics([...topics, topicToAdd]);
                        navigate(`/topics/${topicToAdd}`, {replace: true});
                    })
        }
    }, [addNewTopic,topics, topicToAdd, navigate]);

    const handleConfirmation = () => {
        setAddNewTopic(true);
        setOpenDialog(false);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
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