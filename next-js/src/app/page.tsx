import HomePageCards from '@/src/components/homepage_cards';

export default function Home() {
  return (
    <div className="w-full place-content-center">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-color-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-none">
          <img
            src='/easy_meal.png'
            alt='Easy Meal Icon'
            className="w-48 h-48 text-center item-center object-center mx-auto"
          />
          <h1 className="text-center text-red-600 text-5xl font-bold mx-auto w-auto"> 
            Benvenuto in EasyMeal
          </h1> 
          <div className="flex flex-1 flex-col justify-center items-center p-4">
            <h2 className="text-center text-3xl font-bold mx-auto w-auto"> 
              Prenota, ordina e mangia!
            </h2> 
            <HomePageCards/>
          </div>
        </div>
      </div>
    </div>
  )
}
