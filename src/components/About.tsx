import { Statistics } from "./Statistics";
import pilot from "../assets/pilot.png";

export const About = () => {
  return (
    <section
      id="About"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                CDirect
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                              Navigating a college campus can be overwhelming, especially for new students and visitors. C Direct is your ultimate campus navigation solution, designed to make exploring your college simpler, faster, and smarter.
             
                              With C Direct, you can:
                              Navigate Indoor & Outdoor – Find your way across campus, from lecture halls to libraries, hostels, and cafeterias.

                              Scan Buildings for Instant Info – Get real-time building details, including departments, offices, and facilities, just by scanning.
                              Real-Time Navigation – Step-by-step guidance to your destination with accurate turn-by-turn directions.

                              Whether you're a student, faculty, or visitor, C Direct ensures you never feel lost on campus again! Experience a smarter way to explore with C Direct.

                              🚀 Your Campus, Just a Tap Away!
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
