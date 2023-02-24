import React from 'react';
import {
	BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import {
	ThemeProvider, Typography
} from '@material-ui/core';
import {createTheme} from '@material-ui/core/styles';

import TopBar from './components/top-bar/TopBar';
import UserDetail from './pages/user-detail/UserDetail';
import UserList from './pages/user-list/UserList';
import UserPhotos from './pages/user-photos/UserPhotos';
import './PhotoShare.css';
import Requests from '../utils/requests';

/*
	Creating a theme is useful when you're using the same colors/fonts/... across multiple components,
	allowing your app to be visually consistent.
	Of course, some times is just easier/quicker to use CSS. It depends on the use case, but always
	try to be organized
*/
const theme = createTheme({
	palette: {
		primary: {
			main: '#053079'
		},
		secondary: {
			main: '#64ffda'
		},
		text: {
			primary: '#FAFAFA',
			secondary: '#3C3C3C'
		},
		background: {
			paper: '#161616'
		}
	},
	typography: {
		fontFamily: [
			'Montserrat',
			'sans-serif'
		].join(',')
	}
});

class PhotoShare extends React.Component {
	constructor() {
		super();
		this.state = {
			test: null,
			error: null
		};
	}

	async componentDidMount() {
		const {test, error} = await Requests.getTestInfo();
		if (error) {
			this.setState({test: null, error: JSON.parse(error.message)});
		} else {
			this.setState({test, error: null});
		}
	}

	render() {
		return (
			<ThemeProvider theme={theme}>
				<Router>
					<TopBar/>

					<main>
						<UserList />

						<section>
							<Switch>
								<Route exact path="/photo-share">
									<Typography component="h2" variant="h4" color="textPrimary">
										Solution for Part #2 &amp; #3 of the project

										<img
											className='main-image'
											src={'/images/gnome.png'}
											alt="test"
										></img>
									</Typography>

									<Typography component="div" variant="body2" color="textPrimary">
										<b>Attention</b>: some features and approaches are a bit
										more advanced than what was demanded of you. And there&apos;s
										probably a bit more error checking than what you have.<br/>

										<b>That&apos;s ok! So don&apos;t stress!</b><br/>

										Use them as examples and learning references for how to
										do different things.
										<br/><br/>


										So, with these solutions, I bid your farewell for this semester.<br/>
										Thank you for putting up with me!<br/>
										You&apos;re always welcome to email me
										@ <a className='main-email' href="mailto:bruno@selvklart.no">bruno@selvklart.no</a> if:
										<ul>
											<li>something doesn&apos;t make sense or isn&apos;t working;</li>
											<li>you&apos;re wondering about the difference between your solution and mine;</li>
											<li>you have any suggestions about the solutions;</li>
											<li>you want to complain/argue about whatever;</li>
											<li>you&apos;re interested in more advanced concepts that weren&apos;t approached in class;</li>
											<li>you want career/industry advice;</li>
											<li>you&apos;re trying to get a job in Gjøvik (I have contacts in quite a few companies);</li>
											{/* shoutout selvklart.no */}
										</ul>

										Don&apos;t email me if:
										<ul>
											<li>you want exam answers.</li>
										</ul>

									</Typography>

									{this.state.test &&
										<Typography variant="body2" color="textSecondary">
											Test Endpoint: <br/>
											{JSON.stringify(this.state.test)}
										</Typography>
									}

									{this.state.error &&
										<Typography variant="body2" color="textSecondary">
											Test Endpoint (error): <br/>
											{this.state.error.status}<br/>
											{this.state.error.statusText}<br/>
											{this.state.error.text}
										</Typography>
									}
								</Route>
								<Route path="/photo-share/users/:userId">
									<UserDetail />
								</Route>
								<Route path="/photo-share/photos/:userId">
									<UserDetail />
									<UserPhotos />
								</Route>
								<Route path="/photo-share/users">
									<UserList />
								</Route>
							</Switch>
						</section>
					</main>
				</Router>
			</ThemeProvider>
		);
	}
}

export default PhotoShare;
