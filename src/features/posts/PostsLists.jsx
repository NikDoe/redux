import { useSelector } from 'react-redux';
import { selectPostsIds, useGetPostsQuery } from './postsSlice';
import PostsExcerpt from './PostsExcerpt';

const PostsLists = () => {
	const { isLoading, isSuccess, isError, error } = useGetPostsQuery();
	const orderedPostIds = useSelector(selectPostsIds);

	let content;
	if (isLoading) {
		content = <p>"Loading..."</p>;
	} else if (isSuccess) {
		content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />);
	} else if (isError) {
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
