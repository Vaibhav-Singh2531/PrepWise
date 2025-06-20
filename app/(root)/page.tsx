import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/constants'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = async () => {

  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! })
  ])

  // const userInterviews = await getInterviewsByUserId(user?.id!);
  // const latestInterviews = await getLatestInterviews({userId: user?.id!})

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;


  return (
    <>
      {/* <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className='text-lg'>Practice on real interview questions & get instant feedback</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt='robo-dude' width={400} height={400} className='max-sm:hidden' />
      </section> */}

      <div className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 rounded-2xl p-8 mb-12 relative overflow-hidden border border-purple-800/30">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-4">
              Get Interview-Ready with AI-<br />
              Powered Practice & Feedback
            </h1>
            <p className="text-gray-300 mb-6 text-lg">
              Practice on real interview questions & get instant feedback
            </p>
            <Button className="bg-purple-600 text-white hover:bg-purple-700 font-semibold px-6 py-3 rounded-xl">
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>
          <div className="flex-shrink-0 ml-8">
            <div className="relative">
              {/* Robot illustration placeholder */}
              <div className="w-64 h-55 bg-gradient-to-br from-purple-800/50 to-gray-800 rounded-2xl flex items-center justify-center relative border border-purple-600/30">
                {/* <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl">🤖</span>
                    </div>
                  </div> */}
                <Image src="/robot1.png" alt='robo-dude' width={250} height={250} className='max-sm:hidden' />
                {/* Floating elements */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-700 rounded-lg rotate-12"></div>
                <div className="absolute -top-1 -right-3 w-6 h-6 bg-purple-600 rounded-lg rotate-45"></div>
                <div className="absolute -bottom-2 -left-1 w-6 h-6 bg-purple-700 rounded-lg -rotate-12"></div>
                <div className="absolute -bottom-1 -right-2 w-8 h-8 bg-purple-600 rounded-lg rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className='interviews-section'>
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews</p>
          )
          }

        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>

        <div className='interviews-section'>
          {hasUpcomingInterviews ? (
            latestInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>There are no new interviews available</p>
          )
          }
        </div>
      </section>
    </>
  )
}

export default page