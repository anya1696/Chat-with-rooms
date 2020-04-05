import React from "react";
import UserItem from './UserItem';

export default class UsersList extends React.Component {
    render() {
        let {users} = this.props;
        if (!users){
            console.log("****",users);
            return (
                <span className='chat-output'/>
            );
        }
        return (
            <span className='chat-output'>
                {users.map((user, index) => (
                    <div>
                    <UserItem user={user} key = {index}/>
                    </div>
                ))}
            </span>

        );
    }
}