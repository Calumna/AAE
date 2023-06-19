import React from 'react';
import {Link, Outlet, useLoaderData, useLocation} from "react-router-dom";
import {StyledEngineProvider} from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
    useTheme
} from "@mui/material";
import { getThreads } from "./components/chat/topics";


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

export function loader(): string[] {
    let topics: string[];
    topics = getThreads();
    return topics;
}

const getPageTitle = (pathname: string) => {
    let pageTitle: string;
    if (pathname === '/') {
        pageTitle = 'Home';
    } else {
        pageTitle = pathname.substring(pathname.lastIndexOf('/')+1);
        pageTitle = pageTitle[0].toUpperCase() + pageTitle.substring(1);
    }
    return pageTitle;
}

function App() {
    const location = useLocation();
    const currentPage: string = getPageTitle(location.pathname);
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const topics = useLoaderData() as ReturnType<typeof loader>;
    return (
        <div className="App">
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
                        {topics.length > 0 && (
                                <List>
                                    {
                                        topics.map((topic: string) => (
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
                                    }
                                    <Link to='/'>
                                        <ListItem key='addTopic' disablePadding>
                                            <ListItemButton>
                                                <ListItemText>
                                                    + Add topic
                                                </ListItemText>
                                            </ListItemButton>
                                        </ListItem>
                                    </Link>
                                </List>
                            )}
                    </Drawer>
                </Box>
                <Main open={open}>
                    {location.pathname === '/' ?
                        <Typography variant='h1'>
                            Welcome !
                        </Typography>
                        : <Outlet/>
                    }
                </Main>
            </StyledEngineProvider>
        </div>
  );
}

export default App;
