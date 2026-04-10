import React from 'react'
import { motion } from 'framer-motion'

export default function FloatingBlobs() {
  return (
    <>
      <motion.div
        className="blob blob-one"
        animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob-two"
        animate={{ y: [0, 16, 0], x: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob-three"
        animate={{ y: [0, -14, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />
    </>
  )
}