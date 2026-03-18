"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <BarChart3 size={32} className="text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">성과 분석</h1>
      <p className="text-sm text-gray-500">
        SNS 계정을 연동하면 성과 데이터를 확인할 수 있습니다.
      </p>
    </div>
  );
}
