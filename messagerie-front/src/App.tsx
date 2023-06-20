import React, {useEffect, useState} from 'react';
import {Link, Outlet, useLocation} from "react-router-dom";
import {StyledEngineProvider} from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
    CssBaseline,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    styled,
    useTheme,
    Link as MuiLink
} from "@mui/material";
import { getTopics, getUserTopics } from "./components/chat/topics";
import Connexion from "./components/connexion/connexion";
import Register from "./components/connexion/Register";



const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: 64,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    height: '100%',
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const getPageTitle = (pathname: string) => {
    let pageTitle: string;
    if (pathname === '/') {
        pageTitle = 'Home';
    } else {
        pageTitle = pathname.substring(pathname.lastIndexOf('/')+1);
        if (pageTitle === 'addTopic') {
            pageTitle = 'Add a topic';
        } else {
            pageTitle = pageTitle[0].toUpperCase() + pageTitle.substring(1);
        }

    }
    return pageTitle;
}

interface AppProps {
    username: string,
    setUsername: (s: string) => void,
    userTopics: string[],
    setUserTopics: (t: string[]) => void
}

const App: React.FC<AppProps> = ({username, setUsername, userTopics, setUserTopics}: AppProps) => {
    const location = useLocation();
    const currentPage: string = getPageTitle(location.pathname);
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [topicsLoaded, setTopicsLoaded] = useState<boolean>(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        console.log(username);
        setOpen(false);
    };

    useEffect(() => {
        if(!topicsLoaded){
            if(username!==""){
                getUserTopics(username).then(t => {
                    setUserTopics(t);
                    setTopicsLoaded(true);
                });
            }
        }
    })

    return (
        <div className="App" style={{height: '100%'}}>
            <StyledEngineProvider injectFirst>
                <Box sx={{ flexGrow: 1 }}>
                    <CssBaseline />
                    <AppBar position="fixed" open={open}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{ mr: 2, ...(open && { display: 'none' }) }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap component="div">
                                {currentPage}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                            },
                        }}
                        variant="persistent"
                        anchor="left"
                        open={open}
                    >
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                        </DrawerHeader>
                        <Divider />
                        <List>
                            <Link to='/'>
                                <ListItem key='home' disablePadding>
                                    <ListItemButton>
                                        <HomeIcon />
                                        <ListItemText>
                                            Home
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            {userTopics.length > 0 && (
                                userTopics.map((topic: string) => (
                                    <Link to={`/topics/${topic}`}>
                                        <ListItem key={topic} disablePadding>
                                            <ListItemButton>
                                                <ListItemText>
                                                    #{topic}
                                                </ListItemText>
                                            </ListItemButton>
                                        </ListItem>
                                    </Link>
                                ))
                            )}
                            {username !== "" &&
                            <Link to='/topics/addTopic'>
                                <ListItem key='addTopic' disablePadding>
                                    <ListItemButton>
                                        <ListItemText>
                                            + Add topic
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            }
                        </List>

                    </Drawer>
                </Box>
                <Main open={open}>
                    {location.pathname === '/' ?
                        <Typography variant='h1'>
                            {username === "" ?
                                !isRegistering ?
                                    <div>
                                        <Connexion setUsernameGlobal={setUsername}/>
                                        <small>Need an account? <MuiLink onClick={()=>setIsRegistering(true)}>Register here</MuiLink></small>
                                    </div>
                                    : <Register setUsernameGlobal={setUsername}/>
                                : "Welcome " + username + "! Check out your new messages by selecting a topic"
                            }
                        </Typography>
                        : <Outlet context={username}/>
                    }
                </Main>
            </StyledEngineProvider>
        </div>
  );
}

export default App;
