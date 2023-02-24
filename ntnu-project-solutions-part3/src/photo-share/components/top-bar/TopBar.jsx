import React from 'react';
import {
	AppBar, IconButton, Toolbar, Typography
} from '@material-ui/core';
import {withRouter, Link} from 'react-router-dom';
import './TopBar.css';
import HomeIcon from '@material-ui/icons/Home';
import Utils from '../../../utils/utils';
import Requests from '../../../utils/requests';

class TopBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {title: ''};
	}

	componentDidMount() {
		this.setTitle();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.location.pathname !== this.props.location.pathname) {
			this.setTitle();
		}
	}

	setTitle = async () => {
		let title = '';
		const id = Utils.getUserIDFromRouterPathname(this.props);
		const {user, error} = id ?
			await Requests.getUserByID(id) :
			{user: null, error: null};

		if (error) {
			this.setState({title: '404'});
			return;
		}

		const page = Utils.getPageFromRouterPathname(this.props);
		if (page === 'photos') {
			title = user ?
				`Photos of ${user.first_name} ${user.last_name}` :
				'Invalid user';
		} else if (page === 'users') {
			title = user ? `${user.first_name} ${user.last_name}` : 'Invalid user';
		} else if (page === 'user-list') {
			title = 'User list';
		}
		this.setState({title});
	};

	render() {
		return (
			<AppBar className="topbar" position="absolute">
				<Toolbar className="toolbar">
					<div className="topbar-left-container">
						{/*
							Added a home button here to make it a bit extra and because it was a hassle to go back to the starting page
						*/}
						<IconButton
							className="home"
							aria-label="home"
							component={Link}
							to="/photo-share"
						>
							<HomeIcon fontSize="medium" />
						</IconButton>

						{/*
							Remember Typography always allows you to set the component and style of that component
							This is supposed to be the h1 of the site (for semantics), but the style for h1 is too big so I use h6
						*/}
						<Typography component="h1" variant="h6" color="textPrimary">
              				Group 0 - Bruno Santos
						</Typography>
					</div>
					<Typography component="h2" variant="h6" color="textPrimary">
						{this.state.title}
					</Typography>
				</Toolbar>
			</AppBar>
		);
	}
}

export default withRouter(TopBar);
