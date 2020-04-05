import React from "react";
import UserItem from './UserItem';

export default class Message extends React.Component {
    render() {
        let {message} = this.props;
        return (
            <div >
                <UserItem user={message.userData} />
                <span>: {message.messageText}</span>
            </div>
        );
    }
}

