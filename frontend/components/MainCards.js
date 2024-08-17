import Image from "next/image";
import React from "react";

const MainCards = () => {
  return (
    <div className="grid grid-cols-1 gap-5 py-16 md:grid-cols-2">
      <div className="flex flex-col bg-neutral-50 rounded-lg shadow-lg group hover:bg-neutral-100">
        <div className="overflow-hidden max-h-64 bg-gradient-to-r from-violet-500 to-fuchsia-500">
          <Image
          src="/card1.jpeg"
          width={800}
          height={300}
          quality={70}
          alt="image one"
          className="object-cover group-hover:scale-105 transition duration-500 object-top opacity-70"
          /> 
        </div>
        <div className="py-8 px-4">
          <h3 className="text-lg font-medium text-black">
            Some header
          </h3>
          <p className="mt-1 text-sm text-gray-800 group-hover:text-gray-900 ">
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </p>
        </div>
      </div>
      <div className="flex flex-col bg-neutral-50 rounded-lg shadow-lg group hover:bg-neutral-100">
        <div className="overflow-hidden max-h-64 bg-gradient-to-r from-violet-500 to-fuchsia-500">
          <Image
          src="/card2.jpeg"
          width={800}
          height={300}
          quality={70}
          alt="image two"
          className="object-cover group-hover:scale-105 transition duration-500 object-top opacity-70"
          /> 
        </div>
        <div className="py-8 px-4">
          <h3 className="text-lg font-medium text-black">
            Some header
          </h3>
          <p className="mt-1 text-sm text-gray-800 group-hover:text-gray-900">
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default MainCards;