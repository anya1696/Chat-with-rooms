import React from "react";

export default class UserItem extends React.Component {
    render() {
        let {user} = this.props;
        return (
            <span>{user.name} ({user.userId})</span>

        );
    }
}