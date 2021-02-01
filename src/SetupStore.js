import create from "zustand";

export default create((set) => ({
  isoFile: undefined,
  destFolder: undefined,
  loading: false,
  error: undefined,
  setIsoFile: (value) => set({ isoFile: value }),
  setDestFolder: (value) => set({ destFolder: value }),
  setLoading: (value) => set({ loading: value }),
  setError: (value) => set({ error: value }),
}));
