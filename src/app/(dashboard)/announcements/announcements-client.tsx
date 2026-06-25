"use client";

import { useState } from "react";
import { Heart, MessageCircle, Pin, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn, relativeTime } from "@/lib/utils";
import type { Announcement, Employee } from "@/lib/types";

const categoryStyles: Record<Announcement["category"], string> = {
  company: "border-primary/30 bg-primary/10 text-primary",
  product: "border-indigo-500/30 bg-indigo-500/10 text-indigo-500",
  people: "border-success/30 bg-success/15 text-success",
  event: "border-warning/30 bg-warning/15 text-warning",
};

export function AnnouncementsClient({
  initial,
  employees,
  user,
}: {
  initial: Announcement[];
  employees: Employee[];
  user: Employee;
}) {
  const [posts, setPosts] = useState(initial);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");

  function toggleLike(id: string) {
    setLiked((l) => ({ ...l, [id]: !l[id] }));
    setPosts((ps) =>
      ps.map((p) =>
        p.id === id ? { ...p, likes: p.likes + (liked[id] ? -1 : 1) } : p
      )
    );
  }

  function post() {
    if (!draft.trim()) return;
    const next: Announcement = {
      id: `a-${Date.now()}`,
      author_id: user.id,
      title: draft.split("\n")[0].slice(0, 80),
      body: draft,
      category: "company",
      pinned: false,
      likes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
    };
    setPosts([next, ...posts]);
    setDraft("");
  }

  const ordered = [...posts].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned)
  );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Card>
        <CardContent className="flex gap-3 pt-5">
          <Avatar src={user.avatar_url} name={user.full_name} size={40} />
          <div className="flex-1 space-y-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Share an update with the company…"
              rows={3}
              className="w-full resize-none rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex justify-end">
              <Button className="gap-2" onClick={post} disabled={!draft.trim()}>
                <Send className="h-4 w-4" /> Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {ordered.map((a) => {
        const author = employees.find((e) => e.id === a.author_id);
        return (
          <Card key={a.id}>
            <CardContent className="space-y-3 pt-5">
              <div className="flex items-start gap-3">
                <Avatar src={author?.avatar_url} name={author?.full_name ?? "?"} size={42} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{author?.full_name}</p>
                    <span className="text-xs text-muted-foreground">
                      {relativeTime(a.created_at)}
                    </span>
                    {a.pinned && (
                      <Badge className="border-primary/30 bg-primary/10 text-primary">
                        <Pin className="h-3 w-3" /> Pinned
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{author?.title}</p>
                </div>
                <Badge className={categoryStyles[a.category]}>{a.category}</Badge>
              </div>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{a.body}</p>
              <div className="flex items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
                <button
                  onClick={() => toggleLike(a.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 transition-colors hover:text-destructive",
                    liked[a.id] && "text-destructive"
                  )}
                >
                  <Heart className={cn("h-4 w-4", liked[a.id] && "fill-destructive")} />
                  {a.likes}
                </button>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" />
                  {a.comments}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
