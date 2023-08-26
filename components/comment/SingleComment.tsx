import AddComment from './AddCommentForm'
import { useState } from 'react'
import parser from '../../lib/snarkdown.js'

export default function Comment({ comment, firstParentId }) {
  //console.log(`comment single`, comment)
  const [showReplyBox, setShowReplyBox] = useState(false)
  const toggleReplyBox = () => setShowReplyBox(!showReplyBox)
  const formatDate = fullDate => {
    const date = fullDate?.split('T')[0]
    const year = date?.split('-')[0]
    const month = new Date(date).toLocaleDateString('default', {
      month: 'long'
    })
    const day = date?.split('-')[2]

    return `${day} ${month} ${year}`
  }

  return (
    <li
      key={comment._id}
      id={comment._id}
      className={
        firstParentId
          ? 'my-1 rounded-lg bg-gray-200/20 p-5 dark:bg-gray-900'
          : 'my-1 rounded-lg bg-gray-100 p-5 dark:bg-gray-800'
      }>
      <div>
        <div className="mb-3">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-300">
            {' '}
            <strong>{comment?.name}</strong> on{' '}
            <strong>
              <time className="text-gray-500 dark:text-gray-400" dateTime={comment._createdAt}>
                {formatDate(comment._createdAt)}
              </time>
            </strong>
          </h3>
        </div>
        <div>
          {' '}
          <p
            className="comment-content"
            dangerouslySetInnerHTML={{
              __html: parser(comment?.comment.trim())
            }}></p>
        </div>
        <div className="mt-3">
          <button
            className="rounded-full bg-blue-700/20 px-4 py-2 text-sm text-blue-600 dark:text-blue-500 "
            onClick={toggleReplyBox}>
            Reply
          </button>
        </div>
      </div>

      {showReplyBox && (
        <div className="mt-2">
          <AddComment
            _id={comment.post._ref}
            parentCommentId={comment._id}
            firstParentId={firstParentId || comment._id}
          />
        </div>
      )}

      {comment.childComments && (
        <ul>
          {comment.childComments.map(x => (
            <Comment comment={x} key={x._id} firstParentId={firstParentId || x._id} />
          ))}
        </ul>
      )}
    </li>
  )
}
