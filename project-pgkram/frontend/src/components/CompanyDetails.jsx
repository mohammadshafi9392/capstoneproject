import React from "react";
import searchicon from "../assets/searchicon.svg";
import Feedback from "./Feedback";

const CompanyDetails = () => {
  return (
    <div className="bg-gray-200">
      <div className="w-4/5 flex flex-col justify-center items-center m-auto">
        {/* search */}
        <div className="w-full px-12 rounded-lg bg-white flex m-4">
          <input
            className="w-full py-1 px-2"
            type="text"
            placeholder="Search"
          />
          <div className="bg-[#ED9017] rounded-lg w-[30px] h-[30px] flex justify-center items-center m-1">
            <img src={searchicon} alt="search" />
          </div>
        </div>

        {/* herosection */}
          {/* bannerimg */}
          <div className="p-2 rounded-lg w-full  bg-white flex justify-evenly m-auto items-center ">
            <div className="w-1/5 text-center">icon</div>
            <div className="w-2/5">
              <div className="flex">
                <div className="font-bold">Google</div>
                <div className="w-5 h-5 ml-3 bg-blue-500 rounded-full flex items-center justify-center">
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    </div>
              </div>
              <div>We connect top talents with top companies</div>
              <div className="text-gray-400 text-[14px] flex justify-around mx-auto">
                <div>
                  img <span>Tech</span>
                </div>
                <div>
                  img <span>Indonesia</span>
                </div>
                <div>
                  img <span>On-Site</span>
                </div>
                <div>
                  img <span>1-50 employees</span>
                </div>
              </div>
            </div>

            <div>
                <button className="rounded-lg bg-[#4329EA] text-white py-1 px-2">Set Alerts</button>
            </div>

            <div className="flex justify-evenly m-auto">
                <div className="border-gray-600 p-2">
                  img

                </div>
                <div className="border-gray-600 p-2">
                img
                </div>
                <div className="border-gray-600 p-2">
                    img
                </div>
            </div>
          </div>

          {/* navbar company */}
          <div className="w-full my-4 rounded-lg bg-white p-2">
          <div className="w-3/4 flex justify-start items-center text-black">
            <div className="bg-[#4329EA] py-1 px-2 text-white rounded-lg">About</div>
            <div className="ml-8">Culture</div>
            <div className="ml-8">Jobs</div>
            <div className="ml-8">Hiring Trends</div>
            <div className="ml-8">Feedback</div>
          </div>
          </div>

{/* about text */}
          <div className="rounded-lg w-full bg-white p-2">
            <div className="my-2 font-semibold">About</div>
            <div>A problem isn't truly solved until it's solved for all. Googlers build products that help create opportunities for everyone, whether down the street or across the globe. Bring your insight, imagination and a healthy disregard for the impossible. Bring everything that makes you unique. Together, we can build for everyone.Check out our career opportunities at goo.gle/3DLEokh</div>
          </div>

{/* culture */}
          <div className="bg-white w-full my-4 p-2 rounded-lg">
            <div className="font-bold">Culture :</div>
            <div className="flex justify-between items-center">
                <div className="flex justify-center items-center mx-auto">
                    <div>icon</div>
                    <div className="ml-8">
                        <div className="font-semibold">INNOVATIVE</div>
                        <div>We strive to constantly pursue innovation of our products and services</div>
                    </div>
                </div>

                <div className="h-[100px] rounded-lg mx-4 bg-gray-500 w-[5px] "></div>

                <div className="flex justify-center items-center mx-auto">
                    <div>icon</div>
                    <div className="ml-8">
                        <div className="font-semibold">NURTURING</div>
                        <div>Our working environment prioritizes encouragement for employee's growth and development</div>
                    </div>
                </div>

                <div className="h-[100px] rounded-lg mx-4 bg-gray-500 w-[5px] "></div>

                <div className="flex justify-center items-center mx-auto">
                    <div>icon</div>
                    <div className="ml-8">
                        <div className="font-semibold">ENERGETIC</div>
                        <div>Here, we work together to make the dream work</div>
                    </div>
                </div>
            </div>
          </div>

          {/* feedback */}
          <div className="bg-white w-full my-4 p-2 rounded-lg">
            <div className="font-bold">Feedback</div>
            <div><Feedback date='18 oct' comment='Internship experience' current='intern in gurgaon,haryana' first='recommends' second='good pay' third='recommends'/></div>

            <div><Feedback date='18 oct' comment='Internship experience' current='intern in gurgaon,haryana' first='recommends' second='good pay' third='recommends'/></div>
          </div>
        </div>
      </div>
  );
};

export default CompanyDetails;
