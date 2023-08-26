"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

import CommentSkeleton from "./CommentSkeleton";
import { client } from "@/lib/sanity/client";

interface AllCommentsProps {
  _id: string;
}

export default function AllComments({ _id }: AllCommentsProps) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const Comment = dynamic(() => import("./SingleComment"));
  const query = `*[_type == "comment" && approved == true ]{_id, ...} | order(_createdAt asc)`;

  const querySubRef = useRef<any>(); // You can replace "any" with the appropriate type
  console.log(_id);
  useEffect(() => {
    async function fetchComments() {
      try {
        const initialComments = await client?.fetch(query, _id);
        setComments(initialComments);
        querySubRef.current = client
          ?.listen(query)
          .subscribe(update => {
            if (update) {
              setComments(prevComments =>
                [
                  ...prevComments.filter(
                    comment => comment._id !== update?.result._id
                  ),
                  update.result
                ].sort((a, b) =>
                  a._createdAt > b._createdAt ? 1 : -1
                )
              );
            }
          });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setIsLoading(false);
      }
    }
    fetchComments();

    return () => {
      // Clean up the subscription when the component unmounts
      if (querySubRef.current) {
        querySubRef.current.unsubscribe();
      }
    };
  }, [_id]);

  const commentList = comments.map(comment => (
    <Comment key={comment._id} comment={comment} />
  ));

  return (
    <div className="mx-auto w-full py-2">
      {isLoading ? (
        <div>
          <ul>
            {Array.from({ length: 5 }).map((_, index) => (
              <CommentSkeleton key={index} />
            ))}
          </ul>
        </div>
      ) : (
        <ul>{commentList}</ul>
      )}
    </div>
  );
}
