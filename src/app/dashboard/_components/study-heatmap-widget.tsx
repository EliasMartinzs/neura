"use client";

import React, { useState, useMemo } from "react";
import { Calendar, TrendingUp, Award, Flame } from "lucide-react";

interface DailyStudyActivity {
  date: string;
  count: number;
}

interface StudyStats {
  totalDays: number;
  totalActivities: number;
  streak: number;
  maxCount: number;
}

interface StudyHeatmapProps {
  dailyStudy:
    | {
        date: string;
        count: number;
      }[]
    | undefined;
}

function toUTCDateString(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const StudyHeatmapWidget = ({ dailyStudy }: StudyHeatmapProps) => {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  if (!dailyStudy) return [];

  // Gera dados completos dos últimos 365 dias
  const studyData = useMemo<DailyStudyActivity[]>(() => {
    const data: DailyStudyActivity[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    const apiDataMap = new Map<string, number>();

    for (const item of dailyStudy) {
      const normalized = toUTCDateString(new Date(item.date));
      apiDataMap.set(normalized, item.count);
    }

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dayUTC = toUTCDateString(new Date(d));
      const count = apiDataMap.get(dayUTC) ?? 0;
      data.push({ date: dayUTC, count });
    }

    return data;
  }, [dailyStudy]);

  // Estatísticas
  const stats = useMemo<StudyStats>(() => {
    const totalDays = studyData.filter((d) => d.count > 0).length;
    const totalActivities = studyData.reduce((sum, d) => sum + d.count, 0);

    const currentStreak = studyData
      .slice()
      .reverse()
      .findIndex((d) => d.count === 0);

    const streak = currentStreak === -1 ? studyData.length : currentStreak;
    const maxCount = Math.max(...studyData.map((d) => d.count));

    return { totalDays, totalActivities, streak, maxCount };
  }, [studyData]);

  // Organiza semanas
  const weeks = useMemo<(DailyStudyActivity | null)[][]>(() => {
    if (studyData.length === 0) return [];

    const weeksArray: (DailyStudyActivity | null)[][] = [];
    let currentWeek: (DailyStudyActivity | null)[] = [];

    const startDate = new Date(studyData[0].date);
    const startDay = startDate.getDay();

    for (let i = 0; i < startDay; i++) currentWeek.push(null);

    studyData.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });

    while (currentWeek.length < 7) currentWeek.push(null);
    weeksArray.push(currentWeek);

    return weeksArray;
  }, [studyData]);

  const getColor = (count: number): string => {
    if (count === 0) return "bg-slate-500 dark:bg-slate-500";
    if (count <= 2) return "bg-emerald-900 dark:bg-emerald-900";
    if (count <= 5) return "bg-emerald-700 dark:bg-emerald-700";
    if (count <= 10) return "bg-emerald-500 dark:bg-emerald-500";
    return "bg-emerald-500 dark:bg-emerald-500";
  };

  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const monthLabels = useMemo(() => {
    if (studyData.length === 0) return [];

    const labels: { month: string; weekIndex: number }[] = [];
    let currentMonth = -1;

    studyData.forEach((day, index) => {
      const date = new Date(day.date + "T00:00:00Z");
      const month = date.getUTCMonth();

      if (month !== currentMonth) {
        currentMonth = month;
        const weekIndex = Math.floor(
          (index + new Date(studyData[0].date + "T00:00:00Z").getUTCDay()) / 7
        );
        labels.push({
          month: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
          ][month],
          weekIndex,
        });
      }
    });

    return labels;
  }, [studyData]);

  const activityCount =
    studyData.find((d) => d.date === hoveredDay)?.count ?? 0;

  const icon =
    activityCount > 10
      ? "🔥"
      : activityCount > 5
      ? "⭐"
      : activityCount > 0
      ? "✨"
      : "💤";

  return (
    <div className="space-y-6">
      {/* CARDS DE ESTATISTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 rounded-4xl p-8 border shadow-xl border-emerald-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className=" text-sm font-medium">Total de Dias</h3>
          </div>
          <p className="text-3xl font-bold ">{stats.totalDays}</p>
          <p className="text-xs  mt-1">dias ativos</p>
        </div>

        <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 rounded-4xl p-8 border shadow-xl border-purple-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className=" text-sm font-medium">Total de Atividades</h3>
          </div>
          <p className="text-3xl font-bold ">{stats.totalActivities}</p>
          <p className="text-xs  mt-1">ações de estudo</p>
        </div>

        <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 rounded-4xl p-8 border shadow-xl border-orange-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className=" text-sm font-medium">Sequência Atual</h3>
          </div>
          <p className="text-3xl font-bold ">{stats.streak}</p>
          <p className="text-xs  mt-1">dias consecutivos</p>
        </div>

        <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 rounded-4xl p-8 border shadow-xl border-teal-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className=" text-sm font-medium">Recorde Diário</h3>
          </div>
          <p className="text-3xl font-bold ">{stats.maxCount}</p>
          <p className="text-xs  mt-1">atividades em um dia</p>
        </div>
      </div>

      {/* HEATMAP */}
      <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 rounded-4xl p-8 border shadow-xl border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold ">Últimos 12 meses</h2>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Menos</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"></div>
              <div className="w-4 h-4 rounded bg-emerald-200 dark:bg-emerald-900"></div>
              <div className="w-4 h-4 rounded bg-emerald-400 dark:bg-emerald-700"></div>
              <div className="w-4 h-4 rounded bg-emerald-600 dark:bg-emerald-500"></div>
              <div className="w-4 h-4 rounded bg-emerald-800 dark:bg-emerald-400"></div>
            </div>
            <span>Mais</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* LABELS DOS MESES - CORRIGIDO */}
            <div
              className="flex gap-1 mb-2 ml-12 relative"
              style={{ height: "16px" }}
            >
              {monthLabels.map((label, i) => (
                <div
                  key={i}
                  className="text-xs  absolute"
                  style={{ left: `${label.weekIndex * 16}px` }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              {/* LABEL DOS DIAS */}
              <div className="flex flex-col gap-1 pr-2">
                {days.map((day, i) => (
                  <div key={i} className="h-3 text-xs  flex items-center">
                    {i % 2 === 1 ? day : ""}
                  </div>
                ))}
              </div>

              {/* GRID */}
              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        className={`w-3 h-3 rounded-sm transition-all cursor-pointer ${
                          day ? getColor(day.count) : "bg-transparent"
                        } ${
                          hoveredDay === day?.date
                            ? "ring-2 ring-emerald-600 scale-125"
                            : ""
                        }`}
                        onMouseEnter={() => day && setHoveredDay(day.date)}
                        onMouseLeave={() => setHoveredDay(null)}
                        title={
                          day ? `${day.date}: ${day.count} atividades` : ""
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TOOLTIP */}
        {hoveredDay && (
          <div className="mt-6 p-4 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-emerald-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {new Date(hoveredDay + "T00:00:00Z").toLocaleDateString(
                    "pt-BR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    }
                  )}
                </p>

                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                  {activityCount} atividades
                </p>
              </div>

              <div className="text-4xl">{icon}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
