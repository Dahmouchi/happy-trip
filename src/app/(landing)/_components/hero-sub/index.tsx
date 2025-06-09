import React, { FC } from "react";
import Breadcrumb from "@/components/breadcrumb";
import { BreadcrumbLink } from "@/types/data/breadcrumb";

interface HeroSubProps {
    title: string;
    description: string;
    breadcrumbLinks: BreadcrumbLink[];
}

const HeroSub: FC<HeroSubProps> = ({ title, description, breadcrumbLinks }) => {

    return (
        <>
            <section className=" text-center bg-center  relative bg-gradient-to-b from-white from-10% dark:from-darkmode bg-cover  to-[#83CD20] to-90% dark:to-darklight overflow-x-hidden" style={{backgroundImage:"url(/images/subHero.jpg)"}}>
                  <div className="w-full h-full text-white bg-black/20 bg-opacity-50 pt-16 pb-16  shadow-lg backdrop-blur-xs max-sm:px-8">
                <h2 className="text-midnight_text lg:text-[50px] text-[30px] leading-[1.2] relative font-bold text-white dark:text-white capitalize">{title}</h2>
                <p className="lg:text-lg text-sm text-gray-50 font-normal max-w-2xl w-full mx-auto mt-7 lg:mb-12 mb-6 sm:px-0 px-4">
                    {description}
                </p>
                <Breadcrumb links={breadcrumbLinks}  />
                </div>
            </section>
        </>
    );
};

export default HeroSub;