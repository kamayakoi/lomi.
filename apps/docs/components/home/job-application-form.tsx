/* @proprietary license */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SplitInput } from '@/components/ui/split-input';
import { Upload } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import { createJobApplication, uploadResume } from '@/lib/supabase/queries';
import { toast as showToast } from '@/components/ui/toast';
import { playCompletionSound, playClickSound } from '@/lib/utils/sound';

interface JobApplicationFormProps {
  jobTitle: string;
  jobId: string;
  onSubmit?: () => void;
}

export function JobApplicationForm({
  jobTitle,
  jobId,
  onSubmit,
}: JobApplicationFormProps) {
  const { currentLanguage } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    github: '',
    projectNote: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast: hookToast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        hookToast({
          title: String(t('job_application.file_too_large', currentLanguage)),
          description: String(
            t('job_application.file_too_large_desc', currentLanguage),
          ),
          variant: 'destructive',
        });
        return;
      }
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        hookToast({
          title: String(
            t('job_application.invalid_file_type', currentLanguage),
          ),
          description: String(
            t('job_application.invalid_file_type_desc', currentLanguage),
          ),
          variant: 'destructive',
        });
        return;
      }
      setResume(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let resumeUrl: string | undefined;

      // Upload resume if provided
      if (resume) {
        // Generate a unique application ID for the filename
        const tempApplicationId = `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`;
        resumeUrl = await uploadResume(resume, tempApplicationId);
      }

      // Create the job application
      await createJobApplication(jobId, {
        name: formData.name,
        email: formData.email,
        linkedin_url: formData.linkedin
          ? `https://linkedin.com/in/${formData.linkedin}`
          : undefined,
        github_url: formData.github
          ? `https://github.com/${formData.github}`
          : undefined,
        project_note: formData.projectNote || undefined,
        resume_url: resumeUrl,
      });

      setIsSubmitted(true);
      onSubmit?.();
      playCompletionSound();
      showToast({
        type: 'success',
        description: String(
          t('job_application.thank_you_message', currentLanguage),
        ).replace('{{jobTitle}}', jobTitle),
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      hookToast({
        title: String(t('job_application.submission_failed', currentLanguage)),
        description: String(
          t('job_application.submission_failed_desc', currentLanguage),
        ),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {String(t('job_application.apply_for_role', currentLanguage))}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {String(t('job_application.name', currentLanguage))}{' '}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your full name"
                className="mt-2"
                inputSize="header"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {String(t('job_application.email', currentLanguage))}{' '}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="hello@world.com"
                className="mt-2"
                inputSize="header"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume">
              {String(t('job_application.resume', currentLanguage))}
            </Label>
            <div className="relative mt-2">
              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="resume"
                onClick={playClickSound}
                className={`flex items-center justify-center rounded-sm px-3 py-2 text-sm cursor-pointer transition-colors h-8 ${
                  resume
                    ? 'bg-[#56A5F9] text-white border-[#56A5F9] dark:bg-sky-900 dark:text-sky-300'
                    : 'border border-gray-200 bg-slate-50 text-muted-foreground hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-[0.15px] dark:border-gray-700/20'
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                {resume ? resume.name : 'Upload file'}
              </label>
            </div>
          </div>

          {/* LinkedIn and GitHub Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* LinkedIn URL */}
            <div className="space-y-2">
              <Label htmlFor="linkedin">
                {String(t('job_application.linkedin', currentLanguage))}
              </Label>
              <SplitInput
                prefix="linkedin.com/in/"
                placeholder="your-handle"
                value={formData.linkedin}
                onChange={handleInputChange}
                id="linkedin"
                name="linkedin"
                className="mt-2"
              />
            </div>

            {/* GitHub Profile */}
            <div className="space-y-2">
              <Label htmlFor="github">
                {String(t('job_application.github', currentLanguage))}
              </Label>
              <SplitInput
                prefix="github.com/"
                placeholder="your-username"
                value={formData.github}
                onChange={handleInputChange}
                id="github"
                name="github"
                className="mt-2"
              />
            </div>
          </div>

          {/* Project Note */}
          <div className="space-y-2">
            <Label htmlFor="projectNote">
              {String(t('job_application.project_note', currentLanguage))}{' '}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="projectNote"
              name="projectNote"
              value={formData.projectNote}
              onChange={handleInputChange}
              placeholder=""
              rows={6}
              className="mt-2"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="blue"
            size="header"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>{String(t('job_application.submitting', currentLanguage))}</>
            ) : (
              <>
                {String(
                  t('job_application.submit_application', currentLanguage),
                )}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
