'use client'
import ProjectCard from '../../general-info/projectcard'
import { Card} from "@/components/final-page-portfolio/ui/card";
import { Button } from "@/components/general-info-UI/(components)/button";
import { Input } from "@/components/general-info-UI/(components)/input"; 
import { Textarea } from "@/components/general-info-UI/(components)/textarea"; 
import { Plus, Trash2 } from "lucide-react";
import { CardContent } from "@/components/general-info-UI/(components)/card";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
export default function GeneralInfoForm() {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    introduction: '',
    experience: '',
    linkedin: '',
    github: '',
    codechef: '',
    codeforces: '',
    leetcode: '',
    gfg: '',
    projects: [{ title: '', description: '', technologies: '', link: '' }],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProjectChange = (index: number, field: string, value: string) => {
    const updatedProjects = [...formData.projects]
    updatedProjects[index][field] = value
    setFormData((prev) => ({ ...prev, projects: updatedProjects }))
  }

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', technologies: '', link: '' }],
    }))
  }

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(formData)
      toast({
        title: 'Success',
        description: 'Information saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">General Information Form</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Introduction</label>
                <Textarea
                  name="introduction"
                  placeholder="Write a brief introduction about yourself"
                  value={formData.introduction}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Experience</label>
                <Textarea
                  name="experience"
                  placeholder="Describe your experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Social & Coding Profiles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['linkedin', 'github', 'codechef', 'codeforces', 'leetcode', 'gfg'].map((profile) => (
                  <div key={profile}>
                    <label className="block font-medium mb-1">{profile.charAt(0).toUpperCase() + profile.slice(1)} URL</label>
                    <Input
                      name={profile}
                      placeholder={`https://${profile}.com/...`}
                      value={formData[profile]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Projects</h2>
                <Button type="button" onClick={addProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>

              {formData.projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  index={index}
                  onRemove={removeProject}
                  onChange={handleProjectChange}
                />
              ))}
            </div>

            <Button type="submit" className="w-full bg-[#F5A623] text-white">
              Save Information
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
