// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import resourcesReducer from './resourcesSlice';

export const store = configureStore({
  reducer: {
    resources: resourcesReducer, // resource reducer contains burgerMenuState
  },
});

// Types for the entire Redux state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Optional: typed hooks to use in components
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
