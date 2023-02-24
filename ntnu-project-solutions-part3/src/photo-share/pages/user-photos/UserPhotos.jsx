import React from 'react';
import './UserPhotos.css';
import {withRouter} from 'react-router';
import Photo from '../../components/photo/Photo';
import Requests from '../../../utils/requests';

class UserPhotos extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			photos: [],
			error: null
		};
	}

	componentDidMount() {
		this.updatePhotos();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.userId !== this.props.match.params.userId) {
			this.updatePhotos();
		}
	}

	updatePhotos = async () => {
		const {photos, error} = await Requests.getUserPhotosByID(this.props.match.params.userId);
		this.setState({photos: photos || [], error: error || null});
	};

	render() {
		if (this.state.error) {
			return null;
		}

		return this.state.photos.map((photo) =>
			<Photo key={photo._id} photo={photo} />
		);
	}
}

/*
	Remember to use withRouter when you need things from the URL
*/
export default withRouter(UserPhotos);
