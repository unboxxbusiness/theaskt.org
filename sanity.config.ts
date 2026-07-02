import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';
import { EditorialDashboard } from './sanity/components/EditorialDashboard';
import { LayoutDashboard } from 'lucide-react';

// ponytail: global listener to prevent click-outside modal close events in Sanity Studio
if (typeof window !== 'undefined') {
  const preventOutsideClose = (e: MouseEvent | TouchEvent | PointerEvent) => {
    const dialogs = document.querySelectorAll('div[role="dialog"]');
    if (dialogs.length === 0) return;

    const activeDialog = dialogs[dialogs.length - 1];
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Allow all events inside the active dialog wrapper (includes close buttons, inputs, toolbar etc)
    if (activeDialog.contains(target)) return;

    // Allow dropdown options, select listboxes, menus, and portal elements rendered outside the dialog DOM tree
    const isPortalOrPopover = 
      target.closest('[data-portal]') || 
      target.closest('[role="listbox"]') || 
      target.closest('[role="menu"]') || 
      target.closest('[role="tooltip"]') || 
      target.closest('[role="alert"]') || 
      target.closest('[role="status"]') || 
      target.closest('[role="combobox"]') ||
      target.closest('[id^="radix-"]') ||
      target.closest('[data-ui="Popover"]') ||
      target.closest('[data-ui="Tooltip"]') ||
      target.closest('[data-ui="Menu"]') ||
      target.closest('.ui-popup');

    if (isPortalOrPopover) return;

    // Intercept outside / backdrop clicks and stop propagation to prevent Sanity's closeOnOutsideClick triggers
    e.stopPropagation();
    e.preventDefault();
  };

  const preventPasteBubbling = (e: ClipboardEvent) => {
    const dialogs = document.querySelectorAll('div[role="dialog"]');
    if (dialogs.length === 0) return;

    const activeDialog = dialogs[dialogs.length - 1];
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Allow local inputs/textareas to receive paste, but stop propagation to the global block editor
    if (activeDialog.contains(target)) {
      e.stopPropagation();
    }
  };

  const preventKeyDownBubbling = (e: KeyboardEvent) => {
    if (e.key === 'Escape') return; // Allow Escape key to bubble and close modal natively

    const dialogs = document.querySelectorAll('div[role="dialog"]');
    if (dialogs.length === 0) return;

    const activeDialog = dialogs[dialogs.length - 1];
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Stop keyboard events inside the dialog from bubbling to the parent block editor
    if (activeDialog.contains(target)) {
      e.stopPropagation();
    }
  };

  window.addEventListener('mousedown', preventOutsideClose, true);
  window.addEventListener('pointerdown', preventOutsideClose, true);
  window.addEventListener('touchstart', preventOutsideClose, true);
  window.addEventListener('click', preventOutsideClose, true);
  window.addEventListener('paste', preventPasteBubbling, true);
  window.addEventListener('keydown', preventKeyDownBubbling, true);
}

export default defineConfig({
  name: 'theaskt',
  title: 'TheAskt Studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mock-sanity-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',

  plugins: [
    structureTool({
      structure,
    }),
    // Uncomment presentationTool once Next.js frontend is configured with @sanity/visual-editing
    /*
    presentationTool({
      previewUrl: {
        preview: '/',
      },
    }),
    */
    visionTool()
  ],

  tools: (prev) => [
    {
      name: 'editorial-dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      component: EditorialDashboard,
    },
    ...prev,
  ],

  schema: {
    types: schemaTypes,
  },
});
