import React from "react";
import Image from "next/image";
import { MapPin, Globe, Phone, Mail, Calendar, Flag } from "lucide-react";  
import { SiLinkedin, SiGithub } from "react-icons/si";
import Button from "./Button";
import useTranslation from "@/hooks/useTranslation";

export interface Profile {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  portfolio: string;
  github: string;
  dob: string;
  pob: string;
  marital_status: string;
  nationality: string;
}

interface ProfileCardProps {
  profile?: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const { t, language } = useTranslation();
  
  // Fallbacks for demo/development
  const location = profile?.location || "Hanau, Germany";
  const phone = profile?.phone || "+49 173 940 55 70";
  const email = profile?.email || "mirkotrotta@gmail.com";
  const linkedin = profile?.linkedin || "https://www.linkedin.com/in/mirkotrotta";
  const github = profile?.github || "https://github.com/mirkotrotta";
  const dob = profile?.dob || "07 October 1981";
  const nationality = profile?.nationality || t('resume.profile.nationality') || "Italian";
  
  // For PDF downloads in Next.js with i18n, we need to break out of the locale-prefixed URL structure
  // by forcing an absolute URL path that starts with the root domain
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const resumePdfPath = `${siteUrl}/pdf/resume-${language}.pdf`;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-auto w-full max-w-xs md:max-w-sm lg:max-w-md max-h-[90vh] flex flex-col items-center mx-auto">
      {/* Profile Image*/}
      <div className="w-full h-56 md:h-64 relative">
        <Image
          src="/images/mirko-trotta-profile-resume-2025.jpg"
          alt="Profile"
          fill
          className="object-cover w-full h-full"
          sizes="320px"
        />
      </div>
      {/* Card Content */}
      <div className="p-4 w-full flex flex-col items-center">
        {/* Name and Title */}
        {/*<div className="w-full text-left mb-2">
          <h2 className="text-2xl font-normal leading-tight text-gray-900 dark:text-white">{name}</h2>
        </div>*/}
        {/* Status */}
        <div className="w-full flex items-center mb-2">
          <span className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2 inline-block"></span>
            {t('resume.profile.available') || "Available for work"}
          </span>
        </div>
        {/* Location */}
        <div className="w-full flex items-center text-gray-500 dark:text-gray-400 text-sm my-4">
          <MapPin size={18} className="mr-2" />
          {location}
        </div>
        {/* Contact Info */}
        <div className="w-full space-y-2 mb-4">
          {/* LinkedIn */}
          <div className="flex items-center text-gray-700 dark:text-gray-200 text-sm">
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center hover:underline"
            >
              <SiLinkedin className="mr-2 text-gray-400 dark:text-gray-500" />
              LinkedIn
            </a>
          </div>
          {/* GitHub */}
          <div className="flex items-center text-gray-700 dark:text-gray-200 text-sm">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center hover:underline"
            >
              <SiGithub className="mr-2 text-gray-400 dark:text-gray-500" />
              GitHub
            </a>
          </div>
          {/* Email */}
          <div className="flex items-center text-gray-700 dark:text-gray-200 text-sm">
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="flex items-center hover:underline"
            >
              <Mail size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
              {email}
            </a>
          </div>
          {/* Phone */}
          <div className="flex items-center text-gray-700 dark:text-gray-200 text-sm">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`} // Remove spaces for tel link
              aria-label="Phone"
              className="flex items-center hover:underline"
            >
              <Phone size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
              {phone}
            </a>
          </div>
          {/* Date of Birth */}
          <div className="flex items-center text-gray-700 dark:text-gray-200 text-sm">
            <Calendar size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
            {dob}
          </div>
          {/* Nationality */}
          <div className="flex items-center text-gray-700 dark:text-gray-200 text-sm">
            <Flag size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
            {nationality}
          </div>
        </div>
        {/* Buttons */}
        <div className="w-full flex flex-col gap-2 mt-auto">
          <Button variant="primary" className="w-full" href={resumePdfPath} download={true}>{t('resume.download') || "Download CV"}</Button>
          <Button variant="secondary" className="w-full" href={`/${language}/contact`}>{t('common.buttons.contact') || "Contact Me"}</Button>
        </div>
      </div>
    </div>
  );
} 