"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRightIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

const AboutUs: React.FC = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      id="about-us"
      className="w-full min-h-screen px-4 sm:px-6 lg:px-8 
             bg-[var(--background)] text-[var(--foreground)] 
             flex items-center justify-center py-20"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:order-last flex justify-center"
        >
          <Player
            autoplay
            loop
            src="https://assets4.lottiefiles.com/packages/lf20_0yfsb3a1.json"
            className="w-full max-w-sm h-auto sm:max-w-md lg:max-w-none lg:w-[500px] lg:h-[500px]"
          />
        </motion.div>

        <motion.div
          className="space-y-6 text-center lg:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight 
                   bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text"
          >
            ABOUT US
          </motion.h2>

          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-xl sm:text-2xl font-semibold text-gray-500"
          >
            MRSAC stands for Maharashtra Remote Sensing Applications Centre.
          </motion.h3>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg leading-relaxed text-gray-500"
          >
            It was established in January 1988 under{" "}
            <em className="font-semibold text-blue-600 not-italic">
              the Societies Registration Act, 1860
            </em>
            , functioning as an autonomous body under the administration of the
            Planning Department of the Government of Maharashtra. It serves as
            the nodal agency charged with designing the state's geo-spatial
            digital database system (MGDDS).
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="pt-6 flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Read more about this feature"
              onClick={() => setIsOpen(true)}
              className="px-5 py-2.5 text-sm font-medium rounded-lg 
                     border border-gray-300/30 text-gray-500 
                     hover:bg-gray-100/10 hover:border-gray-200/40
                     dark:border-gray-600/30 dark:hover:bg-gray-800/40 
                     transition-colors duration-300"
            >
              Read More
            </motion.button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto 
                         bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl no-scrollbar"
                  >
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">
                      What is MRSAC?
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      MRSAC stands for the Maharashtra Remote Sensing
                      Application Centre (also seen as “Applications Centre” or
                      “Application Center”). It was established in January 1988
                      under the Societies Registration Act, 1860, functioning as
                      an autonomous body under the administrative control of the
                      Planning Department of the Government of Maharashtra.
                      According to Wikipedia, it also serves as the nodal agency
                      charged with designing the state’s geo-spatial digital
                      database system (MGDDS).
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-blue-500">
                      Mission, Vision & Core Mandate
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      MRSAC’s mission is to harness the immense potential of
                      Remote Sensing & GIS for the development and utilization
                      of Maharashtra’s natural resources. As a geospatial
                      technology hub, MRSAC guides users and departments by
                      deploying remote sensing datasets, GIS, and decision
                      support systems to assist in planning and management.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-blue-500">
                      Major Projects & Contributions
                    </h3>
                    <h4 className="font-semibold text-blue-400 mt-4">
                      MahaBHUMI Geo-Portal
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      An integrated geospatial database and web-portal built by
                      MRSAC aimed at creating high-resolution digital base maps
                      (1:4K scale) with detailed layers including urban areas,
                      transport, water resources, land use, and more.
                    </p>
                    <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
                      <li>
                        Uses 50 cm resolution satellite data for ortho-rectified
                        imagery and mapping.
                      </li>
                      <li>
                        Establishes geodatabase standards and schemas with
                        feature-specific “bags”.
                      </li>
                      <li>
                        Supports seamless integration across grids for
                        department-level planning.
                      </li>
                    </ul>

                    <h4 className="font-semibold text-blue-400 mt-4">
                      GIS-based Decision Support Systems
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                      <li>
                        NHP-DSS: Hydrological systems for the National Hydrology
                        Project.
                      </li>
                      <li>
                        MGNREGA GIS Portal: Stores and disseminates spatial
                        NREGA data.
                      </li>
                      <li>
                        Groundwater DSS: Tracks borewells and rigs through
                        GIS-driven systems.
                      </li>
                    </ul>

                    <h4 className="font-semibold text-blue-400 mt-4">
                      Recent Geo-Tagging & e-Panchanama Initiatives
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                      <li>
                        <strong>School Geo-Tagging Project (2025):</strong>{" "}
                        Mapping every school’s location statewide for improved
                        planning via UDISE Plus.
                      </li>
                      <li>
                        <strong>e-Panchanama for Disaster Compensation:</strong>{" "}
                        GPS-enabled system replacing manual assessments for
                        disaster-hit farmers, integrated with land records and
                        Sevarth ID. Logged over 87,000 e-Panchanamas benefiting
                        83,000+ farmers, with a full rollout by end of 2025.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-blue-500">
                      Structure & Field Presence
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Headquartered at VNIT Campus, South Ambazari Road,
                      Nagpur—operational since August 1994 (initial start in
                      1988). Branch offices in Mumbai and Pune serve Mantralaya
                      departments and enable cross-departmental coordination.
                      Governed by a high-level body chaired by the Chief
                      Secretary of Maharashtra, with the Director of MRSAC
                      serving as Member Secretary.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-blue-500">
                      Summary Table
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <tbody>
                          <tr className="border-b">
                            <td className="font-semibold p-2">Full Name</td>
                            <td className="p-2">
                              Maharashtra Remote Sensing Application Centre
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold p-2">Established</td>
                            <td className="p-2">
                              January 1988, autonomous under Planning Dept.
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold p-2">Headquarters</td>
                            <td className="p-2">VNIT Campus, Nagpur</td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold p-2">Core Function</td>
                            <td className="p-2">
                              Remote sensing & GIS for planning, resource
                              management
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="font-semibold p-2">
                              Key Initiatives
                            </td>
                            <td className="p-2">
                              MahaBHUMI, NHP-DSS, School geo-tagging,
                              e-Panchanama
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold p-2">Reach</td>
                            <td className="p-2">
                              Statewide, branches in Mumbai and Pune
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Close
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Get started now"
              onClick={() => router.push("/auth")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                     bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20 
                     hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 
                     dark:focus:ring-blue-800 transition-all duration-300"
            >
              Get Started
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
