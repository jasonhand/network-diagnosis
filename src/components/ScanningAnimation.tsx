import React from 'react'

interface ScanningAnimationProps {
  children: React.ReactNode
  className?: string
  isActive?: boolean
}

export default function ScanningAnimation({ 
  children, 
  className = '', 
  isActive = true 
}: ScanningAnimationProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent animate-scan-line"></div>
          
          {/* Pulse effect */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary-400 rounded-full animate-pulse-scan"></div>
          </div>
          
          {/* Corner indicators */}
          <div className="absolute top-2 left-2 w-1 h-1 bg-primary-400 rounded-full animate-pulse"></div>
          <div className="absolute top-2 right-2 w-1 h-1 bg-primary-400 rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-primary-400 rounded-full animate-pulse delay-150"></div>
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-primary-400 rounded-full animate-pulse delay-300"></div>
        </div>
      )}
    </div>
  )
} 