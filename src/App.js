import React, {Component} from 'react';
import './App.css';
import openSocket from 'socket.io-client'
import Message from './views/Message'
import UsersList from './views/UsersList'

const socket = openSocket('http://localhost:3001/');
const url = window.location.origin;

class App extends Component {

    onMessageSubmit = (e) => {
        e.preventDefault();
        this.setState(state => ({...state, text: ''}));
        const data = {
            roomId: this.state.roomId,
            userId: this.state.userId,
            messageText: this.state.text
        };
        socket.emit('new message', data);
    };
    onNameSubmit = (e) => {
        e.preventDefault();
        const newRoomMod = !this.state.roomId;
        if (newRoomMod) {
            socket.emit('new user', this.state.userName, newRoomMod);
        } else {
            socket.emit('new user', this.state.userName, newRoomMod, this.state.roomId);
        }
    };

    constructor(props) {
        super(props);

        let search = new URLSearchParams(window.location.search);
        let roomId = search.get("roomId");

        this.state = {
            text: '',
            roomId: roomId,
            userId: '',
            userName: '',
            isMessageInputVisible: false,
            isNameInputVisible: true,
            messages: [],
            users: []
        }
    }

    componentDidMount() {
        socket.on('new message', data => {
            this.setState(state => ({
                ...state,
                messages: [...state.messages, {messageText: data.message, userData: data.userData}]
            }));
        });

        socket.on('registred', data => {
            this.setState(state => ({
                ...state,
                roomId: data.roomId,
                userId: data.userData.userId,
                messages: data.allMessages,
                isMessageInputVisible: true,
                isNameInputVisible: false,
                users: data.allUsers
            }));
        });

        socket.on('user join', data => {
            this.setState(state => ({
                ...state,
                text: '',
                users: data.allUsers,
            }))
        });
    }

    handleMessageChange(target) {
        this.setState(state => ({...state, text: target.value}));
    }

    handleNameChange(target) {
        this.setState(state => ({...state, userName: target.value}));
    }

    render() {
        return (
            <div className="App App-header">
                <UsersList users={this.state.users}/>
                <div className='chat'>
                    <div className='chat-input'>
                        <form method='post' id='chat-form' onSubmit={this.onMessageSubmit} style={{
                            visibility: this.state.isMessageInputVisible ? "visible" : "hidden"
                        }}>
                            <input type='text' id='message-text' className='chat-form-input'
                                   placeholder='Введите сообщение' onChange={(e) => {
                                this.handleMessageChange(e.target)
                            }} value={this.state.text}/>
                            <input type='submit' className='chat-form__submit' value='=>'/>
                        </form>
                        <form method='post' id='name-form' onSubmit={this.onNameSubmit} style={{
                            visibility: this.state.isNameInputVisible ? "visible" : "hidden"
                        }}>
                            <input type='text' id='name-text' className='chat-form-input'
                                   placeholder='Введите имя' onChange={(e) => {
                                this.handleNameChange(e.target)
                            }}/>
                            <input type='submit' className='chat-form__submit' value='=>'/>
                        </form>
                    </div>
                    <span> Copy the link to invite {url + (this.state.roomId ? ("?roomId=" + this.state.roomId) : "")} </span>
                    <div className='chat-output'>
                        {this.state.messages.map((message, index) => (
                            <Message key={index} message={message}/>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
