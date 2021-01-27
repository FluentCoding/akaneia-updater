import create from 'zustand';

export default create(set => ({
    isoFile: undefined,
    destFolder: undefined,
    setIsoFile: (value) => set(({ isoFile: value })),
    setDestFolder: (value) => set(({ destFolder: value }))
}));