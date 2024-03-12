import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Button } from "@mui/material";
import dayjs from "dayjs"; // Import Day.js

function App() {
  const profession = [
    "Developer",
    "Designer",
    "Engineer",
    "Doctor",
    "Teacher",
    "Artist",
    "Other",
  ];

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(5, "Must be mininum 5 characters")
      .max(20, "Character exceed! Please Enter within 20 characters")
      .required("Full Name is required"),
    // username: Yup.string()
    //   // .test("username", "Username already exists", async (value) => {
    //   //   return await isUsernameAvailable(value);
    //   // })
    //   .required("Username is required"), // the isUsernameAvailable function is an asynchronous function that checks if the username is available. The custom validation function awaits the asynchronous call and returns true or false based on the result.

    email: Yup.string().required("Email is required").email("Invalid Email"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be 8 or more characters")
      .max(20, "Password must not exceed 20 characters")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])\w+/,
        "Password ahould contain at least one uppercase and lowercase character"
      )
      .matches(/\d/, "Password should contain at least one number")
      .matches(
        /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
        "Password should contain at least one special"
      ),

    confirmPassword: Yup.string()
      .required("Re-enter password")
      .oneOf([Yup.ref("password"), null], "Password does not match"),

    profession: Yup.string().oneOf(
      profession,
      "The profession you chose does not exist"
    ),
    acceptTerms: Yup.bool().oneOf(
      [true],
      "Please Accept Terms and conditions."
    ),
    age: Yup.number().test("age", "Invalid age", (value) => {
      return value >= 18 && value <= 65;
    }),

    dateRange: Yup.object().shape({
      dob: Yup.date().nullable(),
    }),

    photo: Yup.mixed()
      .required("Please upload a photo")
      .test(
        "fileSize",
        "File too large! Below 300Kb",
        (value) => value && value.size <= 300000
      ),

    allDocs: Yup.mixed()
      .notRequired()
      .test(
        "fileSize",
        "File too large! Below 500Kb",
        (value) => !value || (value && value.size <= 500000)
      ),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: "",
      profession: profession[0],
      dob: new Date(),
      acceptTerms: false,
      photo: null,
      allDocs: null,
    },
    validationSchema,

    onSubmit: (data) => {
      console.log(JSON.stringify(data, null, 2));
      console.warn("Form values:", formik.values);
      alert("Form is validated! Submitting the form");
    },
  });

  useEffect(() => {
    if (formik.values.dob) {
      const today = new Date();
      const birthDate = new Date(formik.values.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      formik.setFieldValue("age", age);
    }
  }, [formik.values.dob]);

  const handleClearPhoto = () => {
    formik.setFieldValue("photo", null);
  };

  const handleClearAllDocs = () => {
    formik.setFieldValue("allDocs", null);
  };

  return (
    <div className="bg-blue-300 min-w-screen min-h-screen overflow-x-hidden">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-lg mx-auto bg-white rounded shadow-lg mt-7 p-3"
      >
        <h1 className="text-3xl mb-3 text-center">Register</h1>
        <div className="mb-4">
          <label>Full Name</label>
          <input
            name="fullName"
            type="text"
            className={
              "block w-full rounded border py-1 px-2 mb-2" +
              (formik.errors.fullName && formik.touched.fullName
                ? "border-red-700"
                : "border-gray-300")
            }
            onChange={formik.handleChange}
            value={formik.values.fullName}
            // onBlur={formik.handleBlur}
          />

          <div className="invalid-feedback">
            {/* {formik.errors.fullName && formik.touched.fullName
              ? // ( <span className='text-red-700'>{formik.errors.email}</span>)
                formik.errors.fullName
              : null} */}
            {formik.touched.fullName && formik.errors.fullName && (
              <span className="text-red-700">{formik.errors.fullName}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label for="email">Email</label>
          <input
            name="email"
            type="email"
            className={
              "block w-full rounded border py-1 px-2 mb-2" +
              (formik.errors.email && formik.touched.email
                ? "border-red-700"
                : "border-gray-300")
            }
            onChange={formik.handleChange}
            value={formik.values.email}
            // onBlur={formik.handleBlur}
          />
          <div>
            {/* {formik.errors.email && formik.touched.email
              ? // ( <span className='text-red-700'>{formik.errors.email}</span>)
                formik.errors.email
              : null} */}
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-700">{formik.errors.email}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label for="profession">Profession</label>
          <select
            name="profession" // Change this to "professions"
            className={`block w-full rounded border py-1 px-2 mb-2 ${
              formik.touched.profession && formik.errors.profession
                ? "border-red-700"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.profession} // Change this to "profession"
          >
            {profession.map((profession, index) => (
              <option value={profession} key={index}>
                {profession}
              </option>
            ))}
          </select>

          {/* {formik.touched.profession && formik.errors.profession && (
            <span className="text-red-700">{formik.errors.profession}</span>
          )} */}
          {formik.touched.profession && formik.errors.profession && (
            <span className="text-red-700">{formik.errors.profession}</span>
          )}
        </div>

        <div className="mb-4">
          <label for="age">Age</label>
          <input
            name="age"
            type="number"
            className="block w-full rounded border py-1 px-2 mb-2 border-gray-300"
            // {
            //   "block w-full rounded border py-1 px-2 mb-2" +
            //   (formik.errors.age && formik.touched.age
            //     ? "border-red-700"
            //     : "border-gray-300")
            // }
            // onChange={formik.handleChange}
            value={formik.values.age}
            // onBlur={formik.handleBlur}
            readOnly // Make the age field read-only to prevent manual input
          />
          <div>
            {/* {formik.errors.age && formik.touched.age
              ? // ( <span className='text-red-700'>{formik.errors.email}</span>)
                formik.errors.age
            : null} */}
            {formik.touched.age && formik.errors.age && (
              <span className="text-red-700">{formik.errors.age}</span>
            )}
          </div>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="mb-4">
            <DatePicker
              label="Date of Birth"
              value={dayjs(formik.values.dob)} // Convert to Day.js object
              onChange={(date) => formik.setFieldValue("dob", date?.toDate())} // Convert back to JavaScript Date object
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={formik.touched.dob && Boolean(formik.errors.dob)}
                  helperText={formik.touched.dob && formik.errors.dob}
                />
              )}
            />
          </div>
        </LocalizationProvider>

        <div className="mb-4">
          <label className="block mb-2">Upload Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={(e) =>
              formik.setFieldValue("photo", e.currentTarget.files[0])
            }
          />

          {/* {formik.values.photo && (
          <button
            type="button"
            onClick={handleClearFile}
          >
            Clear
          </button>
          )} */}
          {formik.values.photo && (
            <Button variant="contained" onClick={handleClearPhoto}>
              Clear
            </Button>
          )}
          <div>
            {formik.touched.photo && formik.errors.photo && (
              <span className="text-red-700">{formik.errors.photo}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Additional Documents</label>
          <input
            type="file"
            name="allDocs"
            accept="image/*,.doc, .docx, .pdf, .txt, application/pdf, text/plain"
            onChange={(e) =>
              formik.setFieldValue("allDocs", e.currentTarget.files[0])
            }
          />
          {/* {formik.values.allDocs && (
          <button
            type="button"
            onClick={handleClearFile}
          >
            Clear
          </button>
          )} */}
          {formik.values.allDocs && (
            <Button variant="contained" onClick={handleClearAllDocs}>
              Clear
            </Button>
          )}

          <div>
            {formik.touched.allDocs && formik.errors.allDocs && (
              <span className="text-red-700">{formik.errors.allDocs}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label>Password</label>
          <input
            name="password"
            type="password"
            className={
              "block w-full rounded border py-1 px-2 mb-2 mb-2" +
              (formik.errors.password && formik.touched.password
                ? "border-red-700"
                : "border-gray-300")
            }
            onChange={formik.handleChange}
            value={formik.values.password}
            // onBlur={formik.handleBlur}
          />
          <div>
            {/* {formik.errors.password && formik.touched.password
              ? // ( <span className='text-red-700'>{formik.errors.email}</span>)
                formik.errors.password
              : null} */}
            {formik.touched.password && formik.errors.password && (
              <span className="text-red-700">{formik.errors.password}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            className={
              "block w-full rounded border py-1 px-2 mb-2" +
              (formik.errors.confirmPassword && formik.touched.confirmPassword
                ? "border-red-700"
                : "border-gray-300")
            }
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            // onBlur={formik.handleBlur}
          />
          <div>
            {/* {formik.errors.confirmPassword && formik.touched.confirmPassword
              ? // ( <span className='text-red-700'>{formik.errors.email}</span>)
                formik.errors.confirmPassword
              : null} */}
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <span className="text-red-700">
                  {formik.errors.confirmPassword}
                </span>
              )}
          </div>
        </div>

        <div className="mb-4">
          <input
            name="acceptTerms"
            type="checkbox"
            className={
              "form-checkbox h-3 w-3 text-blue-600 border-gray-300 rounded" +
              (formik.errors.acceptTerms && formik.touched.acceptTerms
                ? "border-red-700"
                : "")
            }
            onChange={formik.handleChange}
            value={formik.values.acceptTerms}
            // onBlur={formik.handleBlur}
          />

          <label htmlFor="acceptTerms" className="ml-2 font-bold text-gray-700">
            I have read and agree to the Terms
          </label>

          <div>
            {/* {formik.errors.acceptTerms && formik.touched.acceptTerms
              ? // ( <span className='text-red-700'>{formik.errors.email}</span>)
                formik.errors.acceptTerms
              : null} */}
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <span className="block text-red-700 mt-2">
                {formik.errors.acceptTerms}
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <button
            className="my-4 bg-blue-500 rounded p-3 text-white"
            type="submit"
            // disabled={submitting}  //with disable functionality
          >
            Submit
          </button>

          <button
            className="mx-4 bg-blue-500 rounded p-3 text-white"
            type="reset"
            onClick={formik.handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
