import create from "zustand";

export default create((set) => ({
  isoFile: undefined,
  destFile: undefined,
  loading: false,
  disabledNext: false,
  version: undefined,
  selectedAsset: undefined,
  setIsoFile: (value) => set({ isoFile: value }),
  setDestFile: (value) => set({ destFile: value }),
  setLoading: (value) => set({ loading: value }),
  setDisabledNext: (value) => set({ disabledNext: value }),
  setVersion: (value) => set({ version: value }),
  setSelectedAsset: (value) => set({ selectedAsset: value }),
  clear: () => set({
    isoFile: undefined,
    destFile: undefined,
    loading: false,
    disabledNext: false,
    version: undefined,
    selectedAsset: undefined
  })
}));
