"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X, Calendar, MessageSquare, Copy, Check } from "lucide-react";
import { Message } from "@/model/User";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success("Message deleted successfully");
      onMessageDelete(message._id);
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Message copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <MessageSquare className="w-5 h-5" />
            <span className="font-semibold text-gray-800">
              Anonymous Message
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyMessage}
              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    Delete Message
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this message? This action
                    cannot be undone and the message will be permanently removed
                    from your dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    {isDeleting ? "Deleting..." : "Delete Message"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {message.createdAt && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <Calendar className="w-4 h-4" />
            <span>Received {formatDate(message.createdAt)}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="relative">
          <blockquote className="border-l-2 border-gray-200 pl-4 italic text-gray-700 leading-relaxed">
            "{message.content}"
          </blockquote>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Anonymous sender</span>
          </div>
          <div className="text-xs text-gray-400">
            ID: {message._id.slice(-8)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
