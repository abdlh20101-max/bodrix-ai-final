import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Plus,
  TrendingUp,
  Zap,
  BarChart3,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "executing" | "completed" | "failed";
  priority: "low" | "medium" | "high" | "critical";
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  executionTime?: number;
  result?: string;
  error?: string;
}

interface TaskStats {
  total: number;
  completed: number;
  executing: number;
  failed: number;
  avgExecutionTime: number;
  successRate: number;
}

export function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    executing: 0,
    failed: 0,
    avgExecutionTime: 0,
    successRate: 0,
  });

  // Mock data for demo
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: "task_1",
        title: "تحديث الموقع الرئيسي",
        description: "تحديث محتوى الصفحة الرئيسية",
        status: "completed",
        priority: "high",
        progress: 100,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        executionTime: 3500,
        result: "تم تحديث 5 أقسام بنجاح",
      },
      {
        id: "task_2",
        title: "إضافة ميزة جديدة",
        description: "تطوير نظام الإشعارات",
        status: "executing",
        priority: "critical",
        progress: 65,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: "task_3",
        title: "تحسين الأداء",
        description: "تحسين سرعة التحميل",
        status: "pending",
        priority: "medium",
        progress: 0,
        createdAt: new Date(),
      },
    ];

    setTasks(mockTasks);
    updateStats(mockTasks);
  }, []);

  const updateStats = (taskList: Task[]) => {
    const completed = taskList.filter((t) => t.status === "completed").length;
    const executing = taskList.filter((t) => t.status === "executing").length;
    const failed = taskList.filter((t) => t.status === "failed").length;

    const executionTimes = taskList
      .filter((t) => t.executionTime)
      .map((t) => t.executionTime || 0);
    const avgTime =
      executionTimes.length > 0
        ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length
        : 0;

    const successRate =
      taskList.length > 0 ? (completed / taskList.length) * 100 : 0;

    setStats({
      total: taskList.length,
      completed,
      executing,
      failed,
      avgExecutionTime: avgTime,
      successRate,
    });
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      status: "pending",
      priority: "medium",
      progress: 0,
      createdAt: new Date(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    updateStats(updatedTasks);
    setNewTaskTitle("");
    setNewTaskDesc("");
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    updateStats(updatedTasks);
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "executing":
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    const labels: Record<Task["status"], string> = {
      pending: "قيد الانتظار",
      executing: "جاري التنفيذ",
      completed: "مكتملة",
      failed: "فشلت",
    };
    return labels[status];
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    const colors: Record<Task["priority"], string> = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[priority];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-gray-600 mt-1">إجمالي المهام</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-gray-600 mt-1">مكتملة</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">{stats.executing}</p>
              <p className="text-xs text-gray-600 mt-1">قيد التنفيذ</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {stats.successRate.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">معدل النجاح</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Task */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة مهمة جديدة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="عنوان المهمة"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Input
            placeholder="وصف المهمة (اختياري)"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
          />
          <Button onClick={addTask} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            إضافة المهمة
          </Button>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            المهام النشطة
          </CardTitle>
          <CardDescription>
            {tasks.length} مهمة ({stats.executing} قيد التنفيذ)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد مهام حالياً
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority === "critical"
                        ? "حرج"
                        : task.priority === "high"
                        ? "عالي"
                        : task.priority === "medium"
                        ? "متوسط"
                        : "منخفض"}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">{getStatusLabel(task.status)}</span>
                    <span className="font-semibold">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    {task.createdAt.toLocaleTimeString("ar-SA")}
                  </span>
                  {task.executionTime && (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {formatTime(task.executionTime)}
                    </span>
                  )}
                </div>

                {/* Result */}
                {task.result && (
                  <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-800">
                    ✅ {task.result}
                  </div>
                )}

                {task.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-800">
                    ❌ {task.error}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            مقاييس الأداء
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">متوسط وقت التنفيذ</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatTime(stats.avgExecutionTime)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">المهام الفاشلة</p>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
