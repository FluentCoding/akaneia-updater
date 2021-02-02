import create from "zustand";

export default create((set) => ({
  isoFile: undefined,
  destFile: undefined,
  loading: false,
  disabledNext: false,
  selectedAsset: undefined,
  setIsoFile: (value) => set({ isoFile: value }),
  setDestFile: (value) => set({ destFile: value }),
  setLoading: (value) => set({ loading: value }),
  setDisabledNext: (value) => set({ disabledNext: value }),
  setSelectedAsset: (value) => set({ selectedAsset: value })
}));
