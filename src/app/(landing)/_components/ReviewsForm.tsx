/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "react-toastify";

export function ReviewModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", message: "", rating: 5 });

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Review submitted. Awaiting validation.");
      setForm({ fullName: "", message: "", rating: 5 });
      setOpen(false);
    } catch (err) {
      toast.error("Submission failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Leave a Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Your full name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <Textarea
          placeholder="Your message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <Input
          type="number"
          min={1}
          max={5}
          placeholder="Rating (1–5)"
          value={form.rating}
          onChange={(e) =>
            setForm({ ...form, rating: Number(e.target.value) })
          }
        />

        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
