import { ChangeEvent, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';


interface ChatMessage {
  senderName: string;
  message: string;
  status: string;
}

const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState<Map<string, ChatMessage[]>>(new Map());
  const [publicChats, setPublicChats] = useState<ChatMessage[]>([]);
  const [tab, setTab] = useState<string>('CHATROOM');
  const [userData, setUserData] = useState({
    username: '',
    receivername: '',
    connected: false,
    message: '',
  });

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  let socket:Socket | null = null;

  const connect = () => {
    socket = io('http://localhost:8080');

    socket.on('connect', () => {
      setUserData({ ...userData, connected: true });
      userJoin();
    });

    socket.on('message', (payloadData: ChatMessage) => {
      switch (payloadData.status) {
        case 'JOIN':
          if (!privateChats.get(payloadData.senderName)) {
            privateChats.set(payloadData.senderName, []);
            setPrivateChats(new Map(privateChats));
          }
          break;
        case 'MESSAGE':
          if (payloadData.senderName === 'CHATROOM') {
            setPublicChats((prevPublicChats) => [...prevPublicChats, payloadData]);
          } else {
            setPrivateChats((prevChats) => {
              const updatedChats = new Map(prevChats);
              if (updatedChats.has(payloadData.senderName)) {
                updatedChats.get(payloadData.senderName)?.push(payloadData);
              } else {
                updatedChats.set(payloadData.senderName, [payloadData]);
              }
              return updatedChats;
            });
          }
          break;
      }
    });

    socket.on('disconnect', (reason:string) => {
      console.log('Connection closed:', reason);
      setUserData({ ...userData, connected: false });
    });
  };

  const userJoin = () => {
    if (socket) {
      const chatMessage: ChatMessage = {
        senderName: userData.username,
        status: 'JOIN',
        message: '',
      };
      socket.emit('message', chatMessage);
    }
  };

  const handleMessage = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserData((prevUserData) => ({ ...prevUserData, message: value }));
  };

  const sendValue = () => {
    if (socket) {
      const chatMessage: ChatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: 'MESSAGE',
      };
      socket.emit('message', chatMessage);
      setUserData({ ...userData, message: '' });
    }
  };

  const handleUsername = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserData((prevUserData) => ({ ...prevUserData, username: value }));
  };

  const registerUser = () => {
    connect();
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
          {tab === 'CHATROOM' && (
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
                  placeholder="Enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button type="button" className="send-button" onClick={sendValue}>
                  Send
                </button>
              </div>
            </div>
          )}
          {tab !== 'CHATROOM' && (
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
                  placeholder="Enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button type="button" className="send-button" onClick={sendValue}>
                  Send
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
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
