import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { motion } from "framer-motion";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

export const Hero = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const buttonMotionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    return (
        <section className="container grid lg:grid-cols-2 place-items-center py-12 md:py-24 gap-10">
            <motion.div
                className="text-center lg:text-start space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.main className="text-5xl md:text-6xl font-bold" variants={textVariants}>
                    <h1 className="inline">
                        <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
                            CDirect
                        </span>{" "}
                    </h1>{" "}
                    for{" "}
                    <h2 className="inline">
                        <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                            CEG
                        </span>{" "}
                        Explorers
                    </h2>
                </motion.main>

                <motion.p
                    className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0"
                    variants={textVariants}
                >
                    Get to Know Everything about CEG.
                </motion.p>

                <motion.div
                    className="space-y-4 md:space-y-0 md:space-x-4"
                    variants={buttonMotionVariants}
                >
                    <Link to="/login">
                        <Button className="w-full md:w-1/3">Get Started</Button>
                    </Link>
                    <a
                        rel="noreferrer noopener"
                        href="https://github.com/Ganesh-73005"
                        target="_blank"
                        className={`w-full md:w-1/3 ${buttonVariants({
                            variant: "outline",
                        })}`}
                    >
                        Github Repository
                        <GitHubLogoIcon className="ml-2 w-5 h-5" />
                    </a>
                </motion.div>
            </motion.div>

            <motion.div
                className="z-10"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            >
                <motion.img
                    src="src/assets/cdir-logo.png"
                    alt="Logo"
                    className="w-100 max-h-74 object-contain mb-6"
                />
            </motion.div>
            <div className="shadow"></div>
        </section>
    );
};

export default Hero;
