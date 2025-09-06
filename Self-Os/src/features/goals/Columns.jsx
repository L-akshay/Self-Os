import React, { useState } from "react"
import { Input } from "../../components/Ui/input";
import { Checkbox } from "../../components/Ui/checkbox";
import { Badge } from "../../components/Ui/badge";

// Here we'll use dummy update handlers, you'll wire Firestore later
export const columns = [  
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const [val, setVal] = useState(row.original.title)
      return (
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => console.log("Update title →", val)} // replace with updateGoal(uid,id,{title:val})
        />
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.status === "done"}
        onCheckedChange={(v) =>
          console.log("Toggle status →", v ? "done" : "open")
        }
      />
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge>{row.original.priority || "none"}</Badge>
    ),
  },
]
