import PostsLists from './features/posts/PostsLists';
import AddPostForm from './features/posts/AddPostForm';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import SinglePostPage from './features/posts/SinglePostPage';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<PostsLists />} />

				<Route path="post">
					<Route index element={<AddPostForm />} />
					<Route path=":postId" element={<SinglePostPage />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
