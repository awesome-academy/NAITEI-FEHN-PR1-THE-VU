import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

export default function ReviewForm({ productId, onSubmitReview }) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    if (!username.trim()) {
      alert('Vui lòng nhập tên của bạn');
      return;
    }
    
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung đánh giá');
      return;
    }

    const newReview = {
      productId: productId,
      username: username,
      rating: rating,
      content: content,
      created_at: new Date().toISOString()
    };

    onSubmitReview(newReview);

    setRating(0);
    setContent('');
    setUsername('');
  };

  const renderStarInput = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        className="focus:outline-none"
      >
        {(hoverRating || rating) >= star ? (
          <StarIcon className="h-6 w-6 text-yellow-400" />
        ) : (
          <StarIconOutline className="h-6 w-6 text-yellow-400" />
        )}
      </button>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 p-4 border rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Viết đánh giá</h3>
      
      <div>
        <label className="block mb-2">Đánh giá của bạn</label>
        <div className="flex space-x-1">
          {renderStarInput()}
        </div>
      </div>

      <div>
        <label htmlFor="username" className="block mb-2">Tên của bạn</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Nhập tên của bạn"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block mb-2">Nội dung đánh giá</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          rows="4"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm"
          required
        ></textarea>
      </div>

      <button 
        type="submit" 
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
      >
        Gửi đánh giá
      </button>
    </form>
  );
}
