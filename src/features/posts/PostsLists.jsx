import { useSelector } from 'react-redux';
import { selectPostsIds, getPostsStatus, getPostsError } from './postsSlice';
import PostsExcerpt from './PostsExcerpt';

const PostsLists = () => {
	const orderedPostIds = useSelector(selectPostsIds);
	const postsStatus = useSelector(getPostsStatus);
	const error = useSelector(getPostsError);

	let content;
	if (postsStatus === 'loading') {
		content = <p>"Loading..."</p>;
	} else if (postsStatus === 'succeeded') {
		content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />);
	} else if (postsStatus === 'failed') {
		content = <p>{error}</p>;
	}

	return (
		<section>
			<h2>Posts</h2>
			{content}
		</section>
	);
};

export default PostsLists;
