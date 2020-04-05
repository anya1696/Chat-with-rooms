import React, {Component} from 'react';
import './App.css';
import openSocket from 'socket.io-client'
import Message from './components/Message'
import UsersList from './components/UsersList'
import UserItem from "./components/UserItem";

const socket = openSocket('http://localhost:3001/');

class App extends Component {

    constructor(props) {
        super(props);

        let search = new URLSearchParams(window.location.search);
        let roomId = search.get("roomId");

        this.state = {
            text: '',
            roomId: roomId,
            userId: '',
            userName: '',
            messages: [],
            users: [],
            urlToInvite:'http://192.168.0.109:3000'
        }
    }
    componentDidMount(){
        socket.on('new message', data => {
            this.setState(state => ({
                ...state,
                messages: [...state.messages, {messageText: data.message, userData: data.userData }]
            }));
        });

        socket.on('registred', data => {
            console.log("*****ON REGISTER:", data);
            this.setState(state => ({
                ...state,
                roomId: data.roomId,
                userId: data.userData.userId,
                messages: data.allMessages,
                users: data.allUsers,
                urlToInvite: state.urlToInvite + "?roomId="+data.roomId
            }));
            console.log("****Messages:", data);
        });

        socket.on('user join', data => {
            this.setState(state => ({
                ...state,
                text: '',
                users: data.allUsers,
                messages: [...state.messages, data.message]
            }))
        });
    }

    handleMessageChange(target) {
        this.setState(state => ({ ...state, text: target.value }));
    }

    handleNameChange(target) {
        this.setState(state => ({ ...state, userName: target.value }));
    }

    onMessageSubmit = (e) => {
        e.preventDefault();
        this.setState(state => ({ ...state, text: '' }));
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
        if (newRoomMod){
            socket.emit('new user', this.state.userName, newRoomMod);
        }else {
            socket.emit('new user', this.state.userName, newRoomMod, this.state.roomId);
        }
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    {/*<img src={logo} className="App-logo" alt="logo"/>*/}
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>

                    <UsersList users={this.state.users}/>
                    <div className='chat'>
                        <div className='chat-messages'>
                            <div className='chat-messages__content' id='messages'>
                                Загрузка...
                            </div>
                        </div>
                        <div className='chat-input'>
                            <form method='post' id='chat-form' onSubmit={this.onMessageSubmit}>
                                <input type='text' id='message-text' className='chat-form__input'
                                       //placeholder='Введите сообщение' onChange={this.handleChange} value={this.state.text}/>
                                       placeholder='Введите сообщение' onChange={(e) => {this.handleMessageChange(e.target)}} value={this.state.text}/>
                                <input type='submit' className='chat-form__submit' value='=>'/>
                            </form>
                            <form method='post' id='name-form' onSubmit={this.onNameSubmit}>
                                <input type='text' id='name-text' className='chat-form__input'
                                       placeholder='Введите имя' onChange={(e) => {this.handleNameChange(e.target)}}/>
                                <input type='submit' className='chat-form__submit' value='=>'/>
                            </form>
                        </div>
                        {/*<label> Current room id: { this.useQuery().get("roomId") } </label>*/}
                        <label> Copy the link to invite { this.state.urlToInvite } </label>
                        <div className='chat-output'>
                            {this.state.messages.map((message, index) => (
                                <Message key={index} message={message}/>
                            ))}
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
