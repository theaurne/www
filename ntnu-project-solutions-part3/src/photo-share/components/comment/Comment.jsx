import {Card, CardContent, CardHeader} from '@material-ui/core';
import React from 'react';
import './Comment.css';
import {Link} from 'react-router-dom';

/*
	Separate component for Comment because separating your code is good
*/
class Comment extends React.Component {
	render() {
		const comment = this.props.comment;
		return (
			<Card className="comment">
				<CardHeader
					className="comment-header"
					title={
						<Link to={`/photo-share/users/${comment.user._id}`}>
							{`${comment.user.first_name} ${comment.user.last_name}`}
						</Link>
					}
					subheader={comment.date_time}
				/>
				<CardContent className="comment-content">
					{comment.comment}
				</CardContent>
			</Card>
		);
	}
}

export default Comment;
