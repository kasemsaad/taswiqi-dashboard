// src/pages/Login.tsx
import { useEffect, useRef, useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FieldInputProps,
} from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import Api_Chat from "./../../services/baseUrlCustomer";
import { AxiosError } from "axios";
import { Role } from "../../redux/resourcesSlice";
import { useAppDispatch } from "../../redux/store";
import { ProgressBar } from "primereact/progressbar";
import { generateFCMToken } from "@/hooks/firebase";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) return "android";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
    if (/Windows/i.test(userAgent)) return "windows";
    if (/Mac/i.test(userAgent)) return "mac";
    return "unknown";
  };

  const initialValues = {
    email: "",
    password: "",
    deviceType: getDeviceType(),
    fcmToken: "", // سيتم تعبئته تلقائيًا
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    deviceType: Yup.string().required("Device type is required"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setErrors }: FormikHelpers<typeof initialValues>
  ) => {
    setIsLoading(true);

    try {
      const response = await Api_Chat?.post("login", {
        email: values.email,
        password: values.password,
        deviceType: values.deviceType,
        fcmToken: values.fcmToken,
      });

      const { role, image, name, id } = response.data.data.user;
      const { token } = response.data.data;

      if (response?.data?.status) {
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("image", image);
        localStorage.setItem("name", name);
        dispatch(Role(role));
        navigate("/");
        toast.current?.show({
          severity: "success",
          summary: "Login Successful",
          detail: "Redirecting to dashboard...",
          life: 3000,
        });
      }
    } catch (err) {
      const error = err as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;

      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.current?.show({
        severity: "error",
        summary: "Login Failed",
        detail: message,
        life: 4000,
      });

      if (error.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const key in error.response.data.errors) {
          if (error.response.data.errors[key]?.length) {
            fieldErrors[key] = error.response.data.errors[key][0];
          }
        }
        setErrors(fieldErrors);
      }
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div
      id="login"
      className="flex items-center justify-center min-h-screen bg-gray-50 font-primary"
      dir="rtl"
    >
      <Toast ref={toast} />
      <div className="md:bg-white md:shadow-xl rounded-2xl p-10 w-full max-w-lg">
        <h2 className="text-[35px] font-bold mb-6 text-gray-800">
          تسجيل الدخول
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => {
            useEffect(() => {
              const fetchToken = async () => {
                const token = await generateFCMToken();
                if (token) {
                  localStorage.setItem("fcmToken", token);
                  setFieldValue("fcmToken", token);
                }
              };
              fetchToken();
            }, [setFieldValue]);

            return (
              <Form
                className={`flex flex-col gap-7 ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-600 !text-start mb-1"
                  >
                    البريد الإلكتروني
                  </label>
                  <Field
                    as={InputText}
                    id="email"
                    name="email"
                    placeholder="البريد الإلكتروني"
                    className="w-full ps-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Email address"
                    disabled={isLoading}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1 !text-start"
                  />
                </div>

                <div className="text-end">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-600 !text-start mb-1"
                  >
                    كلمة المرور
                  </label>
                  <Field name="password">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <Password
                        id="password"
                        {...field}
                        toggleMask
                        feedback={false}
                        placeholder="كلمة المرور"
                        aria-label="Password"
                        disabled={isLoading}
                        className="w-full"
                        inputClassName="w-full  ps-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </Field>

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1 !text-start"
                  />
                </div>

                {/* Hidden fields */}
                <Field type="hidden" name="deviceType" />
                <Field type="hidden" name="fcmToken" />

                <Button
                  type="submit"
                  label={isLoading ? "" : "Sign in"}
                  disabled={isLoading || isSubmitting}
                  className="!bg-primary text-white !border-0 w-full h-[3rem] flex justify-center items-center text-2xl !p-0"
                >
                  {isLoading && (
                    <i className="pi pi-spin pi-spinner text-[2.5rem] mx-auto" />
                  )}
                </Button>

                {isLoading && (
                  <div className="w-full mt-2 ProgressBar_app">
                    <ProgressBar
                      mode="indeterminate"
                      style={{ height: "6px" }}
                    />
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
