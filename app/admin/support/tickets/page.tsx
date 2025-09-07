"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SupportTicketsTable from "../Section/tickets-table";

export default function SupportTicketsPage() {
  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Ticketlar</CardTitle>
        <CardDescription className="text-white/70">Kullanıcıların açtığı tüm talepler</CardDescription>
      </CardHeader>
      <CardContent>
        <SupportTicketsTable />
      </CardContent>
    </Card>
  );
}

