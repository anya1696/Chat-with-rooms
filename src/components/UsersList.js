import React from "react";
import UserItem from './UserItem';

export default class UsersList extends React.Component {
    render() {
        let {users} = this.props;
        return (
            <span className='chat-output'>
                {users.map((user, index) => (
                    <div key={index}>
                    <UserItem user={user}/>
                    </div>
                ))}
            </span>

        );
    }
}