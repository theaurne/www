import {Button, Card, CardActions, CardHeader, CardMedia, Collapse} from '@material-ui/core';
import React from 'react';
import './Photo.css';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CommentIcon from '@material-ui/icons/Comment';
import Comment from '../comment/Comment';

/*
	Might be a bit of overkill to use a Card for the Photo but it looks nice,
	and it's always good to use the stuff that's available to you in the libraries you're using
*/
class Photo extends React.Component {
	constructor() {
		super();
		this.state = {expanded: false};
	}

	handleExpandClick = () => {
		this.setState({expanded: !this.state.expanded});
	};

	render() {
		return (
			<article className="photo">
				<Card className="photo-card">
					<CardHeader
						className="info header"
						subheader={this.props.photo.date_time}
					/>
					<CardMedia
						className="image"
						component="img"
						height="400"
						image={`/images/${this.props.photo.file_name}`}
						alt={this.props.photo.file_name}
					/>
					<CardActions
						className="info footer"
					>
						<Button
							onClick={this.handleExpandClick}
							startIcon={<CommentIcon />}
							endIcon={this.state.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
							disabled={!this.props.photo.comments || this.props.photo.comments.length === 0}
							aria-expanded={this.state.expanded}
							aria-label="show more"
						>
							Comments ({this.props.photo.comments ? this.props.photo.comments.length : 0})
						</Button>
					</CardActions>
					<div className='shadow'></div>
				</Card>
				<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
					{this.props.photo.comments && this.props.photo.comments.map((comment) =>
						<Comment key={comment._id} comment={comment} />
					)}
				</Collapse>
			</article>
		);
	}
}

export default Photo;
