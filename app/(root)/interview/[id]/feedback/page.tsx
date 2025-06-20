import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/general.action';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import { TrendingUp, TrendingDown, User, Clock, Star, ArrowRight, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect('/')

  const feedbackData = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  })

  //  return (
  //     <section className="section-feedback">
  //       <div className="flex flex-row justify-center">
  //         <h1 className="text-4xl font-semibold">
  //           Feedback on the Interview -{" "}
  //           <span className="capitalize">{interview.role}</span> Interview
  //         </h1>
  //       </div>

  //       <div className="flex flex-row justify-center ">
  //         <div className="flex flex-row gap-5">
  //           {/* Overall Impression */}
  //           <div className="flex flex-row gap-2 items-center">
  //             <Image src="/star.svg" width={22} height={22} alt="star" />
  //             <p>
  //               Overall Impression:{" "}
  //               <span className="text-primary-200 font-bold">
  //                 {feedback?.totalScore}
  //               </span>
  //               /100
  //             </p>
  //           </div>

  //           {/* Date */}
  //           <div className="flex flex-row gap-2">
  //             <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
  //             <p>
  //               {feedback?.createdAt
  //                 ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
  //                 : "N/A"}
  //             </p>
  //           </div>
  //         </div>
  //       </div>

  //       <hr />

  //       <p>{feedback?.finalAssessment}</p>

  //       {/* Interview Breakdown */}
  //       <div className="flex flex-col gap-4">
  //         <h2>Breakdown of the Interview:</h2>
  //         {feedback?.categoryScores?.map((category, index) => (
  //           <div key={index}>
  //             <p className="font-bold">
  //               {index + 1}. {category.name} ({category.score}/100)
  //             </p>
  //             <p>{category.comment}</p>
  //           </div>
  //         ))}
  //       </div>

  //       <div className="flex flex-col gap-3">
  //         <h3>Strengths</h3>
  //         <ul>
  //           {feedback?.strengths?.map((strength, index) => (
  //             <li key={index}>{strength}</li>
  //           ))}
  //         </ul>
  //       </div>

  //       <div className="flex flex-col gap-3">
  //         <h3>Areas for Improvement</h3>
  //         <ul>
  //           {feedback?.areasForImprovement?.map((area, index) => (
  //             <li key={index}>{area}</li>
  //           ))}
  //         </ul>
  //       </div>

  //       <div className="buttons">
  //         <Button className="btn-secondary flex-1">
  //           <Link href="/" className="flex w-full justify-center">
  //             <p className="text-sm font-semibold text-primary-200 text-center">
  //               Back to dashboard
  //             </p>
  //           </Link>
  //         </Button>

  //         <Button className="btn-primary flex-1">
  //           <Link
  //             href={`/interview/${id}`}
  //             className="flex w-full justify-center"
  //           >
  //             <p className="text-sm font-semibold text-black text-center">
  //               Retake Interview
  //             </p>
  //           </Link>
  //         </Button>
  //       </div>
  //     </section>
  //   );
  // };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/30 to-gray-900/50  text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            <span className="capitalize">{interview.role}</span> Interview
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{feedbackData?.createdAt ? dayjs(feedbackData.createdAt).format("MMM D, YYYY h:mm A") : "N/A"}</span>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Overall Impression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(feedbackData.totalScore)}`}>
                {feedbackData.totalScore}
                <span className="text-2xl text-gray-400">/100</span>
              </div>
              <Progress
                value={feedbackData.totalScore}
                className="mt-4 h-3"
              />
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-blue-400">Final Assessment</h3>
              <p className="text-gray-300 leading-relaxed">{feedbackData.finalAssessment}</p>
            </div>
          </CardContent>
        </Card>

        {/* Category Scores */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Detailed Scores by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {feedbackData.categoryScores.map((category, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-white">{category.name}</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                    {category.score}%
                  </div>
                </div>
                <Progress value={category.score} className="h-2" />
                <p className="text-gray-400 text-sm leading-relaxed">{category.comment}</p>
                {index < feedbackData.categoryScores.length - 1 && (
                  <Separator className="bg-gray-700 mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Strengths and Areas for Improvement */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-5 h-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {feedbackData.strengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{strength}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <TrendingDown className="w-5 h-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {feedbackData.areasForImprovement.map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 mt-2" />
                  <span className="text-gray-300">{area}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          {/* <Button
            onClick={handleGoToDashboard}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Button>
          <Button
            onClick={handleRetakeInterview}
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Retake Interview
          </Button> */}
          <Button className="btn-secondary flex-1">
            <Link href="/" className="flex w-full justify-center">
              <p className="text-sm font-semibold text-primary-200 text-center">
                Back to dashboard
              </p>
            </Link>
          </Button>

          <Button className="btn-primary flex-1">
            <Link
              href={`/interview/${id}`}
              className="flex w-full justify-center"
            >
              <p className="text-sm font-semibold text-black text-center">
                Retake Interview
              </p>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};


export default page