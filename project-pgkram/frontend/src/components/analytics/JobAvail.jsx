import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import Navbar from "../Navbar";

const jobAvail = () => {
  const [button, setButton] = useState(true)
  const [user, setUser] = useState(null);
  const [options, setOptions] = useState({});
  const [minAge, setMinAge] = useState();
  const [maxAge, setMaxAge] = useState();
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  const [SFdata, setSFdata] = useState({});
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "education-chart",
      },
      xaxis: {
        categories: [], // Provide default empty array or the appropriate initial value
      },
      title: {
        // text: 'Education Distribution',
        align: "center",
      },
    },
    series: [
      {
        name: "Success",
        data: [], // Provide default empty array or the appropriate initial value
      },
    ],
  });

  // Event handler to update the selected industries state
  const handleIndustryChange = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedIndustries(selectedOptions);
  };
  // Event handler to update the selected location state
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };
  // Event handler to update the selected education state
  const handleEducationChange = (event) => {
    setSelectedEducation(event.target.value);
  };
  // Event handler to update the selected gender state
  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleMinAgeChange = (event) => {
    setMinAge(event.target.value);
  };

  // Event handler to update maximum age state
  const handleMaxAgeChange = (event) => {
    setMaxAge(event.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://pgrkam-backend.onrender.com/user-data"
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (user == null) {
    return <div>Loading....</div>;
  }
  // console.log(user)

  function objectToArray(user) {
    // Check if the input is not null or undefined
    if (user == null) {
      return [];
    }

    // Use Object.entries to get an array of key-value pairs
    return Object.entries(user);
  }
  const userdata = objectToArray(user);
  console.log(userdata);

  const handleFilterClick = () => {
    setButton(false);
    const result = getUsersCountByCriteria(
      userdata,
      minAge,
      maxAge,
      selectedLocation,
      selectedEducation,
      selectedGender,
      selectedIndustries
    );
    console.log("Filtered user count", result);
    setChartData({
      options: {
        chart: {
          id: "education-chart",
        },
        xaxis: {
          categories: ["7 SEP", "14 SEP", "21 SEP", " 28 SEP", "05 OCT", "12 OCT", "July", "August", "Sept", "Oct", "Nov", "Dec"]





          , // Provide default empty array or the appropriate initial value
        },
        title: {
          // text: 'Education Distribution',
          align: "center",
        },
      },
      series: [
        {
          name: "Success",
          data: result, // Provide default empty array or the appropriate initial value
        },
      ],
    })
  };

  function getUsersCountByCriteria(
    usersData,
    minAge,
    maxAge,
    location,
    education,
    gender,
    industries
  ) {
    console.log("fn called");
    const result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const assignRandomValues = (result, min, max) => {
      for (let i = 0; i < result.length; i++) {
        result[i] = Math.floor(Math.random() * (700 - 100 + 1)) + min;
      }
    };
    assignRandomValues(result, 100, 1000);

    console.log(result);
    setSFdata(result);


    for (const monthData of usersData) {
      let count = 0;

      // Log information to understand the structure of monthData
      console.log("monthData:", monthData);

      // Assuming monthData is an array of users
      for (const user of monthData) {
        // Log user details to understand the structure of each user
        console.log("user:", user);
        console.log(user.age);
        const ageInRange =
          (minAge === "" || user.age >= parseInt(minAge, 10)) &&
          (maxAge === "" || user.age <= parseInt(maxAge, 10));
        const locationMatch =
          location === undefined ||
          (user.location &&
            user.location.toLowerCase() === location.toLowerCase());
        const educationMatch =
          education === undefined ||
          (user.education &&
            user.education.toLowerCase() === education.toLowerCase());
        const genderMatch =
          gender === undefined ||
          (user.gender && user.gender.toLowerCase() === gender.toLowerCase());
        const industryMatch =
          industries === undefined ||
          industries.length === 0 ||
          (user.industry && industries.includes(user.industry.toLowerCase()));
        console.log(
          ageInRange,
          locationMatch,
          educationMatch,
          genderMatch,
          industryMatch
        );
        if (
          ageInRange &&
          locationMatch &&
          educationMatch &&
          genderMatch &&
          industryMatch
        ) {
          count++;
        }
      }

      result[monthData.id] = count;
    }

    console.log("Final result:", result);

    return result;
  }

  //   cosnt newResult=result

  return (

    <div>
      <Navbar />
      <div className="flex flex-col p-10">

        <div className="my-4 border shadow p-4 rounded-md">
          <label className="mr-2 mt-2">Min Age:</label>
          <input type="number" className="border" value={minAge} onChange={handleMinAgeChange} />
          <label className="ml-2 mt-2">Max Age:</label>
          <input type="number" className="border ml-2 mt-2" value={maxAge} onChange={handleMaxAgeChange} />
          <p className="mt-2">Min Age: <span className="mt-2 bg-green-400 rounded-md p-[0.5px]"> {minAge}</span></p>
          <p className="mt-2">Max Age: <span className="bg-green-400 rounded-md p-[0.5px]"> {maxAge}</span></p>
        </div>

        <div className="my-4 border shadow p-4 rounded-md">
          <label className="mr-2">Gender</label>
          <select value={selectedGender} className="border" onChange={handleGenderChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="transgender">Transgender</option>
          </select>
          <p>Selected Gender: <span className="bg-green-400 rounded-md p-[2px]"> {selectedGender}</span></p>
        </div>

        <div className="my-4 border shadow p-4 rounded-md">
          <label className="mr-2">Education:</label>
          <select value={selectedEducation} className="border" onChange={handleEducationChange}>
            <option value="">Select Education</option>
            <option value="10th pass">10th Pass</option>
            <option value="12th pass">12th Pass</option>
            <option value="graduate">Graduate</option>
            <option value="post graduate">Postgraduate</option>
          </select>
          <p>Selected Education: {selectedEducation}</p>
        </div>

        <div className="my-4 border shadow p-4 rounded-md">
          <div className="flex">
            <div>

              <label className="mr-2">Industry:</label>
            </div>
            <div>

              <select
              className="border"
                value={selectedIndustries}
                onChange={handleIndustryChange}
                multiple
              >
                <option value="computerscience">Computer Science</option>
                <option value="it">IT</option>
                <option value="bussiness">business</option>
                <option value="electrical">Electrical</option>
                <option value="mechanical">mechanical</option>
                <option value="information security">Information Security</option>
              </select>
            </div>
          </div>
          <p className="mt-3">Selected Industries: {selectedIndustries.join(", ")}</p>
        </div>

        <div className="my-4 border shadow p-4 rounded-md">
          <label className="mr-2">Location:</label>
          <select value={selectedLocation} onChange={handleLocationChange}>
            <option value="">Select Location</option>
            <option value="delhi">Delhi</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="chennai">Chennai</option>
            <option value="meerut">Meerut</option>
            <option value="agra">Agra</option>
          </select>

          <p>Selected Location: {selectedLocation}</p>
        </div>

        <div>
          <button onClick={handleFilterClick} type="submit" className={` ${button? '':'disabled'} rounded-sm bg-[#ED9017] w-44 px-3 py-1 my-6 text-white font-semibold text-xs`}>Apply Filter</button>

        </div>

        <div className=" flex items-center justify-center border shadow p-4 rounded-md">
          <div className=" border shadow p-4 rounded-md">
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              width={700}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default jobAvail;
