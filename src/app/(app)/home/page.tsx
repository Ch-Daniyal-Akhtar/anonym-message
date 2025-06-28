"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  Loader2,
  RefreshCcw,
  Copy,
  Link2,
  MessageSquare,
  Settings,
  Shield,
  BarChart3,
  Bell,
  Check,
  ExternalLink,
  Inbox,
} from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to fetch message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Messages refreshed successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to update message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (!session || !session.user) {
    return (
      <>
        <p className="mx-auto py-8 text-black font-bold">
          Please Login to start your journey
        </p>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const openProfile = () => {
    window.open(profileUrl, "_blank");
  };

  const totalMessages = messages.length;
  const recentMessages = messages.filter((msg) => {
    const messageDate = new Date(msg.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return messageDate > weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, {username}!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your anonymous messages and settings
              </p>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-full shadow-sm border">
                <div
                  className={`w-2 h-2 rounded-full ${acceptMessages ? "bg-green-500" : "bg-red-500"} animate-pulse`}
                ></div>
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                  {acceptMessages ? "Accepting Messages" : "Messages Paused"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Total Messages
                </CardTitle>
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-2xl sm:text-3xl font-bold">
                {totalMessages}
              </div>
              <p className="text-blue-100 text-xs sm:text-sm">
                All time messages received
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  This Week
                </CardTitle>
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-2xl sm:text-3xl font-bold">
                {recentMessages}
              </div>
              <p className="text-green-100 text-xs sm:text-sm">
                Messages in last 7 days
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Status
                </CardTitle>
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-2xl sm:text-3xl font-bold">
                {acceptMessages ? "Active" : "Paused"}
              </div>
              <p className="text-purple-100 text-xs sm:text-sm">
                Message acceptance status
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Share Profile Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg self-center sm:self-start">
                  <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-center sm:text-left">
                  <CardTitle className="text-lg sm:text-xl">
                    Share Your Profile
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Let others send you anonymous messages
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={profileUrl}
                  disabled
                  className="flex-1 bg-transparent text-xs sm:text-sm text-gray-600 outline-none min-w-0"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={copyToClipboard}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  variant="outline"
                  onClick={openProfile}
                  className="sm:px-4"
                >
                  <ExternalLink className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Open</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg self-center sm:self-start">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="text-center sm:text-left">
                  <CardTitle className="text-lg sm:text-xl">
                    Message Settings
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Control who can send you messages
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-sm sm:text-base">
                      Accept Messages
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {acceptMessages
                        ? "Currently accepting new messages"
                        : "New messages are paused"}
                    </p>
                  </div>
                </div>
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6 sm:my-8" />

        {/* Messages Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-center sm:text-left">
              <div className="p-2 bg-indigo-100 rounded-lg self-center sm:self-start">
                <Inbox className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Your Messages
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {totalMessages > 0
                    ? `${totalMessages} messages received`
                    : "No messages yet"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 border-gray-200 w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {/* Messages Grid */}
          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4 sm:px-6">
                <div className="p-3 sm:p-4 bg-gray-100 rounded-full mb-4">
                  <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md text-sm sm:text-base">
                  Share your profile link to start receiving anonymous messages
                  from others.
                </p>
                <Button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Profile Link
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
