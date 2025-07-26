// Utils
import { lazy } from 'react';
const HomePage = lazy(() => import("@userpage-layouts/HomePage"));

const MainPage = () => {

  return (
    <HomePage/>
  )
}

export default MainPage