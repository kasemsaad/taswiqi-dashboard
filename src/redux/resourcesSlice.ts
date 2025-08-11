import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { string } from 'yup';

interface ResourcesState {
  logoState: string | number | null;
  headerState: string | number | null;
  burgerMenuState: boolean;
  activeLinkState: string | number | null;
  hasCenterState: boolean | null;
  idsCheckbox: number[];
  role: string | number | null;
  roleId: string | number | null;
}

const initialState: ResourcesState = {
  logoState: "",
  headerState: "",
  burgerMenuState: false,
  activeLinkState: 0,
  hasCenterState: null,
  idsCheckbox: [],
  role: "",
  roleId: null,
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    Logo(state, action: PayloadAction<string | number | null>) {
      state.logoState = action.payload;
    },
    Header(state, action: PayloadAction<string | number | null>) {
      state.headerState = action.payload;
    },
    BurgerMenu(state, action: PayloadAction<boolean>) {
      state.burgerMenuState = action.payload;
    },
    ActiveLink(state, action: PayloadAction<string | number | null>) {
      state.activeLinkState = action.payload;
    },
    HasCenter(state, action: PayloadAction<boolean | null>) {
      state.hasCenterState = action.payload;
    },
    IdsCheckbox(state, action: PayloadAction<number[]>) {
      state.idsCheckbox = action.payload;
    },
    Role(state, action: PayloadAction<string | number | null>) {
      state.role = action.payload;
    },
    RoleId(state, action: PayloadAction<string | number | null>) {
      state.roleId = action.payload;
    },
  },
});
export const selectLogo = (state: { resources: ResourcesState }) => state.resources.logoState;
export const selectHeader = (state: { resources: ResourcesState }) => state.resources.headerState;

export const { Logo,Header,BurgerMenu,ActiveLink,HasCenter,IdsCheckbox,Role,RoleId  } = resourcesSlice.actions;
export default resourcesSlice.reducer;
