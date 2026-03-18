"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  const [topic, setTopic] = useState("");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <FileText size={24} className="text-indigo-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">블로그 글 작성</h1>
            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
              베타
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            주제만 입력하면 고품질 블로그 글을 만들어줌
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            주제 / 키워드
          </label>
          <Input
            placeholder="예: MCP Server Integration, AI 마케팅 트렌드"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            추가 지시사항 (선택)
          </label>
          <Textarea
            placeholder="예: SEO 키워드 중심으로 작성해주세요. 3000자 이상으로 상세하게 작성해주세요."
            rows={3}
          />
        </div>

        <Button className="w-full bg-violet-600 hover:bg-violet-700">
          블로그 글 생성하기
        </Button>
      </div>
    </div>
  );
}
