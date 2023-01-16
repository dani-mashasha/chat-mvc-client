import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

export const Chat = ({ socket, userName, room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: userName,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((currList) => [...currList, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((currList) => [...currList, data]);
        });
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>{" "}
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageData) => (
                        <div
                            key={Math.floor(
                                Math.random() *
                                    Math.floor(Math.random() * Date.now())
                            )}
                            className="message"
                            id={
                                userName === messageData.author
                                    ? "you"
                                    : "other"
                            }
                        >
                            <div>
                                <div className="message-content">
                                    <p>{messageData.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageData.time}</p>
                                    <p id="author">{messageData.author}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    placeholder="Hey..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={() => sendMessage()}>&#9658;</button>
            </div>
        </div>
    );
};
