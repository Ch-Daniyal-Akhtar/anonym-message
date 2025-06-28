"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

import messages from "@/messages.json";

const Home = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12 min-h-screen">
        <section className="text-center mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            Dive into the world of Anonymous Conversations
          </h1>
          <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore Anonym Message - Where your identity remains a secret
          </p>
        </section>

        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1 sm:p-2">
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="pb-2 sm:pb-3">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-center">
                          {message.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6">
                        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-center leading-relaxed">
                          {message.content}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-8 sm:-left-12 md:-left-16" />
            <CarouselNext className="hidden sm:flex -right-8 sm:-right-12 md:-right-16" />
          </Carousel>
        </div>

        {/* Touch indicators for mobile */}
        <div className="mt-6 sm:hidden">
          <p className="text-xs text-gray-500 text-center">
            Swipe to see more messages
          </p>
        </div>
      </main>

      <footer className="text-center p-4 sm:p-6 md:p-8 bg-gray-50 border-t">
        <p className="text-xs sm:text-sm md:text-base text-gray-600">
          ©️2025 Anonym Message. All rights reserved
        </p>
      </footer>
    </>
  );
};

export default Home;
