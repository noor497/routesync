// src/Components/Login.js
import React from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { BiLogoFacebook } from "react-icons/bi";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import Link from 'next/link';
import { useSession } from 'next-auth/react'
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"

const Login = () => {

    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        email: "",
        password: "",
    });

     const onSubmit = async () => {
        try {
            if (!values.email || !values.password) {
                // toast.error("All fields are required!");
                toast({
                  title: "Error",
                  description: "All fields are required!",
                  variant: "destructive"
                });
                return;
            }
    
          setLoading(true)
          //Error handling using API
          const response = await fetch("/api/Login", {
            method: "POST",
            body: JSON.stringify({ values }),
            headers : {
              "Content-type": "application/json"
            }
            ,
          });
          if (!response.ok) {
            // Handle non-2xx status codes
            setLoading(false)
            const data = await response.json();
            const { message } = data; // Destructure message
            // toast.error(message);
            toast({
              title: "Error",
              description: message,
              variant: "destructive"
            });
            return;

          }
          //Logging in using netx auth
          const result = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          });
          if (result && !result.error) {
            setLoading(false)
            // toast.success("Login successful!");
            toast({
              title: "Success",
              description: "Login successful!",
              variant: "default"
            });
            window.location.href = "/";
            return;

          } else {
            setLoading(false)
            console.log("Error in Authorizartion", result?.error);
            // toast.error("Could not login!");
            toast({
              title: "Error",
              description: "Could not login!",
              variant: "destructive"
            });
            return;

    
          }
        } catch (error) {
            setLoading(false)
          console.log("ERROR IN LOGGING : ",error);
          // toast.error("Could not login!");
          // toast.error(error);
          toast({
            title: "Error",
            description: "Could not login!",
            variant: "destructive"
          });
          return;

        }
    
      };
  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:m-0">
      <div className="md:w-1/3 max-w-sm">
        {/* <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
        /> */}
         <svg
      width="92"
      height="18"
      viewBox="0 0 92 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // {...props}
    >
      <g clipPath="url(#clip0_1949_239)" height={500}>
        <path
        height={100}
        width={100}
          d="M15.7275 4.64981L9.54 1.26426C9.37468 1.17292 9.18888 1.125 9 1.125C8.81112 1.125 8.62532 1.17292 8.46 1.26426L2.2725 4.65122C2.0958 4.7479 1.94829 4.89025 1.84539 5.06341C1.74248 5.23656 1.68796 5.43417 1.6875 5.63559V12.3603C1.68796 12.5617 1.74248 12.7593 1.84539 12.9325C1.94829 13.1056 2.0958 13.248 2.2725 13.3447L8.46 16.7316C8.62532 16.823 8.81112 16.8709 9 16.8709C9.18888 16.8709 9.37468 16.823 9.54 16.7316L15.7275 13.3447C15.9042 13.248 16.0517 13.1056 16.1546 12.9325C16.2575 12.7593 16.312 12.5617 16.3125 12.3603V5.6363C16.3124 5.43451 16.2581 5.23647 16.1551 5.06291C16.0522 4.88935 15.9045 4.74667 15.7275 4.64981ZM9 11.8111C8.44374 11.8111 7.89997 11.6462 7.43746 11.3371C6.97495 11.0281 6.61446 10.5889 6.40159 10.0749C6.18872 9.56102 6.13302 8.99552 6.24154 8.44995C6.35006 7.90438 6.61793 7.40324 7.01126 7.0099C7.4046 6.61657 7.90574 6.3487 8.45131 6.24018C8.99688 6.13166 9.56238 6.18736 10.0763 6.40023C10.5902 6.6131 11.0295 6.97359 11.3385 7.4361C11.6475 7.89861 11.8125 8.44238 11.8125 8.99864C11.8125 9.74456 11.5162 10.4599 10.9887 10.9874C10.4613 11.5148 9.74592 11.8111 9 11.8111Z"
          fill="currentColor"
        />
        {/* <path
          d="M34.6882 7.49219H31.8885C31.8374 7.12997 31.733 6.80824 31.5753 6.52699C31.4176 6.24148 31.2152 5.99858 30.968 5.7983C30.7209 5.59801 30.4354 5.4446 30.1115 5.33807C29.7919 5.23153 29.4446 5.17827 29.0696 5.17827C28.392 5.17827 27.8018 5.34659 27.299 5.68324C26.7962 6.01562 26.4063 6.50142 26.1293 7.14062C25.8523 7.77557 25.7138 8.54687 25.7138 9.45455C25.7138 10.3878 25.8523 11.1719 26.1293 11.8068C26.4105 12.4418 26.8026 12.9212 27.3054 13.245C27.8082 13.5689 28.3899 13.7308 29.0504 13.7308C29.4212 13.7308 29.7642 13.6818 30.0795 13.5838C30.3991 13.4858 30.6825 13.343 30.9297 13.1555C31.1768 12.9638 31.3814 12.7315 31.5433 12.4588C31.7095 12.1861 31.8246 11.875 31.8885 11.5256L34.6882 11.5384C34.6158 12.1392 34.4347 12.7188 34.1449 13.277C33.8594 13.831 33.4737 14.3274 32.9879 14.7663C32.5064 15.201 31.9311 15.5462 31.2621 15.8018C30.5973 16.0533 29.8452 16.179 29.0057 16.179C27.8381 16.179 26.794 15.9148 25.8736 15.3864C24.9574 14.858 24.233 14.093 23.7003 13.0916C23.1719 12.0902 22.9077 10.8778 22.9077 9.45455C22.9077 8.02699 23.1761 6.8125 23.7131 5.81108C24.25 4.80966 24.9787 4.04687 25.8991 3.52273C26.8196 2.99432 27.8551 2.73011 29.0057 2.73011C29.7642 2.73011 30.4673 2.83665 31.1151 3.04972C31.767 3.26278 32.3445 3.57386 32.8473 3.98295C33.3501 4.38778 33.7592 4.88423 34.0746 5.4723C34.3942 6.06037 34.5987 6.73366 34.6882 7.49219ZM39.6015 16.1854C38.9751 16.1854 38.4169 16.0767 37.9268 15.8594C37.4367 15.6378 37.049 15.3118 36.7635 14.8814C36.4822 14.4467 36.3416 13.9055 36.3416 13.2578C36.3416 12.7124 36.4417 12.2543 36.642 11.8835C36.8423 11.5128 37.115 11.2145 37.4602 10.9886C37.8054 10.7628 38.1974 10.5923 38.6363 10.4773C39.0795 10.3622 39.544 10.2812 40.0298 10.2344C40.6008 10.1747 41.061 10.1193 41.4105 10.0682C41.7599 10.0128 42.0135 9.93182 42.1711 9.82528C42.3288 9.71875 42.4076 9.56108 42.4076 9.35227V9.31392C42.4076 8.90909 42.2798 8.59588 42.0241 8.37429C41.7727 8.1527 41.4147 8.0419 40.9502 8.0419C40.4602 8.0419 40.0703 8.15057 39.7805 8.3679C39.4907 8.58097 39.299 8.84943 39.2052 9.1733L36.6867 8.96875C36.8146 8.37216 37.066 7.85653 37.441 7.42188C37.816 6.98295 38.2997 6.64631 38.892 6.41193C39.4886 6.1733 40.1789 6.05398 40.963 6.05398C41.5085 6.05398 42.0305 6.1179 42.5291 6.24574C43.0319 6.37358 43.4772 6.57173 43.865 6.8402C44.2571 7.10866 44.566 7.45384 44.7919 7.87571C45.0177 8.29332 45.1306 8.79403 45.1306 9.37784V16H42.5483V14.6385H42.4715C42.3139 14.9453 42.1029 15.2159 41.8387 15.4503C41.5745 15.6804 41.2571 15.8615 40.8863 15.9936C40.5156 16.1214 40.0873 16.1854 39.6015 16.1854ZM40.3813 14.3061C40.7819 14.3061 41.1356 14.2273 41.4424 14.0696C41.7492 13.9077 41.99 13.6903 42.1647 13.4176C42.3394 13.1449 42.4268 12.8359 42.4268 12.4908V11.4489C42.3416 11.5043 42.2244 11.5554 42.0752 11.6023C41.9304 11.6449 41.7663 11.6854 41.5831 11.7237C41.3998 11.7578 41.2166 11.7898 41.0333 11.8196C40.8501 11.8452 40.6839 11.8686 40.5348 11.8899C40.2152 11.9368 39.936 12.0114 39.6974 12.1136C39.4588 12.2159 39.2734 12.3544 39.1413 12.5291C39.0092 12.6996 38.9431 12.9126 38.9431 13.1683C38.9431 13.5391 39.0774 13.8224 39.3458 14.0185C39.6186 14.2102 39.9637 14.3061 40.3813 14.3061ZM47.4232 16V6.18182H50.0631V7.89489H50.1654C50.3444 7.28551 50.6448 6.82528 51.0667 6.5142C51.4886 6.19886 51.9743 6.04119 52.5241 6.04119C52.6604 6.04119 52.8074 6.04972 52.9651 6.06676C53.1228 6.08381 53.2613 6.10724 53.3806 6.13707V8.55327C53.2528 8.51491 53.0759 8.48082 52.8501 8.45099C52.6242 8.42116 52.4175 8.40625 52.23 8.40625C51.8295 8.40625 51.4715 8.49361 51.1562 8.66832C50.8451 8.83878 50.5979 9.07741 50.4147 9.38423C50.2357 9.69105 50.1462 10.0447 50.1462 10.4453V16H47.4232ZM57.6915 10.3239V16H54.9684V2.90909H57.6148V7.91406H57.7298C57.9514 7.33452 58.3094 6.88068 58.8037 6.55256C59.298 6.22017 59.918 6.05398 60.6638 6.05398C61.3456 6.05398 61.94 6.20312 62.4471 6.50142C62.9585 6.79545 63.3548 7.21946 63.6361 7.77344C63.9216 8.32315 64.0622 8.98153 64.0579 9.74858V16H61.3349V10.2344C61.3392 9.62926 61.1858 9.15838 60.8747 8.82173C60.5679 8.48509 60.1375 8.31676 59.5835 8.31676C59.2128 8.31676 58.8846 8.3956 58.5991 8.55327C58.3179 8.71094 58.0963 8.94105 57.9344 9.24361C57.7767 9.5419 57.6957 9.90199 57.6915 10.3239ZM66.3809 16V6.18182H69.1039V16H66.3809ZM67.7488 4.91619C67.3439 4.91619 66.9966 4.78196 66.7069 4.51349C66.4214 4.24077 66.2786 3.91477 66.2786 3.53551C66.2786 3.16051 66.4214 2.83878 66.7069 2.57031C66.9966 2.29758 67.3439 2.16122 67.7488 2.16122C68.1536 2.16122 68.4988 2.29758 68.7843 2.57031C69.074 2.83878 69.2189 3.16051 69.2189 3.53551C69.2189 3.91477 69.074 4.24077 68.7843 4.51349C68.4988 4.78196 68.1536 4.91619 67.7488 4.91619ZM80.6186 6.18182L77.186 16H74.1179L70.6853 6.18182H73.5618L75.6008 13.2067H75.7031L77.7358 6.18182H80.6186ZM86.3501 16.1918C85.3401 16.1918 84.4708 15.9872 83.7421 15.5781C83.0177 15.1648 82.4594 14.581 82.0674 13.8267C81.6753 13.0682 81.4793 12.1712 81.4793 11.1357C81.4793 10.1257 81.6753 9.23935 82.0674 8.47656C82.4594 7.71378 83.0113 7.11932 83.7229 6.69318C84.4388 6.26705 85.2783 6.05398 86.2414 6.05398C86.8891 6.05398 87.4921 6.15838 88.0503 6.36719C88.6128 6.57173 89.1029 6.88068 89.5205 7.29403C89.9424 7.70739 90.2705 8.22727 90.5049 8.85369C90.7393 9.47585 90.8565 10.2045 90.8565 11.0398V11.7876H82.566V10.1001H88.2932C88.2932 9.7081 88.208 9.3608 88.0376 9.05824C87.8671 8.75568 87.6306 8.51918 87.328 8.34872C87.0298 8.17401 86.6825 8.08665 86.2861 8.08665C85.8728 8.08665 85.5063 8.18253 85.1867 8.37429C84.8714 8.56179 84.6242 8.81534 84.4452 9.13494C84.2663 9.45028 84.1746 9.80185 84.1704 10.1896V11.794C84.1704 12.2798 84.2599 12.6996 84.4388 13.0533C84.6221 13.407 84.8799 13.6797 85.2123 13.8714C85.5447 14.0632 85.9388 14.1591 86.3948 14.1591C86.6974 14.1591 86.9744 14.1165 87.2258 14.0312C87.4772 13.946 87.6924 13.8182 87.8714 13.6477C88.0503 13.4773 88.1867 13.2685 88.2805 13.0213L90.7989 13.1875C90.6711 13.7926 90.409 14.321 90.0127 14.7727C89.6207 15.2202 89.1136 15.5696 88.4914 15.821C87.8735 16.0682 87.1597 16.1918 86.3501 16.1918Z"
          fill="currentColor"
        /> */}
          {/* Text Label */}
      <text
        x="24"
        y="14"
        fontFamily="Arial, sans-serif"
        fontSize="13"
        fill="currentColor"
      >
        RouteSync
      </text>
      </g>
      <defs>
        <clipPath id="clip0_1949_239">
          <rect width="92" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
      </div>
      <div className="md:w-1/3 max-w-sm">
        <div className="text-center md:text-left">
          <label className="mr-1">Sign in with</label>
          <button
            type="button"
            className="mx-1 size-9  rounded-full bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_9px_-4px_#3b71ca]"
          >
            <BiLogoFacebook
              size={20}
              className="flex justify-center items-center w-full"
            />
          </button>
          <button
            type="button"
            className="inline-block mx-1 size-9 rounded-full bg-red-600 hover:bg-red-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
          >
            <AiOutlineTwitter
              size={20}
              className="flex justify-center items-center w-full"
            />
          </button>
        </div>
        <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
            Or
          </p>
        </div>
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
          type="text"
          placeholder="Email Address"
          required={true}
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}

        />
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          placeholder="Password"
          required={true}
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <div className="mt-4 flex justify-between font-semibold text-sm">
          <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
            <input className="mr-1" type="checkbox" />
            <span>Remember Me</span>
          </label>
          <a
            className="text-red-600 hover:text-red-700 hover:underline hover:underline-offset-4"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
        <div className="text-center md:text-left">
          <button
            className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            type="submit"
            onClick={onSubmit}
            disabled={loading}
          >
            Login
          </button>
        </div>
        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don&apos;t have an account?{" "}
          <a
            className="text-red-600 hover:underline hover:underline-offset-4"
            href="signup"
          >
            Register
          </a>
        </div>
      </div>
    </section>
  );
};

export default Login;