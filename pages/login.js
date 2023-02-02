import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

function login({ providers }) {
  return (
    <div
      className="text-center h-screen w-screen flex items-center justify-center relative"
      style={{ backgroundColor: "whitesmoke" }}
    >
      <div className="bg-black w-screen h-40 flex items-center justify-center relative">
        <img
          className="w-16 md-20 lg:w-24 bg-white rounded-full mr-7 md:mr-12 "
          src="https://links.papareact.com/9xl"
          alt="spotify logo"
        />
        <h1
          className="text-4xl lg:text-9xl md:text-7xl uppercase font-bold"
          style={{
            color: "#1ed760",
          }}
        >
          spotify
        </h1>
        <small className="absolute top-[6.5rem] right-[24rem] font-extrabold uppercase text-lg text-white hidden lg:block">
          Clone
        </small>

        {Object.values(providers).map((provider) => (
          <div
            key={provider.name}
            className="absolute top-auto w-20 h-20 bg-transparent right-10 cursor-pointer"
          >
            <ChevronDoubleRightIcon
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="w-20 h-20 animate-pulse"
              style={{ color: "#1ed760" }}
            />
          </div>
        ))}
      </div>
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
