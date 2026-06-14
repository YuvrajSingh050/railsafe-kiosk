import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Complaint } from "@/types";

export function ComplaintsTable({ complaints, onStatusUpdate }: { complaints: Complaint[], onStatusUpdate: () => void }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const filteredComplaints = useMemo(() => {
    if (filter === "All") return complaints;
    return complaints.filter(c => c.category === filter);
  }, [complaints, filter]);

  const handleToggleStatus = async (complaintId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Open" ? "Resolved" : "Open";
    try {
      setUpdating(complaintId);
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success(`Complaint marked as ${newStatus}`);
      onStatusUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={filter} onValueChange={(val) => { if (val) setFilter(val); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Overcharging">Overcharging</SelectItem>
            <SelectItem value="Quality">Quality</SelectItem>
            <SelectItem value="Delay">Delay</SelectItem>
            <SelectItem value="Hygiene">Hygiene</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-rail-blue/5">
                <TableHead className="text-rail-blue-dark font-bold">Seat / Order</TableHead>
                <TableHead className="text-rail-blue-dark font-bold">Category</TableHead>
                <TableHead className="text-rail-blue-dark font-bold">Description</TableHead>
                <TableHead className="text-rail-blue-dark font-bold">Time</TableHead>
                <TableHead className="text-rail-blue-dark font-bold">Status</TableHead>
                <TableHead className="text-rail-blue-dark font-bold">Resolve</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No complaints found
                  </TableCell>
                </TableRow>
              ) : (
                filteredComplaints.map(complaint => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <div className="font-medium">{complaint.seatNumber}</div>
                      {complaint.orderNumber && <div className="text-xs text-muted-foreground font-mono">{complaint.orderNumber}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge className={complaint.category === "Overcharging" ? "bg-rail-red text-white" : "bg-rail-blue text-white"}>
                        {complaint.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm line-clamp-2" title={complaint.description}>{complaint.description}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(complaint.createdAt), "dd MMM HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={complaint.status === "Open" ? "default" : "secondary"} className={complaint.status === "Open" ? "bg-rail-amber text-white" : "bg-rail-green text-white"}>
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={complaint.status === "Resolved"}
                          onCheckedChange={() => handleToggleStatus(complaint.id, complaint.status)}
                          disabled={updating === complaint.id}
                        />
                        {updating === complaint.id && <Loader2 className="animate-spin text-primary" size={14} />}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
