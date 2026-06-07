import { create } from 'zustand'

type ModalKey = 'createHabit' | 'createTask' | 'createGoal' | 'editHabit' | 'editTask' | 'editGoal' | 'confirm'

type ToastVariant = 'success' | 'error' | 'info'

export type Toast = {
  id:       string
  message:  string
  variant:  ToastVariant
}

type ConfirmOptions = {
  title:    string
  message:  string
  onConfirm: () => void
}

type UIStore = {
  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar:    () => void
  setSidebar:       (collapsed: boolean) => void

  // Modals
  openModals:  Partial<Record<ModalKey, boolean>>
  editingId:   string | null
  openModal:   (key: ModalKey, editingId?: string) => void
  closeModal:  (key: ModalKey) => void

  // Toasts
  toasts:      Toast[]
  addToast:    (message: string, variant?: ToastVariant) => void
  removeToast: (id: string) => void

  // Confirm dialog
  confirm:        ConfirmOptions | null
  openConfirm:    (options: ConfirmOptions) => void
  closeConfirm:   () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar:    () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebar:       (collapsed) => set({ sidebarCollapsed: collapsed }),

  openModals:  {},
  editingId:   null,
  openModal:   (key, editingId) => set((s) => ({ openModals: { ...s.openModals, [key]: true }, editingId: editingId ?? null })),
  closeModal:  (key) => set((s) => ({ openModals: { ...s.openModals, [key]: false }, editingId: null })),

  toasts:      [],
  addToast:    (message, variant = 'info') =>
    set((s) => ({
      toasts: [...s.toasts, { id: crypto.randomUUID(), message, variant }],
    })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  confirm:      null,
  openConfirm:  (options) => set({ confirm: options }),
  closeConfirm: () => set({ confirm: null }),
}))
