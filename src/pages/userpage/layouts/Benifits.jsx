// components
import { benifits } from '@constants/shopdata.js';

const Benifits = () => {
  return (
    <div className="w-full px-4 py-10 bg-[rgb(175,32,55)] flex justify-center items-center">
      <div className="w-full max-w-7xl flex flex-wrap justify-center items-center gap-y-10 gap-x-6">
        {benifits?.map((item, i) => (
          <div
            key={i}
            className="w-full sm:w-[45%] md:w-[20%] flex flex-col justify-center items-center text-center px-4"
          >
            <img src={item?.image} alt="Benifit" className="w-[60px] h-[60px] mb-4" />
            <h1 className="text-white text-base font-bold">{item?.title}</h1>
            <p className="text-white text-sm">{item?.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benifits;