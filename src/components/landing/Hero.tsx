import { Button } from "../ui/button";
import { HeroCards } from "./HeroCards";
import { useState } from "react";
import { Link } from "react-router-dom";
import PulsatingButton from '@/components/ui/pulsating-button';
import AvatarCircles from "@/components/ui/avatar-circles";
import { useTranslation } from 'react-i18next';

// Image import
import africanledger from "/africanledger_round.webp";
import testimony2 from "/testimony2.webp";
import testimony3 from "/testimony3.webp";

export const Hero = () => {
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage modal visibility
  const { t } = useTranslation();

  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-left lg:text-start space-y-6">
        <main className="text-4xl md:text-5xl lg:text-6xl font-bold text-left lg:text-start mb-6">
          <h1>
            <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
              {t('hero.oneIntegration')}
            </span>{" "}
            {t('hero.forAllYour')}{" "}
            <span className="bg-gradient-to-r from-[#61DAFB] to-[#2563EB] text-transparent bg-clip-text">
              {t('hero.paymentNeeds')}
            </span>
          </h1>
        </main>

        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground text-left lg:text-start mb-8">
          {t('hero.description')}
        </p>

        <div className="flex flex-col md:flex-row justify-start lg:justify-start space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <Button
            className="w-full md:w-auto lg:w-1/5 text-lg md:text-xl lg:text-2xl px-8 md:px-12 lg:px-20 py-3 md:py-5 lg:py-7"
            onClick={() => setIsFormOpen(true)}
          >
            {t('hero.learnMore')}
          </Button>

          <Link to="/sign-in" className="w-full md:w-auto lg:w-1/5 mt-4 md:mt-0">
            <PulsatingButton
              className="w-full text-lg md:text-xl lg:text-2xl px-8 md:px-12 lg:px-20 py-2 md:py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700"
              pulseColor="#2563EB"
            >
              <span className="font-bold text-white">{t('hero.connect')}</span>
            </PulsatingButton>
          </Link>
        </div>

        <div className="hidden lg:flex items-center justify-start">
          <AvatarCircles
            avatarUrls={[
              africanledger,
              testimony2,
              testimony3
            ]}
            numPeople={12}
          />
          <span className="text-sm md:text-base text-muted-foreground ml-4">
            {t('hero.lovedByBusinesses')}
          </span>
        </div>
        <div className="h-12 md:hidden"></div> {/* Add space only for mobile devices */}
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>

      {/* Airtable form modal */}
      {
        isFormOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            onClick={() => setIsFormOpen(false)} // Close modal on background click
          >
            <div
              className="bg-white rounded-lg p-3 w-full max-w-3xl mx-2"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
            >
              <iframe
                className="airtable-embed"
                src="https://airtable.com/embed/appFQadFIGVMYNnHq/pagphA6Lt1pPzWMhX/form"
                frameBorder="0"
                width="100%"
                height="800"
                style={{ background: 'transparent', border: '1px solid #ccc' }}
              ></iframe>
            </div>
          </div>
        )
      }
    </section >
  );
};
