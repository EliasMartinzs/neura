"use client";

import Image from "next/image";

import {
  Activity,
  Award,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Eye,
  EyeClosed,
  Flame,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

import { useState } from "react";
import { ChangeImageProfile } from "./_components/change-image-profile";
import { DeleteAccountButton } from "./_components/delete-account-button";
import { EditProfile } from "./_components/edit-profile";

import { ACTIVITY_ICONS, ActivityIconType } from "@/constants/activity";
import useProfile from "@/features/profile/api/use-profile";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { LoadingState } from "@/lib/query/loading-state";
import { useDashboard } from "@/features/session/api/use-dashboard";
import { StudyHeatmapWidget } from "../_components/study-heatmap-widget";
import { Button } from "@/components/ui/button";

type MostStudiedCategory = {
  tag: string;
  count: number;
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showTags, setShowTags] = useState(5);
  const { user, isError, isLoading, refetch, stats, activities } = useProfile();
  const { data } = useDashboard();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  if (!user) {
    return <EmptyState />;
  }

  const getInitials = () => {
    if (!user.name) return;

    return user.name
      .split(" ")
      .map((n) => n.at(0))
      .splice(0, 2);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Hero Section with Cover */}
      <div className="relative w-full flex items-center justify-center">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={160}
            height={160}
            className="object-cover rounded-full size-40"
          />
        ) : (
          <div className="size-40 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-full text-3xl flex items-center justify-center">
            {getInitials()}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        {/* User Info Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">
            {user?.name} {user?.surname}
          </h1>
          <p className="text-foreground text-lg mb-4">{user?.email}</p>
          {user?.bio && (
            <p className=" italic max-w-2xl mx-auto mb-6">{user?.bio}</p>
          )}
          <div className="flex items-center justify-center gap-6 text-sm text-foreground ">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {/* <span>Membro há {getDaysActive()} dias</span> */}
              <span>Membro há dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-orange-400">
                {0} dias de sequência
              </span>
            </div>
          </div>

          <div className="gap-x-4 flex items-center justify-center">
            <Button
              onClick={() => setIsEditing((prevState) => !prevState)}
              className="text-white mt-6 px-8 py-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 inline-flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Editar Perfil
            </Button>
            <ChangeImageProfile user={user} />
          </div>

          <EditProfile
            user={user}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>

        {/* Stats Grid - Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <HeroStat
            icon={<BookOpen className="w-8 h-8" />}
            value={stats?.flashcardsCreated || 0}
            label="Flashcards Criados"
            color="from-blue-500 to-cyan-500"
          />
          <HeroStat
            icon={<Target className="w-8 h-8" />}
            value={stats?.decksCount || 0}
            label="Decks Ativos"
            color="from-purple-500 to-pink-500"
          />
          <HeroStat
            icon={<Brain className="w-8 h-8" />}
            value={stats?.studiesCompleted || 0}
            label="Estudos Completos"
            color="from-green-500 to-emerald-500"
          />
          <HeroStat
            icon={<Trophy className="w-8 h-8" />}
            value={`${stats?.accuracyRateCards.toFixed(2) || 0}%`}
            label="Taxa de Acerto"
            color="from-yellow-500 to-orange-500"
          />
        </div>

        <StudyHeatmapWidget dailyStudy={data?.data?.dailyStudy!} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 rounded-4xl p-8 border shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Activity className="w-7 h-7 text-purple-400" />
                  Desempenho Geral
                </h2>
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                  <span className="text-green-400 font-semibold text-sm">
                    Excelente!
                  </span>
                </div>
              </div>

              {/* Accuracy Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Taxa de Acurácia</span>
                  <span className="text-3xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {stats?.accuracyRateCards.toFixed(2) || 0}%
                  </span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-linear-to-r from-green-500 via-emerald-500 to-green-400 rounded-full transition-all duration-1000 relative overflow-hidden"
                    style={{
                      width: `${stats?.accuracyRateCards.toFixed(2) || 0}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatBox
                  icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
                  label="Respostas Corretas"
                  value={stats?.totalCorrectAnswers || 0}
                  bgColor="bg-green-500/10"
                  borderColor="border-green-500/30"
                />
                <StatBox
                  icon={<XCircle className="w-6 h-6 text-red-400" />}
                  label="Respostas Erradas"
                  value={stats?.totalWrongAnswers || 0}
                  bgColor="bg-red-500/10"
                  borderColor="border-red-500/30"
                />
                <StatBox
                  icon={<Zap className="w-6 h-6 text-yellow-400" />}
                  label="Total de Revisões"
                  value={stats?.totalReviews || 0}
                  bgColor="bg-yellow-500/10"
                  borderColor="border-yellow-500/30"
                />
                <StatBox
                  icon={<TrendingUp className="w-6 h-6 text-blue-400" />}
                  label="Média por Card"
                  value={stats?.accuracyRateCards.toFixed(2) || 0}
                  bgColor="bg-blue-500/10"
                  borderColor="border-blue-500/30"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 rounded-4xl p-8 border shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Clock className="w-7 h-7 text-blue-400" />
                Atividade Recente
              </h2>
              <div className="space-y-4">
                {!activities?.length ? (
                  <p className="">Nenhuma atividade recente</p>
                ) : (
                  activities?.map((item) => (
                    <ActivityItem
                      key={item.id}
                      message={item.message as string}
                      icon={item.icon}
                      createdAt={new Date(item.createdAt)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Categories & Achievements */}
          <div className="space-y-6">
            {/* Top Categories */}
            <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 rounded-4xl p-8 border shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Award className="w-7 h-7 text-purple-400" />
                Top Tags
              </h2>
              <div className="space-y-4">
                {stats?.mostStudiedCategories === undefined ? (
                  <p>Nenhuma tag adicionada</p>
                ) : (
                  Array.isArray(
                    stats?.mostStudiedCategories as MostStudiedCategory[]
                  ) &&
                  (stats?.mostStudiedCategories as MostStudiedCategory[])
                    .slice(0, showTags)
                    .map((category, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border hover:border-purple-500/50 transition-all">
                          <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-lg">
                              {category?.tag}
                            </p>
                            <p className="text-sm ">Categoria mais estudada</p>
                          </div>
                        </div>
                      </div>
                    ))
                )}
                <button
                  className=""
                  onClick={() =>
                    setShowTags((prevState) => (prevState === 5 ? 10 : 5))
                  }
                >
                  {showTags === 5 ? (
                    <span className="flex items-center gap-x-3">
                      <Eye />
                      Mostrar todas as tags
                    </span>
                  ) : (
                    <span className="flex items-center gap-x-3">
                      <EyeClosed /> Ocultas tags
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className=" dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 rounded-4xl p-8 border shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Trophy className="w-7 h-7 text-yellow-400" />
                Conquistas
              </h2>
              <div className="space-y-3">
                <Achievement
                  emoji="🔥"
                  title="Sequência de Fogo"
                  description={`0 dias consecutivos`}
                  gradient="from-orange-500 to-red-500"
                />
                <Achievement
                  emoji="📚"
                  title="Criador Prolífico"
                  description={`${stats?.flashcardsCreated}+ flashcards`}
                  gradient="from-blue-500 to-cyan-500"
                />
                <Achievement
                  emoji="⚡"
                  title="Mente Afiada"
                  description={`${stats?.accuracyRateCards.toFixed(
                    2
                  )}% de acertos`}
                  gradient="from-green-500 to-emerald-500"
                />
                <Achievement
                  emoji="🎯"
                  title="Dedicação Total"
                  description={`${stats?.studiesCompleted} estudos completos`}
                  gradient="from-purple-500 to-pink-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-linear-to-br from-red-950 to-red-900 rounded-xl p-8 border-2 border-red-500/30 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-red-400 mb-2">
                Zona de Perigo
              </h3>
              <p className=" mb-4">
                Esta ação é permanente e não pode ser desfeita. Todos os seus
                dados serão perdidos.
              </p>
              <DeleteAccountButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ icon, value, label, color }: any) {
  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 bg-linear-to-r ${color} rounded-4xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity`}
      ></div>
      <div className="relative h-full dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 rounded-4xl p-6 border transition-all shadow-xl">
        <div
          className={`w-14 h-14 bg-linear-to-br ${color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
        >
          {icon}
        </div>
        <p className="text-3xl md:text-4xl font-bold mb-1">{value}</p>
        <p className="text-sm ">{label}</p>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, bgColor, borderColor }: any) {
  return (
    <div
      className={`${bgColor} border ${borderColor} rounded-xl p-5 hover:scale-105 transition-transform`}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm ">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function ActivityItem({
  icon,
  createdAt,
  message,
}: {
  icon: string;
  message: string;
  createdAt: Date;
}) {
  const Icon =
    ACTIVITY_ICONS[icon as ActivityIconType] ?? ACTIVITY_ICONS["sparkles"];

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border transition-all">
      <div className="p-2 bg-slate-700/50 rounded-lg">
        <Icon />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{message}</p>
        <p className="text-sm ">
          {new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(createdAt)}
        </p>
      </div>
    </div>
  );
}

function Achievement({ emoji, title, description, gradient }: any) {
  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 bg-linear-to-r ${gradient} rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity`}
      ></div>
      <div className="relative flex items-center bg-slate-800/50 gap-4 p-4 rounded-xl border transition-all">
        <div
          className={`w-14 h-14 bg-linear-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}
        >
          {emoji}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-lg">{title}</p>
          <p className="text-sm ">{description}</p>
        </div>
      </div>
    </div>
  );
}
