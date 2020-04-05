import React from "react";
import UserItem from './UserItem';

export default class Message extends React.Component {
    render() {
        let {message} = this.props;
        if (!message){
            return(
            <p>
                Some error
            </p>
            )
        }
        console.log("***Message:*",message);
        return (
            <div >
                <UserItem user={message.userData} />
                <span>: {message.messageText}</span>
            </div>
        );
    }
}

