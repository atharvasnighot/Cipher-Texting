import React, { useState, ChangeEvent } from 'react';

const ChatRoom: React.FC = () => {
  const [privateChats, setPrivateChats] = useState(new Map<string, { senderName: string; message: string }[]>());
  const [publicChats, setPublicChats] = useState<{ senderName: string; message: string }[]>([]);
  const [tab, setTab] = useState<string>('CHATROOM');
  const [userData, setUserData] = useState({
    username: '',
    receivername: '',
    connected: false,
    message: '',
  });

  const handleMessage = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserData((prevUserData) => ({ ...prevUserData, message: value }));
  };

  const sendValue = () => {
    // Add logic for sending public messages
    setUserData((prevUserData) => ({ ...prevUserData, message: '' }));
  };

  const sendPrivateValue = () => {
    // Add logic for sending private messages
    setUserData((prevUserData) => ({ ...prevUserData, message: '' }));
  };

  const handleUsername = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserData((prevUserData) => ({ ...prevUserData, username: value }));
  };

  const registerUser = () => {
    // Add logic for connecting to the chat
    setUserData((prevUserData) => ({ ...prevUserData, connected: true }));
  };

  return (
    <div className="container">
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li onClick={() => setTab('CHATROOM')} className={`member ${tab === 'CHATROOM' && 'active'}`}>
                Chatroom
              </li>
              {[...privateChats.keys()].map((name, index) => (
                <li onClick={() => setTab(name)} className={`member ${tab === name && 'active'}`} key={index}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
          {tab === 'CHATROOM' ? (
            <div className="chat-content">
              <ul className="chat-messages">
                {publicChats.map((chat, index) => (
                  <li className={`message ${chat.senderName === userData.username && 'self'}`} key={index}>
                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button type="button" className="send-button" onClick={sendValue}>
                  send
                </button>
              </div>
            </div>
          ) : (
            <div className="chat-content">
              <ul className="chat-messages">
                {[...(privateChats.get(tab) || [])].map((chat, index) => (
                  <li className={`message ${chat.senderName === userData.username && 'self'}`} key={index}>
                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button type="button" className="send-button" onClick={sendPrivateValue}>
                  send
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
          />
          <button type="button" onClick={registerUser}>
            connect
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
