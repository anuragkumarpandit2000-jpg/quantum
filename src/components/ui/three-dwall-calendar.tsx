"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import { cn } from "@/lib/utils";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // ISO
};

interface ThreeDWallCalendarProps {
  events?: CalendarEvent[];
  onAddEvent?: (e: CalendarEvent) => void;
  onRemoveEvent?: (id: string) => void;
  panelWidth?: number;
  panelHeight?: number;
  columns?: number;
  className?: string;
}

export function ThreeDWallCalendar({
  events = [],
  onAddEvent,
  onRemoveEvent,
  panelWidth = 140,
  panelHeight = 110,
  columns = 7,
  className,
}: ThreeDWallCalendarProps) {
  const [dateRef, setDateRef] = React.useState<Date>(new Date());
  const [title, setTitle] = React.useState("");
  const [newDate, setNewDate] = React.useState("");
  const wallRef = React.useRef<HTMLDivElement | null>(null);

  // 3D tilt state
  const [tiltX, setTiltX] = React.useState(14);
  const [tiltY, setTiltY] = React.useState(0);
  const isDragging = React.useRef(false);
  const dragStart = React.useRef<{ x: number; y: number } | null>(null);

  // month days
  const days = eachDayOfInterval({
    start: startOfMonth(dateRef),
    end: endOfMonth(dateRef),
  });

  const eventsForDay = (d: Date) =>
    events.filter((ev) => format(new Date(ev.date), "yyyy-MM-dd") === format(d, "yyyy-MM-dd"));

  // Add event handler
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !newDate) return;
    onAddEvent?.({
      id: uuidv4(),
      title: title.trim(),
      date: new Date(newDate).toISOString(),
    });
    setTitle("");
    setNewDate("");
  };

  // wheel tilt
  const onWheel = (e: React.WheelEvent) => {
    setTiltX((t) => Math.max(0, Math.min(45, t + e.deltaY * 0.02)));
    setTiltY((t) => Math.max(-40, Math.min(40, t + e.deltaX * 0.04)));
  };

  // drag tilt
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setTiltY((t) => Math.max(-50, Math.min(50, t + dx * 0.08)));
    setTiltX((t) => Math.max(0, Math.min(50, t - dy * 0.08)));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = () => {
    isDragging.current = false;
    dragStart.current = null;
  };

  const gap = 10;
  const rowCount = Math.ceil(days.length / columns);
  const wallCenterRow = (rowCount - 1) / 2;

  return (
    <div className={cn("space-y-6 w-full", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-sky-400">ARC TIMELINE</span> CALENDAR
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            DRAG OR SCROLL TO ROTATE 3D PERSPECTIVE MATRIX
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateRef((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="font-mono text-sm font-bold px-4 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-sky-300">
            {format(dateRef, "MMMM yyyy")}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateRef((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Wall container */}
      <div
        ref={wallRef}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="w-full overflow-x-auto py-8 cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: 1200 }}
      >
        <div
          className="mx-auto"
          style={{
            width: columns * (panelWidth + gap),
            transformStyle: "preserve-3d",
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: "transform 100ms linear",
          }}
        >
          <div
            className="relative"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, ${panelWidth}px)`,
              gridAutoRows: `${panelHeight}px`,
              gap: `${gap}px`,
              transformStyle: "preserve-3d",
              padding: gap,
            }}
          >
            {days.map((day, idx) => {
              const row = Math.floor(idx / columns);
              const rowOffset = row - wallCenterRow;
              const z = Math.max(-60, 30 - Math.abs(rowOffset) * 15);
              const dayEvents = eventsForDay(day);
              const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

              return (
                <div
                  key={day.toISOString()}
                  className="relative"
                  style={{
                    transform: `translateZ(${z}px)`,
                    zIndex: Math.round(100 - Math.abs(rowOffset)),
                  }}
                >
                  <Card
                    className={cn(
                      "h-full overflow-visible transition-colors border",
                      isToday
                        ? "border-sky-400 bg-sky-950/40 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                        : "border-slate-800 bg-slate-950/80 hover:border-slate-700"
                    )}
                  >
                    <CardContent className="p-2.5 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span
                          className={cn(
                            "text-xs font-mono font-bold px-1.5 py-0.5 rounded",
                            isToday ? "bg-sky-500 text-slate-950" : "text-slate-300"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {format(day, "EEE")}
                        </span>
                      </div>

                      {/* events dots/pills */}
                      <div className="relative my-1 flex-1 flex flex-wrap gap-1 content-start overflow-hidden">
                        {dayEvents.map((ev) => (
                          <Popover key={ev.id}>
                            <PopoverTrigger asChild>
                              <div
                                className="w-5 h-5 rounded-md bg-sky-500 hover:bg-sky-400 flex items-center justify-center text-slate-950 text-[10px] font-bold cursor-pointer shadow-sm transition"
                                title={ev.title}
                              >
                                •
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-semibold text-xs text-white">{ev.title}</div>
                                  <div className="text-[10px] font-mono text-sky-400 mt-1">
                                    {format(new Date(ev.date), "PPP")}
                                  </div>
                                </div>
                                {onRemoveEvent && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-red-400 hover:text-red-300"
                                    onClick={() => onRemoveEvent(ev.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        ))}
                      </div>

                      <div className="text-[10px] font-mono text-slate-500">
                        {dayEvents.length > 0 ? `${dayEvents.length} log(s)` : "-"}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add event form */}
      <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-center bg-slate-900/60 border border-slate-800 p-3 rounded-xl max-w-xl">
        <Input
          placeholder="Milestone or Event title (e.g. Day 30 Checkpoint)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <Input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="w-40"
        />
        <Button type="submit" variant="cool" size="sm" className="gap-1">
          <Plus className="size-4" /> Add Event
        </Button>
      </form>
    </div>
  );
}

export default ThreeDWallCalendar;
