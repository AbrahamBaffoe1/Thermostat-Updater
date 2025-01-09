import { create } from 'zustand';

const useThermostatStore = create((set) => ({
  user: null,
  thermostat: { currentTemperature: 72, targetTemperature: 70 }, // Mock data
  zones: [], // Array to hold multiple zones
  setUser: (user) => set({ user }),
  setThermostat: (thermostat) => set({ thermostat }),
  setZones: (zones) => set({ zones }),
  addZone: (zone) => set((state) => ({ zones: [...state.zones, zone] })),
  updateZone: (updatedZone) => set((state) => ({
    zones: state.zones.map((zone) => zone.id === updatedZone.id ? updatedZone : zone)
  })),
  deleteZone: (zoneId) => set((state) => ({
    zones: state.zones.filter((zone) => zone.id !== zoneId)
  })),
}));

export default useThermostatStore;
