import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import useAddComment from "../hooks/comment/useAddComment";

const CommentForm = ({ videoId }) => {
  const { addComment, loading } = useAddComment(videoId);
  const { register, handleSubmit, reset } = useForm();
  const [formFocus, setFormFocus] = useState(false);

  const onSubmit = async (data) => {
    const { content } = data;
    const newComment = await addComment(content);

    if (newComment) {
      reset(); // Clear the form on successful submission
    }
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex items-center gap-3 rounded-lg bg-gray-100 p-4 shadow-md ${
          formFocus ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <motion.textarea
          {...register("content", { required: true })}
          className="flex-grow resize-none rounded-md border-none bg-transparent text-base placeholder-gray-500 outline-none focus:ring-0"
          placeholder="Write a comment..."
          onFocus={() => setFormFocus(true)}
          onBlur={() => setFormFocus(false)}
          disabled={loading}
        />
        <motion.button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-5 w-5 border-2 border-t-transparent border-white rounded-full"
            />
          ) : (
            <FaPaperPlane size={18} />
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CommentForm;
