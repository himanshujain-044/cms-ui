// components/CommentSkeleton.js
import React from 'react'

const CommentSkeleton = () => {
  return (
    <div className="mt-2 animate-pulse rounded bg-gray-200 p-4">
      <div className="mb-2 h-4 w-2/3 rounded bg-gray-300"></div>
      <div className="mb-2 h-4 w-1/2 rounded bg-gray-300"></div>
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
    </div>
  )
}

export default CommentSkeleton
