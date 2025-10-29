import AboutPreview from './AboutPreview.jsx';
import FeaturedCongregations from './FeaturedCongregations.jsx';
import FeaturedEvents from './FeaturedEvents.jsx';
import HeroSection from './HeroSection.jsx';

const Home = () =>{
  return (
    <div>
        <HeroSection />
         <AboutPreview />
        <FeaturedCongregations />
        <FeaturedEvents />
    </div>
    )
}

export default Home;