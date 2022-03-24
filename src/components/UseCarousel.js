import React, {useState, useEffect} from "react"
import { useSwipeable } from "react-swipeable"
import './Carousel.css'

export const CarouselItem = ({children, width}) => {
  return (
    <div className='car-item' style={{width: width}}>
      {children}
    </div>
  )
}

const Carousel = ({ children}) => {
  // using state here will provide us the ability to change the transfor style,
  // thus allowing movement between pages
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // sets the state 
  const updateIndex = (newIndex) => {
    if(newIndex < 0) {
     newIndex = React.Children.count(children) - 1;
    } else if (newIndex >= React.Children.count(children)){
      newIndex = 0
    }
    setActiveIndex(newIndex)

  }


  // include auto swipeing, which will update the state every 3 seconds
useEffect(() => {
  const interval = setInterval(() => {
    if(!paused) {
      updateIndex(activeIndex + 1);
    }
    
  }, 1000)
  return () => {
    if(interval) {
      clearInterval(interval)
    }
  }
})
   const handlers = useSwipeable({
     onSwipedLeft: () => updateIndex(activeIndex + 1),
     onSwipedRight: () => updateIndex(activeIndex - 1),
   });


  return (
    <div
      {...handlers}
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="inner"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, { width: '100%' });
        })}
      </div>
      <div className="buttons">
        <button
          onClick={() => {
            updateIndex(activeIndex - 1);
          }}
        >
          prev
        </button>
        {React.Children.map(children, (child, index) => {
          return (
            <button
              className={`${index === activeIndex ? 'active' : ''} `}
              onClick={() => {
                updateIndex(index);
              }}
            >
              {index + 1}
            </button>
          );
        })}
        <button
          onClick={() => {
            updateIndex(activeIndex + 1);
          }}
        >
          next
        </button>
      </div>
    </div>
  );
}

export default Carousel