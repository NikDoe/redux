import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { sub } from 'date-fns';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = {
	posts: [],
	status: 'idle',
	error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	try {
		const response = await axios.get(POSTS_URL);
		return response.data;
	} catch (error) {
		return error.message;
	}
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async initialPost => {
	const response = await axios.post(POSTS_URL, initialPost);
	return response.data;
});

export const updatePost = createAsyncThunk('posts/updatePost', async initialPost => {
	const { id } = initialPost;
	try {
		const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
		return response.data;
	} catch (err) {
		//return err.message;
		return initialPost; // only for testing Redux!
	}
});

const postSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		reactionAdded: {
			reducer: (state, action) => {
				const { postId, reaction } = action.payload;
				const existingPost = state.posts.find(post => post.id === postId);
				if (existingPost) {
					existingPost.reactions[reaction]++;
				}
			},
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchPosts.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.status = 'succeeded';
				let min = 1;
				const loadedPosts = action.payload.map(post => {
					post.date = sub(new Date(), { minutes: min++ }).toISOString();
					post.reactions = {
						thumbsUp: 0,
						wow: 0,
						heart: 0,
						rocket: 0,
						coffee: 0,
					};
					return post;
				});
				state.posts = state.posts.concat(loadedPosts);
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.staus = 'failed';
				state.error = action.error.message;
			})
			.addCase(addNewPost.fulfilled, (state, action) => {
				const sortedPosts = state.posts.sort((a, b) => {
					if (a.id > b.id) return 1;
					if (a.id < b.id) return -1;
					return 0;
				});
				action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;

				action.payload.userId = Number(action.payload.userId);
				action.payload.date = new Date().toISOString();
				action.payload.reactions = {
					thumbsUp: 0,
					wow: 0,
					heart: 0,
					rocket: 0,
					coffee: 0,
				};
				console.log(action.payload);
				state.posts.push(action.payload);
			})
			.addCase(updatePost.fulfilled, (state, action) => {
				if (!action.payload?.id) {
					console.log('Update could not complete');
					console.log(action.payload);
					return;
				}
				const { id } = action.payload;
				action.payload.date = new Date().toISOString();
				const posts = state.posts.filter(post => post.id !== id);
				state.posts = [...posts, action.payload];
			});
	},
});

export const selectAllPosts = state => state.posts.posts;
export const getPostsStatus = state => state.posts.status;
export const getPostsError = state => state.posts.error;

export const selectPostById = (state, postId) => {
	return state.posts.posts.find(post => post.id === postId);
};

export const { postAdded, reactionAdded } = postSlice.actions;

export default postSlice.reducer;
