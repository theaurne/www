import React from 'react';
import {
	Button,
	Card,
	CardContent,
	Chip,
	Typography
} from '@material-ui/core';
import './UserDetail.css';
import {withRouter, Link} from 'react-router-dom';
import WorkIcon from '@material-ui/icons/Work';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import Utils from '../../../utils/utils';
import Requests from '../../../utils/requests';

class UserDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			error: null,
			currentPage: null
		};
	}

	componentDidMount() {
		this.updateUser();
	}

	componentDidUpdate(prevProps) {
		/*
			Checking both if pathname changed instead of userID because this component is also included
			in /photos/, so just checking the userID wouldn't work when navigating from /users/:id to /photos/:id
			Happens because I wanted to display the user details in the photos page as well
		*/
		if (prevProps.location.pathname !== this.props.location.pathname) {
			this.updateUser();
		}
	}

	updateUser = async () => {
		const {user, error} = await Requests.getUserByID(this.props.match.params.userId);
		this.setState({
			user,
			error,
			currentPage: Utils.getPageFromRouterPathname(this.props)
		});
	};

	render() {
		/*
			It's good practice to error check so you don't get problems at runtime when something doesn't go according to plan
		*/
		if (this.state.error || !this.state.user) {
			return (
				<Card>
					<CardContent>
						<Typography gutterBottom variant="h4" component="h2">
							Invalid user
						</Typography>
					</CardContent>
				</Card>
			);
		}

		return (
			<>
				<article>
					<Card>
						<CardContent>
							<Typography gutterBottom variant="h4" component="h2">
								{this.state.user.first_name} {this.state.user.last_name}
							</Typography>
							<div className="chip-container">
								<Chip
									color="primary"
									icon={<LocationOnIcon />}
									label={this.state.user.location}
								/>
								<Chip
									color="primary"
									icon={<WorkIcon />}
									label={this.state.user.occupation}
								/>
							</div>
							<Typography variant="body2">
								{this.state.user.description}
							</Typography>
						</CardContent>
					</Card>
				</article>

				{/*
					Using the current page to figure out if Show photos button should be displayed
					No need to display it when photos are already shown
				*/}
				{this.state.currentPage === 'users' &&
					<Button
						className="show-photos-button"
						component={Link}
						to={`/photo-share/photos/${this.state.user._id}`}
						size="small"
						color="secondary"
						variant="contained"
						startIcon={<PhotoLibraryIcon />}
					>
						Show photos
					</Button>
				}
			</>
		);
	}
}

export default withRouter(UserDetail);
