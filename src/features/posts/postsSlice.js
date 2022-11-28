import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import { apiSlice } from '../api/apiSlice';

const postsAdapter = createEntityAdapter({ sortComparer: (a, b) => b.date.localeCompare(a.date) });

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints(build) {
		getPosts: build.query({
			query() {
				return '/posts';
			},
			transformResponse(responseData) {
				let min = 1;
				const loadedPosts = responseData.map(post => {
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
				return postsAdapter.setAll(initialState, loadedPosts);
			},
			providesTags(result) {
				return [
					{ type: 'Post', id: 'LIST' },
					...result.ids.map(id => ({ type: 'Post', id })),
				];
			},
		});
	},
});

export const { useGetPostsQuery } = extendedApiSlice;

export const selectPostsResults = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(selectPostsResults, postsResult => postsResult.data);

export const {
	selectAll: selectAllPosts,
	selectById: selectPostById,
	selectIds: selectPostsIds,
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState);
