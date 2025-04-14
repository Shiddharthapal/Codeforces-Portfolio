"use client";

import * as React from 'react'
import { createElement, useCallback } from 'react'
import { toast as hotToast } from 'react-hot-toast'
import type { Toast } from 'react-hot-toast'

export type ToastVariant = 'success' | 'failed'

export interface ToastProps {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastStyles {
  background: string
  color: string
  border?: string
}

const getToastStyles = (variant: ToastVariant = 'success'): ToastStyles => {
  switch (variant) {
    case 'success':
      return {
        background: '#10B981',
        color: '#FFFFFF',
        border: '1px solid #059669'
      }
    case 'failed':
      return {
        background: '#EF4444',
        color: '#FFFFFF',
        border: '1px solid #DC2626'
      }
    default:
      return {
        background: '#10B981',
        color: '#FFFFFF',
        border: '1px solid #059669'
      }
  }
}

const ToastMessage: React.FC<{ t: Toast } & ToastProps> = ({ t, title, description, variant }) => {
  const styles = getToastStyles(variant)
  
  return createElement('div', {
    className: `${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`,
    style: {
      background: styles.background,
      color: styles.color,
      border: styles.border,
    },
    children: [
      createElement('div', {
        className: 'flex-1 w-0 p-4',
        children: createElement('div', {
          className: 'flex items-start',
          children: createElement('div', {
            className: 'ml-3 flex-1',
            children: [
              createElement('p', {
                className: 'text-sm font-medium',
                children: title
              }),
              description && createElement('p', {
                className: 'mt-1 text-sm opacity-90',
                children: description
              })
            ]
          })
        })
      }),
      createElement('div', {
        className: 'flex border-l border-opacity-20',
        children: createElement('button', {
          onClick: () => hotToast.dismiss(t.id),
          className: 'w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium hover:opacity-80 focus:outline-none',
          children: 'Close'
        })
      })
    ]
  })
}

export const toast = ({ title, description, variant = 'success', duration = 3000 }: ToastProps) => {
  const styles = getToastStyles(variant)

  return hotToast.custom(
    (t) => createElement(ToastMessage, { t, title, description, variant, duration }),
    { duration }
  )
}

export const useToast = () => {
  return useCallback((props: ToastProps) => toast(props), [])
}

export default useToast