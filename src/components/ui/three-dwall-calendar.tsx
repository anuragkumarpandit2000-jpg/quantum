"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
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

  // Responsive state for mobile adaptation
  const [isMobile, setIsMobile] = React.useState(false);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [mobileMode, setMobileMode] = React.useState<"fit" | "3d">("fit");

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (wallRef.current) {
        setContainerWidth(wallRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // wheel tilt (desktop)
  const onWheel = (e: React.WheelEvent) => {
    if (isMobile && mobileMode === "fit") return;
    setTiltX((t) => Math.max(0, Math.min(45, t + e.deltaY * 0.02)));
    setTiltY((t) => Math.max(-40, Math.min(40, t + e.deltaX * 0.04)));
  };

  // drag tilt
  const onPointerDown = (e: React.PointerEvent) => {
    if (isMobile && mobileMode === "fit") return;
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

  // Adaptive panel dimensions
  const isMobileFit = isMobile && mobileMode === "fit";
  const gap = isMobile ? (isMobileFit ? 4 : 6) : 10;
  
  // In fit mode on mobile, calculate box size so all 7 columns fit the screen width
  const effectivePanelWidth = isMobile
    ? isMobileFit
      ? containerWidth > 0
        ? Math.max(36, Math.floor((containerWidth - (columns - 1) * gap - 4) / columns))
        : 44
      : 70
    : panelWidth;

  const effectivePanelHeight = isMobile
    ? isMobileFit
      ? Math.max(50, Math.round(effectivePanelWidth * 1.25))
      : 76
    : panelHeight;

  const effectiveTiltX = isMobileFit ? 0 : tiltX;
  const effectiveTiltY = isMobileFit ? 0 : tiltY;

  const rowCount = Math.ceil(days.length / columns);
  const wallCenterRow = (rowCount - 1) / 2;

  return (
    <div className={cn("space-y-4 sm:space-y-6 w-full", className)}>
      {/* Calendar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-sky-400">ARC TIMELINE</span> CALENDAR
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
            {isMobileFit
              ? "COMPACT 90-DAY TIMELINE MATRIX"
              : "DRAG OR SCROLL TO ROTATE 3D PERSPECTIVE MATRIX"}
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-[10px] font-mono text-sky-400 border-sky-500/30 bg-sky-950/20"
              onClick={() => setMobileMode((m) => (m === "fit" ? "3d" : "fit"))}
            >
              {mobileMode === "fit" ? "3D Tilt" : "Fit View"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7 sm:h-8 px-2"
            onClick={() => setDateRef((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          >
            <ChevronLeft className="size-3.5 sm:size-4" />
          </Button>
          <div className="font-mono text-xs sm:text-sm font-bold px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-md bg-slate-900 border border-slate-700 text-sky-300">
            {format(dateRef, isMobile ? "MMM yyyy" : "MMMM yyyy")}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 sm:h-8 px-2"
            onClick={() => setDateRef((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          >
            <ChevronRight className="size-3.5 sm:size-4" />
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
        className={cn(
          "w-full py-4 sm:py-8 select-none",
          isMobileFit
            ? "overflow-x-hidden cursor-default"
            : "overflow-x-auto cursor-grab active:cursor-grabbing"
        )}
        style={{ perspective: isMobileFit ? undefined : 1200 }}
      >
        <div
          className="mx-auto"
          style={{
            width: isMobileFit ? "100%" : columns * (effectivePanelWidth + gap),
            maxWidth: "100%",
            transformStyle: isMobileFit ? undefined : "preserve-3d",
            transform: isMobileFit ? undefined : `rotateX(${effectiveTiltX}deg) rotateY(${effectiveTiltY}deg)`,
            transition: "transform 100ms linear",
          }}
        >
          <div
            className="relative"
            style={{
              display: "grid",
              gridTemplateColumns: isMobileFit
                ? `repeat(${columns}, minmax(0, 1fr))`
                : `repeat(${columns}, ${effectivePanelWidth}px)`,
              gridAutoRows: `${effectivePanelHeight}px`,
              gap: `${gap}px`,
              transformStyle: isMobileFit ? undefined : "preserve-3d",
              padding: isMobile ? "2px" : `${gap}px`,
            }}
          >
            {days.map((day, idx) => {
              const row = Math.floor(idx / columns);
              const rowOffset = row - wallCenterRow;
              const z = isMobileFit ? 0 : Math.max(-60, 30 - Math.abs(rowOffset) * 15);
              const dayEvents = eventsForDay(day);
              const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

              return (
                <div
                  key={day.toISOString()}
                  className="relative h-full w-full"
                  style={{
                    transform: isMobileFit ? undefined : `translateZ(${z}px)`,
                    zIndex: Math.round(100 - Math.abs(rowOffset)),
                  }}
                >
                  <Card
                    className={cn(
                      "h-full w-full overflow-visible transition-colors border",
                      isToday
                        ? "border-sky-400 bg-sky-950/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                        : "border-slate-800/80 bg-slate-950/80 hover:border-slate-700"
                    )}
                  >
                    <CardContent className={cn(
                      "h-full flex flex-col justify-between",
                      isMobile ? "p-1" : "p-2.5"
                    )}>
                      <div className="flex justify-between items-start">
                        <span
                          className={cn(
                            "font-mono font-bold rounded",
                            isMobile ? "text-[10px] px-1 py-0.5 leading-none" : "text-xs px-1.5 py-0.5",
                            isToday ? "bg-sky-500 text-slate-950" : "text-slate-300"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        <span className={cn(
                          "font-mono text-slate-500 uppercase",
                          isMobile ? "text-[8px] leading-none" : "text-[10px]"
                        )}>
                          {format(day, isMobile ? "EEEEE" : "EEE")}
                        </span>
                      </div>

                      {/* events dots/pills */}
                      <div className={cn(
                        "relative flex flex-wrap content-start overflow-hidden",
                        isMobile ? "my-0.5 gap-0.5" : "my-1 gap-1 flex-1"
                      )}>
                        {dayEvents.map((ev) => (
                          <Popover key={ev.id}>
                            <PopoverTrigger asChild>
                              <div
                                className={cn(
                                  "rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center text-slate-950 font-bold cursor-pointer shadow-sm transition",
                                  isMobile ? "w-3 h-3 text-[7px]" : "w-5 h-5 text-[10px]"
                                )}
                                title={ev.title}
                              >
                                •
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-3 z-50">
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

                      {!isMobile && (
                        <div className="text-[10px] font-mono text-slate-500">
                          {dayEvents.length > 0 ? `${dayEvents.length} log(s)` : "-"}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add event form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center bg-slate-900/60 border border-slate-800 p-2.5 sm:p-3 rounded-xl w-full max-w-xl"
      >
        <Input
          placeholder="Milestone title (e.g. Day 30 Checkpoint)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
        />
        <div className="flex gap-2">
          <Input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="flex-1 sm:w-40 text-xs sm:text-sm h-8 sm:h-9"
          />
          <Button type="submit" variant="cool" size="sm" className="gap-1 h-8 sm:h-9 text-xs px-3">
            <Plus className="size-3.5" /> Add
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ThreeDWallCalendar;
