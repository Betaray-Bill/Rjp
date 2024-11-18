import React, {useEffect, useState} from 'react'
import io from "socket.io-client";

// const socket = io("http://localhost:6000");

function Chat({project}) {
    const [messages,
        setMessages] = useState([]);
    const [message,
        setMessage] = useState('');
    const [sender,
        setSender] = useState('User1');


    return (
        <div>
            
        </div>
    )
}

export default Chat
