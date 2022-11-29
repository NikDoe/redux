import { createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

const usersAdapter = createEntityAdapter();
const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: build => ({
		getUsers: build.query({
			query: () => '/users',
			transformResponse: responseData => usersAdapter.setAll(initialState, responseData),
			providesTags: result => [
				{ type: 'User', id: 'LIST' },
				...result.ids.map(id => ({ type: 'User', id })),
			],
		}),
	}),
});

export const { useGetUsersQuery } = usersApiSlice;
