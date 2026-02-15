import { Gift, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/_core/hooks/useLanguage";

interface Challenge {
  id: number;
  title: string;
  description: string;
  type: string;
  targetCount: number;
  rewardPoints: number;
  userProgress: {
    currentCount: number;
    isCompleted: number;
  };
}

interface DailyChallengesProps {
  challenges: Challenge[];
}

export function DailyChallenges({ challenges }: DailyChallengesProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  if (!challenges || challenges.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">
          {isArabic ? "التحديات اليومية" : "Daily Challenges"}
        </h3>
      </div>

      <div className="grid gap-3">
        {challenges.map((challenge) => {
          const progress = (challenge.userProgress.currentCount / challenge.targetCount) * 100;
          const isCompleted = challenge.userProgress.isCompleted === 1;

          return (
            <Card
              key={challenge.id}
              className={`p-4 ${
                isCompleted
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                  : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium">{challenge.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {challenge.description}
                  </p>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {challenge.userProgress.currentCount} / {challenge.targetCount}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-yellow-600">
                        <Zap className="h-3 w-3" />
                        +{challenge.rewardPoints}
                      </span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                  </div>
                </div>

                {isCompleted && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
