/**
 * Z-index layer system for consistent layering across the application.
 *
 * MUI default z-index values for reference:
 * - mobileStepper: 1000
 * - fab: 1050
 * - speedDial: 1050
 * - appBar: 1100
 * - drawer: 1200
 * - modal: 1300
 * - snackbar: 1400
 * - tooltip: 1500
 *
 * Our custom layers build on top of MUI's system:
 */
export const Z_INDEX = {
  // Base MUI layers (1000-1500)

  // Application-specific layers (1500+)
  /** Resource drawer - should be above regular dialogs */
  RESOURCE_DRAWER: 1600,

  /** Critical notifications and confirmations */
  NOTIFICATION: 1700,

  /** Error/warning popups that need to be above everything */
  ALERT_POPUP: 1800,

  /** Confirmation dialogs for critical actions */
  CONFIRMATION_DIALOG: 1900,

  /** Reserved for future use - absolute top layer */
  OVERLAY: 2000,
} as const;

export type ZIndexLayer = (typeof Z_INDEX)[keyof typeof Z_INDEX];
