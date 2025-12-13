import { Link } from 'react-router-dom';
import coverImage from '../assets/Cover.png'; 
import asset1 from '../assets/Asset-01.svg'; 
import asset2 from '../assets/Asset-02.svg'; 
import asset3 from '../assets/Asset-04.svg'; 
import asset4 from '../assets/Asset-03.svg'; 

export default function Home() {
  return (
    <div className="min-h-[70vh] xl:min-h-[88vh] flex flex-col justify-center">
      
      {/* ---- COVER --- */}
      <div className='w-full bg-white px-8 py-5 md:px-16 xl:px-16'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 my-16 md:my-14 xl:my-12 items-center max-w-7xl mx-auto xl:py-5">
          
          <div className="text-left order-2 md:order-2">
            <h1 className="text-3xl md:text-[2.5rem] xl:text-6xl font-extrabold text-[#1A3052] mb-1 md:mb-2 md:tracking-tight xl:tracking-normal md:leading-[1.1] xl:leading-[1.15]">
              Detect Tuberculosis <br/>
              <span>in One Click</span> 
            </h1>
            <p className="text-md md:text-lg xl:text-[1.3rem] text-[#4D93FF] mb-4 md:mb-5 xl:mb-6 leading-relaxed max-w-lg">
              Affordable AI-powered Tuberculosis screening.
            </p>

            <div className="flex justify-start">
              <Link 
                to="/scan"
                className="group bg-gradient-to-r from-[#67C3F3] to-[#27FE89] hover:bg-none hover:text-[#4D93FF] hover:border-[#36D67F] hover:border-[1px] text-md md:text-xl xl:text-[1.3rem] font-semibold py-2 px-6 md:py-[0.6rem] xl:py-3 xl:px-7 rounded-full transition-transform hover:scale-105 active:scale-95"
              >
                <span className='text-[#f7fbff] group-hover:bg-gradient-to-r group-hover:from-[#67C3F3] group-hover:to-[#27FE89] group-hover:bg-clip-text group-hover:text-transparent'>Start Now</span>
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <img 
              src={coverImage}
              draggable="false" 
              className="w-full max-w-sm md:max-w-md xl:max-w-full object-contain animate-fade-in-up select-none" 
            />
          </div>
        </div>
      </div>

      {/* --- SECTION 1 --- */}
      <div className="w-full bg-gradient-to-br from-[#58C8FF] to-[#4D93FF] px-10 pr-8 md:px-16 xl:px-20 py-16 xl:py-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center mx-auto">
          <div className="flex justify-center md:justify-end order-1 md:order-1">
            <img 
              src={asset1}
              draggable="false" 
              className="w-full max-w-sm md:max-w-md xl:max-w-3xl object-contain animate-fade-in-up select-none" 
            />
          </div>
          
          <div className="text-left text-white order-2 md:order-2">
            <h1 className="text-2xl md:text-3xl xl:text-[2.75rem] font-bold py-4 xl:py-6 tracking-normal leading-tight">
              Early TB Detection Matter
            </h1>
            
            <div className='mb-4'>
              <p className='font-semibold text-base md:text-xl xl:text-[1.75rem] py-1 md:py-2'>
                Stop the Spread
              </p>
              <p className='max-w-xs md:max-w-sm xl:max-w-xl font-normal text-sm md:text-lg xl:text-xl'>
                TB is highly contagious, detecting it early protects your family and community.
              </p>
            </div>
            
            <div className='mb-4'>
              <p className='font-semibold text-base md:text-xl xl:text-[1.75rem] py-1 md:py-2'>
                Prevent Lung Damage
              </p>
              <p className='max-w-xs md:max-w-sm xl:max-w-xl font-normal text-sm md:text-lg xl:text-xl'>
                Early treatment prevents irreversible scarring and complications.
              </p>
            </div>
            
            <div className='mb-4'>
              <p className='font-semibold text-base md:text-xl xl:text-[1.75rem] py-1 md:py-2'>
                Save Lives
              </p>
              <p className='max-w-xs md:max-w-sm xl:max-w-xl font-normal text-sm md:text-lg xl:text-xl'>
                TB is curable, but delays in diagnosis can be fatal.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- SECTION 2 --- */}
      <div className='w-full bg-white px-8 md:px-16 py-16 md:py-28 xl:py-40'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7 xl:gap-10 text-left max-w-7xl mx-auto w-full">
          
          <div className="flex md:flex-col items-center px-4 py-3 md:pt-8 md:pb-10 gap-3 xl:pt-10 xl:pb-14 xl:gap-4 bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F8FDFF_75%,#F4FBFF_87%,#E9F8FF_100%)] rounded-2xl md:rounded-[2rem] xl:rounded-[3rem] shadow-[0_4px_4px_rgba(77,147,255,0.15)] md:shadow-[0_5px_7px_rgba(77,147,255,0.2)]">
            <img 
              src={asset2}
              draggable="false" 
              className="max-w-24 md:max-w-36 xl:max-w-48 object-contain animate-fade-in-up select-none" 
            />
            <p className="max-w-48 md:max-w-52 xl:max-w-72 text-sm md:text-lg xl:text-2xl text-[#1A3052] font-semibold">
              Built using Convolutional Neural Network (CNN)
            </p>
          </div>

          <div className="flex md:flex-col items-center px-4 py-3 md:pt-8 md:pb-10 gap-3 xl:pt-10 xl:pb-14 xl:gap-4 bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F8FDFF_75%,#F4FBFF_87%,#E9F8FF_100%)] rounded-2xl md:rounded-[2rem] xl:rounded-[3rem] shadow-[0_4px_4px_rgba(77,147,255,0.15)] md:shadow-[0_5px_7px_rgba(77,147,255,0.2)]">
            <img 
              src={asset3}
              draggable="false" 
              className="max-w-24 md:max-w-36 xl:max-w-48 object-contain animate-fade-in-up select-none" 
            />
            <p className="max-w-48 md:max-w-52 xl:max-w-72 text-sm md:text-lg xl:text-2xl text-[#1A3052] font-semibold">
              Detect Tuberculosis Risk in Seconds
            </p>
          </div>
          
          <div className="flex md:flex-col items-center px-4 py-3 md:pt-8 md:pb-10 gap-3 xl:pt-10 xl:pb-14 xl:gap-4 bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F8FDFF_75%,#F4FBFF_87%,#E9F8FF_100%)] rounded-2xl md:rounded-[2rem] xl:rounded-[3rem] shadow-[0_4px_4px_rgba(77,147,255,0.15)] md:shadow-[0_5px_7px_rgba(77,147,255,0.2)]">
            <img 
              src={asset4}
              draggable="false" 
              className="max-w-24 md:max-w-36 xl:max-w-48 object-contain animate-fade-in-up select-none" 
            />
            <p className="max-w-48 md:max-w-52 xl:max-w-72 text-sm md:text-lg xl:text-2xl text-[#1A3052] font-semibold">
              Fast, Accurate, and Affordable TB Screening
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}