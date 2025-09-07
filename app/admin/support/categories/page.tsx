"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SupportCategoriesTable from "../Section/categories-table";

export default function SupportCategoriesPage() {
  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Kategoriler</CardTitle>
        <CardDescription className="text-white/70">Destek kategorilerini oluşturun ve düzenleyin</CardDescription>
      </CardHeader>
      <CardContent>
        <SupportCategoriesTable />
      </CardContent>
    </Card>
  );
}

