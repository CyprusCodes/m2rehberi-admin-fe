import { ReportedPostDetail } from "./Section";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ReportedPostDetailPageProps {
  params: {
    id: string;
  };
}

export default function ReportedPostDetailPage({
  params,
}: ReportedPostDetailPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/reported-posts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Rapor Detayı</h1>
            <p className="text-muted-foreground">
              Rapor #{params.id} detaylarını inceleyin
            </p>
          </div>
        </div>
      </div>

      <ReportedPostDetail reportId={params.id} />
    </div>
  );
}
