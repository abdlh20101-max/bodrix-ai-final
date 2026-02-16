import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { useLocation } from "wouter";

export default function Reviews() {
  const [, navigate] = useLocation();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      messageId: "msg_001",
      rating: 5,
      comment: "رد رائع جداً! الشرح واضح وسهل الفهم",
      helpful: 24,
      notHelpful: 1,
      date: "2026-02-04",
      userInitials: "AH",
    },
    {
      id: 2,
      messageId: "msg_002",
      rating: 4,
      comment: "جيد لكن كان يمكن إضافة أمثلة أكثر",
      helpful: 15,
      notHelpful: 3,
      date: "2026-02-03",
      userInitials: "SA",
    },
    {
      id: 3,
      messageId: "msg_003",
      rating: 3,
      comment: "متوسط، بحاجة إلى توضيح أكثر",
      helpful: 8,
      notHelpful: 5,
      date: "2026-02-02",
      userInitials: "MK",
    },
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

  const handleSubmitReview = () => {
    if (newReview.comment.trim()) {
      const review = {
        id: reviews.length + 1,
        messageId: `msg_${String(reviews.length + 1).padStart(3, "0")}`,
        rating: newReview.rating,
        comment: newReview.comment,
        helpful: 0,
        notHelpful: 0,
        date: new Date().toISOString().split("T")[0],
        userInitials: "ME",
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: "" });
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/history")}
            className="p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              التقييمات والتعليقات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              قيّم جودة الردود من الذكاء الاصطناعي
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Review */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                أضف تقييمك
              </h3>

              {/* Rating Stars */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  التقييم
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none transition"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= newReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  التعليق
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder="شارك رأيك..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                إرسال التقييم
              </Button>

              {/* Statistics */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  إحصائيات التقييمات
                </h4>

                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-yellow-500">
                    {averageRating}
                  </div>
                  <div className="flex justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(Number(averageRating))
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    من {reviews.length} تقييم
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-6">
                        {rating}⭐
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{
                            width: `${
                              reviews.length > 0
                                ? (ratingDistribution[rating as keyof typeof ratingDistribution] /
                                    reviews.length) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                        {ratingDistribution[rating as keyof typeof ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Reviews List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <Card className="p-8 text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    لا توجد تقييمات حتى الآن
                  </p>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {review.userInitials}
                        </div>
                        <div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {review.date}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-900 dark:text-white mb-4">
                      {review.comment}
                    </p>

                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 transition">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful}</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 transition">
                        <ThumbsDown className="w-4 h-4" />
                        <span>{review.notHelpful}</span>
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
