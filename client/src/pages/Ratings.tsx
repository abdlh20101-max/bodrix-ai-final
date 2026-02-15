import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function Ratings() {
  const [, navigate] = useLocation();
  const [showReview, setShowReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const [reviews, setReviews] = useState([
    {
      id: "1",
      author: "أحمد محمد",
      rating: 5,
      date: "2026-02-03",
      comment: "تطبيق رائع جداً! الردود دقيقة وسريعة جداً.",
      helpful: 45,
      unhelpful: 2,
    },
    {
      id: "2",
      author: "فاطمة علي",
      rating: 4,
      date: "2026-02-02",
      comment: "جيد جداً لكن أتمنى المزيد من اللغات.",
      helpful: 32,
      unhelpful: 1,
    },
    {
      id: "3",
      author: "محمود حسن",
      rating: 5,
      date: "2026-02-01",
      comment: "أفضل تطبيق ذكاء اصطناعي استخدمته!",
      helpful: 78,
      unhelpful: 3,
    },
  ]);

  const [stats] = useState({
    averageRating: 4.7,
    totalReviews: 1234,
    distribution: {
      5: 890,
      4: 250,
      3: 70,
      2: 20,
      1: 4,
    },
  });

  const handleAddReview = () => {
    if (newReview.comment.trim()) {
      setReviews([
        {
          id: String(Math.max(...reviews.map((r) => parseInt(r.id)), 0) + 1),
          author: "أنت",
          rating: newReview.rating,
          date: new Date().toISOString().split("T")[0],
          comment: newReview.comment,
          helpful: 0,
          unhelpful: 0,
        },
        ...reviews,
      ]);
      setNewReview({ rating: 5, comment: "" });
      setShowReview(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="w-8 h-8" />
                التقييمات والمراجعات
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                شارك رأيك وساعد الآخرين على اختيار الأفضل
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowReview(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            اكتب مراجعة
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Rating Summary */}
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              ملخص التقييمات
            </h3>

            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-yellow-400">
                  {stats.averageRating}
                </p>
                <div className="flex justify-center mt-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  من {stats.totalReviews} تقييم
                </p>
              </div>

              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.distribution[rating as keyof typeof stats.distribution];
                  const percentage = (count / stats.totalReviews) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                        {rating}⭐
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-full rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 w-12">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    إجمالي المراجعات
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalReviews}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    المراجعات هذا الشهر
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    +156
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </Card>
          </div>
        </div>

        {/* New Review Form */}
        {showReview && (
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              اكتب مراجعتك
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  التقييم
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 cursor-pointer transition ${
                          star <= newReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  التعليق
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder="شارك تجربتك..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddReview}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  نشر المراجعة
                </Button>
                <Button
                  onClick={() => setShowReview(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            أحدث المراجعات ({reviews.length})
          </h3>

          {reviews.map((review) => (
            <Card
              key={review.id}
              className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {review.author}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {review.date}
                  </p>
                </div>
                <div>{renderStars(review.rating)}</div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {review.comment}
              </p>

              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="w-4 h-4" />
                  مفيد ({review.helpful})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  غير مفيد ({review.unhelpful})
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
