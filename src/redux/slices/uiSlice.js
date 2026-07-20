import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appLoader: {
    isActive: false,
    label: '',
  },
  subtleLoader: {
    isActive: false,
    label: '',
  },
  confirmModal: {
    isOpen: false,
    title: '',
    message: '',
    variant: 'primary',
    confirmText: 'Yes, Proceed',
    cancelText: 'No, Cancel',
    onConfirm: null,
    onCancel: null,
  },
  alerts: [],
  topbarConfig: {
    title: '',
    description: '',
  },
  donateModal: {
    isOpen: false,
    context: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showAppLoader: (state, action) => {
      state.appLoader.isActive = true;
      state.appLoader.label = action.payload || '';
    },
    hideAppLoader: (state) => {
      state.appLoader.isActive = false;
      state.appLoader.label = '';
    },
    showSubtleLoader: (state, action) => {
      state.subtleLoader.isActive = true;
      state.subtleLoader.label = action.payload || '';
    },
    hideSubtleLoader: (state) => {
      state.subtleLoader.isActive = false;
      state.subtleLoader.label = '';
    },
    showConfirmModal: (state, action) => {
      state.confirmModal = {
        isOpen: true,
        title: action.payload.title || '',
        message: action.payload.message || '',
        variant: action.payload.variant || 'primary',
        confirmText: action.payload.confirmText || 'Yes, Proceed',
        cancelText: action.payload.cancelText || 'No, Cancel',
        onConfirm: action.payload.onConfirm || null,
        onCancel: action.payload.onCancel || null,
      };
    },
    hideConfirmModal: (state) => {
      state.confirmModal.isOpen = false;
    },
    addAlert: (state, action) => {
      const id = Date.now() + Math.random();
      state.alerts.push({ id, ...action.payload });
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
    },
    setTopbarConfig: (state, action) => {
      state.topbarConfig = {
        title: action.payload.title || '',
        description: action.payload.description || '',
      };
    },
    showDonateModal: (state, action) => {
      state.donateModal.isOpen = true;
      state.donateModal.context = action.payload?.context || null;
    },
    hideDonateModal: (state) => {
      state.donateModal.isOpen = false;
      state.donateModal.context = null;
    },
  },
});

export const {
  showAppLoader, hideAppLoader,
  showSubtleLoader, hideSubtleLoader,
  showConfirmModal, hideConfirmModal,
  addAlert, removeAlert,
  setTopbarConfig,
  showDonateModal, hideDonateModal
} = uiSlice.actions;

export const getUiState = (state) => state.ui;

export default uiSlice.reducer;
