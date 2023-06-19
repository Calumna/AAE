import {MessageData} from "../../types";

const getThreads = () => {
    const threads: string[] = ["cuisine", "gym"]
    return threads;
}

const getMessages = (topicName: string) => {
    let messages: MessageData[] = [
        {
            userName: "toto",
            date: "20/04/2023 10:32",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus."
        },
        {
            userName: "Jean",
            date: "20/04/2023 10:40",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus."
        }

    ];
    if (topicName === 'cuisine') {
        messages.push({
            userName: "Paul",
            date: "23/04/2023 05:41",
            text: "Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit gravida rutrum quisque non tellus orci ac."
        })
    }
    return messages
}

export {
    getThreads,
    getMessages
};