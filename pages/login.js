import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { getProviders, signIn } from "next-auth/react";

function login({ providers }) {
  return (
    <div className="bg-black h-screen w-screen flex flex-col space-y-4 items-center justify-center">
      <div className="flex items-center">
        <img
          className="w-16 lg:w-24 bg-white rounded-full mr-3 md:mr-5 "
          src="https://links.papareact.com/9xl"
          alt="spotify logo"
        />
        <div className="relative">
          <h1
            className="text-3xl lg:text-7xl md:text-5xl uppercase font-bold"
            style={{
              color: "#1ed760",
            }}
          >
            spotify
          </h1>
        </div>
      </div>

      {Object.values(providers).map((provider) => (
        <div
          key={provider.name}
          className="justify-end w-20 h-20 bg-transparent right-10 cursor-pointer"
        >
          <div
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className="ml-[40%] text-green-200 font-bold text-3xl animate-pulse"
          >
            Login
          </div>
        </div>
      ))}
    </div>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
