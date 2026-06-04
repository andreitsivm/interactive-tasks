---
name: shadcn-dialogs
description: >
  Implement typed, queued dialog management for Next.js + Shadcn/ui + Zustand projects.
  Use this skill whenever adding a new dialog, modal, or confirm popup; when setting up
  the dialog system from scratch; or when asked to "open a dialog", "show a modal", or
  "add a confirmation". The system uses a centralized Zustand store with a buffer queue
  so multiple dialogs can be triggered without losing any — each waits its turn.
---

# Typed Dialog Queue — Next.js + Shadcn + Zustand

## Mental model

One Zustand store holds two things: the **active** dialog and a **queue** of pending ones.
`dialogActions.open()` either shows the dialog immediately (if nothing is active) or pushes
it to the queue. `dialogActions.close()` clears the active dialog and — after a 300 ms
animation gap — promotes the first item in the queue. This means you can fire
`dialogActions.open(...)` from anywhere without checking whether another dialog is open.

All dialog components are **lazy-loaded** via `React.lazy` + `injectDialog()`. The bundle
doesn't pay for dialog code until the dialog is first opened.

---

## Files to create (once, at project setup)

### `src/stores/dialog-store.ts`

```typescript
import { create } from 'zustand'
import type { DialogType, DialogPropsMap } from '@/components/dialogs/dialog-types'

interface DialogItem<T extends DialogType = DialogType> {
  id: string
  type: T
  props: DialogPropsMap[T]
  priority: 'normal' | 'high'
  persistent?: boolean
}

interface DialogState {
  active: DialogItem | null
  queue: DialogItem[]
}

const useDialogStore = create<DialogState>(() => ({
  active: null,
  queue: [],
}))

// Prevents double-advance during the close animation
let isTransitioning = false

export const dialogActions = {
  open: <T extends DialogType>(
    type: T,
    props: DialogPropsMap[T],
    options?: { priority?: 'high' | 'normal'; persistent?: boolean },
  ) => {
    const item: DialogItem<T> = {
      id: crypto.randomUUID(),
      type,
      props,
      priority: options?.priority ?? 'normal',
      persistent: options?.persistent,
    }
    useDialogStore.setState(s => {
      if (!s.active) return { active: item as DialogItem, queue: s.queue }
      const queue =
        item.priority === 'high'
          ? [item as DialogItem, ...s.queue]
          : [...s.queue, item as DialogItem]
      return { ...s, queue }
    })
  },

  close: () => {
    useDialogStore.setState(s => ({ ...s, active: null }))
    const { queue } = useDialogStore.getState()
    if (queue.length === 0 || isTransitioning) return
    isTransitioning = true
    setTimeout(() => {
      isTransitioning = false
      useDialogStore.setState(s => {
        if (s.active || s.queue.length === 0) return s
        const [next, ...rest] = s.queue
        return { active: next, queue: rest }
      })
    }, 300)
  },

  closeAll: () => {
    isTransitioning = false
    useDialogStore.setState(s => ({
      active: s.active?.persistent ? s.active : null,
      queue: s.queue.filter(d => d.persistent),
    }))
  },
}

export const useActiveDialog = () => useDialogStore(s => s.active)
export const useIsDialogOpen = (type: DialogType) =>
  useDialogStore(s => s.active?.type === type)
src/components/dialogs/dialog-types.ts

// Add a new entry here whenever you add a new dialog.
// Key = dialog name, Value = props the dialog receives.

export const DialogType = {
  ConfirmDelete: 'ConfirmDelete',
  // ... add more here
} as const

export type DialogType = (typeof DialogType)[keyof typeof DialogType]

export interface DialogPropsMap {
  [DialogType.ConfirmDelete]: {
    title: string
    description?: string
    confirmLabel?: string
    onConfirm: () => Promise<void> | void
  }
  // ... add more here
}
src/components/dialogs/dialog-registry.ts

import type React from 'react'
import type { DialogType } from './dialog-types'

// Populated by injectDialog() calls — never import dialog components directly here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dialogComponents: Partial<Record<DialogType, React.FC<any>>> = {}
src/components/dialogs/inject-dialog.ts

import React from 'react'
import { dialogComponents } from './dialog-registry'
import type { DialogType, DialogPropsMap } from './dialog-types'

export function injectDialog<T extends DialogType>(
  type: T,
  factory: () => Promise<{ default: React.ComponentType<DialogPropsMap[T]> }>,
): void {
  if (dialogComponents[type]) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dialogComponents[type] = React.lazy(factory) as React.FC<any>
}
src/components/dialogs/dialog-root.tsx

'use client'

import React, { Suspense } from 'react'
import { useActiveDialog, dialogActions } from '@/stores/dialog-store'
import { dialogComponents } from './dialog-registry'

class DialogErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[DialogRoot]', error)
    dialogActions.close()
  }

  componentDidUpdate(prev: { children: React.ReactNode }) {
    if (prev.children !== this.props.children) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export function DialogRoot() {
  const active = useActiveDialog()
  if (!active) return null

  const SpecificDialog = dialogComponents[active.type]
  if (!SpecificDialog) {
    console.warn(`[DialogRoot] No component registered for: "${active.type}". Did you call injectDialog()?`)
    return null
  }

  return (
    <DialogErrorBoundary key={active.id}>
      <Suspense>
        <SpecificDialog {...active.props} />
      </Suspense>
    </DialogErrorBoundary>
  )
}
Mount in root layout
In src/app/layout.tsx (or the relevant root layout):


import { DialogRoot } from '@/components/dialogs/dialog-root'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <DialogRoot />
      </body>
    </html>
  )
}
Adding a new dialog (checklist)
Register the type — add to DialogType const and DialogPropsMap in dialog-types.ts
Create the component — src/components/dialogs/my-thing-dialog.tsx
Inject — call injectDialog() where the dialog is first needed (e.g. the page that triggers it, or a feature entry point)
Open — call dialogActions.open(DialogType.MyThing, { ...props })
Dialog component template (Shadcn)

'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { dialogActions } from '@/stores/dialog-store'
import type { DialogPropsMap } from './dialog-types'

type Props = DialogPropsMap['MyThing']

export default function MyThingDialog({ /* destructure props */ }: Props) {
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    if (loading) return
    dialogActions.close()
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      // await someAction()
      dialogActions.close()
    } catch {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Optional description</DialogDescription>
        </DialogHeader>

        {/* body */}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={() => void handleConfirm()} disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
Note: The component must be a default export because injectDialog uses
React.lazy(() => import('./my-thing-dialog')) which expects { default: Component }.

Confirm-delete dialog template
For destructive actions, use Shadcn AlertDialog instead of Dialog:


'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { dialogActions } from '@/stores/dialog-store'
import type { DialogPropsMap } from './dialog-types'

type Props = DialogPropsMap['ConfirmDelete']

export default function ConfirmDeleteDialog({ title, description, confirmLabel, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      dialogActions.close()
    } catch {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open onOpenChange={() => !loading && dialogActions.close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => void handleConfirm()}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Deleting…' : (confirmLabel ?? 'Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
Opening dialogs from anywhere

import { dialogActions } from '@/stores/dialog-store'
import { DialogType } from '@/components/dialogs/dialog-types'
import { injectDialog } from '@/components/dialogs/inject-dialog'

// Register once, near the call site (safe to call multiple times)
injectDialog(DialogType.ConfirmDelete, () => import('@/components/dialogs/confirm-delete-dialog'))

// Open
dialogActions.open(DialogType.ConfirmDelete, {
  title: 'Delete item?',
  description: 'This cannot be undone.',
  onConfirm: async () => {
    await deleteItem(id)
  },
})
Priority and persistence

// High-priority: appears before anything already queued
dialogActions.open(DialogType.SessionExpired, {}, { priority: 'high' })

// Persistent: survives dialogActions.closeAll() (use for critical flows)
dialogActions.open(DialogType.RequiredSetup, {}, { persistent: true })

// Close everything (e.g. on route change) — persistent dialogs survive
dialogActions.closeAll()
```

Key invariants
Dialog components always render with open prop hardcoded to true — the store owns visibility
onOpenChange on Dialog/AlertDialog calls dialogActions.close() (handles ESC + backdrop click)
Always default export from dialog component files (required by React.lazy)
Never import dialog components directly into dialog-registry.ts — use injectDialog() only
The 300 ms delay in close() matches Shadcn Dialog's default CSS exit animation duration
