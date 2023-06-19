import React, {useEffect, useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import { createClient } from 'redis';

/*async function nodeRedisDemo() {
    try {
        const client = createClient();
        await client.connect();

        await client.set('mykey', 'Hello from node redis');
        const myKeyValue = await client.get('mykey');
        console.log(myKeyValue);

        const numAdded = await client.zAdd('vehicles', [
            {
                score: 4,
                value: 'car',
            },
            {
                score: 2,
                value: 'bike',
            },
        ]);
        console.log(`Added ${numAdded} items.`);

        for await (const { score, value } of client.zScanIterator('vehicles')) {
            console.log(`${value} -> ${score}`);
        }

        await client.quit();
    } catch (e) {
        console.error(e);
    }
}*/

interface MessageFormProps {
    messageFormNeedUpdate: () => void
}

const ClientForm: React.FC<MessageFormProps> = ({messageFormNeedUpdate}: MessageFormProps) => {
    const {register, handleSubmit} = useForm();
    const [content, setContent] = useState("");

    const onSubmit = (data: FieldValues) => {
        setContent(data.content);
        messageFormNeedUpdate();
    }

    const client = createClient();
    client.connect().then(r => {
        client.set('mykey', 'Hello from node redis').then(r => {
            client.get('mykey').then(r => {
                console.log(r);
            })
        });
    });

    //nodeRedisDemo();

    return (
        <form action="" method="get" className="form-example">
            <div className="form-example">
                <input type="text" name="name" id="name" placeholder={"Message"} required/>
                <input type="submit" value="Envoyer!"/>
            </div>
        </form>
    )
}
export default ClientForm;