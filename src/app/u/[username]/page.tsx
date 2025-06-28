"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Loader2,
  Send,
  Sparkles,
  MessageCircle,
  User,
  Eye,
  Shuffle,
  CheckCircle2,
  ArrowRight,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [messageSent, setMessageSent] = useState(false);

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast.success("Message sent successfully!", {
        description: "Your anonymous message has been delivered.",
      });
      form.reset({ ...form.getValues(), content: "" });
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 3000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to send message", {
        description:
          axiosError.response?.data.message ?? "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to generate suggestions");
    }
  };

  if (messageSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Message Sent!
              </h2>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Your anonymous message has been delivered to @{username}
              </p>
            </div>
            <Button
              onClick={() => setMessageSent(false)}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 sm:py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center">
              Send Anonymous Message
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <span className="text-lg sm:text-xl text-gray-700">
              to{" "}
              <span className="font-bold text-purple-600 break-all">
                @{username}
              </span>
            </span>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Send a completely anonymous message that will be delivered
            privately. Your identity will remain hidden.
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base sm:text-lg font-semibold flex items-center gap-2">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        Your Anonymous Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here... Remember, this will be completely anonymous!"
                          className="min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-lg border-2 border-gray-200 focus:border-purple-500 transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                          Your identity is completely protected
                        </span>
                        <span>{messageContent?.length || 0} characters</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent?.trim()}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 h-4 sm:h-5 sm:w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 h-4 sm:h-5 sm:w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Message Suggestions Section */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Need Inspiration?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Get AI-generated message suggestions
                  </p>
                </div>
              </div>
              <Button
                onClick={fetchSuggestedMessages}
                disabled={isSuggestLoading}
                variant="outline"
                className="bg-yellow-50 border-yellow-200 hover:bg-yellow-100 w-full sm:w-auto"
              >
                {isSuggestLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Shuffle className="mr-2 h-4 w-4" />
                )}
                <span className="hidden sm:inline">Generate Ideas</span>
                <span className="sm:hidden">Generate</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {error ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-red-500 mb-4 text-sm sm:text-base">
                  Failed to generate suggestions
                </p>
                <Button
                  onClick={fetchSuggestedMessages}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid gap-2 sm:gap-3">
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 flex items-center gap-2">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  Click on any suggestion to use it as your message
                </p>
                {parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto p-3 sm:p-4 justify-start hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group"
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="flex items-center  gap-2 sm:gap-3 w-full">
                      <div className="p-1 bg-purple-100 rounded group-hover:bg-purple-200 transition-colors flex-shrink-0">
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                      </div>
                      <span className="flex-1 text-xs sm:text-sm break-words">
                        {message}
                      </span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator className="my-6 sm:my-8" />

        {/* Call to Action */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Want Your Own Message Board?
              </h3>
              <p className="text-sm sm:text-base text-blue-100 px-2">
                Create your own anonymous message board and start receiving
                messages from friends, colleagues, or anyone who wants to share
                something with you anonymously.
              </p>
            </div>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 sm:px-8 py-2 sm:py-3 shadow-lg w-full sm:w-auto"
              >
                <Gift className="mr-2 h-4 h-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">
                  Create Your Account - It's Free!
                </span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
