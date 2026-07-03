"use client";

import Card from "@/components/common/Card";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyState from "@/components/common/EmptyState";

export default function ReportTemplatesPage() {
  return (
    <div className="p-8">
      <SectionTitle
        title="报告模板管理"
        subtitle="自定义测评报告的模板样式和内容"
        className="mb-8"
      />

      <Card>
        <EmptyState
          title="报告模板管理功能将在下一版本上线"
          description="报告模板管理将允许您自定义测评报告的展示样式、内容结构和不同人格类型的报告模板。您可以为每种人格类型配置专属的报告页面，提升用户的阅读体验。"
          icon={
            <svg
              className="w-16 h-16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          }
        />
      </Card>
    </div>
  );
}
