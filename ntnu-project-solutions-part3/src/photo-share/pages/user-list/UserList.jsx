import React from 'react';
import {
	List,
	ListItem,
	ListItemText
}
from '@material-ui/core';
import './UserList.css';
import {Link, withRouter} from 'react-router-dom';
import Utils from '../../../utils/utils';
import Requests from '../../../utils/requests';

class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			error: null,
			currentUser: null
		};
	}

	async componentDidMount() {
		const id = Utils.getUserIDFromRouterPathname(this.props);
		const {users, error} = await Requests.getAllUsers();
		/*
			Keeping track of the current user so I can highlight it (to be fancy)
		*/
		const currentUser = users.find((user) => user._id === id);
		this.setState({users, error, currentUser});
	}

	componentDidUpdate(prevProps) {
		const id = Utils.getUserIDFromRouterPathname(this.props);
		if (prevProps.location.pathname !== this.props.location.pathname) {
			const currentUser = this.state.users.find((user) => user._id === id);
			this.setState({currentUser});
		}
	}

	render() {
		if (this.state.error) {
			return null;
		}

		return (
			<List component="nav" className="user-list">
				{this.state.users.map((user) => (
					<ListItem
						key={user._id}
						component={Link}
						to={`/photo-share/users/${user._id}`}
						className={this.state.currentUser?._id === user._id ? 'active-user' : ''}
					>
						{/*
							You can always assign classes conditionally to your components to change
							their appearance depending on the state/props
						*/}
						<ListItemText primary={`${user.first_name} ${user.last_name}`} />
					</ListItem>
				))}
			</List>
		);
	}
}

export default withRouter(UserList);
