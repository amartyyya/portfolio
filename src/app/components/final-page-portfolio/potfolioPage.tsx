'use client'

import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/final-page-portfolio/ui/accordion"
import { Card } from "@/components/final-page-portfolio/ui/card"
import { Facebook, Youtube, Twitter, Instagram, Linkedin } from 'lucide-react'
import { GitHubIcon, CodeForcesIcon, CodeChefIcon, LeetCodeIcon, GFGIcon } from './final-page-portfolio/icons/codingPlatformLogo'
import { CodeLioLogo } from './final-page-portfolio/icons/codelioLogo'
import Image from 'next/image'
import axios from 'axios'
import { dbConnect } from '@/lib/dbConnect'
import { InfoModel } from '@/model/UserPortfolioInfo'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
// import { fetchPortfolioData } from '@/'


export default function PortfolioPage() {
  const [expandedProject, setExpandedProject] = useState<string | null>("item-1")
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
          return new Response(
            JSON.stringify({ success: false, message: 'Unauthorized' }),
            { status: 401 } // Return 401 if user is not authenticated
          );
        }
        const data = await InfoModel.findOne({ userId: session.user.id });
        setPortfolioData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load portfolio data')
        setLoading(false)
      }
    }
    loadPortfolioData()
  }, [])

  const stats = [
    { label: 'GitHub', value: portfolioData?.github, Icon: GitHubIcon },
    { label: 'CodeForces', value: portfolioData?.codeforces, Icon: CodeForcesIcon },
    { label: 'CodeChef', value: portfolioData?.codechef, Icon: CodeChefIcon },
    { label: 'LeetCode', value: portfolioData?.leetcode, Icon: LeetCodeIcon },
    { label: 'GFG', value: portfolioData?.gfg, Icon: GFGIcon },
  ]

  const socialLinks = [
    { icon: Facebook, name: 'facebook' },
    { icon: Youtube, name: 'youtube' },
    { icon: Twitter, name: 'twitter' },
    { icon: Instagram, name: 'instagram' },
    { icon: Linkedin, name: 'linkedin' },
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#F5A623] p-4">
        <div className="container mx-auto">
          <CodeLioLogo />
        </div>
      </header>

      {/* Introduction */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#F5A623] mb-4">Introduction</h1>
            <p className="text-gray-600 mb-6">
              {portfolioData.introduction}
            </p>
            <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="bg-[#F5A623] text-white px-6 py-2 rounded-full hover:bg-[#F5A623]/90 transition-colors inline-block">
              Connect on LinkedIn
            </a>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/profile-image.jpg"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-[#F5A623] mb-4">Experience</h2>
        <p className="text-gray-600 mb-8">
          {portfolioData.experience}
        </p>
      </section>

      {/* Coding Portfolio */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-[#F5A623] mb-8">Coding Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            stat.value && (
              <Card 
                key={index} 
                className={`p-6 ${index === 0 ? 'bg-[#F5A623] md:col-span-2 row-span-2' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-start gap-4">
                  <stat.Icon className={`h-10 w-10 ${index === 0 ? 'text-white' : 'text-[#F5A623]'}`} />
                  <div>
                    <p className={`text-sm ${index === 0 ? 'text-white' : 'text-[#F5A623]'}`}>{stat.label}</p>
                    <a 
                      href={stat.value} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`text-lg font-bold mt-2 ${index === 0 ? 'text-white' : 'text-gray-900'} hover:underline`}
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </Card>
            )
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-[#F5A623] mb-8">Projects</h2>
        <Accordion 
          type="single" 
          collapsible 
          value={expandedProject || undefined}
          onValueChange={(value) => setExpandedProject(value)}
          className="space-y-4"
        >
          {portfolioData.projects.map((project: any, index: number) => (
            <AccordionItem 
              key={index} 
              value={`item-${index + 1}`}
              className="border-none bg-white"
            >
              <AccordionTrigger className="flex items-center gap-4 text-[#F5A623] hover:text-[#F5A623]/90 no-underline">
                <span className="text-2xl font-bold">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-xl">{project.title}</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pl-12">
                <p className="mb-4">{project.description}</p>
                <p className="mb-4"><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#F5A623] hover:underline"
                  >
                    View Project
                  </a>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-[#F5A623] mb-4">Let's Connect</h2>
        <p className="text-gray-600 mb-6">
          Feel free to reach out for collaborations or just a friendly chat
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href="#"
              className="p-2 rounded-full hover:bg-[#F5A623]/10 transition-colors"
              aria-label={`Connect on ${social.name}`}
            >
              <social.icon className="h-6 w-6 text-[#F5A623]" />
            </a>
          ))}
        </div>
        <p className="text-gray-600 text-sm">
          Copyright © {new Date().getFullYear()} CodeLio | All Rights Reserved
        </p>
      </footer>
    </div>
  )
}

// portfolio-form 
//    - page.tsx : form react component 
//      import projectTemplate 
//               input name, xxxxxx
//               on Button Click Save Changed
//                  -- set showTemplate as true
//    {showTemaplte  &&  <ProjectTemplate data = {name, xxxxxx} >}


// x-folder: project-template.tsx

//  url yani folder -> wo hota h ek page
//  2 urls yni 2 folders in /app/ 
//  1 folder /url-1
//  2 folder /url-2
//  To pass data between 2 pages or urls 
//  1. using query params - /data?name='Amartya'
//  2. either store the data in BE/ DB and then pass the document_id = _id in query params

//  PArent Child 
//  call child component and pass krdiya data
    